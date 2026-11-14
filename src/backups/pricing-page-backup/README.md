# Pricing page backup (snapshot 2026-11-13)

Frozen copy of the /pricing page before the Nov 2026 round of client changes.
Source commit: 9dca68c (main).

Contents:
- `page.tsx` -> was `src/app/pricing/page.tsx`
- `components/*` -> was `src/components/pricing/*`
- `lib/pricing.ts` -> was `src/lib/pricing.ts` (all prices, plan data, copy)

This folder is NOT routed (it lives outside `src/app`), so it never shows on the live site.

## To restore
Copy the files back to their original locations, then change the imports back:
- `page.tsx`: `./components/PricingPlans` -> `@/components/pricing/PricingPlans`
- `components/*.tsx`: `../lib/pricing` -> `@/lib/pricing`
