# 04 — Agent Rules

These rules are non-negotiable. Every agent working on this codebase must read this file before making any change. Rules are ordered by severity. Rules marked 🔴 are blockers — violating them requires an immediate rollback.

---

## 🔴 Rule 1 — Analyze Before You Move

Before moving any file, you must:

1. Read the file completely.
2. Run `grep -r "from.*<filename-without-extension>" src/ --include="*.ts"` and collect every file that imports it.
3. Confirm your understanding of what the file exports and what depends on it.
4. Plan every import update that the move will require.
5. Only then perform the move and the import updates atomically in the same commit.

**Never move a file and leave broken imports — even temporarily.**

---

## 🔴 Rule 2 — Preserve Git History

- Use `git mv <old> <new>` for every file relocation. Never delete-and-recreate.
- When merging two files (e.g. `car.model.ts` + `car.ts` → `vehicle.model.ts`):
  1. Copy the content of the smaller file into the larger one.
  2. `git mv` the larger file to the new path.
  3. Delete the smaller file with `git rm`.
  4. This preserves the history of the primary file.
- Never use `cp` then `rm` as a substitute for `git mv`.

---

## 🔴 Rule 3 — App Must Run After Every Commit

- After every commit, run `npm start` and wait for `Application bundle generation complete` in the logs.
- If the build fails, **do not commit more changes on top**. Roll back to the last clean commit, identify the problem, and fix it before continuing.
- A failing build is never acceptable as an intermediate state. There are no "I'll fix it in the next step" exceptions.

---

## 🔴 Rule 4 — No Cross-Feature Deep Imports

Cross-feature imports are only allowed through a feature's `index.ts` public API.

```typescript
// ✅ Allowed
import { AuthService } from '@features/auth';

// ❌ Forbidden — bypasses public API
import { AuthService } from '@features/auth/services/auth.service';
```

Before finishing any phase, run:
```bash
grep -r "from '@features/[^']*\/[^']*\/[^']*'" src/ --include="*.ts"
```
Any result with more than two path segments after `@features/` is a violation (the third segment means it is going past the feature's `index.ts`).

---

## 🔴 Rule 5 — No HttpClient Outside Repositories

No service, component, guard, resolver, or interceptor (except interceptors themselves) may inject `HttpClient`.

Verify before each commit:
```bash
grep -r "inject(HttpClient)\|private http: HttpClient" src/app/features --include="*.ts"
```
Any result outside a `*.repository.ts` file is a violation.

---

## 🟡 Rule 6 — No DTOs in Components or Templates

DTOs are raw API response shapes. They must never reach a component's `@Input`, a template binding, or a signal value. The mapper layer exists to prevent this.

Data flow:
```
Repository (returns DTO)
  → Service (calls mapper, exposes Model)
    → State (holds Model)
      → Component (receives Model)
        → Template (renders Model properties)
```

---

## 🟡 Rule 7 — Standalone Components Only

Every new component is standalone. No new `NgModule` declarations. When migrating an existing non-standalone component:
1. Add `standalone: true` to the decorator.
2. Move all `declarations` imports into the component's `imports` array.
3. Remove the component from any `NgModule.declarations`.
4. Delete the module if it is now empty.

---

## 🟡 Rule 8 — Lazy-Load Every Feature

Every feature is loaded via `loadChildren` (for route groups) or `loadComponent` (for individual pages). No feature component is eagerly imported in `app.routes.ts` or `app.config.ts`.

Verify:
```bash
grep -r "import.*Component\|import.*Routes" src/app/app.routes.ts
```
Any static (non-dynamic) import of a feature component or routes array is a violation.

---

## 🟡 Rule 9 — No Signals in Templates Without `()`

Signals are functions. Always call them in templates:

```html
<!-- ✅ -->
<p>{{ vehicle().make }}</p>
@if (loading()) { <app-spinner /> }

<!-- ❌ -->
<p>{{ vehicle.make }}</p>
@if (loading) { <app-spinner /> }
```

---

## 🟡 Rule 10 — Update the Public API After Every Move

After moving any file into a feature folder, verify that the feature's `index.ts` exports it (if it should be public) or intentionally omits it (if it is internal). Do not leave `index.ts` stale.

---

## 🟢 Rule 11 — One Feature Per Commit

Each phase-6 feature migration is exactly one commit. Do not bundle two features in one commit. This makes rollback clean.

Commit message format:
```
feat(<feature-name>): migrate to features/<feature-name>
```

---

## 🟢 Rule 12 — Report After Every Phase

After completing a phase, append the phase summary to `docs/migration-report.md` using the format defined in `02-Migration-Plan.md §Report Format`. This is how future agents know what has already been done.

---

## 🟢 Rule 13 — Path Aliases, Not Relative Traversals

Any import that crosses a folder boundary uses path aliases:

```typescript
// ✅
import { Vehicle } from '@features/vehicles';
import { ImgFallbackDirective } from '@shared/directives/img-fallback.directive';
import { TokenInterceptor } from '@core/interceptors/token.interceptor';

// ❌ (crosses feature boundary)
import { Vehicle } from '../../../features/vehicles/models/vehicle.model';
```

Intra-feature relative imports (within the same feature folder) are allowed and preferred for internal references:
```typescript
// ✅ inside features/vehicles/services/
import { VehicleState } from '../state/vehicle.state';
```

---

## 🟢 Rule 14 — `ChangeDetectionStrategy.OnPush` on Every Component

No component may use the default change detection strategy. Apply `OnPush` to every component — new and migrated. This is not optional.

---

## 🟢 Rule 15 — File Size Limits Are Hard Limits

See `03-Folder-Standards.md §File Size Limits`. When a file would exceed its limit:
1. Stop.
2. Identify the correct split (extract a child component, split a service, extract a utility function).
3. Apply the split before adding more code.

---

## Pre-Commit Checklist

Before every commit, verify all of the following:

```bash
# 1. Build is clean
npm start   # wait for "Application bundle generation complete"

# 2. No deep cross-feature imports
grep -r "from '@features/[^']*\/[^']*\/[^']*'" src/ --include="*.ts"
# → must return nothing

# 3. No HttpClient outside repositories
grep -r "inject(HttpClient)\|private http: HttpClient" src/app/features --include="*.ts"
# → must return only *.repository.ts matches

# 4. No remaining broken imports
npx tsc --noEmit
# → must return nothing

# 5. migration-report.md has been updated if a phase was completed
```

---

## Escalation: When to Stop and Ask

Stop immediately and ask the user before proceeding if:

- A file has more than **5 other files** importing from it and the refactor would change its public interface.
- A move would require changing code in more than **10 files** simultaneously.
- An existing pattern contradicts these rules and changing it would affect the running app's behavior (not just structure).
- The `npm start` build does not recover after **2 attempts** at a fix.

Do not make guesses in these situations. The cost of a wrong guess here is higher than the cost of asking.
