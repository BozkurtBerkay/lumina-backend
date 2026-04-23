import { describe, it, expect, beforeEach } from 'vitest';
import { SchoolService } from '../SchoolService';
import { ISchoolRepository } from '../../../domain/repositories/ISchoolRepository';
import { mockDeep, MockProxy } from 'vitest-mock-extended';

describe('SchoolService', () => {
  let schoolService: SchoolService;
  let schoolRepository: MockProxy<ISchoolRepository>;

  beforeEach(() => {
    // Repository'yi her testten önce mockluyoruz
    schoolRepository = mockDeep<ISchoolRepository>();
    schoolService = new SchoolService(schoolRepository);
  });

  const mockDate = new Date();
  const mockSchool = {
    id: '1',
    name: 'Türkan Sabancı Görme Engelliler Ortaokulu',
    city: 'İstanbul',
    district: null,
    address: null,
    phoneNumber: null,
    createdAt: mockDate,
    updatedAt: mockDate,
  };

  it('should return all schools', async () => {
    schoolRepository.findAll.mockResolvedValue([mockSchool]);

    const result = await schoolService.getAllSchools();

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Türkan Sabancı Görme Engelliler Ortaokulu');
    expect(schoolRepository.findAll).toHaveBeenCalledTimes(1);
  });

  it('should return a school by id', async () => {
    schoolRepository.findById.mockResolvedValue(mockSchool);

    const result = await schoolService.getSchoolById('1');

    expect(result).toEqual(mockSchool);
    expect(schoolRepository.findById).toHaveBeenCalledWith('1');
  });

  it('should throw error when school not found by id', async () => {
    schoolRepository.findById.mockResolvedValue(null);

    await expect(schoolService.getSchoolById('non-existent'))
      .rejects.toThrow('School not found');
  });

  it('should create a new school', async () => {
    const createDto = { name: 'Yeni Okul', city: 'Ankara' };
    const createdSchool = { ...mockSchool, ...createDto, id: '2' };
    
    schoolRepository.create.mockResolvedValue(createdSchool);

    const result = await schoolService.createSchool(createDto);

    expect(result.name).toBe('Yeni Okul');
    expect(schoolRepository.create).toHaveBeenCalledWith(createDto);
  });

  it('should update a school', async () => {
    const updateDto = { name: 'Güncellenmiş Okul' };
    const updatedSchool = { ...mockSchool, ...updateDto };
    
    schoolRepository.findById.mockResolvedValue(mockSchool);
    schoolRepository.update.mockResolvedValue(updatedSchool);

    const result = await schoolService.updateSchool('1', updateDto);

    expect(result.name).toBe('Güncellenmiş Okul');
    expect(schoolRepository.update).toHaveBeenCalledWith('1', updateDto);
  });

  it('should delete a school', async () => {
    schoolRepository.findById.mockResolvedValue(mockSchool);
    schoolRepository.delete.mockResolvedValue(undefined);

    await schoolService.deleteSchool('1');

    expect(schoolRepository.delete).toHaveBeenCalledWith('1');
  });
});
