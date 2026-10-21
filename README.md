# Kurio — Marketplace de NFTs

Desafio frontend (React + TypeScript). Estado atual: **Etapa 1 (fundação)**.

## Rodar
```bash
npm install
npm run dev            # mocks MSW ativos por padrão (VITE_ENABLE_MOCKS=false desativa)
npm run build
```

## Etapas
1. Fundação: Vite, Tailwind v4, tokens do Figma, TanStack Router (search params tipados com zod), Axios, tipos dos contratos, ETH com `decimal.js`. **(feito)**
2. MSW: handlers REST, banco em memória + persistência, cenários e reset.
3. Catálogo e detalhe, favoritos otimistas, skeletons.
4. Conta: cadastro, login, sessão, perfil, carteiras.
5. Carrinho e checkout idempotente.
6. Socket.IO via `@mswjs/socket.io-binding`.
7. Playwright (E2E + regressão visual).
8. Lighthouse e documentação final.

## Decisões
- `msw` fixado em 2.x: `@mswjs/socket.io-binding@0.2` exige peer `msw ^2.10.2`.
- Fonte JetBrains Mono self-hosted (`@fontsource-variable`), próxima à monoespaçada do layout. Confirmar a fonte original no Figma.
- Imagens dos NFTs: ainda não recebidas como arquivos (só prints). Serão substituídas por placeholders SVG até você exportar os assets; a substituição será documentada.
