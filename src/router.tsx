import { createRootRoute, createRoute, createRouter, Link, redirect } from '@tanstack/react-router'
import { z } from 'zod'
import { RootLayout } from '@/components/layout/RootLayout'
import { tokenStore } from '@/api/client'

/** Filtros, busca, ordenação e paginação vivem na URL (sobrevivem a refresh e histórico). */
export const catalogSearch = z.object({
  q: z.string().optional().catch(undefined),
  category: z.string().optional().catch(undefined),
  network: z.enum(['Ethereum', 'Polygon', 'Solana']).optional().catch(undefined),
  minPrice: z.string().regex(/^\d+(\.\d+)?$/).optional().catch(undefined),
  maxPrice: z.string().regex(/^\d+(\.\d+)?$/).optional().catch(undefined),
  sort: z.enum(['recent', 'price-asc', 'price-desc', 'name']).catch('recent').default('recent'),
  tab: z.enum(['all', 'new', 'trending']).catch('all').default('all'),
  page: z.number().int().min(1).catch(1).default(1),
})
export type CatalogSearch = z.infer<typeof catalogSearch>

const Stub = ({ title }: { title: string }) => <h1 className="py-10 text-lg font-bold">{title}</h1>

const rootRoute = createRootRoute({
  component: RootLayout,
  notFoundComponent: () => (
    <div className="py-20 text-center">
      <h1 className="text-lg font-bold">Página não encontrada</h1>
      <p className="text-muted mt-2 text-sm">O endereço não existe ou foi movido.</p>
      <Link to="/" className="text-accent mt-6 inline-block underline">Voltar ao início</Link>
    </div>
  ),
})

/** Fluxos privados: sem token, volta ao login guardando o destino (retorno ao fluxo anterior). */
const requireAuth = ({ location }: { location: { href: string } }) => {
  if (!tokenStore.get()) throw redirect({ to: '/login', search: { redirect: location.href } })
}

const page = (title: string) => () => <Stub title={title} />
const child = <P extends string>(path: P, title: string) =>
  createRoute({ getParentRoute: () => rootRoute, path, component: page(title) })

const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: page('Início'), validateSearch: catalogSearch })
const nftRoute = child('/nft/$nftId', 'Detalhes do NFT')
const cartRoute = child('/carrinho', 'Carrinho de NFTs')
const signupRoute = child('/cadastro', 'Criar perfil de colecionador')
const loginRoute = createRoute({
  getParentRoute: () => rootRoute, path: '/login', component: page('Entrar'),
  validateSearch: z.object({ redirect: z.string().optional() }),
})
const checkoutRoute = createRoute({ getParentRoute: () => rootRoute, path: '/pagamento', component: page('Pagamento'), beforeLoad: requireAuth })
const orderRoute = createRoute({ getParentRoute: () => rootRoute, path: '/pedido/$orderId', component: page('Confirmação de pedido'), beforeLoad: requireAuth })
const profileRoute = createRoute({ getParentRoute: () => rootRoute, path: '/perfil', component: page('Perfil do colecionador'), beforeLoad: requireAuth })
const walletsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/perfil/carteiras', component: page('Carteiras'), beforeLoad: requireAuth })

const routeTree = rootRoute.addChildren([
  indexRoute, nftRoute, cartRoute, checkoutRoute, orderRoute, loginRoute, signupRoute, profileRoute, walletsRoute,
])

export const router = createRouter({ routeTree, defaultPreload: 'intent' })
declare module '@tanstack/react-router' { interface Register { router: typeof router } }
