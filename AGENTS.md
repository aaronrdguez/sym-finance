# SyM Finance

## Commands

```bash
npm run dev       # starts both API (Express 5, port 5000) and client (Next.js 16, port 3000)
npm run build     # turbo build (required: generates Prisma client first via dependsOn)
npm run typecheck # turbo typecheck (tsc --noEmit in each package)
npm run lint      # turbo lint
```

Run per-package commands with `turbo` or `--filter`:
```bash
turbo build --filter=@sym-finance/api
turbo dev --filter=@sym-finance/client
```

## Architecture

- **Monorepo** — npm workspaces + Turborepo 2. Packages: `apps/api`, `apps/client`, `packages/eslint-config`, `packages/typescript-config`.
- **API** (`apps/api`) — Express 5, ESM (`"type": "module"`). Entrypoint: `src/app.ts` runs via `npx tsx watch src/app.ts`.
- **Client** (`apps/client`) — Next.js 16 App Router, Tailwind CSS 4 (PostCSS `@tailwindcss/postcss`), no `tailwind.config.js` (uses CSS `@theme` directive in `globals.css`). Motion library for animations.
- **DB** — PostgreSQL, Prisma 7.8 with `@prisma/adapter-pg`. Prisma client is generated to `apps/api/src/generated/prisma/` (custom output path), imported via `../generated/prisma/client.js`.
- **Auth** — JWT in httpOnly cookie named `session`. Middleware `processToken` decodes and sets `req.userId`. Client `middleware.ts` checks cookie `keepLogin` to protect `/dashboard/*`.

## Key facts

- **Build order matters**: API must build before client (`dependsOn: ["^build"]` in turbo.json).
- **Prisma**:
  - Run `npx prisma migrate dev --name <name>` from `apps/api/` to create + apply migrations.
  - Prisma config file is `prisma.config.ts` (Prisma 7 format), schema at `prisma/schema.prisma`.
  - `currency` is free-text `String` everywhere (no enum).
  - `amount` fields use `Decimal(12,2)`, cast with `Number()` when reading.
  - Each model uses `uuid` (random, not autoincrement) as the public identifier.
- **API routes** are registered manually in `src/app.ts`. Every route uses `middleware.processToken`.
- **Client API** uses Axios instance from `app/libs/api.ts` with `baseURL: 'http://localhost:5000'` and `withCredentials: true`.
- **Styling**: Radix UI primitives, `lucide-react` icons, `clsx` + `tailwind-merge` via `cn()` utility at `app/components/ui/utils.ts`.
- **Number formatting**: All amounts use `.toLocaleString("es-AR", ...)` for AR locale formatting.
- **New page pattern**: Create `app/dashboard/<name>/page.tsx` with `"use client"`, import `Navbar`, `DashboardSidebar`, `GlassCard`, and add sidebar link in `components/DashboardSidebar.tsx`.
- **New backend resource**: Create schema model + migration, service file, routes file, register in `app.ts`.
- **Dashboard** (`app/dashboard/page.tsx`): Exchange rates are hardcoded in `CURRENCY_CONFIG` (USD, ARS, EUR, BRL, GBP, USDT).

## Integration logos

All 12 SVG logos are in `apps/client/public/logos/`:

| Service       | File              | Brand color |
|---------------|-------------------|-------------|
| DeGiro        | degiro.svg        | `#003D7A`   |
| Binance       | binance.svg       | `#F3BA2F`   |
| PayPal        | paypal.svg        | `#002991`   |
| Mercado Pago  | mercadopago.svg   | `#00BCFF`   |
| Ualá          | uala.svg          | `#6C27A5`   |
| Brubank       | brubank.svg       | `#1E88E5`   |
| Lemon Cash    | lemoncash.svg     | `#F7C948`   |
| Belo          | belo.svg          | `#003399`   |
| Fiwind        | fiwind.svg        | `#6C5CE7`   |
| Cocos Capital | cocoscapital.svg  | `#00B5BE`   |
| Bull Market   | bullmarket.svg    | `#DC2626`   |
| PPI           | ppi.svg           | `#16A34A`   |
| IOL           | iol.svg           | `#6439FF`   |

Connection `service` field values match the filenames (e.g. `lemoncash`, `cocoscapital`, `mercadopago`).

## Spanish conventions

- All UI labels are hardcoded in Spanish (Argentina).
- Days: `["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"]`.
- Frequency labels: `WEEKLY`→Semanal, `MONTHLY`→Mensual, etc.
- Category labels in installments: `technology`→Tecnología, `vehicle`→Vehículo, etc.
