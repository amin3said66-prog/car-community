# 02 — Migration Plan

## Principles

1. **Analyze before moving.** Read every file before touching it. Understand its imports and what imports it.
2. **Move, never recreate.** Use `git mv` to preserve history. Never delete-and-recreate a file unless it is being split or merged.
3. **Never break imports.** After every move, update every import across the entire codebase before running the app.
4. **App must run after every step.** Each phase ends only when `npm start` compiles clean and the browser shows no runtime errors.
5. **Report after every phase.** Append a completed phase summary to `docs/migration-report.md`.

---

## Pre-Flight Checklist

Before starting any phase, verify:

- [ ] `npm start` compiles clean with zero errors.
- [ ] Browser console shows no errors on `/`, `/cars`, `/auth/login`.
- [ ] Git working tree is clean (`git status` shows no uncommitted changes).
- [ ] A git commit exists at HEAD with message `chore: pre-migration snapshot`.

---

## Phase 0 — Add Path Aliases (No File Moves)

**Goal:** Wire up `tsconfig.json` aliases so all subsequent phases can use them immediately.

Steps:
1. Add the `paths` block to `tsconfig.json` as specified in `01-Architecture.md §Path Aliases`.
2. Add `moduleNameMapper` in any Jest/Karma config that exists so tests resolve the aliases.
3. Run `npm start` — confirm clean compile.
4. Commit: `chore(tsconfig): add path aliases`.

**Files touched:** `tsconfig.json` only.

---

## Phase 1 — Scaffold Target Skeleton (Empty Folders + index.ts Stubs)

**Goal:** Create the full target folder tree with empty `index.ts` files. Zero file moves in this phase.

Steps:
1. Create every folder listed in `01-Architecture.md` that does not yet exist.
2. Add an empty `index.ts` (single line: `// public API`) to every feature root and to `core/`, `shared/`, `layouts/`.
3. Run `npm start` — confirm clean compile (nothing has changed, only empty files added).
4. Commit: `chore: scaffold feature-based folder skeleton`.

**Files touched:** New empty files only. Nothing moved or deleted.

---

## Phase 2 — Migrate `core/`

**Goal:** Confirm `core/interceptors/` is already correct; add `core/index.ts`.

Steps:
1. Verify `src/app/core/interceptors/error.interceptor.ts` and `token.interceptor.ts` exist and are registered in `app.config.ts`.
2. Add `core/index.ts` that re-exports both interceptors.
3. Update `app.config.ts` to import interceptors via `@core/interceptors/...`.
4. Run `npm start` — confirm clean compile.
5. Commit: `feat(core): wire core barrel and path aliases`.

---

## Phase 3 — Migrate `shared/`

**Goal:** Move `src/app/shared/` contents into the new `shared/` layout; delete `shared-module.ts`.

Steps:
1. `git mv src/app/shared/img-fallback.directive.ts src/app/shared/directives/img-fallback.directive.ts`
2. Delete `src/app/shared/shared-module.ts`.
3. Update every component that imported `SharedModule` to instead import `ImgFallbackDirective` directly (standalone import).
4. Export `ImgFallbackDirective` from `shared/index.ts`.
5. Update all imports to use `@shared/directives/img-fallback.directive`.
6. Run `npm start` — confirm clean compile and no console errors on car listing page (uses `imgFallback`).
7. Commit: `feat(shared): migrate shared directive, remove NgModule`.

---

## Phase 4 — Migrate Global Models

**Goal:** Distribute `src/app/models/` into feature model folders. Delete the now-empty global models folder.

Move each file with `git mv`, update all imports:

| From | To |
|---|---|
| `src/app/models/car.model.ts` | `src/app/features/vehicles/models/vehicle.model.ts` |
| `src/app/models/event.model.ts` | `src/app/features/communities/models/event.model.ts` |
| `src/app/models/post.model.ts` | `src/app/features/posts/models/post.model.ts` |
| `src/app/models/comment.model.ts` | `src/app/features/posts/models/comment.model.ts` |
| `src/app/models/user.model.ts` | `src/app/features/users/models/user.model.ts` |

Additionally:
- Merge `src/app/cars/car.ts` into `features/vehicles/models/vehicle.model.ts`. Remove duplicates. Delete `src/app/cars/car.ts`.
- Move `src/app/auth/models/auth.models.ts` → `src/app/features/auth/models/auth.model.ts`.

After all moves:
- Update every import in every service and component that referenced these files.
- Delete `src/app/models/` directory.
- Run `npm start` — confirm clean compile.
- Commit: `feat(models): distribute global models into feature folders`.

---

## Phase 5 — Migrate Mock Data

**Goal:** Move `src/app/data/` mock files into the `repository/` folder of their owning feature.

| From | To |
|---|---|
| `src/app/data/mock-cars.ts` | `src/app/features/vehicles/repository/mock-vehicles.ts` |
| `src/app/data/mock-events.ts` | `src/app/features/communities/repository/mock-events.ts` |
| `src/app/data/mock-posts.ts` | `src/app/features/posts/repository/mock-posts.ts` |
| `src/app/data/mock-users.ts` | `src/app/features/users/repository/mock-users.ts` |

