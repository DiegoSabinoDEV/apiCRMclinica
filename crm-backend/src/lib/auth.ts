import type { FastifyReply, FastifyRequest } from 'fastify';
import jwt from 'jsonwebtoken';

export type UserRole = 'admin' | 'secretaria' | 'profissional' | 'financeiro' | 'gestor';

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
}

const jwtSecret = process.env.JWT_SECRET ?? 'dev-secret';

export function signSessionToken(payload: SessionPayload) {
  return jwt.sign(payload, jwtSecret, { expiresIn: '12h' });
}

export function verifySessionToken(token: string) {
  return jwt.verify(token, jwtSecret) as SessionPayload;
}

export function getBearerToken(request: FastifyRequest) {
  const header = request.headers.authorization;
  if (!header?.startsWith('Bearer ')) return null;
  return header.slice('Bearer '.length);
}

export async function requireAuth(request: FastifyRequest, reply: FastifyReply) {
  const token = getBearerToken(request);
  if (!token) {
    return reply.status(401).send({ ok: false, error: 'Token de acesso ausente.' });
  }

  try {
    verifySessionToken(token);
  } catch {
    return reply.status(401).send({ ok: false, error: 'Token inválido ou expirado.' });
  }
}

export function requireRole(...roles: UserRole[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const token = getBearerToken(request);
    if (!token) {
      return reply.status(401).send({ ok: false, error: 'Token de acesso ausente.' });
    }

    try {
      const payload = verifySessionToken(token);
      if (!roles.includes(payload.role)) {
        return reply.status(403).send({ ok: false, error: 'Perfil sem permissão.' });
      }
    } catch {
      return reply.status(401).send({ ok: false, error: 'Token inválido ou expirado.' });
    }
  };
}
