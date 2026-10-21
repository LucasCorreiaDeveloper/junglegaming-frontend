import { Link } from '@tanstack/react-router'
import { Search, ShoppingBag, LogIn } from 'lucide-react'

const nav = ['Início', 'Mercado', 'Criadores', 'Aprenda'] as const

export function Header() {
  return (
    <header className="border-line border-b">
      <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-4 md:px-6">
        <Link to="/" className="text-sm font-bold tracking-[0.3em]">KURIO</Link>
        <nav aria-label="Principal" className="hidden gap-8 text-[11px] md:flex">
          {nav.map((label) => (
            <Link key={label} to="/" className="hover:text-accent py-4">{label}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <button type="button" aria-label="Buscar" className="hover:text-accent"><Search size={16} aria-hidden /></button>
          <Link to="/carrinho" aria-label="Carrinho de NFTs" className="hover:text-accent"><ShoppingBag size={16} aria-hidden /></Link>
          <Link to="/login" className="bg-accent text-bg inline-flex items-center gap-1 rounded px-3 py-1 text-[11px] font-semibold">
            <LogIn size={12} aria-hidden /> Entrar
          </Link>
        </div>
      </div>
    </header>
  )
}
