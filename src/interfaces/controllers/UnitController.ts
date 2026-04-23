import { Request, Response } from 'express';
import { UnitService } from '../../application/services/UnitService';

export class UnitController {
  constructor(private readonly unitService: UnitService) {}

  getAllUnits = async (req: Request, res: Response): Promise<void> => {
    try {
      const courseId = req.query.courseId as string | undefined;
      const units = await this.unitService.getAllUnits(courseId);
      res.status(200).json(units);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getUnitById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id as string;
      const unit = await this.unitService.getUnitById(id);
      
      if (!unit) {
        res.status(404).json({ error: 'Unit not found' });
        return;
      }
      
      res.status(200).json(unit);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  createUnit = async (req: Request, res: Response): Promise<void> => {
    try {
      const { title, description, orderIndex, courseId } = req.body;
      const unit = await this.unitService.createUnit({ title, description, orderIndex, courseId });
      res.status(201).json(unit);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  updateUnit = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id as string;
      const { title, description, orderIndex } = req.body;
      const unit = await this.unitService.updateUnit(id, { title, description, orderIndex });
      res.status(200).json(unit);
    } catch (error: any) {
      if (error.message === 'Unit not found') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  };

  deleteUnit = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id as string;
      await this.unitService.deleteUnit(id);
      res.status(204).send();
    } catch (error: any) {
      if (error.message === 'Unit not found') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  };
}
