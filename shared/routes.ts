import { z } from 'zod';
import {
  insertUserSchema, insertGuestSchema,
  type User, type Provider, type Plan, type Guest,
  type InsertGuest, type LoginRequest, type RegisterRequest,
  type CreatePlanRequest, type PlanResponse
} from './schema';

export {
  User, Provider, Plan, Guest,
  InsertGuest, LoginRequest, RegisterRequest,
  CreatePlanRequest, PlanResponse
};

export const errorSchemas = {
  validation: z.object({ message: z.string(), field: z.string().optional() }),
  notFound: z.object({ message: z.string() }),
  internal: z.object({ message: z.string() }),
  unauthorized: z.object({ message: z.string() }),
};

export const api = {
  auth: {
    register: { method: 'POST' as const, path: '/api/register' as const },
    login: { method: 'POST' as const, path: '/api/login' as const },
    logout: { method: 'POST' as const, path: '/api/logout' as const },
    me: { method: 'GET' as const, path: '/api/user' as const },
  },
  providers: {
    list: { method: 'GET' as const, path: '/api/providers' as const },
    get: { method: 'GET' as const, path: '/api/providers/:id' as const },
  },
  plans: {
    create: { method: 'POST' as const, path: '/api/plans' as const },
    list: { method: 'GET' as const, path: '/api/plans' as const },
  },
  guests: {
    list: { method: 'GET' as const, path: '/api/guests' as const },
    create: { method: 'POST' as const, path: '/api/guests' as const },
    delete: { method: 'DELETE' as const, path: '/api/guests/:id' as const },
  },
  payment: {
    process: { method: 'POST' as const, path: '/api/pay' as const },
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
