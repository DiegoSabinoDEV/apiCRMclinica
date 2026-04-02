import type { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma.js';
import { requireRole } from '../lib/auth.js';

export async function reminderRoutes(app: FastifyInstance) {
  app.get('/api/v1/alerts/retouch', { preHandler: [requireRole('admin', 'secretaria', 'profissional', 'gestor')] }, async (request) => {
    const { days = '45' } = request.query as { days?: string };
    const limitDays = Number(days) || 45;
    const now = new Date();
    const procedures = await prisma.procedure.findMany({
      include: { service: true, patient: true },
      orderBy: { performedAt: 'desc' },
      take: 200,
    });

    const alerts = procedures.flatMap((procedure) => {
      const min = procedure.service?.retouchDaysMin ?? null;
      const max = procedure.service?.retouchDaysMax ?? null;
      if (!min && !max) return [];

      const performed = new Date(procedure.performedAt);
      const daysSince = Math.floor((now.getTime() - performed.getTime()) / (1000 * 60 * 60 * 24));
      const dueFrom = min ?? max ?? 0;
      const dueTo = max ?? min ?? limitDays;
      const isDueSoon = daysSince >= dueFrom - 7 && daysSince <= dueTo;
      const isOverdue = daysSince > dueTo;

      if (!isDueSoon && !isOverdue) return [];

      return [{
        id: procedure.id,
        patientName: procedure.patient.fullName,
        serviceName: procedure.service?.name ?? 'Serviço',
        performedAt: procedure.performedAt,
        daysSince,
        status: isOverdue ? 'atrasado' : 'programado',
      }];
    });

    return { ok: true, data: alerts };
  });
}
