import type { FastifyInstance } from 'fastify';
import { createWriteStream } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { pipeline } from 'node:stream/promises';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { requireRole } from '../lib/auth.js';

const photoSchema = z.object({
  patientId: z.string().uuid(),
  procedureId: z.string().uuid().optional(),
  photoType: z.enum(['before', 'after']),
  fileUrl: z.string().url(),
  tags: z.array(z.string()).default([]),
});

export async function photoRoutes(app: FastifyInstance) {
  app.post('/api/v1/uploads/image', { preHandler: [requireRole('admin', 'secretaria', 'profissional', 'gestor')] }, async (request, reply) => {
    const file = await request.file();
    if (!file) {
      return reply.status(400).send({ ok: false, error: 'Arquivo não enviado.' });
    }

    const uploadsDir = join(process.cwd(), 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    const safeName = `${Date.now()}-${file.filename.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const destination = join(uploadsDir, safeName);
    await pipeline(file.file, createWriteStream(destination));

    return reply.status(201).send({
      ok: true,
      fileUrl: `/uploads/${safeName}`,
      filename: safeName,
    });
  });

  app.get('/api/v1/patients/:patientId/photos', { preHandler: [requireRole('admin', 'secretaria', 'profissional', 'gestor')] }, async (request) => {
    const { patientId } = request.params as { patientId: string };
    const photos = await prisma.beforeAfterPhoto.findMany({
      where: { patientId },
      orderBy: { takenAt: 'desc' },
    });

    return { ok: true, data: photos };
  });

  app.post('/api/v1/photos/before-after', { preHandler: [requireRole('admin', 'secretaria', 'profissional', 'gestor')] }, async (request, reply) => {
    const parsed = photoSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ ok: false, error: parsed.error.flatten() });
    }

    const photo = await prisma.beforeAfterPhoto.create({
      data: {
        patientId: parsed.data.patientId,
        procedureId: parsed.data.procedureId,
        photoType: parsed.data.photoType,
        fileUrl: parsed.data.fileUrl,
        tags: parsed.data.tags,
      },
    });

    return reply.status(201).send({ ok: true, data: photo });
  });
}
