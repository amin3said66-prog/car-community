# CarCommunity

An Angular 20 social platform for car enthusiasts — browse listings, share posts, join events, and connect with the community.

## Stack
- **Framework**: Angular 20 (standalone components, `@if`/`@for` control flow)
- **UI**: Angular Material + Tailwind CSS
- **Data**: Mock data in `src/app/data/` (no backend required)
- **Styling**: Dark purple/cyan gradient theme, glass-morphism cards

## How to run
```bash
npm start
```
Serves on port 5000 (`ng serve --host 0.0.0.0 --port 5000`). The workflow `Start application` handles this automatically.

## Pages & routes
| Route | Description |
|-------|-------------|
| `/` | Home landing page |
| `/cars` | Car listings with search & fuel-type filter |
| `/cars/:id` | Car detail — specs, owner, reviews |
| `/cars/new` | Add a new car listing (reactive form → CarService) |
| `/posts` | Community posts with category filter & like button |
| `/events` | Events grid with category filter & join button |
| `/customers` | Community members with verified filter |
| `/dashboard` | Stats overview + recent cars/posts/events/members |
| `/auth/login` | Login |
| `/auth/register` | Register |
| `/auth/profile` | User profile |
| `/auth/forgot-password` | Forgot password |
| `/auth/reset-password` | Reset password |

## Architecture
- **Lazy-loaded feature modules**: `cars`, `auth`, `posts`, `events`, `customers`, `dashboard`
- **Mock services**: `CarService` (BehaviorSubject, full CRUD) — `PostService` and `EventService` stubs exist
- **Core module**: `AuthGuard`, `GuestGuard`, `TokenInterceptor`, `ErrorInterceptor`
- **Node.js version**: 20 (required for Angular CLI 20)

## User preferences
- Keep the existing dark purple/cyan design language
- Use Angular standalone components and modern control flow (`@if`, `@for`)
