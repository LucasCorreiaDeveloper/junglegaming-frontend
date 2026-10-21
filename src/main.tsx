import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from '@tanstack/react-router'
import './index.css'
import { router } from './router'
import { ApiError } from './api/client'

/** Política de cache/retry (documentada no README): 4xx não repete; rede/5xx repetem até 2x com backoff. */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      retry: (n, err) => err instanceof ApiError && err.retryable && n < 2,
      retryDelay: (n) => Math.min(500 * 2 ** n, 4000),
      refetchOnWindowFocus: false,
    },
    mutations: { retry: false },
  },
})

async function bootstrap() {
  if (import.meta.env.VITE_ENABLE_MOCKS !== 'false') {
    const { startMocks } = await import('./mocks/browser')
    await startMocks()
  }
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>,
  )
}
void bootstrap()
