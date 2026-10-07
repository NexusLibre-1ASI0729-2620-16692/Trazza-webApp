# Trazza Web Application (`trazza-web-application`)

## Overview
Trazza is a logistics web platform by **NexusLibre** that connects **carriers** who drive back empty after a delivery with **merchants** (MSMEs and entrepreneurs) who need to ship goods inside Metropolitan Lima. Carriers publish their *return routes* with the free capacity they have left; merchants publish *freight requests*; Trazza suggests compatible loads, lets both parties negotiate the rate, tracks the shipment until delivery and builds the reputation of both sides.

The front-end is an **Angular 22 + TypeScript** application organized with Domain-Driven Design (DDD), following the structure and rules of the course learning center. Every bounded context of the Trazza domain model is a folder under `src/app`, split into the `domain`, `application`, `infrastructure` and `presentation` layers. In development mode the application consumes a local fake API exposed through `json-server` at `http://localhost:3000/api/v1`.

## Features
- Sign up as carrier (DNI) or merchant (RUC), sign in, sign out and role-based navigation.
- Carrier profile with fleet management (unique plates, capacity, active/inactive vehicles).
- Return routes with free capacity, time window, accepted cargo types and maximum detour.
- Freight requests with drafts, publication, cancellation and optional offered rate.
- Load suggestions and carrier search powered by the `RouteMatchingService` domain service (date, time window, cargo type, capacity and detour).
- Rate negotiation with turns (pending, counteroffer, accepted, matched, rejected, closed) and match confirmation that opens a shipment.
- Shipment execution: pickup, live location, deviation alerts (> 2 km), delivery radius check (1 km), reception and incidents (48 h window).
- Tracking map with a route sketch and an **OpenStreetMap** street map (external third-party service).
- Free and Pro plans (5 publications per month vs unlimited), card payment with Luhn validation through a payment gateway adapter and electronic receipts (boleta/factura with 18% IGV).
- Ratings with stars and highlights, reputation summaries and distribution.
- Dashboard per role, in-app alerts, English and Spanish (English by default), accessible Material components and responsive layout.

## Architecture Overview

| Bounded Context | Folder | Type | Aggregates / Entities |
|:--|:--|:--|:--|
| IAM & Profiles | `src/app/iam` | Generic | `User`, `CarrierProfile` → `Vehicle`, `MerchantProfile` |
| Matchmaking & Routing | `src/app/matchmaking` | **Core** | `ReturnRoute`, `FreightRequest`, `MatchProposal` |
| Service Execution & Monitoring | `src/app/execution` | Supporting | `Shipment` → `Incident`, `ShipmentEvent` |
| Payment & Billing | `src/app/billing` | Generic | `PaymentTransaction`, `Receipt` |
| Loyalty & Reputation | `src/app/reputation` | Supporting | `Rating` |
| Shared Kernel | `src/app/shared` | Shared | `Money`, `Address`, `GeoLocation`, Lima districts catalog |

Each bounded context is structured into four layers:
- **`domain`**: entities, aggregates, value objects, commands and domain services with native ECMAScript `#` private fields and invariants validated in constructors.
- **`application`**: `@Injectable({ providedIn: 'root' })` stores built with Angular Signals (`signal`, `computed`, `asReadonly`).
- **`infrastructure`**: typed resources and responses, static assemblers (Data Mapper), API endpoints based on `BaseApiEndpoint`, API facades based on `BaseApi`, adapters (`PaymentGateway`, `MapProvider`), guards and interceptors.
- **`presentation`**: standalone components and views with `ChangeDetectionStrategy.OnPush`, `input()`/`output()`, Angular Material and `@ngx-translate/core`.

## Project Structure

