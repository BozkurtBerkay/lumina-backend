export interface Course {
  id: string;
  title: string;
  description: string | null;
  gradeId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCourseDTO {
  title: string;
  description?: string;
  gradeId: string;
}

export interface UpdateCourseDTO {
  title?: string;
  description?: string;
}
