import { ICourseRepository } from '../../domain/repositories/ICourseRepository';
import { Course, CreateCourseDTO, UpdateCourseDTO } from '../../domain/entities/Course';

export class CourseService {
  constructor(private readonly courseRepository: ICourseRepository) {}

  async getAllCourses(gradeId?: string): Promise<Course[]> {
    return this.courseRepository.findAll(gradeId);
  }

  async getCourseById(id: string): Promise<Course | null> {
    return this.courseRepository.findById(id);
  }

  async createCourse(data: CreateCourseDTO): Promise<Course> {
    if (!data.title || data.title.trim() === '') {
      throw new Error('Course title is required');
    }
    if (!data.gradeId || data.gradeId.trim() === '') {
      throw new Error('Grade ID is required');
    }
    return this.courseRepository.create(data);
  }

  async updateCourse(id: string, data: UpdateCourseDTO): Promise<Course> {
    const existingCourse = await this.courseRepository.findById(id);
    if (!existingCourse) {
      throw new Error('Course not found');
    }
    return this.courseRepository.update(id, data);
  }

  async deleteCourse(id: string): Promise<void> {
    const existingCourse = await this.courseRepository.findById(id);
    if (!existingCourse) {
      throw new Error('Course not found');
    }
    await this.courseRepository.delete(id);
  }
}
