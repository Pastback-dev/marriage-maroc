import { z } from 'zod';
import { insertUserSchema, insertGuestSchema, providers, plans, guests, users, type User, type Provider, type Plan, type Guest, type InsertGuest, type LoginRequest, type RegisterRequest, type CreatePlanRequest, type PlanResponse } from './schema';

export { User, Provider, Plan, Guest, InsertGuest, LoginRequest, RegisterRequest, CreatePlanRequest, PlanResponse };

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
  unauthorized: z.object({
    message: z.string(),
  }),
};

export const api = {
  auth: {
    register: {
      method: 'POST' as const,
      path: '/api/register' as const,
      input: insertUserSchema,
      responses: {
        201: z.custom<typeof users.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    login: {
      method: 'POST' as const,
      path: '/api/login' as const,
      input: insertUserSchema.pick({ username: true, password: true }).extend({ role: z.string().optional() }),
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
    logout: {
      method: 'POST' as const,
      path: '/api/logout' as const,
      responses: {
        200: z.object({ message: z.string() }),
      },
    },
    me: {
      method: 'GET' as const,
      path: '/api/user' as const,
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
  },
  providers: {
    list: {
      method: 'GET' as const,
      path: '/api/providers' as const,
      input: z.object({
        category: z.string().optional(),
        city: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof providers.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/providers/:id' as const,
      responses: {
        200: z.custom<typeof providers.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  plans: {
    create: {
      method: 'POST' as const, // This runs the "AI" logic
      path: '/api/plans' as const,
      input: z.object({
        guestCount: z.number().min(1),
        totalBudget: z.number().min(1000),
        city: z.string(),
        weddingStyle: z.string(),
      }),
      responses: {
        201: z.custom<typeof plans.$inferSelect & { breakdown: any }>(),
        401: errorSchemas.unauthorized,
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/plans' as const,
      responses: {
        200: z.array(z.custom<typeof plans.$inferSelect>()),
        401: errorSchemas.unauthorized,
      },
    },
  },
  guests: {
    list: {
      method: 'GET' as const,
      path: '/api/guests' as const,
      responses: {
        200: z.array(z.custom<typeof guests.$inferSelect>()),
        401: errorSchemas.unauthorized,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/guests' as const,
      input: insertGuestSchema,
      responses: {
        201: z.custom<typeof guests.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/guests/:id' as const,
      responses: {
        200: z.void(),
        401: errorSchemas.unauthorized,
      },
    },
  },
  payment: {
    process: {
      method: 'POST' as const,
      path: '/api/pay' as const,
      input: z.object({
        amount: z.number(),
        method: z.enum(['cash', 'paypal']),
        planId: z.number().optional(),
      }),
      responses: {
        200: z.object({ success: z.boolean(), message: z.string() }),
        401: errorSchemas.unauthorized,
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
