import { z } from 'zod';

export const createGradeSchema = z.object({
  body: z.object({
    name: z.string({
      message: 'Name is required',
    }).min(2, 'Name must be at least 2 characters long').max(100, 'Name cannot exceed 100 characters'),
    description: z.string().max(500, 'Description cannot exceed 500 characters').optional(),
    orderIndex: z.number().int().min(0, 'Order index must be a non-negative integer').optional(),
  }),
});

export const updateGradeSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters long').max(100, 'Name cannot exceed 100 characters').optional(),
    description: z.string().max(500, 'Description cannot exceed 500 characters').optional(),
    orderIndex: z.number().int().min(0, 'Order index must be a non-negative integer').optional(),
  }),
  params: z.object({
    id: z.string().uuid('Invalid Grade ID format'),
  }),
});

export const gradeIdParamsSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid Grade ID format'),
  }),
});
