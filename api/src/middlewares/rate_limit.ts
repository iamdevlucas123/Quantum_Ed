import { NextFunction, Request, Response } from 'express';

type RateLimitOptions = {
  maxRequests: number;
  windowMs: number;
};

type Bucket = {
  count: number;
  resetAt: number;
};

const DEFAULT_MESSAGE = 'Too many requests, please try again later';

const getClientKey = (req: Request): string => {
  return req.ip || req.socket.remoteAddress || 'unknown';
};

export const createRateLimiter = ({ maxRequests, windowMs }: RateLimitOptions) => {
  const buckets = new Map<string, Bucket>();

  return (req: Request, res: Response, next: NextFunction): void => {
    const now = Date.now();
    const key = getClientKey(req);
    const currentBucket = buckets.get(key);

    if (!currentBucket || currentBucket.resetAt <= now) {
      buckets.set(key, {
        count: 1,
        resetAt: now + windowMs,
      });
      next();
      return;
    }

    if (currentBucket.count >= maxRequests) {
      res.status(429).json({ message: DEFAULT_MESSAGE });
      return;
    }

    currentBucket.count += 1;
    next();
  };
};

export const globalRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 100,
});

export const authSensitiveRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 10,
});

export const authRefreshRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 30,
});
