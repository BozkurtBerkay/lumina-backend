import { prisma } from "../src/infrastructure/database/prismaClient";
import bcrypt from "bcryptjs";

async function main() {
  console.log("🌱 Bütün veriler sıfırlanıyor (Temiz sayfa)...");
  await prisma.question.deleteMany();
  await prisma.unit.deleteMany();
  await prisma.course.deleteMany();
  await prisma.grade.deleteMany();
  await prisma.school.deleteMany();
  await prisma.user.deleteMany();

  console.log("🏫 Okullar oluşturuluyor...");
  const schools = [
    { name: "Türkan Sabancı Görme Engelliler Ortaokulu", city: "İstanbul" },
    { name: "Veysel Vardal Görme Engelliler Ortaokulu", city: "İstanbul" },
    { name: "Göreneller Görme Engelliler Ortaokulu", city: "Ankara" },
    { name: "Mitat Enç Görme Engelliler Ortaokulu", city: "Ankara" },
  ];

  for (const school of schools) {
    await prisma.school.create({
      data: school,
    });
  }
  console.log(`✅ ${schools.length} okul oluşturuldu!`);

  console.log("🏫 Sınıflar oluşturuluyor...");
  // ... rest of the file

  const grade7 = await prisma.grade.create({
    data: {
      name: "7. Sınıf",
      description: "Ortaokul 7. sınıf müfredatı",
      orderIndex: 7,
    },
  });

  const grade8 = await prisma.grade.create({
    data: {
      name: "8. Sınıf",
      description: "Ortaokul 8. sınıf müfredatı",
      orderIndex: 8,
    },
  });

  console.log(`✅ ${grade7.name} ve ${grade8.name} oluşturuldu!`);

  console.log("📚 Örnek dersler, üniteler ve sorular oluşturuluyor...");

  // --- KURS 1: LGS Fen Bilimleri (8. Sınıf) ---
  const course1 = await prisma.course.create({
    data: {
      title: "8. Sınıf LGS Fen Bilimleri",
      description:
        "Mevsimler, İklim, DNA ve Genetik Kod gibi 8. sınıf Fen Bilimleri konularını kapsayan LGS hazırlık kursu.",
      gradeId: grade8.id,
      units: {
        create: [
          {
            title: "Ünite 1: Mevsimler ve İklim",
            description:
              "Mevsimlerin oluşum nedenleri ve iklim değişiklikleri.",
            orderIndex: 1,
            questions: {
              create: [
                {
                  content:
                    "Dünya'nın Güneş etrafında dolanması ve dönme ekseninin eğikliği aşağıdakilerden hangisine neden olur?",
                  type: "MULTIPLE_CHOICE",
                  options: {
                    A: "Gece ve gündüzün ardalanmasına",
                    B: "Mevsimlerin oluşmasına",
                    C: "Gelgit olaylarına",
                    D: "Ay tutulmasına",
                  },
                  correctAnswer: "B",
                  orderIndex: 1,
                },
              ],
            },
          },
          {
            title: "Ünite 2: DNA ve Genetik Kod",
            description: "Kromozom, DNA, gen, nükleotid kavramları ve kalıtım.",
            orderIndex: 2,
            questions: {
              create: [
                {
                  content: "DNA'nın yapı taşı aşağıdakilerden hangisidir?",
                  type: "MULTIPLE_CHOICE",
                  options: {
                    A: "Gen",
                    B: "Nükleotid",
                    C: "Kromozom",
                    D: "Hücre",
                  },
                  correctAnswer: "B",
                  orderIndex: 1,
                },
                {
                  content:
                    "Yukarıdaki görselde gösterilen hücre bölünmesi evresi hangisidir?",
                  type: "MULTIPLE_CHOICE",
                  options: {
                    A: "Metafaz",
                    B: "Anafaz",
                    C: "Telofaz",
                    D: "Profaz",
                  },
                  correctAnswer: "B",
                  imageUrl:
                    "https://tr-static.eodev.com/files/dd9/aa7d93919b43b93ea2e9330fdac16db3.jpg",
                  imageAlt:
                    "Görselde bir hücrenin kromozomlarının zıt kutuplara çekildiği görülüyor. Kromozomlar iğ iplikleri üzerinde hücrenin uç kısımlarına doğru ilerlemektedir.",
                  orderIndex: 3,
                },
              ],
            },
          },
        ],
      },
    },
  });

  // --- KURS 2: LGS Matematik (8. Sınıf) ---
  const course2 = await prisma.course.create({
    data: {
      title: "8. Sınıf LGS Matematik",
      description:
        "Çarpanlar ve katlar, üslü ifadeler, kareköklü ifadeler gibi temel 8. sınıf matematik konuları.",
      gradeId: grade8.id,
      units: {
        create: [
          {
            title: "Ünite 1: Çarpanlar ve Katlar",
            description: "EBOB, EKOK hesaplamaları ve aralarında asal sayılar.",
            orderIndex: 1,
            questions: {
              create: [
                {
                  content:
                    "Aşağıdaki sayılardan hangisi 12 ve 18 sayılarının EKOK'udur (En Küçük Ortak Kat)?",
                  type: "MULTIPLE_CHOICE",
                  options: {
                    A: "6",
                    B: "24",
                    C: "36",
                    D: "72",
                  },
                  correctAnswer: "C",
                  orderIndex: 1,
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log(`✅ ${course1.title} ve ${course2.title} başarıyla oluşturuldu!`);

  console.log("👤 Kullanıcılar oluşturuluyor...");
  const hashedPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.create({
    data: {
      email: "admin@lumina.com",
      passwordHash: hashedPassword,
      firstName: "Lumina",
      lastName: "Admin",
      role: "ADMIN",
    },
  });
  console.log("✅ admin@lumina.com kullanıcısı oluşturuldu (Şifre: admin123)");

  const yektaHashedPassword = await bcrypt.hash("yekta123", 10);
  await prisma.user.create({
    data: {
      email: "yekta@lumina.com",
      passwordHash: yektaHashedPassword,
      firstName: "Yekta",
      lastName: "Deneme",
      role: "STUDENT",
    },
  });
  console.log("✅ yekta@lumina.com kullanıcısı oluşturuldu (Şifre: yekta123)");

  console.log("✅ Tohumlama (Seed) işlemi başarıyla tamamlandı!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
