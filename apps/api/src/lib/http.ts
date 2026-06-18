import type { Request, Response, NextFunction, RequestHandler } from 'express';

/** Wrap an async handler so rejected promises reach the error middleware. */
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler =>
  (req, res, next) => {
    fn(req, res, next).catch(next);
  };

/** Typed application error with an HTTP status. */
export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown
  ) {
    super(message);
  }
}

export const notFound = (msg = 'Not found') => new HttpError(404, msg);
export const unauthorized = (msg = 'Unauthorized') => new HttpError(401, msg);
export const forbidden = (msg = 'Forbidden') => new HttpError(403, msg);
export const badRequest = (msg = 'Bad request', details?: unknown) =>
  new HttpError(400, msg, details);
