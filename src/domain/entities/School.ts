export interface School {
  id: string;
  name: string;
  city: string | null;
  district: string | null;
  address: string | null;
  phoneNumber: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSchoolDTO {
  name: string;
  city?: string;
  district?: string;
  address?: string;
  phoneNumber?: string;
}

export interface UpdateSchoolDTO {
  name?: string;
  city?: string;
  district?: string;
  address?: string;
  phoneNumber?: string;
}