```text
trazza-web-application/
├── docs/                                   # Architectural and requirement documentation
│   ├── adrs.md                             # Architectural Decision Records (ADRs)
│   ├── class-diagram.puml                  # PlantUML class diagram of the bounded contexts
│   └── user-stories.md                     # User stories and Requirements Traceability Matrix (RTM)
├── public/                                 # Static public assets
│   ├── favicon.ico                         # Application favicon
│   ├── trazza-logo.svg                     # Brand logo
│   └── i18n/                               # Translation dictionaries for @ngx-translate
│       ├── en.json                         # English strings (default)
│       └── es.json                         # Spanish strings
├── server/                                 # Fake REST API backend (json-server)
│   ├── db.json                             # Seed data for every resource
│   ├── routes.json                         # /api/v1/* rewrite rules
│   └── start.sh                            # Shell launcher for the fake backend
├── src/
│   ├── index.html                          # Single-page HTML entry point
│   ├── main.ts                             # Bootstrap entry point
│   ├── material-theme.scss                 # Material 3 theme with the Trazza palette
│   ├── styles.css                          # Global styles and utility classes
│   ├── environments/                       # API base URL and endpoint paths
│   │   ├── environment.ts
│   │   └── environment.development.ts
│   └── app/
│       ├── app.config.ts                   # Router, HttpClient, interceptor, i18n, date adapter, title strategy
│       ├── app.routes.ts                   # Root routes composing the bounded contexts
│       ├── app.ts / app.html / app.css     # Root component
│       ├── app.spec.ts                     # Root component unit test
│       ├── iam/                            # IAM & Profiles bounded context
│       │   ├── domain/model/               # User, CarrierProfile, Vehicle, MerchantProfile, Email, Phone, Dni, Ruc, LicensePlate, LoadCapacity, UserRole, SignIn/SignUp commands
│       │   ├── application/                # IamStore, ProfileStore
│       │   ├── infrastructure/             # IamApi, endpoints, resources, assemblers, iam.guard, iam.interceptor
│       │   └── presentation/               # iam.routes, sign-in, sign-up, profile, vehicle-list, vehicle-form, vehicle-card
│       ├── matchmaking/                    # Matchmaking & Routing bounded context (core)
│       │   ├── domain/model/               # ReturnRoute, FreightRequest, MatchProposal, TimeWindow, Cargo, CargoType, Detour, statuses
│       │   ├── domain/services/            # RouteMatchingService
│       │   ├── application/                # MatchmakingStore
│       │   ├── infrastructure/             # MatchmakingApi, endpoints, resources, assemblers
│       │   └── presentation/               # return routes, load suggestions, load detail, freight requests, find carriers, offers
│       ├── execution/                      # Service Execution & Monitoring bounded context
│       │   ├── domain/model/               # Shipment, Incident, ShipmentEvent, ShipmentStatus, IncidentType
│       │   ├── application/                # ExecutionStore
│       │   ├── infrastructure/             # ExecutionApi, endpoint, assemblers, MapProvider (OpenStreetMap)
│       │   └── presentation/               # active trip, shipment tracking, histories, timeline, tracking map, incident dialog
│       ├── billing/                        # Payment & Billing bounded context
│       │   ├── domain/model/               # PaymentTransaction, Receipt, SubscriptionPlan, PaymentMethod, PaymentStatus, ReceiptType
│       │   ├── application/                # BillingStore
│       │   ├── infrastructure/             # BillingApi, endpoints, assemblers, PaymentGateway
│       │   └── presentation/               # plan & billing view, checkout dialog, receipt dialog
│       ├── reputation/                     # Loyalty & Reputation bounded context
│       │   ├── domain/model/               # Rating, Score, RatingTarget
│       │   ├── application/                # ReputationStore
│       │   ├── infrastructure/             # ReputationApi, endpoint, assembler
│       │   └── presentation/               # rating list, rating dialog, star rating
│       └── shared/                         # Shared kernel and base infrastructure
│           ├── domain/model/               # BaseEntity, Money, Address, GeoLocation, LIMA_DISTRICTS, calendar
│           ├── application/                # NotificationStore, collection helpers
│           ├── infrastructure/             # BaseApi, BaseApiEndpoint, BaseAssembler, BaseResponse, error handling, SharedAssembler
│           └── presentation/               # layout, side menu, top bar, language switcher, footer, base form, dialogs, pipes, dashboard, page not found
├── angular.json                            # Angular CLI workspace configuration
├── CHANGELOG.md                            # Version history (Keep a Changelog + SemVer)
├── CONTRIBUTING.md                         # DDD rules, Git Flow, Conventional Commits and coding standards
├── eslint.config.js                        # ESLint flat configuration
├── LICENSE.md                              # MIT license
├── package.json                            # Dependencies and scripts
├── README.md                               # This document
├── tsconfig.json                           # Root TypeScript options (strict, ES2024)
├── tsconfig.app.json                       # Application compilation options
└── tsconfig.spec.json                      # Unit test compilation options
```

