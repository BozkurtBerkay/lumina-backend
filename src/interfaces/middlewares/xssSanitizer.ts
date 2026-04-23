import { Request, Response, NextFunction } from 'express';
import sanitizeHtml from 'sanitize-html';

/**
 * XSS temizleyici middleware.
 * Gelen isteğin body, query ve params içindeki string değerlerini HTML etiketlerinden (özellikle <script>) arındırır.
 */

const sanitizeObj = (obj: any): any => {
  if (!obj) return obj;

  if (typeof obj === 'string') {
    return sanitizeHtml(obj, {
      allowedTags: [], // Hiçbir HTML etiketine izin verme (sadece saf metin)
      allowedAttributes: {},
    });
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObj(item));
  }

  if (typeof obj === 'object' && obj !== null) {
    const cleanObj: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        cleanObj[key] = sanitizeObj(obj[key]);
      }
    }
    return cleanObj;
  }

  return obj;
};

export const xssSanitizer = (req: Request, res: Response, next: NextFunction) => {
  if (req.body) req.body = sanitizeObj(req.body);
  if (req.query) Object.assign(req.query, sanitizeObj(req.query));
  if (req.params) Object.assign(req.params, sanitizeObj(req.params));

  next();
};
