import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

/**
 * Zod schema tabanlı doğrulama middleware'i.
 * Gelen isteğin body, query veya params alanlarını verilen şemaya göre doğrular.
 */
export const validateRequest = (schema: any) => 
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error: any) {
      if (error instanceof ZodError) {
        res.status(400).json({
          error: 'Validation failed',
          details: (error.issues || []).map((err: any) => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
        return;
      }
      next(error);
    }
  };
