import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { requireRole } from '../lib/auth.js';

const serviceSchema = z.object({
  name: z.string().min(2),
  category: z.string().min(2),
  durationMinutes: z.number().int().min(10).default(30),
  retouchDaysMin: z.number().int().optional(),
  retouchDaysMax: z.number().int().optional(),
  priceBase: z.number().optional(),
  active: z.boolean().default(true),
});

export async function serviceRoutes(app: FastifyInstance) {
  app.get('/api/v1/services', { preHandler: [requireRole('admin', 'secretaria', 'profissional', 'financeiro', 'gestor')] }, async () => {
    const services = await prisma.service.findMany({ orderBy: { name: 'asc' } });
    return { ok: true, data: services };
  });

  app.post('/api/v1/services', { preHandler: [requireRole('admin', 'gestor')] }, async (request, reply) => {
    const parsed = serviceSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ ok: false, error: parsed.error.flatten() });
    }

    const service = await prisma.service.create({ data: parsed.data as never });
    return reply.status(201).send({ ok: true, data: service });
  });
}
