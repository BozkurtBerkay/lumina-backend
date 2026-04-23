import { Request, Response } from "express";
import { ResultService } from "../../application/services/ResultService";

export class ResultController {
  constructor(private readonly resultService: ResultService) {}

  syncResults = async (req: Request, res: Response) => {
    const { results } = req.body;
    const userId = (req as any).user.userId;

    if (!results || !Array.isArray(results)) {
      return res.status(400).json({ message: "Sonuçlar eksik veya hatalı." });
    }

    try {
      const saved = await this.resultService.syncResults(userId, results);
      res.status(200).json({
        message: "Sonuçlar başarıyla kaydedildi.",
        count: saved.count,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  exportToCSV = async (req: Request, res: Response) => {
    const { unitId } = req.params as { unitId: string };

    try {
      const questions = await this.resultService.getUnitQuestions(unitId);
      const results = await this.resultService.getUnitResultsForCSV(unitId);

      if (questions.length === 0) {
        return res.status(404).json({ message: "Bu ünitede soru bulunamadı." });
      }

      // 1. Gruplandırma: attemptId varsa bazal, yoksa userId ve zaman farkı fallback
      const userAttempts: any[][] = [];
      const userGroups = new Map<string, any[]>();

      results.forEach((res: any) => {
        if (res.attemptId) {
          // Yeni sistem: attemptId var, doğrudan grupla
          const key = `attempt_${res.attemptId}`;
          if (!userGroups.has(key)) userGroups.set(key, []);
          userGroups.get(key)!.push(res);
        } else {
          // Eski veriler için fallback: userId kullan
          const key = `legacy_${res.userId}`;
          if (!userGroups.has(key)) userGroups.set(key, []);
          userGroups.get(key)!.push(res);
        }
      });

      for (const [key, group] of userGroups.entries()) {
        const sortedGroup = group.sort(
          (a: any, b: any) => a.createdAt.getTime() - b.createdAt.getTime(),
        );

        if (key.startsWith("attempt_")) {
          // attemptId ile gruplanmışlar doğrudan bir denemedir
          userAttempts.push(sortedGroup);
        } else {
          // Eski legacy kayıtları zaman farkıyla denemelere ayırma (5 dk kuralı)
          let currentAttempt: any[] = [];
          sortedGroup.forEach((res: any, index: number) => {
            if (index === 0) {
              currentAttempt.push(res);
            } else {
              const prevRes = sortedGroup[index - 1];
              const diffMs = res.createdAt.getTime() - prevRes.createdAt.getTime();
              const isSameQuestion = currentAttempt.some(
                (a) => a.questionId === res.questionId,
              );
              
              if (diffMs > 5 * 60 * 1000 || isSameQuestion) {
                userAttempts.push(currentAttempt);
                currentAttempt = [res];
              } else {
                currentAttempt.push(res);
              }
            }
          });
          if (currentAttempt.length > 0) {
            userAttempts.push(currentAttempt);
          }
        }
      }

      // 2. CSV Başlıklarını Hazırla
      const questionHeaders = questions.flatMap((_, i) => [
        `Soru ${i + 1} Metni`,
        `Soru ${i + 1} Doğru Cevap`,
        `Soru ${i + 1} Öğrenci Cevabı`
      ]);
      const headers = [
        "Öğrenci",
        "E-posta",
        "Okul",
        "Tarih",
        "Toplam Süre(dk)",
        ...questionHeaders,
        "Doğru",
        "Yanlış",
        "Başarı (%)",
      ];

      // 3. Satırları Hazırla (CRLF \r\n kullanarak Excel uyumunu artırıyoruz)
      const csvRows = userAttempts
        .map((attempt) => {
          const first = attempt[0];
          const studentName = `${first.user.firstName} ${first.user.lastName}`;
          const schoolName = first.user.school?.name || "-";
          const date = new Date(first.createdAt).toLocaleString("tr-TR");

          const totalTimeMs = attempt.reduce(
            (sum: number, r: any) => sum + r.timeSpent,
            0,
          );
          const totalTimeMin = (totalTimeMs / (1000 * 60)).toFixed(1);

          const correctCount = attempt.filter((r: any) => r.isCorrect).length;
          const wrongCount = attempt.length - correctCount;
          const successRate = ((correctCount / attempt.length) * 100).toFixed(1);

          // Soruları eşleştir (Soru metni, Doğru Cevap, Öğrenci Cevabı)
          const questionResponses = questions.flatMap((q) => {
            const cleanContent = q.content.replace(/"/g, '""').replace(/\r?\n/g, ' ');
            const res = attempt.find((r: any) => r.questionId === q.id);
            if (!res) {
              return [`"${cleanContent}"`, `"${q.correctAnswer || "-"}"`, `"-"`];
            }
            return [
              `"${cleanContent}"`,
              `"${q.correctAnswer || "-"}"`,
              `"${res.userResponse || "-"}"`
            ];
          });

          return [
            `"${studentName}"`,
            `"${first.user.email}"`,
            `"${schoolName}"`,
            `"${date}"`,
            totalTimeMin,
            ...questionResponses,
            correctCount,
            wrongCount,
            `"%${successRate}"`,
          ].join(";");
        })
        .join("\r\n");

      // Mac Excel'de "sep=;" eklendiğinde BOM (Byte Order Mark) görmezden gelinip Türkçe karakterler bozulabiliyor.
      // Türkiye locale ayarlı bir Mac/PC'de Excel varsayılan ayırıcı olarak zaten noktalı virgül (;) kullanır.
      // Bu yüzden sadece BOM karakterini ekliyoruz.
      const csvContent = "\uFEFF" + headers.join(";") + "\r\n" + csvRows;

      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=unit-${unitId}-results.csv`,
      );

      res.status(200).send(Buffer.from(csvContent, "utf-8"));
    } catch (error: any) {
      console.error("CSV Export Error:", error);
      res.status(500).json({ message: error.message });
    }
  };
}
