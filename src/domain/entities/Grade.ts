export interface Grade {
  id: string;
  name: string;
  description: string | null;
  orderIndex: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateGradeDTO {
  name: string;
  description?: string;
  orderIndex?: number;
}

export interface UpdateGradeDTO {
  name?: string;
  description?: string;
  orderIndex?: number;
}
