# 01 — Target Architecture

## Overview

This document describes the target folder structure for the Car Community Angular application after the feature-based migration. Every decision here is binding. No agent may deviate from this layout without a documented reason in `02-Migration-Plan.md`.

---

## Top-Level Source Tree

```
src/
└── app/
    ├── core/               # Singleton services, interceptors, guards that belong to the whole app
    ├── shared/             # Reusable components, directives, pipes used by 2+ features
    ├── layouts/            # Shell components (nav, sidebar, footer wrappers)
    ├── features/           # Every product domain lives here — one subfolder per feature
    │   ├── auth/
    │   ├── dashboard/
    │   ├── users/
    │   ├── profile/
    │   ├── posts/
    │   ├── communities/
    │   ├── chats/
    │   ├── notifications/
    │   ├── vehicles/
    │   ├── marketplace/
    │   ├── settings/
    │   └── admin/
    ├── app.routes.ts       # Root lazy-load route definitions only
    ├── app.config.ts       # provideRouter, provideHttpClient, interceptors, etc.
    └── app.component.ts    # Root shell — router-outlet only
```

---

## Feature Folder Contract

Every feature under `features/<name>/` **must** follow this internal layout exactly. Subfolders that are not yet needed may be omitted, but must never be placed elsewhere when they are needed.

```
features/<name>/
├── pages/          # Routable page components (one component = one route)
├── components/     # Presentational components used only inside this feature
├── services/       # Business-logic services for this feature
├── repository/     # All HttpClient calls — services never call HttpClient directly
├── state/          # Signals or lightweight reactive state (BehaviorSubject wrappers)
├── models/         # Interfaces and types owned by this feature
├── dto/            # Raw API response shapes — never used directly in components
├── mappers/        # Functions that convert DTO → model and model → DTO
├── guards/         # Route guards scoped to this feature
├── resolvers/      # Route resolvers scoped to this feature
├── routes/         # Feature route definitions, exported as a const array
├── utils/          # Pure helper functions with no Angular dependencies
├── constants/      # Feature-scoped enums and constant objects
└── index.ts        # Single public API — the only file other code may import from
```

### Current-to-Target Feature Mapping

| Current folder | Target feature | Notes |
|---|---|---|
| `src/app/auth/` (login, register, forgot-password, reset-password) | `features/auth/` | Guards and auth models move in |
| `src/app/auth/profile/` | `features/profile/` | Separate feature — user owns their profile |
| `src/app/cars/` | `features/vehicles/` | Rename aligns with broader domain name |
| `src/app/customers/` | `features/users/` | Member directory |
| `src/app/posts/` | `features/posts/` | No rename needed |
| `src/app/events/` | `features/communities/` | Events are a communities sub-domain |
| `src/app/dashboard/` | `features/dashboard/` | No rename needed |
| `src/app/home/` | `features/dashboard/pages/home/` | Merge into dashboard feature |
| `src/app/models/` | Distribute into owning features | See §Models below |
| `src/app/data/` | Distribute into owning features `repository/` | Mock data lives next to the repository it serves |
| `src/app/shared/` | `shared/` | Flatten — `shared-module.ts` → standalone exports |
| `src/app/core/interceptors/` | `core/interceptors/` | No structural change needed |

---

## `core/` Contract

`core/` contains exactly:

```
core/
├── interceptors/
│   ├── error.interceptor.ts        # already exists
│   └── token.interceptor.ts        # already exists
├── services/                       # App-wide singletons (e.g. ToastService, ThemeService)
└── index.ts
```

**Rules:**
- Services here are `providedIn: 'root'` and shared across all features.
- No component lives here.
- No feature-specific logic lives here.

---

## `shared/` Contract

```
shared/
├── components/     # Reusable UI components (e.g. AvatarComponent, SpinnerComponent)
├── directives/     # e.g. ImgFallbackDirective (already exists)
├── pipes/
├── utils/          # Pure functions used across 2+ features
└── index.ts
```

**Rules:**
- `shared/` has no knowledge of any feature.
- `shared-module.ts` is replaced by individual standalone exports; the module file is deleted.

---

## `layouts/` Contract

```
layouts/
├── main-layout/    # Authenticated shell: nav + router-outlet
├── auth-layout/    # Unauthenticated shell: centered card layout
└── index.ts
```

---

## Models

| Current file | Moves to |
|---|---|
| `src/app/models/car.model.ts` | `features/vehicles/models/vehicle.model.ts` |
| `src/app/models/event.model.ts` | `features/communities/models/event.model.ts` |
| `src/app/models/post.model.ts` | `features/posts/models/post.model.ts` |
| `src/app/models/comment.model.ts` | `features/posts/models/comment.model.ts` |
| `src/app/models/user.model.ts` | `features/users/models/user.model.ts` (re-exported from `features/profile/`) |
| `src/app/auth/models/auth.models.ts` | `features/auth/models/auth.model.ts` |
| `src/app/cars/car.ts` | Merge into `features/vehicles/models/vehicle.model.ts` — deduplicate |

---

## Path Aliases

After migration, `tsconfig.json` **must** declare these aliases:

```json
{
  "compilerOptions": {
    "paths": {
      "@core/*":    ["src/app/core/*"],
      "@shared/*":  ["src/app/shared/*"],
      "@layouts/*": ["src/app/layouts/*"],
      "@features/*":["src/app/features/*"],
      "@env/*":     ["src/environments/*"]
    }
  }
}
```

All internal imports must use these aliases — no `../../..` traversals crossing feature boundaries.

---

## State Management

- Use Angular **Signals** for all new state.
- Existing `BehaviorSubject`-based state in services is migrated to Signals during the feature migration step, not before.
- No NgRx is introduced unless the user explicitly requests it.
- Each feature's `state/` folder exports a single signal-based store class or functional store.

---

## Routing

- `app.routes.ts` contains **only** lazy-loaded feature routes.
- Each feature owns its route definitions in `features/<name>/routes/<name>.routes.ts`.
- Every feature is lazy-loaded via `loadChildren` pointing to its routes file.
- All page components are standalone and declared nowhere.

```typescript
// app.routes.ts shape
export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./features/dashboard/routes/dashboard.routes').then(m => m.DASHBOARD_ROUTES)
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/routes/auth.routes').then(m => m.AUTH_ROUTES)
  },
  // … one entry per feature
];
```
