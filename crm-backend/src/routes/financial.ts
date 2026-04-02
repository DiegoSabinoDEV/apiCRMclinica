import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { requireRole } from '../lib/auth.js';

const invoiceSchema = z.object({
  patientId: z.string().uuid(),
  appointmentId: z.string().uuid().optional(),
  totalAmount: z.number(),
  installments: z.number().int().min(1).default(1),
  status: z.enum(['aberta', 'parcial', 'quitada', 'cancelada']).default('aberta'),
  dueDate: z.string().datetime().optional(),
});

const paymentSchema = z.object({
  invoiceId: z.string().uuid(),
  amount: z.number(),
  method: z.enum(['pix', 'cartao', 'boleto', 'dinheiro', 'link_pagamento']),
  gatewayTransactionId: z.string().optional(),
});

export async function financialRoutes(app: FastifyInstance) {
  app.post('/api/v1/invoices', { preHandler: [requireRole('admin', 'financeiro', 'gestor')] }, async (request, reply) => {
    const parsed = invoiceSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ ok: false, error: parsed.error.flatten() });
    }

    const invoice = await prisma.invoice.create({
      data: {
        patientId: parsed.data.patientId,
        appointmentId: parsed.data.appointmentId,
        totalAmount: parsed.data.totalAmount,
        installments: parsed.data.installments,
        status: parsed.data.status,
        dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : undefined,
      } as never,
    });

    return reply.status(201).send({ ok: true, data: invoice });
  });

  app.post('/api/v1/payments', { preHandler: [requireRole('admin', 'financeiro', 'gestor')] }, async (request, reply) => {
    const parsed = paymentSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ ok: false, error: parsed.error.flatten() });
    }

    const payment = await prisma.payment.create({ data: parsed.data as never });
    return reply.status(201).send({ ok: true, data: payment });
  });

  app.get('/api/v1/patients/:patientId/financial', { preHandler: [requireRole('admin', 'financeiro', 'gestor')] }, async (request) => {
    const { patientId } = request.params as { patientId: string };
    const invoices = await prisma.invoice.findMany({ where: { patientId }, include: { payments: true } });
    return { ok: true, data: invoices };
  });
}
