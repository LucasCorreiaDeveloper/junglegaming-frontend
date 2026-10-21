import axios, { AxiosError } from 'axios'
import type { ApiErrorBody } from './types'

const TOKEN_KEY = 'kurio.token'
export const tokenStore = {
  get: () => { try { return localStorage.getItem(TOKEN_KEY) } catch { return null } },
  set: (t: string) => { try { localStorage.setItem(TOKEN_KEY, t) } catch { /* storage indisponível */ } },
  clear: () => { try { localStorage.removeItem(TOKEN_KEY) } catch { /* noop */ } },
}

export const http = axios.create({ baseURL: '/api', timeout: 8000 })

http.interceptors.request.use((cfg) => {
  const t = tokenStore.get()
  if (t) cfg.headers.set('Authorization', `Bearer ${t}`)
  return cfg
})

/** Erro normalizado: a UI nunca lida com AxiosError diretamente. */
export class ApiError extends Error {
  status: number
  body: ApiErrorBody
  isNetwork: boolean
  constructor(status: number, body: ApiErrorBody, isNetwork = false) {
    super(body.message)
    this.status = status
    this.body = body
    this.isNetwork = isNetwork
  }
  get retryable() { return this.isNetwork || this.status >= 500 || this.body.code === 'TRANSIENT' }
}

let onSessionExpired: (() => void) | null = null
export const setSessionExpiredHandler = (fn: (() => void) | null) => { onSessionExpired = fn }

http.interceptors.response.use(undefined, (err: AxiosError<ApiErrorBody>) => {
  if (axios.isCancel(err)) return Promise.reject(err)
  if (!err.response) {
    const timeout = err.code === 'ECONNABORTED'
    return Promise.reject(new ApiError(0, { code: 'TRANSIENT', message: timeout ? 'A requisição demorou demais.' : 'Sem conexão com o servidor.' }, true))
  }
  const body = err.response.data?.code ? err.response.data : { code: 'TRANSIENT' as const, message: 'Erro inesperado.' }
  if (body.code === 'SESSION_EXPIRED') onSessionExpired?.()
  return Promise.reject(new ApiError(err.response.status, body))
})
