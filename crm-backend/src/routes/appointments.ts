import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { requireRole } from '../lib/auth.js';

const appointmentSchema = z.object({
  patientId: z.string().uuid(),
  leadId: z.string().uuid().optional(),
  professionalId: z.string().uuid().optional(),
  serviceId: z.string().uuid().optional(),
  scheduledAt: z.string().datetime(),
  status: z.enum(['agendado', 'confirmado', 'compareceu', 'faltou', 'cancelado']),
  notes: z.string().optional(),
});

export async function appointmentRoutes(app: FastifyInstance) {
  app.get('/api/v1/appointments', { preHandler: [requireRole('admin', 'secretaria', 'profissional', 'gestor')] }, async () => {
    const appointments = await prisma.appointment.findMany({ orderBy: { scheduledAt: 'desc' } });
    return { ok: true, data: appointments };
  });

  app.post('/api/v1/appointments', { preHandler: [requireRole('admin', 'secretaria', 'profissional', 'gestor')] }, async (request, reply) => {
    const parsed = appointmentSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ ok: false, error: parsed.error.flatten() });
    }

    const appointment = await prisma.appointment.create({
      data: {
        patientId: parsed.data.patientId,
        leadId: parsed.data.leadId,
        professionalId: parsed.data.professionalId,
        serviceId: parsed.data.serviceId,
        scheduledAt: new Date(parsed.data.scheduledAt),
        status: parsed.data.status,
        notes: parsed.data.notes,
      },
    });

    return reply.status(201).send({ ok: true, data: appointment });
  });
}
