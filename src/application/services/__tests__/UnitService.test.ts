import { describe, it, expect, beforeEach } from 'vitest';
import { mock, MockProxy } from 'vitest-mock-extended';
import { UnitService } from '../UnitService';
import { IUnitRepository } from '../../../domain/repositories/IUnitRepository';
import { Unit } from '../../../domain/entities/Unit';

describe('UnitService', () => {
  let unitRepositoryMock: MockProxy<IUnitRepository>;
  let unitService: UnitService;

  const mockUnit: Unit = {
    id: 'unit-123',
    title: 'Test Unit',
    description: 'Test Description',
    orderIndex: 1,
    courseId: 'course-123',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    unitRepositoryMock = mock<IUnitRepository>();
    unitService = new UnitService(unitRepositoryMock);
  });

  describe('createUnit', () => {
    it('should create a unit when valid data is provided', async () => {
      const input = { title: 'Test Unit', courseId: 'course-123', orderIndex: 1 };
      unitRepositoryMock.create.mockResolvedValue(mockUnit);

      const result = await unitService.createUnit(input);

      expect(result).toEqual(mockUnit);
      expect(unitRepositoryMock.create).toHaveBeenCalledWith(input);
    });

    it('should throw an error if title is empty', async () => {
      const input = { title: '   ', courseId: 'course-123' };

      await expect(unitService.createUnit(input)).rejects.toThrow('Unit title is required');
      expect(unitRepositoryMock.create).not.toHaveBeenCalled();
    });

    it('should throw an error if courseId is empty', async () => {
      const input = { title: 'Valid Title', courseId: '' };

      await expect(unitService.createUnit(input)).rejects.toThrow('Course ID is required');
      expect(unitRepositoryMock.create).not.toHaveBeenCalled();
    });
  });

  describe('getAllUnits', () => {
    it('should return all units', async () => {
      unitRepositoryMock.findAll.mockResolvedValue([mockUnit]);

      const result = await unitService.getAllUnits();

      expect(result).toEqual([mockUnit]);
      expect(unitRepositoryMock.findAll).toHaveBeenCalledWith(undefined);
    });

    it('should return units filtered by courseId', async () => {
      unitRepositoryMock.findAll.mockResolvedValue([mockUnit]);

      const result = await unitService.getAllUnits('course-123');

      expect(result).toEqual([mockUnit]);
      expect(unitRepositoryMock.findAll).toHaveBeenCalledWith('course-123');
    });
  });

  describe('getUnitById', () => {
    it('should return a unit when found', async () => {
      unitRepositoryMock.findById.mockResolvedValue(mockUnit);

      const result = await unitService.getUnitById(mockUnit.id);

      expect(result).toEqual(mockUnit);
    });

    it('should return null when unit is not found', async () => {
      unitRepositoryMock.findById.mockResolvedValue(null);

      const result = await unitService.getUnitById('missing-id');

      expect(result).toBeNull();
    });
  });

  describe('updateUnit', () => {
    it('should update unit when it exists', async () => {
      const updateData = { title: 'Updated Title' };
      const updatedUnit = { ...mockUnit, title: 'Updated Title' };
      
      unitRepositoryMock.findById.mockResolvedValue(mockUnit);
      unitRepositoryMock.update.mockResolvedValue(updatedUnit);

      const result = await unitService.updateUnit(mockUnit.id, updateData);

      expect(result).toEqual(updatedUnit);
      expect(unitRepositoryMock.update).toHaveBeenCalledWith(mockUnit.id, updateData);
    });

    it('should throw an error if unit to update does not exist', async () => {
      unitRepositoryMock.findById.mockResolvedValue(null);

      await expect(unitService.updateUnit('missing-id', { title: 'New' })).rejects.toThrow('Unit not found');
    });
  });

  describe('deleteUnit', () => {
    it('should delete unit when it exists', async () => {
      unitRepositoryMock.findById.mockResolvedValue(mockUnit);
      unitRepositoryMock.delete.mockResolvedValue();

      await unitService.deleteUnit(mockUnit.id);

      expect(unitRepositoryMock.delete).toHaveBeenCalledWith(mockUnit.id);
    });

    it('should throw an error if unit to delete does not exist', async () => {
      unitRepositoryMock.findById.mockResolvedValue(null);

      await expect(unitService.deleteUnit('missing-id')).rejects.toThrow('Unit not found');
    });
  });
});
