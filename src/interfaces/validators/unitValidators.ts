import { z } from 'zod';

export const createUnitSchema = z.object({
  body: z.object({
    title: z.string({
      message: 'Title is required',
    }).min(3, 'Title must be at least 3 characters long').max(100, 'Title cannot exceed 100 characters'),
    description: z.string().max(500, 'Description cannot exceed 500 characters').optional(),
    orderIndex: z.number().int().min(0, 'Order index must be a non-negative integer').optional(),
    courseId: z.string().uuid('Invalid Course ID format'),
  }),
});

export const updateUnitSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters long').max(100, 'Title cannot exceed 100 characters').optional(),
    description: z.string().max(500, 'Description cannot exceed 500 characters').optional(),
    orderIndex: z.number().int().min(0, 'Order index must be a non-negative integer').optional(),
  }),
  params: z.object({
    id: z.string().uuid('Invalid Unit ID format'),
  }),
});

export const unitIdParamsSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid Unit ID format'),
  }),
});

export const getUnitsQuerySchema = z.object({
  query: z.object({
    courseId: z.string().uuid('Invalid Course ID format').optional(),
  }),
});
