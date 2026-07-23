---
name: creamy-heaven-admin-panel
description: >
  Build and extend the Creamy Heaven admin panel with Next.js App Router as a server-first
  (RSC + Server Actions) application, Firebase Auth (session cookies) + Firestore, RBAC
  permissions, CSS-only motion, and full CRUD via Server Actions. Covers: dashboard,
  product/category/inventory/order/customer/user/role/message/marketing/settings management.
  Triggers on any request to build, fix, or extend an admin panel page, module, action, or
  data layer for the Creamy Heaven project.
---

# Creamy Heaven — Admin Panel Skill

You are extending the **Creamy Heaven admin panel** — the internal back-office for managing
products, orders, customers, inventory, categories, roles, users, messages, marketing content,
and site settings.

> **Read `references/architecture.md` and `references/templates.md` before writing any code.**
> They contain the full type system, Server Action patterns, component anatomy, and file-by-file
> implementation guide.

The admin panel is **already built and running**. This skill's purpose is to guide any future
modifications, new modules, or bug fixes to stay architecturally consistent.

## Quick Reference

- **Rendering**: Server-first. No `'use client'` unless it's on the allow-list (login page,
  notification bell, or mobile sidebar JS-dependent animation).
- **Data fetching**: Directly in Server Components via Firestore Admin SDK helpers in
  `src/lib/data/*.ts`.
- **Mutations**: Server Actions (`'use server'`) in colocated `actions.ts` files, bound to
  plain `<form action={...}>` elements.
- **Auth**: Firebase session cookie verified server-side via `getSession()`. Permission check
  via `requirePermission('module:action')` at the top of every gated page and action.
- **Filtering**: All via `searchParams` (URL query params). No client-side `useState` for
  filter/search/pagination state.
- **Animations**: CSS-only `@keyframes` + `transform` transitions. No JS animation library.
- **Design tokens**: `brand-white`, `brand-cream`, `brand-black`, `brand-border`, `brand-muted`
  + functional colors. Cormorant Garamond (headings) + Manrope (body).
- **Toasts**: Flash messages via redirect `?flash=success:...` + CSS auto-dismiss animation.

## Adding a New Module Checklist

1. Types → `src/types/index.ts`
2. Validation → `src/lib/validations.ts`
3. Permissions → `src/lib/permissions.ts`
4. Data layer → `src/lib/data/{module}.ts`
5. Server Actions → `src/app/admin/{module}/actions.ts`
6. List page → `src/app/admin/{module}/page.tsx` (Server Component, searchParams filtering)
7. Detail page → `src/app/admin/{module}/[id]/page.tsx`
8. Create/Edit pages → plain `<form action={...}>` pages
9. Delete confirm → `src/app/admin/{module}/[id]/delete/page.tsx`
10. Sidebar → add to `SIDEBAR_ITEMS`, filtered server-side by permission
11. Roles → update `BUILT_IN_ROLE_PERMISSIONS`

## Critical Rules

See the full 17-rule list in `references/architecture.md`. The top 5:
1. **NEVER** add `'use client'` by default — justify against the allow-list first
2. **ALWAYS** fetch data directly in Server Components via Firestore Admin SDK
3. **ALWAYS** use Server Actions for mutations, bound to `<form action={...}>`
4. **ALWAYS** call `requirePermission()` at the top of every gated page/action
5. **ALWAYS** drive filtering/search/pagination through `searchParams`
