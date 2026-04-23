import { Request, Response } from "express";
import { SchoolService } from "../../application/services/SchoolService";

export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  getAllSchools = async (_req: Request, res: Response): Promise<void> => {
    try {
      const schools = await this.schoolService.getAllSchools();
      res.status(200).json(schools);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  getSchoolById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const school = await this.schoolService.getSchoolById(id);
      res.status(200).json(school);
    } catch (error: any) {
      const status = error.message === "School not found" ? 404 : 500;
      res.status(status).json({ message: error.message });
    }
  };

  createSchool = async (req: Request, res: Response): Promise<void> => {
    try {
      const school = await this.schoolService.createSchool(req.body);
      res.status(201).json(school);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  updateSchool = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const school = await this.schoolService.updateSchool(id, req.body);
      res.status(200).json(school);
    } catch (error: any) {
      const status = error.message === "School not found" ? 404 : 400;
      res.status(status).json({ message: error.message });
    }
  };

  deleteSchool = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      await this.schoolService.deleteSchool(id);
      res.status(204).send();
    } catch (error: any) {
      const status = error.message === "School not found" ? 404 : 500;
      res.status(status).json({ message: error.message });
    }
  };
}
