import { Request, Response } from 'express';
import { QuestionService } from '../../application/services/QuestionService';

export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  getAllQuestions = async (req: Request, res: Response): Promise<void> => {
    try {
      const unitId = req.query.unitId as string | undefined;
      const questions = await this.questionService.getAllQuestions(unitId);
      res.status(200).json(questions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getQuestionById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id as string;
      const question = await this.questionService.getQuestionById(id);
      
      if (!question) {
        res.status(404).json({ error: 'Question not found' });
        return;
      }
      
      res.status(200).json(question);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  createQuestion = async (req: Request, res: Response): Promise<void> => {
    try {
      const { content, type, options, correctAnswer, imageUrl, imageAlt, orderIndex, unitId } = req.body;
      const question = await this.questionService.createQuestion({
        content, type, options, correctAnswer, imageUrl, imageAlt, orderIndex, unitId
      });
      res.status(201).json(question);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  updateQuestion = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id as string;
      const { content, type, options, correctAnswer, imageUrl, imageAlt, orderIndex } = req.body;
      const question = await this.questionService.updateQuestion(id, {
        content, type, options, correctAnswer, imageUrl, imageAlt, orderIndex
      });
      res.status(200).json(question);
    } catch (error: any) {
      if (error.message === 'Question not found') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  };

  deleteQuestion = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id as string;
      await this.questionService.deleteQuestion(id);
      res.status(204).send();
    } catch (error: any) {
      if (error.message === 'Question not found') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  };
}
