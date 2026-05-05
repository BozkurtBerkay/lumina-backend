import { z } from 'zod';

const QuestionTypeEnum = z.enum(['MULTIPLE_CHOICE', 'TRUE_FALSE', 'OPEN_ENDED']);

const imageUrlSchema = z.string()
  .transform(val => val === '' ? null : val)
  .pipe(z.string().url('Geçerli bir URL giriniz').nullable())
  .optional();

const imageAltSchema = z.string().optional().nullable();

const baseQuestionBodySchema = z.object({
  content: z.string({
    message: 'Question content is required',
  }).min(3, 'Content must be at least 3 characters long'),
  type: QuestionTypeEnum.optional(),
  options: z.record(z.string(), z.string()).optional().nullable(),
  correctAnswer: z.string().optional().nullable(),
  imageUrl: imageUrlSchema,
  imageAlt: imageAltSchema,
  orderIndex: z.number().int().min(0, 'Order index must be a non-negative integer').optional(),
  unitId: z.string().uuid('Invalid Unit ID format'),
});

const questionBodySchema = baseQuestionBodySchema.refine((data) => {
  // If MULTIPLE_CHOICE, correctAnswer must be A, B, C, or D and exist in options
  if (data.type === 'MULTIPLE_CHOICE' || !data.type) {
    if (data.correctAnswer && !['A', 'B', 'C', 'D'].includes(data.correctAnswer)) {
      return false;
    }
    if (data.options && data.correctAnswer && !data.options[data.correctAnswer]) {
      return false;
    }
  }
  // If TRUE_FALSE, correctAnswer must be true or false
  if (data.type === 'TRUE_FALSE') {
    if (data.correctAnswer && !['true', 'false'].includes(data.correctAnswer)) {
      return false;
    }
  }
  return true;
}, {
  message: 'Invalid correctAnswer for the given question type or options',
  path: ['correctAnswer'],
});

export const createQuestionSchema = z.object({
  body: questionBodySchema,
});

export const updateQuestionSchema = z.object({
  body: baseQuestionBodySchema.partial().refine((data) => {
    // Partial validation is trickier because we might not have both options and correctAnswer in the same update
    // But for simplicity, we can just allow it or fetch from DB (which Zod can't do easily here)
    // We'll just enforce the values are valid if present
    if (data.type === 'MULTIPLE_CHOICE') {
      if (data.correctAnswer && !['A', 'B', 'C', 'D'].includes(data.correctAnswer)) {
        return false;
      }
    }
    if (data.type === 'TRUE_FALSE') {
      if (data.correctAnswer && !['true', 'false'].includes(data.correctAnswer)) {
        return false;
      }
    }
    return true;
  }, {
    message: 'Invalid correctAnswer format',
    path: ['correctAnswer']
  }),
  params: z.object({
    id: z.string().uuid('Invalid Question ID format'),
  }),
});


export const questionIdParamsSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid Question ID format'),
  }),
});

export const getQuestionsQuerySchema = z.object({
  query: z.object({
    unitId: z.string().uuid('Invalid Unit ID format').optional(),
  }),
});

export const reorderQuestionsSchema = z.object({
  body: z.object({
    questions: z
      .array(
        z.object({
          id: z.string().uuid('Invalid Question ID format'),
          orderIndex: z.number().int().min(0, 'Order index must be a non-negative integer'),
        })
      )
      .min(1, 'At least one question must be provided'),
  }),
});
