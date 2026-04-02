import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { requireRole } from '../lib/auth.js';

const consentSchema = z.object({
  patientId: z.string().uuid(),
  consentType: z.string().min(2),
  signedAt: z.string().datetime().optional(),
  fileUrl: z.string().url().optional(),
  metadata: z.record(z.any()).default({}),
});

export async function consentRoutes(app: FastifyInstance) {
  app.get('/api/v1/patients/:patientId/consents', { preHandler: [requireRole('admin', 'secretaria', 'profissional', 'gestor')] }, async (request) => {
    const { patientId } = request.params as { patientId: string };
    const consents = await prisma.consentForm.findMany({ where: { patientId }, orderBy: { createdAt: 'desc' } });
    return { ok: true, data: consents };
  });

  app.post('/api/v1/consents', { preHandler: [requireRole('admin', 'secretaria', 'profissional', 'gestor')] }, async (request, reply) => {
    const parsed = consentSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ ok: false, error: parsed.error.flatten() });
    }

    const consent = await prisma.consentForm.create({
      data: {
        patientId: parsed.data.patientId,
        consentType: parsed.data.consentType,
        signedAt: parsed.data.signedAt ? new Date(parsed.data.signedAt) : new Date(),
        fileUrl: parsed.data.fileUrl,
        metadata: parsed.data.metadata,
      },
    });

    return reply.status(201).send({ ok: true, data: consent });
  });
}
