import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { asyncHandler } from '../../lib/http.js';
import { validate } from '../../middleware/validate.js';
import { chatSchema } from './assistant.schema.js';
import { respond } from './assistant.service.js';
import type { ChatMessage } from '../../lib/openrouter.js';

export const assistantRouter = Router();

const chatLimiter = rateLimit({
  windowMs: 60_000,
  limit: 30,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

assistantRouter.post(
  '/chat',
  chatLimiter,
  validate({ body: chatSchema }),
  asyncHandler(async (req, res) => {
    const { messages, fields } = req.body as {
      messages: ChatMessage[];
      fields?: Record<string, string>;
    };
    const turn = await respond(messages, fields ?? {});
    res.json(turn);
  })
);
