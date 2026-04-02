import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { requireRole } from '../lib/auth.js';

const patientSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(8),
  email: z.string().email().optional(),
  cpf: z.string().optional(),
  birthDate: z.string().datetime().optional(),
  gender: z.string().optional(),
  notes: z.string().optional(),
});

export async function patientRoutes(app: FastifyInstance) {
  app.get('/api/v1/patients', { preHandler: [requireRole('admin', 'secretaria', 'profissional', 'financeiro', 'gestor')] }, async () => {
    const patients = await prisma.patient.findMany({ orderBy: { createdAt: 'desc' } });
    return { ok: true, data: patients };
  });

  app.post('/api/v1/patients', { preHandler: [requireRole('admin', 'secretaria', 'profissional', 'gestor')] }, async (request, reply) => {
    const parsed = patientSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ ok: false, error: parsed.error.flatten() });
    }

    const patient = await prisma.patient.create({
      data: {
        ...parsed.data,
        birthDate: parsed.data.birthDate ? new Date(parsed.data.birthDate) : undefined,
      },
    });

    return reply.status(201).send({ ok: true, data: patient });
  });
}
