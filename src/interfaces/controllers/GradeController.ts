import { Request, Response } from 'express';
import { GradeService } from '../../application/services/GradeService';

export class GradeController {
  constructor(private readonly gradeService: GradeService) {}

  getAllGrades = async (req: Request, res: Response): Promise<void> => {
    try {
      const grades = await this.gradeService.getAllGrades();
      res.status(200).json(grades);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getGradeById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id as string;
      const grade = await this.gradeService.getGradeById(id);

      if (!grade) {
        res.status(404).json({ error: 'Grade not found' });
        return;
      }

      res.status(200).json(grade);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  createGrade = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, description, orderIndex } = req.body;
      const grade = await this.gradeService.createGrade({ name, description, orderIndex });
      res.status(201).json(grade);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  updateGrade = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id as string;
      const { name, description, orderIndex } = req.body;
      const grade = await this.gradeService.updateGrade(id, { name, description, orderIndex });
      res.status(200).json(grade);
    } catch (error: any) {
      if (error.message === 'Grade not found') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  };

  deleteGrade = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id as string;
      await this.gradeService.deleteGrade(id);
      res.status(204).send();
    } catch (error: any) {
      if (error.message === 'Grade not found') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  };
}
