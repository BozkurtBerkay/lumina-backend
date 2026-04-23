import { describe, it, expect, beforeEach } from 'vitest';
import { mock, MockProxy } from 'vitest-mock-extended';
import { QuestionService } from '../QuestionService';
import { IQuestionRepository } from '../../../domain/repositories/IQuestionRepository';
import { Question } from '../../../domain/entities/Question';

describe('QuestionService', () => {
  let questionRepositoryMock: MockProxy<IQuestionRepository>;
  let questionService: QuestionService;

  const mockQuestion: Question = {
    id: 'question-123',
    content: 'What is 2+2?',
    type: 'MULTIPLE_CHOICE',
    options: { A: '3', B: '4', C: '5' },
    correctAnswer: 'B',
    imageUrl: null,
    imageAlt: null,
    orderIndex: 1,
    unitId: 'unit-123',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    questionRepositoryMock = mock<IQuestionRepository>();
    questionService = new QuestionService(questionRepositoryMock);
  });

  describe('createQuestion', () => {
    it('should create a question when valid data is provided', async () => {
      const input = { content: 'What is 2+2?', unitId: 'unit-123', type: 'MULTIPLE_CHOICE' as const };
      questionRepositoryMock.create.mockResolvedValue(mockQuestion);

      const result = await questionService.createQuestion(input);

      expect(result).toEqual(mockQuestion);
      expect(questionRepositoryMock.create).toHaveBeenCalledWith(input);
    });

    it('should throw an error if content is empty', async () => {
      const input = { content: '   ', unitId: 'unit-123' };

      await expect(questionService.createQuestion(input)).rejects.toThrow('Question content is required');
      expect(questionRepositoryMock.create).not.toHaveBeenCalled();
    });

    it('should throw an error if unitId is empty', async () => {
      const input = { content: 'Valid content', unitId: '' };

      await expect(questionService.createQuestion(input)).rejects.toThrow('Unit ID is required');
      expect(questionRepositoryMock.create).not.toHaveBeenCalled();
    });
  });

  describe('getAllQuestions', () => {
    it('should return all questions', async () => {
      questionRepositoryMock.findAll.mockResolvedValue([mockQuestion]);

      const result = await questionService.getAllQuestions();

      expect(result).toEqual([mockQuestion]);
      expect(questionRepositoryMock.findAll).toHaveBeenCalledWith(undefined);
    });

    it('should return questions filtered by unitId', async () => {
      questionRepositoryMock.findAll.mockResolvedValue([mockQuestion]);

      const result = await questionService.getAllQuestions('unit-123');

      expect(result).toEqual([mockQuestion]);
      expect(questionRepositoryMock.findAll).toHaveBeenCalledWith('unit-123');
    });
  });

  describe('getQuestionById', () => {
    it('should return a question when found', async () => {
      questionRepositoryMock.findById.mockResolvedValue(mockQuestion);

      const result = await questionService.getQuestionById(mockQuestion.id);

      expect(result).toEqual(mockQuestion);
    });

    it('should return null when question is not found', async () => {
      questionRepositoryMock.findById.mockResolvedValue(null);

      const result = await questionService.getQuestionById('missing-id');

      expect(result).toBeNull();
    });
  });

  describe('updateQuestion', () => {
    it('should update question when it exists', async () => {
      const updateData = { content: 'Updated Content' };
      const updatedQuestion = { ...mockQuestion, content: 'Updated Content' };
      
      questionRepositoryMock.findById.mockResolvedValue(mockQuestion);
      questionRepositoryMock.update.mockResolvedValue(updatedQuestion);

      const result = await questionService.updateQuestion(mockQuestion.id, updateData);

      expect(result).toEqual(updatedQuestion);
      expect(questionRepositoryMock.update).toHaveBeenCalledWith(mockQuestion.id, updateData);
    });

    it('should throw an error if question to update does not exist', async () => {
      questionRepositoryMock.findById.mockResolvedValue(null);

      await expect(questionService.updateQuestion('missing-id', { content: 'New' })).rejects.toThrow('Question not found');
    });
  });

  describe('deleteQuestion', () => {
    it('should delete question when it exists', async () => {
      questionRepositoryMock.findById.mockResolvedValue(mockQuestion);
      questionRepositoryMock.delete.mockResolvedValue();

      await questionService.deleteQuestion(mockQuestion.id);

      expect(questionRepositoryMock.delete).toHaveBeenCalledWith(mockQuestion.id);
    });

    it('should throw an error if question to delete does not exist', async () => {
      questionRepositoryMock.findById.mockResolvedValue(null);

      await expect(questionService.deleteQuestion('missing-id')).rejects.toThrow('Question not found');
    });
  });
});