## Technologies
- **Framework**: Angular 22 (standalone components, Signals, `inject()`, functional guards and interceptors)
- **Language**: TypeScript 6 (strict mode, ES2024, native `#` private fields)
- **UI & Theming**: Angular Material 22 (Material 3 tokens, Trazza palette)
- **State & Reactivity**: Angular Signals and RxJS
- **Internationalization**: `@ngx-translate/core` and `@ngx-translate/http-loader`
- **External service**: OpenStreetMap embedded map
- **Linting**: ESLint flat config with `angular-eslint` and `typescript-eslint`
- **Testing**: Jasmine and Karma (Chrome Headless)
- **Mock API**: `json-server`
- **Diagrams**: PlantUML

## Documentation
- **User Stories & RTM**: [`docs/user-stories.md`](docs/user-stories.md)
- **Class Diagram**: [`docs/class-diagram.puml`](docs/class-diagram.puml)
- **Architectural Decision Records**: [`docs/adrs.md`](docs/adrs.md)
- **Contributing Guidelines**: [`CONTRIBUTING.md`](CONTRIBUTING.md)
- **Changelog**: [`CHANGELOG.md`](CHANGELOG.md)

## Prerequisites
- Node.js (v22.22.3+ or v24.15+, required by Angular CLI 22)
- npm

## Installation
```bash
npm install
```

## Running the Application
Start the fake API first and then the Angular development server:

```bash
# Terminal 1: Fake REST API
npm run server

# Terminal 2: Angular dev server
npm start
```

The application runs at `http://localhost:4200/` and the API at `http://localhost:3000/api/v1`.

The fake API can also be started with:

```bash
npx json-server --watch server/db.json --routes server/routes.json --port 3000
```

or from inside the `server` folder:

```bash
cd server
sh start.sh
```

## Demo Accounts
All demo accounts use the password `Trazza2026`.

| Role | Email | Notes |
|:--|:--|:--|
| Carrier | `juan.ramos@email.com` | Active return route Lurín → Los Olivos, a shipment in transit and an offer waiting for an answer |
| Merchant | `valeria.torres@email.com` | Textiles Andinos SAC, request FR-2210 with offers to review and a shipment in transit |
| Carrier | `carlos.mendoza@email.com`, `pedro.quispe@email.com` | Routes compatible with FR-2210 |
| Merchant | `camila.rojas@email.com`, `luis.ferrer@email.com` | Loads suggested to Juan |

Test cards for the Pro plan checkout: `4242 4242 4242 4242` is approved and `4000 0000 0000 0002` is declined (any future expiry date, e.g. `12/30`).

To restore the initial data, discard the changes of `server/db.json` (for example with `git checkout server/db.json`).

## Available Scripts
- `npm start` – starts the development server (`ng serve`).
- `npm run server` – starts the fake API on port 3000.
- `npm run build` – builds the production bundles.
- `npm run watch` – builds in watch mode with the development configuration.
- `npm test` – runs the unit tests with Karma and Jasmine.
- `npm run lint` – runs ESLint over TypeScript and HTML files.

## Routing Notes
- Public routes: `/iam/sign-in`, `/iam/sign-up`.
- Carrier routes: `/matchmaking/return-routes`, `/matchmaking/load-suggestions`, `/execution/active-trip`, `/execution/trip-history`, `/iam/vehicles`.
- Merchant routes: `/matchmaking/freight-requests`, `/matchmaking/find-carriers`, `/matchmaking/offers/:requestId`, `/execution/shipment-tracking`, `/execution/shipment-history`.
- Shared routes: `/dashboard`, `/matchmaking/offers`, `/billing/plan`, `/reputation/ratings`, `/iam/profile`.
- Any other path shows the page-not-found view.

## Project Notes
- Translation files are located in `public/i18n/`.
- API base URL and endpoint paths are defined in `src/environments/`.
- Source files do not contain comments; naming and the documentation in `docs/` explain the design.

## License
MIT © 2026 NexusLibre Development Team. See [`LICENSE.md`](LICENSE.md).
