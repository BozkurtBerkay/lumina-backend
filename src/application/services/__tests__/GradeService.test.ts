import { describe, it, expect, beforeEach } from 'vitest';
import { mock, MockProxy } from 'vitest-mock-extended';
import { GradeService } from '../GradeService';
import { IGradeRepository } from '../../../domain/repositories/IGradeRepository';
import { Grade } from '../../../domain/entities/Grade';

describe('GradeService', () => {
  let gradeRepositoryMock: MockProxy<IGradeRepository>;
  let gradeService: GradeService;

  const mockGrade: Grade = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: '8. Sınıf',
    description: 'Ortaokul 8. sınıf müfredatı',
    orderIndex: 8,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    gradeRepositoryMock = mock<IGradeRepository>();
    gradeService = new GradeService(gradeRepositoryMock);
  });

  describe('createGrade', () => {
    it('should create a grade when valid data is provided', async () => {
      // Arrange
      const input = { name: '8. Sınıf', description: 'Ortaokul 8. sınıf müfredatı', orderIndex: 8 };
      gradeRepositoryMock.create.mockResolvedValue(mockGrade);

      // Act
      const result = await gradeService.createGrade(input);

      // Assert
      expect(result).toEqual(mockGrade);
      expect(gradeRepositoryMock.create).toHaveBeenCalledWith(input);
      expect(gradeRepositoryMock.create).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if name is empty', async () => {
      // Arrange
      const input = { name: '   ', description: 'Empty Name Grade' };

      // Act & Assert
      await expect(gradeService.createGrade(input)).rejects.toThrow('Grade name is required');
      expect(gradeRepositoryMock.create).not.toHaveBeenCalled();
    });
  });

  describe('getAllGrades', () => {
    it('should return all grades', async () => {
      // Arrange
      gradeRepositoryMock.findAll.mockResolvedValue([mockGrade]);

      // Act
      const result = await gradeService.getAllGrades();

      // Assert
      expect(result).toEqual([mockGrade]);
      expect(gradeRepositoryMock.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('getGradeById', () => {
    it('should return a grade when found', async () => {
      // Arrange
      gradeRepositoryMock.findById.mockResolvedValue(mockGrade);

      // Act
      const result = await gradeService.getGradeById(mockGrade.id);

      // Assert
      expect(result).toEqual(mockGrade);
      expect(gradeRepositoryMock.findById).toHaveBeenCalledWith(mockGrade.id);
    });

    it('should return null when grade is not found', async () => {
      // Arrange
      gradeRepositoryMock.findById.mockResolvedValue(null);

      // Act
      const result = await gradeService.getGradeById('missing-id');

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('updateGrade', () => {
    it('should update grade when it exists', async () => {
      // Arrange
      const updateData = { name: 'Updated Grade' };
      const updatedGrade = { ...mockGrade, name: 'Updated Grade' };

      gradeRepositoryMock.findById.mockResolvedValue(mockGrade);
      gradeRepositoryMock.update.mockResolvedValue(updatedGrade);

      // Act
      const result = await gradeService.updateGrade(mockGrade.id, updateData);

      // Assert
      expect(result).toEqual(updatedGrade);
      expect(gradeRepositoryMock.update).toHaveBeenCalledWith(mockGrade.id, updateData);
    });

    it('should throw an error if grade to update does not exist', async () => {
      // Arrange
      gradeRepositoryMock.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(gradeService.updateGrade('missing-id', { name: 'New' }))
        .rejects.toThrow('Grade not found');
      expect(gradeRepositoryMock.update).not.toHaveBeenCalled();
    });
  });

  describe('deleteGrade', () => {
    it('should delete grade when it exists', async () => {
      // Arrange
      gradeRepositoryMock.findById.mockResolvedValue(mockGrade);
      gradeRepositoryMock.delete.mockResolvedValue();

      // Act
      await gradeService.deleteGrade(mockGrade.id);

      // Assert
      expect(gradeRepositoryMock.delete).toHaveBeenCalledWith(mockGrade.id);
    });

    it('should throw an error if grade to delete does not exist', async () => {
      // Arrange
      gradeRepositoryMock.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(gradeService.deleteGrade('missing-id')).rejects.toThrow('Grade not found');
      expect(gradeRepositoryMock.delete).not.toHaveBeenCalled();
    });
  });
});
