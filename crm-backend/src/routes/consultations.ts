import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { requireRole } from '../lib/auth.js';

const consultationSchema = z.object({
  patientId: z.string().uuid(),
  appointmentId: z.string().uuid().optional(),
  professionalId: z.string().uuid().optional(),
  anamnesisJson: z.record(z.any()),
  clinicalNotes: z.string().optional(),
  recommendedPlan: z.string().optional(),
});

export async function consultationRoutes(app: FastifyInstance) {
  app.get('/api/v1/patients/:patientId/consultations', { preHandler: [requireRole('admin', 'profissional', 'gestor')] }, async (request) => {
    const { patientId } = request.params as { patientId: string };
    const consultations = await prisma.consultation.findMany({
      where: { patientId },
      orderBy: { createdAt: 'desc' },
    });

    return { ok: true, data: consultations };
  });

  app.post('/api/v1/consultations', { preHandler: [requireRole('admin', 'profissional', 'gestor')] }, async (request, reply) => {
    const parsed = consultationSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ ok: false, error: parsed.error.flatten() });
    }

    const consultation = await prisma.consultation.create({ data: parsed.data as never });
    return reply.status(201).send({ ok: true, data: consultation });
  });
}
