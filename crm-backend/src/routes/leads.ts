import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { requireRole } from '../lib/auth.js';

const leadSchema = z.object({
  contactName: z.string().min(2),
  contactPhone: z.string().min(8),
  sourceChannel: z.string().min(2),
  procedureInterest: z.string().min(2),
  goal: z.string().min(2),
  urgency: z.string().min(2),
  originCampaign: z.string().optional(),
});

export async function leadRoutes(app: FastifyInstance) {
  app.get('/api/v1/leads', { preHandler: [requireRole('admin', 'secretaria', 'gestor')] }, async () => {
    const leads = await prisma.lead.findMany({ orderBy: { createdAt: 'desc' } });
    return { ok: true, data: leads };
  });

  app.post('/api/v1/leads', { preHandler: [requireRole('admin', 'secretaria', 'gestor')] }, async (request, reply) => {
    const parsed = leadSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ ok: false, error: parsed.error.flatten() });
    }

    const lead = await prisma.lead.create({
      data: {
        ...parsed.data,
        status: 'interessado',
      },
    });

    return reply.status(201).send({ ok: true, data: lead });
  });
}
