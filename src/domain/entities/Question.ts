export type QuestionType = 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'OPEN_ENDED';

export interface QuestionOptions {
  A?: string;
  B?: string;
  C?: string;
  D?: string;
  [key: string]: string | undefined; // Diğer seçenekler (E, F vb.) için esneklik sağlar
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
