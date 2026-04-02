import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';

const webhookSchema = z.object({
  nome: z.string().min(2),
  telefone: z.string().min(8),
  procedimento: z.string().min(2),
  objetivo: z.string().min(2),
  urgencia: z.string().min(2),
  origem: z.string().default('landing-page'),
});

const evolutionSchema = z.object({
  nome: z.string().optional(),
  telefone: z.string().optional(),
  procedure: z.string().optional(),
  goal: z.string().optional(),
  urgency: z.string().optional(),
  message: z.string().optional(),
});

export async function webhookRoutes(app: FastifyInstance) {
  app.post('/api/v1/webhooks/landing', async (request, reply) => {
    const parsed = webhookSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ ok: false, error: parsed.error.flatten() });
    }

    const lead = await prisma.lead.create({
      data: {
        contactName: parsed.data.nome,
        contactPhone: parsed.data.telefone,
        sourceChannel: parsed.data.origem,
        procedureInterest: parsed.data.procedimento,
        goal: parsed.data.objetivo,
        urgency: parsed.data.urgencia,
        status: 'interessado',
      },
    });

    return reply.status(201).send({
      ok: true,
      message: 'Lead recebido e qualificado para a equipe.',
      data: lead,
    });
  });

  app.post('/api/v1/webhooks/evolution', async (request, reply) => {
    const parsed = evolutionSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ ok: false, error: parsed.error.flatten() });
    }

    const lead = await prisma.lead.create({
      data: {
        contactName: parsed.data.nome ?? 'Lead WhatsApp',
        contactPhone: parsed.data.telefone ?? 'nao-informado',
        sourceChannel: 'whatsapp',
        procedureInterest: parsed.data.procedure ?? parsed.data.message ?? 'nao-informado',
        goal: parsed.data.goal ?? 'nao-informado',
        urgency: parsed.data.urgency ?? 'nao-informado',
        status: 'interessado',
      },
    });

    return reply.status(201).send({
      ok: true,
      message: 'Mensagem da Evolution recebida e registrada no CRM.',
      data: lead,
    });
  });
}
