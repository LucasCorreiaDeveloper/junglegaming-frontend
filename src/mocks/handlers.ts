import { http, HttpResponse } from 'msw'

// Etapa 2 popula os handlers REST/Socket.IO. Por ora, apenas um healthcheck.
export const handlers = [http.get('/api/health', () => HttpResponse.json({ ok: true }))]
