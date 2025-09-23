# The Fix - Next.js App

Marketing and light commerce site for The Fix device repair shops. Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, and shadcn/ui components. Includes a hero carousel, reviews marquee, services catalog, locations search with Mapbox (or Google) geocoding, and a support center with AI-assisted chat plus ticket intake.

## Quick start

```bash
pnpm install
pnpm dev
```

Visit http://localhost:3000 and explore the Home, Services, Locations, About, and Support pages. Run `pnpm lint` before committing and `pnpm build` to validate production output.

## Environment configuration

Create `.env.local` (already scaffolded) and populate as needed:

```
OPENAI_API_KEY=
MAPBOX_TOKEN=
NEXT_PUBLIC_MAPBOX_TOKEN=
GOOGLE_MAPS_API_KEY=
```

- `OPENAI_API_KEY` enables real responses for the AI concierge and ticket summariser. Without it, deterministic mock replies are returned so the UI still works offline.
- `MAPBOX_TOKEN` (server-side) powers the `/api/geocode` proxy. `NEXT_PUBLIC_MAPBOX_TOKEN` exposes a restricted token for the interactive Mapbox GL map. If you prefer Google Maps geocoding, leave the Mapbox values empty and set `GOOGLE_MAPS_API_KEY` instead.

Restart the dev server after changing environment variables.

## Data & extensibility

Local JSON under `data/` seeds repairs, accessories, locations, and reviews. Swap to a real backend by replacing those imports with fetchers (or hooking the files into a CMS) and reusing the existing TypeScript types.

- `data/services.json` – canonical repair & service catalog powering the Services page (generated via `scripts/import-services.mjs`).
- `data/repairs.json` – legacy issue list leveraged by the support intake forms.
- `data/accessories.json` – featured retail catalog.
- `data/locations.json` – store metadata + image paths.
- `data/reviews.json` – testimonial snippets for the marquee.

Images live in `public/promos/` and `public/locations/`. Replace the SVG placeholders with photography or marketing assets when ready.

## Update services and prices

1. Drop the latest CSV or JSON price list into the project (any location). Columns should include the service slug, category, description, duration, warranty, and either `option`/`price` rows or `model`/`price` rows.
2. Run `node scripts/import-services.mjs path/to/source.csv` (use a JSON file instead of CSV if preferred). The script normalises values, validates them with Zod, sorts services, and writes `data/services.json`.
3. Commit the regenerated `data/services.json`. The Next.js build runs the same schema validation and will fail fast on bad data.

### Quick manual edit

To tweak a single service without regenerating everything, edit the matching object inside `data/services.json` and keep the slug unchanged. Example – bump the OEM price by $10:

```json
{
  "category": "Screens",
  "name": "iPhone 14 Screen Replacement",
  "variants": [
    { "option": "OEM", "price": 259 },
    { "option": "Aftermarket", "price": 179 }
  ],
  "duration_min": 90,
  "warranty_days": 180,
  "description": "Genuine OLED replacement, recalibrated and sealed same-day.",
  "featured": true,
  "slug": "iphone-14-screen-replacement"
}
```

After any change run `pnpm test` (unit + snapshot coverage) and `pnpm build` to confirm the catalog still compiles.

## shadcn/ui components

The project is initialised with the shadcn registry and includes Button, Card, Tabs, Input, Textarea, Badge, Sheet, Dialog, Select, and Checkbox primitives. Add more via:

```bash
pnpm dlx shadcn@latest add [component]
```

Custom UI building blocks (hero carousel, reviews marquee, locations explorer, etc.) live under `components/`.

## Maps & geocoding abstraction

`lib/geocode.ts` checks Mapbox first, then Google Maps if a token is available. The `/api/geocode` route adds a lightweight per-IP rate limit and falls back to known store coordinates when no provider credentials exist.

`components/Map.tsx` expects `NEXT_PUBLIC_MAPBOX_TOKEN` for the interactive experience. Without it, a friendly placeholder renders so pages still pass QA. Swap to another mapping library by editing this component only.

## AI integration

`lib/ai.ts` wraps the OpenAI client. The `/api/support` route supports two modes:

- `mode: "chat"` for FixBot conversations.
- `mode: "ticket"` (default) for ticket submissions from the support form.

Responses include a `ticketId`, `summary`, and `nextSteps`, and all payloads are logged server-side for easy CRM wiring.

## Deployment notes

- Update `metadataBase` in `app/layout.tsx` before production deploys.
- Configure Mapbox/Google environment variables in your hosting provider (e.g., Vercel project settings).
- `public/og-default.png` powers social sharing cards; replace it with on-brand artwork when available.

Happy fixing!
