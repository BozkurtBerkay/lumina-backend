import { z } from 'zod';

export const createCourseSchema = z.object({
  body: z.object({
    title: z.string({
      message: 'Title is required',
    }).min(3, 'Title must be at least 3 characters long').max(100, 'Title cannot exceed 100 characters'),
    description: z.string().max(500, 'Description cannot exceed 500 characters').optional(),
    gradeId: z.string().uuid('Invalid Grade ID format'),
  }),
});

export const updateCourseSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters long').max(100, 'Title cannot exceed 100 characters').optional(),
    description: z.string().max(500, 'Description cannot exceed 500 characters').optional(),
  }),
  params: z.object({
    id: z.string().uuid('Invalid Course ID format'),
  }),
});

export const courseIdParamsSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid Course ID format'),
  }),
});

export const getCoursesQuerySchema = z.object({
  query: z.object({
    gradeId: z.string().uuid('Invalid Grade ID format').optional(),
  }),
});
