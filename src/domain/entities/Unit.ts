export interface Unit {
  id: string;
  title: string;
  description: string | null;
  orderIndex: number;
  courseId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUnitDTO {
  title: string;
  description?: string;
  orderIndex?: number;
  courseId: string;
}

export interface UpdateUnitDTO {
  title?: string;
  description?: string;
  orderIndex?: number;
}
