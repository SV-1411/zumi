import type { RequestHandler } from 'express';
import type { ZodTypeAny, infer as ZInfer } from 'zod';

type Schemas = {
  body?: ZodTypeAny;
  query?: ZodTypeAny;
  params?: ZodTypeAny;
};

/**
 * Validates and coerces request parts against zod schemas. On success the
 * parsed values replace the originals so downstream handlers get typed data.
 */
export const validate =
  (schemas: Schemas): RequestHandler =>
  (req, _res, next) => {
    try {
      if (schemas.body) req.body = schemas.body.parse(req.body);
      if (schemas.query) Object.assign(req.query, schemas.query.parse(req.query));
      if (schemas.params) Object.assign(req.params, schemas.params.parse(req.params));
      next();
    } catch (err) {
      next(err);
    }
  };

export type Infer<T extends ZodTypeAny> = ZInfer<T>;
