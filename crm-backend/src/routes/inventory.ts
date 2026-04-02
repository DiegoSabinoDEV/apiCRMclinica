import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { requireRole } from '../lib/auth.js';

const movementSchema = z.object({
  inventoryItemId: z.string().uuid(),
  procedureId: z.string().uuid().optional(),
  movementType: z.enum(['entrada', 'saida', 'ajuste', 'reserva']),
  quantity: z.number(),
  unitCost: z.number().optional(),
});

export async function inventoryRoutes(app: FastifyInstance) {
  app.get('/api/v1/inventory/items', { preHandler: [requireRole('admin', 'financeiro', 'gestor')] }, async () => {
    const items = await prisma.inventoryItem.findMany({ orderBy: { name: 'asc' } });
    return { ok: true, data: items };
  });

  app.get('/api/v1/inventory/alerts', { preHandler: [requireRole('admin', 'financeiro', 'gestor')] }, async () => {
    const items = await prisma.inventoryItem.findMany();
    const alerts = items.filter((item) => Number(item.currentStock) <= Number(item.minimumStock));
    return { ok: true, data: alerts };
  });

  app.post('/api/v1/inventory/movements', { preHandler: [requireRole('admin', 'financeiro', 'gestor')] }, async (request, reply) => {
    const parsed = movementSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ ok: false, error: parsed.error.flatten() });
    }

    const movement = await prisma.inventoryMovement.create({ data: parsed.data as never });
    return reply.status(201).send({ ok: true, data: movement });
  });
}