After all moves:
- Update all service imports.
- Delete `src/app/data/` directory.
- Run `npm start`.
- Commit: `feat(data): move mock data into feature repositories`.

---

## Phase 6 — Migrate Feature by Feature

Migrate one feature at a time in this order. Complete all steps for a feature before moving to the next. **The app must run after each feature.**

### Order
1. `auth` (least dependencies)
2. `users` (formerly `customers/`)
3. `vehicles` (formerly `cars/`)
4. `posts`
5. `communities` (formerly `events/`)
6. `dashboard`

### Per-Feature Steps

For each feature `<name>`:

1. **Analyze imports.** Run: `grep -r "from.*<old-path>" src/ --include="*.ts" -l` to find every file that imports from the old folder.
2. **Move pages.** `git mv src/app/<old>/<page>/ src/app/features/<name>/pages/<page>/`
3. **Move service.** `git mv src/app/<old>/<name>.service.ts src/app/features/<name>/services/<name>.service.ts`
4. **Move routing module** → `src/app/features/<name>/routes/<name>.routes.ts`. Convert from `RouterModule` to a plain `Routes` const array if it is still NgModule-based.
5. **Move guards/resolvers** (if any) into `features/<name>/guards/` or `features/<name>/resolvers/`.
6. **Update all imports** in the moved files and in every file that imported them.
7. **Update `app.routes.ts`** to point to the new routes file.
8. **Export public API** from `features/<name>/index.ts`.
9. **Run `npm start`** — confirm zero errors.
10. **Smoke-test in browser**: navigate to the feature's main list page and detail page.
11. **Commit:** `feat(<name>): migrate to features/<name>`.
12. **Append to `docs/migration-report.md`**: phase summary (see §Report Format below).

---

## Phase 7 — Migrate Layouts

**Goal:** Extract the nav/shell into `layouts/`.

1. Identify which component renders the top nav bar (likely `app.component.ts` or a nav component inside auth).
2. Create `src/app/layouts/main-layout/main-layout.component.ts` — nav + `<router-outlet>`.
3. Create `src/app/layouts/auth-layout/auth-layout.component.ts` — centered card + `<router-outlet>`.
4. Update `app.routes.ts` to use layout wrappers:
   ```typescript
   { path: '', component: MainLayoutComponent, children: [ /* authenticated routes */ ] },
   { path: 'auth', component: AuthLayoutComponent, children: [ /* auth routes */ ] },
   ```
5. Strip nav rendering from `app.component.ts` — it becomes `<router-outlet>` only.
6. Run `npm start`.
7. Commit: `feat(layouts): extract shell layouts`.

---

## Phase 8 — Signals Migration

**Goal:** Replace `BehaviorSubject`-based state in services with Angular Signals.

Affected files (current state — verify before migrating):
- `src/app/features/auth/services/auth.service.ts` (currentUser BehaviorSubject)
- `src/app/features/vehicles/services/vehicle.service.ts`
- `src/app/features/posts/services/post.service.ts`
- `src/app/features/communities/services/community.service.ts` (formerly event.service)
- `src/app/features/users/services/user.service.ts`

Per-service steps:
1. Replace `BehaviorSubject<T>` with `signal<T>(initialValue)`.
2. Replace `.asObservable()` with the signal reference directly.
3. Replace `.next(value)` with `set(value)` or `update(fn)`.
4. Update components that subscribed via `async` pipe → use `{{ mySignal() }}` instead.
5. Move state class or functions into `features/<name>/state/<name>.state.ts`.
6. Run `npm start` after each service migration.
7. Commit per service: `feat(<name>/state): migrate to Angular Signals`.

---

## Phase 9 — Final Cleanup

1. Delete all old top-level feature folders that have been fully migrated (`src/app/auth/`, `src/app/cars/`, etc.).
2. Delete `src/app/models/` if not already deleted.
3. Delete `src/app/data/` if not already deleted.
4. Run `grep -r "from.*\.\./\.\./\.\." src/ --include="*.ts"` — fix any remaining `../../..` imports by replacing with aliases.
5. Run `npm start` — must be clean.
6. Run `npm run lint` — fix all lint errors.
7. Run `npm run build` (production) — must succeed with zero errors.
8. Commit: `chore: final cleanup post-migration`.

---

## Report Format

Append one section per completed phase to `docs/migration-report.md`:

```markdown
## Phase N — <Phase Name> — Completed <ISO date>

### Files moved
- `old/path/file.ts` → `new/path/file.ts`

### Files deleted
- `src/app/old-folder/old-file.ts`

### Imports updated
- N files had their imports updated

### Verification
- `npm start`: ✅ clean compile
- Browser smoke-test: ✅ <routes tested>

### Notes
Any surprises, deferred items, or decisions made.
```
