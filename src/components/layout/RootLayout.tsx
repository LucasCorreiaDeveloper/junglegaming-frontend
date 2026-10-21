import { Outlet } from '@tanstack/react-router'
import { Header } from './Header'
import { Footer } from './Footer'

export function RootLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <a href="#conteudo" className="sr-only-focusable bg-accent text-bg left-2 top-2 z-50 rounded px-3 py-2">Ir para o conteúdo</a>
      <Header />
      <main id="conteudo" className="mx-auto w-full max-w-[1200px] flex-1 px-4 md:px-6" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
