import { Course, CreateCourseDTO, UpdateCourseDTO } from '../entities/Course';

export interface ICourseRepository {
  findAll(gradeId?: string): Promise<Course[]>;
  findById(id: string): Promise<Course | null>;
  create(data: CreateCourseDTO): Promise<Course>;
  update(id: string, data: UpdateCourseDTO): Promise<Course>;
  delete(id: string): Promise<void>;
}
