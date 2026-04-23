import { describe, it, expect, beforeEach } from 'vitest';
import { mock, MockProxy } from 'vitest-mock-extended';
import { CourseService } from '../CourseService';
import { ICourseRepository } from '../../../domain/repositories/ICourseRepository';
import { Course } from '../../../domain/entities/Course';

describe('CourseService', () => {
  let courseRepositoryMock: MockProxy<ICourseRepository>;
  let courseService: CourseService;

  const mockCourse: Course = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Test Course',
    description: 'Test Description',
    gradeId: '123e4567-e89b-12d3-a456-426614174001',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    courseRepositoryMock = mock<ICourseRepository>();
    courseService = new CourseService(courseRepositoryMock);
  });

  describe('createCourse', () => {
    it('should create a course when valid data is provided', async () => {
      // Arrange
      const input = { title: 'Test Course', description: 'Test Description', gradeId: '123e4567-e89b-12d3-a456-426614174001' };
      courseRepositoryMock.create.mockResolvedValue(mockCourse);

      // Act
      const result = await courseService.createCourse(input);

      // Assert
      expect(result).toEqual(mockCourse);
      expect(courseRepositoryMock.create).toHaveBeenCalledWith(input);
      expect(courseRepositoryMock.create).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if title is empty', async () => {
      // Arrange
      const input = { title: '   ', description: 'Empty Title Course', gradeId: '123e4567-e89b-12d3-a456-426614174001' };

      // Act & Assert
      await expect(courseService.createCourse(input)).rejects.toThrow('Course title is required');
      expect(courseRepositoryMock.create).not.toHaveBeenCalled();
    });
  });

  describe('getAllCourses', () => {
    it('should return all courses', async () => {
      // Arrange
      courseRepositoryMock.findAll.mockResolvedValue([mockCourse]);

      // Act
      const result = await courseService.getAllCourses();

      // Assert
      expect(result).toEqual([mockCourse]);
      expect(courseRepositoryMock.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('getCourseById', () => {
    it('should return a course when found', async () => {
      // Arrange
      courseRepositoryMock.findById.mockResolvedValue(mockCourse);

      // Act
      const result = await courseService.getCourseById(mockCourse.id);

      // Assert
      expect(result).toEqual(mockCourse);
      expect(courseRepositoryMock.findById).toHaveBeenCalledWith(mockCourse.id);
    });

    it('should return null when course is not found', async () => {
      // Arrange
      courseRepositoryMock.findById.mockResolvedValue(null);

      // Act
      const result = await courseService.getCourseById('missing-id');

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('updateCourse', () => {
    it('should update course when it exists', async () => {
      // Arrange
      const updateData = { title: 'Updated Title' };
      const updatedCourse = { ...mockCourse, title: 'Updated Title' };
      
      courseRepositoryMock.findById.mockResolvedValue(mockCourse);
      courseRepositoryMock.update.mockResolvedValue(updatedCourse);

      // Act
      const result = await courseService.updateCourse(mockCourse.id, updateData);

      // Assert
      expect(result).toEqual(updatedCourse);
      expect(courseRepositoryMock.update).toHaveBeenCalledWith(mockCourse.id, updateData);
    });

    it('should throw an error if course to update does not exist', async () => {
      // Arrange
      courseRepositoryMock.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(courseService.updateCourse('missing-id', { title: 'New' }))
        .rejects.toThrow('Course not found');
      expect(courseRepositoryMock.update).not.toHaveBeenCalled();
    });
  });

  describe('deleteCourse', () => {
    it('should delete course when it exists', async () => {
      // Arrange
      courseRepositoryMock.findById.mockResolvedValue(mockCourse);
      courseRepositoryMock.delete.mockResolvedValue();

      // Act
      await courseService.deleteCourse(mockCourse.id);

      // Assert
      expect(courseRepositoryMock.delete).toHaveBeenCalledWith(mockCourse.id);
    });

    it('should throw an error if course to delete does not exist', async () => {
      // Arrange
      courseRepositoryMock.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(courseService.deleteCourse('missing-id')).rejects.toThrow('Course not found');
      expect(courseRepositoryMock.delete).not.toHaveBeenCalled();
    });
  });
});
