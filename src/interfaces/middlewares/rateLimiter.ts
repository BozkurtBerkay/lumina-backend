import rateLimit from 'express-rate-limit';

/**
 * Global rate limiter — tüm endpoint'lere uygulanır.
 * Varsayılan: 15 dakikada en fazla 100 istek.
 */
export const globalRateLimiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 15 dakika
  limit: 1000,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    error: 'Too many requests, please try again later.',
  },
});

/**
 * Sıkı rate limiter — hassas endpoint'ler için (auth, login vb.)
 * 15 dakikada en fazla 20 istek.
 */
export const strictRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    error: 'Too many requests to this endpoint, please try again later.',
  },
});
