# 03 — Folder & File Standards

## Naming Conventions

| Type | Convention | Example |
|---|---|---|
| Folder | `kebab-case` | `vehicle-details/` |
| Component file | `<name>.component.ts` | `vehicle-list.component.ts` |
| Component template | `<name>.component.html` | `vehicle-list.component.html` |
| Component styles | `<name>.component.scss` | `vehicle-list.component.scss` |
| Service | `<name>.service.ts` | `vehicle.service.ts` |
| Repository | `<name>.repository.ts` | `vehicle.repository.ts` |
| Model | `<name>.model.ts` | `vehicle.model.ts` |
| DTO | `<name>.dto.ts` | `vehicle.dto.ts` |
| Mapper | `<name>.mapper.ts` | `vehicle.mapper.ts` |
| Guard | `<name>.guard.ts` | `auth.guard.ts` |
| Resolver | `<name>.resolver.ts` | `vehicle.resolver.ts` |
| Routes file | `<name>.routes.ts` | `vehicles.routes.ts` |
| State file | `<name>.state.ts` | `vehicle.state.ts` |
| Constants file | `<name>.constants.ts` | `vehicle.constants.ts` |
| Utility file | `<name>.utils.ts` | `price.utils.ts` |
| Public API barrel | `index.ts` | `index.ts` |
| Mock data file | `mock-<name>.ts` | `mock-vehicles.ts` |

---

## Component Standards

### Every component must be standalone

```typescript
@Component({
  selector: 'app-vehicle-list',
  standalone: true,        // required
  imports: [CommonModule, RouterLink, /* … */],
  templateUrl: './vehicle-list.component.html',
  styleUrl: './vehicle-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush, // required
})
export class VehicleListComponent { }
```

- `NgModule` declarations are forbidden. Delete any `*-module.ts` files.
- `ChangeDetectionStrategy.OnPush` is required on every component.
- Templates go in separate `.html` files — no inline templates.
- Styles go in separate `.scss` files — no inline styles.

---

## Service Standards

### Provided in root by default

```typescript
@Injectable({ providedIn: 'root' })
export class VehicleService { }
```

- Services never call `HttpClient` directly. That responsibility belongs to the repository.
- Services contain business logic, transformation, and state coordination.
- Feature services stay inside their feature folder.
- App-wide singleton services live in `core/services/`.

---

## Repository Standards

Repositories are the **only** layer that calls `HttpClient`.

```typescript
@Injectable({ providedIn: 'root' })
export class VehicleRepository {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/vehicles';

  getAll(): Observable<VehicleDto[]> {
    return this.http.get<VehicleDto[]>(this.baseUrl);
  }

  getById(id: string): Observable<VehicleDto> {
    return this.http.get<VehicleDto>(`${this.baseUrl}/${id}`);
  }

  create(dto: CreateVehicleDto): Observable<VehicleDto> {
    return this.http.post<VehicleDto>(this.baseUrl, dto);
  }

  update(id: string, dto: Partial<VehicleDto>): Observable<VehicleDto> {
    return this.http.patch<VehicleDto>(`${this.baseUrl}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
```

During the mock-data phase, repositories return `of(MOCK_DATA)` instead of HTTP calls. The interface is identical; only the data source changes.

---

## DTO Standards

DTOs represent raw API shapes. They are **never** used in components or templates.

```typescript
// features/vehicles/dto/vehicle.dto.ts
export interface VehicleDto {
  id: string;
  make: string;
  model: string;
  year: number;
  price_usd: number;       // snake_case mirrors API
  fuel_type: string;
  owner_id: string;
}
```

- DTOs use the API's casing (often `snake_case`).
- Components always receive model objects, never DTOs.

---

## Mapper Standards

Mappers are pure functions — no dependencies injected.

```typescript
// features/vehicles/mappers/vehicle.mapper.ts
import { VehicleDto } from '../dto/vehicle.dto';
import { Vehicle }    from '../models/vehicle.model';

export function toVehicle(dto: VehicleDto): Vehicle {
  return {
    id:       dto.id,
    make:     dto.make,
    model:    dto.model,
    year:     dto.year,
    price:    dto.price_usd,
    fuelType: dto.fuel_type as FuelType,
    ownerId:  dto.owner_id,
  };
}

