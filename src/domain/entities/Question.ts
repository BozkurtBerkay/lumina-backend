export type QuestionType = 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'OPEN_ENDED';

/** Tek bir şıkkın zengin içerik formatı */
export interface QuestionOption {
  text: string;
  imageUrl?: string | null;
  imageAlt?: string | null;
}

/**
 * options alanı: eski format (düz string) veya yeni format (zengin nesne).
 * Geriye dönük uyumluluk için ikisi de desteklenmektedir.
 */
export interface QuestionOptions {
  A?: string | QuestionOption;
  B?: string | QuestionOption;
  C?: string | QuestionOption;
  D?: string | QuestionOption;
  [key: string]: string | QuestionOption | undefined;
}

export interface Question {
  id: string;
  content: string;
  type: QuestionType;
  options: QuestionOptions | null;
  correctAnswer: string | null;
  imageUrl: string | null;
  imageAlt: string | null;
  orderIndex: number;
  unitId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateQuestionDTO {
  content: string;
  type?: QuestionType;
  options?: QuestionOptions;
  correctAnswer?: string;
  imageUrl?: string;
  imageAlt?: string;
  orderIndex?: number;
  unitId: string;
}

export interface UpdateQuestionDTO {
  content?: string;
  type?: QuestionType;
  options?: QuestionOptions;
  correctAnswer?: string;
  imageUrl?: string;
  imageAlt?: string;
  orderIndex?: number;
}
