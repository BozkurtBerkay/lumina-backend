import { Request, Response } from 'express';
import { CourseService } from '../../application/services/CourseService';

export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  getAllCourses = async (req: Request, res: Response): Promise<void> => {
    try {
      const gradeId = req.query.gradeId as string | undefined;
      const courses = await this.courseService.getAllCourses(gradeId);
      res.status(200).json(courses);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getCourseById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id as string;
      const course = await this.courseService.getCourseById(id);
      
      if (!course) {
        res.status(404).json({ error: 'Course not found' });
        return;
      }
      
      res.status(200).json(course);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  createCourse = async (req: Request, res: Response): Promise<void> => {
    try {
      const { title, description, gradeId } = req.body;
      const course = await this.courseService.createCourse({ title, description, gradeId });
      res.status(201).json(course);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  updateCourse = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id as string;
      const { title, description } = req.body;
      const course = await this.courseService.updateCourse(id, { title, description });
      res.status(200).json(course);
    } catch (error: any) {
      if (error.message === 'Course not found') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  };

  deleteCourse = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id as string;
      await this.courseService.deleteCourse(id);
      res.status(204).send();
    } catch (error: any) {
      if (error.message === 'Course not found') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  };
}