export function toVehicleDto(model: Partial<Vehicle>): Partial<VehicleDto> {
  return {
    make:      model.make,
    model:     model.model,
    year:      model.year,
    price_usd: model.price,
    fuel_type: model.fuelType,
  };
}
```

---

## State Standards

Use Angular Signals. No `BehaviorSubject` in new code.

```typescript
// features/vehicles/state/vehicle.state.ts
import { Injectable, signal, computed } from '@angular/core';
import { Vehicle } from '../models/vehicle.model';

@Injectable({ providedIn: 'root' })
export class VehicleState {
  private readonly _vehicles = signal<Vehicle[]>([]);
  private readonly _loading  = signal(false);
  private readonly _error    = signal<string | null>(null);

  readonly vehicles = this._vehicles.asReadonly();
  readonly loading  = this._loading.asReadonly();
  readonly error    = this._error.asReadonly();
  readonly count    = computed(() => this._vehicles().length);

  setVehicles(vehicles: Vehicle[]): void { this._vehicles.set(vehicles); }
  setLoading(v: boolean): void           { this._loading.set(v); }
  setError(msg: string | null): void     { this._error.set(msg); }
}
```

Components inject `VehicleState` directly and read signals in templates with `{{ state.vehicles() }}`.

---

## Routes Standards

Feature routes are exported as a plain const — no `RouterModule`.

```typescript
// features/vehicles/routes/vehicles.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from '@features/auth';

export const VEHICLES_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('../pages/vehicle-list/vehicle-list.component')
            .then(m => m.VehicleListComponent),
      },
      {
        path: 'new',
        loadComponent: () =>
          import('../pages/vehicle-form/vehicle-form.component')
            .then(m => m.VehicleFormComponent),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('../pages/vehicle-details/vehicle-details.component')
            .then(m => m.VehicleDetailsComponent),
      },
    ],
  },
];
```

- Every page component is lazy-loaded via `loadComponent`.
- Guards are applied at the routes level, not inside components.

---

## Public API (index.ts) Standards

Each feature exports exactly one `index.ts`. External code imports **only** from this file.

```typescript
// features/vehicles/index.ts
export { VehicleListComponent }   from './pages/vehicle-list/vehicle-list.component';
export { VehicleDetailsComponent } from './pages/vehicle-details/vehicle-details.component';
export { VehicleService }         from './services/vehicle.service';
export { VehicleState }           from './state/vehicle.state';
export { VEHICLES_ROUTES }        from './routes/vehicles.routes';
export type { Vehicle }           from './models/vehicle.model';
// Do NOT export: repositories, DTOs, mappers, internal components
```

What **must not** be exported from `index.ts`:
- Repository classes (internal implementation detail)
- DTO interfaces
- Mapper functions
- Page components are exported only if another feature needs to navigate to them programmatically (rare)

---

## Import Rules

### Allowed cross-boundary imports

| From | May import from |
|---|---|
| Any feature | `@core/*`, `@shared/*`, `@layouts/*`, `@env/*` |
| Any feature | Other features **only** via their `index.ts` public API |
| `shared/` | `@core/*` only |
| `core/` | Nothing from `shared/` or `features/` |
| `layouts/` | `@core/*`, `@shared/*` |

### Forbidden

- Cross-feature deep imports: `import { X } from '@features/auth/services/auth.service'` ❌
- Direct model imports from another feature bypassing index: `import { User } from '@features/users/models/user.model'` ❌ — use `import { User } from '@features/users'` ✅
- Any `../../../../` import that crosses a feature boundary ❌
- Importing `HttpClient` inside a service or component ❌ — use a repository

---

## File Size Limits

| File type | Max lines |
|---|---|
| Component `.ts` | 150 |
| Component `.html` | 200 |
| Service | 200 |
| Repository | 100 |
| State file | 100 |
| Mapper file | 80 |
| Routes file | 60 |
| `index.ts` | 30 |

Files approaching the limit are a signal to split, not to raise the limit.

---

## What Must Not Exist After Migration

- `*-routing-module.ts` files (replaced by `*.routes.ts` const arrays)
- `*-module.ts` files except `app.module.ts` — and that too only if providedIn-root is insufficient
- `src/app/models/` global folder
- `src/app/data/` global folder
- `src/app/shared/shared-module.ts`
- Any `NgModule` that declares components
- Any `../../..` import that crosses feature boundaries
- Any `HttpClient` injection outside of a `*.repository.ts` file
