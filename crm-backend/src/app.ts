import Fastify from 'fastify';
import cors from '@fastify/cors';
import formbody from '@fastify/formbody';
import multipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import { join } from 'node:path';
import { authRoutes } from './routes/auth.js';
import { appointmentRoutes } from './routes/appointments.js';
import { consultationRoutes } from './routes/consultations.js';
import { financialRoutes } from './routes/financial.js';
import { leadRoutes } from './routes/leads.js';
import { inventoryRoutes } from './routes/inventory.js';
import { patientRoutes } from './routes/patients.js';
import { photoRoutes } from './routes/photos.js';
import { serviceRoutes } from './routes/services.js';
import { searchRoutes } from './routes/search.js';
import { consentRoutes } from './routes/consents.js';
import { reminderRoutes } from './routes/reminders.js';
import { webhookRoutes } from './routes/webhooks.js';
import { requireAuth } from './lib/auth.js';

export function buildApp() {
  const app = Fastify({ logger: true });

  app.register(cors, { origin: true });
  app.register(formbody);
  app.register(multipart, { limits: { fileSize: 10 * 1024 * 1024 } });
  app.register(fastifyStatic, {
    root: join(process.cwd(), 'uploads'),
    prefix: '/uploads/',
  });

  app.get('/health', async () => ({ ok: true, service: 'harmonny-crm-backend' }));

  app.register(authRoutes);
  app.register(webhookRoutes);

  app.register(async function protectedRoutes(protectedApp) {
    protectedApp.addHook('preHandler', requireAuth);

    protectedApp.register(leadRoutes);
    protectedApp.register(patientRoutes);
    protectedApp.register(serviceRoutes);
    protectedApp.register(appointmentRoutes);
    protectedApp.register(consultationRoutes);
    protectedApp.register(photoRoutes);
    protectedApp.register(consentRoutes);
    protectedApp.register(reminderRoutes);
    protectedApp.register(searchRoutes);
    protectedApp.register(inventoryRoutes);
    protectedApp.register(financialRoutes);
  });

  app.get('/api/v1/bootstrap', { preHandler: [requireAuth] }, async () => ({
    ok: true,
    modules: ['auth', 'leads', 'patients', 'services', 'appointments', 'consultations', 'photos', 'consents', 'reminders', 'search', 'inventory', 'financial'],
  }));

  return app;
}
