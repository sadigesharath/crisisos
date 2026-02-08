import { z } from 'zod';
import { insertSignalSchema, CrisisStateSchema, AnalyzeResponseSchema } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  crisis: {
    analyze: {
      method: 'POST' as const,
      path: '/api/analyze' as const,
      input: insertSignalSchema,
      responses: {
        200: AnalyzeResponseSchema,
        400: errorSchemas.validation,
        500: errorSchemas.internal,
      },
    },
    getState: {
      method: 'GET' as const,
      path: '/api/state' as const,
      responses: {
        200: CrisisStateSchema,
        500: errorSchemas.internal,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
