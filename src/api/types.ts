import type { EthString } from '@/lib/money'

export type Network = 'Ethereum' | 'Polygon' | 'Solana'
export type SortKey = 'recent' | 'price-asc' | 'price-desc' | 'name'
export type CatalogTab = 'all' | 'new' | 'trending'

export interface Nft {
  id: string
  name: string
  tokenId: string
  collection: string
  category: string
  network: Network
  price: EthString
  oldPrice?: EthString
  rare: boolean
  rating: number
  ratingCount: number
  description: string
  attributes: string[]
  image: string
  gallery: string[]
  editions: { id: string; label: string; available: number }[]
  version: number
  updatedAt: string
}

export interface NftQuery {
  q?: string
  category?: string
  network?: Network
  minPrice?: string
  maxPrice?: string
  sort: SortKey
  tab: CatalogTab
  page: number
  pageSize: number
}

export interface Page<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  facets: { categories: Record<string, number>; networks: Record<string, number> }
}

export interface User {
  id: string
  username: string
  displayName: string
  email: string
  ens?: string
  avatarUrl?: string
}
export interface Session { user: User; expiresAt: string }

export interface CartItem { nftId: string; editionId: string; quantity: number }
export interface Cart { items: CartItem[]; version: number }

export interface QuoteLine {
  nftId: string
  editionId: string
  quantity: number
  unitPrice: EthString
  subtotal: EthString
  version: number
}
export interface Quote {
  quoteId: string
  lines: QuoteLine[]
  subtotal: EthString
  discount: EthString
  networkFee: EthString
  total: EthString
  coupon?: { code: string; valid: boolean; reason?: 'invalid' | 'expired' }
  expiresAt: string
}

export type OrderStatus = 'pending' | 'confirmed' | 'rejected'
export interface Order {
  id: string
  status: OrderStatus
  version: number
  txHash?: string
  createdAt: string
  walletId: string
  network: Network
  snapshot: Quote & { items: { name: string; tokenId: string; image: string }[] }
  rejectionReason?: string
}

export interface Wallet {
  id: string
  kind: 'primary' | 'secondary'
  displayName: string
  address: string
  network: Network
  provider: 'WalletConnect' | 'MetaMask' | 'Coinbase Wallet'
  ens?: string
}

export type ApiErrorCode =
  | 'VALIDATION' | 'UNAUTHENTICATED' | 'SESSION_EXPIRED' | 'FORBIDDEN'
  | 'NOT_FOUND' | 'CONFLICT' | 'AVAILABILITY_CONFLICT' | 'PRICE_CHANGED'
  | 'IDEMPOTENCY_CONFLICT' | 'TRANSIENT'

export interface ApiErrorBody {
  code: ApiErrorCode
  message: string
  fields?: Record<string, string>
}

/** Eventos Socket.IO: identidade estável, recurso afetado e versão. */
export interface RealtimeEvent<T = unknown> {
  eventId: string
  resource: { type: 'nft' | 'order'; id: string }
  version: number
  userId?: string
  data: T
}
