import type { FastifyInstance } from 'fastify';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { getBearerToken, requireAuth, signSessionToken, verifySessionToken, type UserRole } from '../lib/auth.js';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function authRoutes(app: FastifyInstance) {
  app.get('/api/v1/auth/me', { preHandler: [requireAuth] }, async (request, reply) => {
    const token = getBearerToken(request);
    if (!token) {
      return reply.status(401).send({ ok: false, error: 'Token de acesso ausente.' });
    }

    const session = verifySessionToken(token);
    return {
      ok: true,
      user: session,
    };
  });

  app.post('/api/v1/auth/login', async (request, reply) => {
    const parsed = loginSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ ok: false, error: parsed.error.flatten() });
    }

    const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
    if (!user) {
      return reply.status(401).send({ ok: false, error: 'Credenciais inválidas.' });
    }

    const isValid = await bcrypt.compare(parsed.data.password, user.passwordHash);
    if (!isValid) {
      return reply.status(401).send({ ok: false, error: 'Credenciais inválidas.' });
    }

    const token = signSessionToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role as UserRole,
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return reply.send({
      ok: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  });
}
