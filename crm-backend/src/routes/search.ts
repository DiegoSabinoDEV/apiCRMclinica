import type { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma.js';
import { requireRole } from '../lib/auth.js';

export async function searchRoutes(app: FastifyInstance) {
  app.get('/api/v1/search', { preHandler: [requireRole('admin', 'secretaria', 'profissional', 'financeiro', 'gestor')] }, async (request) => {
    const { q = '' } = request.query as { q?: string };
    const term = q.trim();

    if (!term) {
      return { ok: true, data: { leads: [], patients: [], appointments: [] } };
    }

    const [leads, patients, appointments] = await Promise.all([
      prisma.lead.findMany({
        where: {
          OR: [
            { contactName: { contains: term, mode: 'insensitive' } },
            { contactPhone: { contains: term, mode: 'insensitive' } },
            { procedureInterest: { contains: term, mode: 'insensitive' } },
            { goal: { contains: term, mode: 'insensitive' } },
            { urgency: { contains: term, mode: 'insensitive' } },
          ],
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      prisma.patient.findMany({
        where: {
          OR: [
            { fullName: { contains: term, mode: 'insensitive' } },
            { phone: { contains: term, mode: 'insensitive' } },
            { email: { contains: term, mode: 'insensitive' } },
          ],
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      prisma.appointment.findMany({
        where: {
          OR: [
            { notes: { contains: term, mode: 'insensitive' } },
          ],
        },
        orderBy: { scheduledAt: 'desc' },
        take: 10,
      }),
    ]);

    return { ok: true, data: { leads, patients, appointments } };
  });
}
