# Contributing to Trazza Web Application

Thank you for contributing to the Trazza web application by NexusLibre! This document establishes the engineering standards, architecture rules, and development workflows to maintain high codebase quality, consistency, and scalability.

---

## Table of Contents
1. [Architecture & Design Principles](#architecture--design-principles)
   - [Domain-Driven Design (DDD)](#domain-driven-design-ddd)
   - [Object-Oriented Programming (OOP) & Clean Code](#object-oriented-programming-oop--clean-code)
2. [Git Workflow & Branching Strategy](#git-workflow--branching-strategy)
3. [Conventional Commits](#conventional-commits)
4. [Semantic Versioning (SemVer)](#semantic-versioning-semver)
5. [TypeScript Guidelines](#typescript-guidelines)
6. [Angular & Angular Material Standards](#angular--angular-material-standards)
7. [Quality Assurance & Development Workflow](#quality-assurance--development-workflow)
8. [Pull Request (PR) Process](#pull-request-pr-process)

---

## Architecture & Design Principles

### Domain-Driven Design (DDD)
The project organizes code into **Bounded Contexts** located under `src/app/`:
- **`iam`**: IAM & Profiles (sign up, sign in, session, carrier and merchant profiles, vehicles, guards and interceptor).
- **`matchmaking`**: Matchmaking & Routing, the core domain (return routes, freight requests, rate negotiation and route matching).
- **`execution`**: Service Execution & Monitoring (shipments, live location, deviation alerts, delivery and incidents).
- **`billing`**: Payment & Billing (Free/Pro subscription, payment gateway adapter, boleta and factura receipts).
- **`reputation`**: Loyalty & Reputation (ratings and reputation summaries).
- **`shared`**: Shared kernel (`Money`, `Address`, `GeoLocation`), base infrastructure, application shell, internationalization and reusable presentation pieces.

Each bounded context is strictly divided into four architectural layers:
```text
src/app/<bounded-context>/
├── domain/
│   ├── model/           # Pure domain entities, value objects, domain interfaces, and commands.
│   │                    # Must NOT depend on Angular, HTTP, or UI layers.
│   └── services/        # Domain services that coordinate several aggregates.
├── infrastructure/      # REST API endpoints, DTO resources/responses, and Assemblers.
│                        # Handles HTTP communication and serialization/deserialization.
├── application/         # Application stores, state orchestrators, and reactive use-case workflows.
└── presentation/        # Standalone components, views, dialogs, forms, and route configurations.
    ├── components/      # UI components scoped to the context.
    └── views/           # Routed view pages and forms.
```

### Object-Oriented Programming (OOP) & Clean Code
- **SOLID Principles**: Adhere to Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion across all classes and abstractions.
- **Encapsulation**: Domain entities and command models protect internal state using native ECMAScript private fields (`#id`, `#name`) rather than soft `_` prefixes, exposing explicit getters/setters or business behavior methods.
- **Assembler Pattern**: Keep infrastructure DTOs (`*Resource`, `*Response`) decoupled from domain entities using static, bidirectional assemblers (`toEntityFromResource`, `toResourceFromEntity`, `toEntitiesFromResponse`) whose class satisfies the `BaseAssembler` contract.
- **Invariants**: Validate invariants in constructors and factory methods, and throw translation keys (`validation.*`, `matching.*`) so the presentation layer can show localized messages.
- **Composition over Inheritance**: Prefer composing specialized services/endpoints into facades (`BaseApi`) over deep class inheritance hierarchies.

---

## Git Workflow & Branching Strategy

We follow the standard **Git Flow** branching model:

```text
main ──────────────────────────────────────────●────── (Production Releases)
         \                                    /
develop ──●─────────●───────────────●────────●──────── (Integration Branch)
           \       /                 \      /
feature/    ●─────●                   ●────●           (Feature Branches)
```

### Branch Types & Naming Conventions
- `main`: Production-ready code. Only merged from `release/*` or `hotfix/*` branches. Tagged with SemVer tags (e.g., `v1.2.0`).
- `develop`: Primary integration branch where completed features are merged.
- `feature/<context>-<short-description>`: New features or enhancements (branched from `develop`, merged back to `develop`).
  - *Example:* `feature/matchmaking-routing`, `feature/iam-vehicles`
- `bugfix/<context>-<issue-description>`: Non-urgent bug fixes (branched from `develop`, merged back to `develop`).
  - *Example:* `bugfix/execution-delivery-radius`
- `release/v<MAJOR.MINOR.PATCH>`: Release preparation, final validation, and version bumping (branched from `develop`, merged to `main` and `develop`).
- `hotfix/v<MAJOR.MINOR.PATCH>`: Critical production fixes (branched directly from `main`, merged to `main` and `develop`).

---

## Conventional Commits

Commit messages must follow the [Conventional Commits v1.0.0](https://www.conventionalcommits.org/) specification.

### Commit Format
```text
<type>(<scope>): <short summary in imperative mood>

[optional body providing technical context, rationale, and motivation]

[optional footer(s) such as BREAKING CHANGE or issue tracker references]
```

### Commit Types
| Type       | Description                                                  |
|------------|--------------------------------------------------------------|
| `feat`     | A new feature for the user or system                         |
| `fix`      | A bug fix                                                    |
| `docs`     | Documentation changes only                                   |
| `style`    | Formatting, missing semi-colons, whitespace (no code change) |
| `refactor` | Refactoring code without fixing a bug or adding a feature    |
| `perf`     | Code changes that improve performance                        |
| `test`     | Adding or updating unit tests                                |
| `build`    | Build system, toolchain, or external dependency changes      |
| `ci`       | CI configuration files and automation scripts                |
| `chore`    | Maintenance tasks that do not alter production code          |

### Allowed Scopes
Scopes must match a Bounded Context, core layer, or tool: `iam`, `matchmaking`, `execution`, `billing`, `reputation`, `shared`, `app`, `deps`, `config`, `theme`, `server`.

### Examples
- `feat(matchmaking): add load suggestions view with detour filters`
- `fix(iam): redirect signed-in users away from sign-in`
- `docs(shared): update ADR for OpenStreetMap integration`
- `refactor(execution): clone shipment before applying domain behavior`
- `build(deps): update Angular to v22.2.0`

---

## Semantic Versioning (SemVer)

Versions follow the [SemVer 2.0.0](https://semver.org/) schema: `MAJOR.MINOR.PATCH`

- **MAJOR (`X.0.0`)**: Incompatible API changes, breaking route restructuring, or fundamental architecture rewrites.
- **MINOR (`0.X.0`)**: Backwards-compatible new features, new bounded contexts, or added capabilities.
- **PATCH (`0.0.X`)**: Backwards-compatible bug fixes and security patches.

---

## TypeScript Guidelines

- **Strict Type Checking**: Maintain strict TypeScript configuration (`strict: true`, `noImplicitAny: true`, `noImplicitReturns: true`).
- **Avoid `any`**: Use explicit interfaces, generics, or `unknown` (with type narrowing) instead of `any`.
- **Target ECMAScript**: Target modern ECMAScript standard (`ES2024`) per `tsconfig.json`.
- **Private Properties in Domain Models**: Use native ECMAScript `#` private fields (`#id`, `#name`) for domain entity and command backing fields to ensure hard runtime encapsulation and avoid artificial underscore prefixes.
- **Naming Conventions**:
  - `PascalCase`: Classes, interfaces, types, enums, components (`ReturnRoute`, `BaseEntity`, `ReturnRouteList`).
  - `camelCase`: Properties, methods, functions, variables, signals (`routeId`, `loadAll`, `currentUser`).
  - `UPPER_SNAKE_CASE`: Global constants and immutable configuration maps.
  - `kebab-case`: All file and folder names (`matchmaking-api.ts`, `return-route-form.html`).

---

## Angular & Angular Material Standards

### Angular Modern Conventions
- **Standalone Components**: Do not use `NgModule`. Declare components, pipes, and directives as standalone.
- **Dependency Injection**: Use `inject(Service)` rather than constructor-based injection for cleaner, modern DI.
- **Reactivity via Signals**:
  - Use `signal()`, `WritableSignal`, `computed()`, and `effect()` for local and store state.
  - Use modern signal queries (`viewChild`, `viewChildren`, `contentChild`).
- **Change Detection**: Declare `changeDetection: ChangeDetectionStrategy.OnPush` in every component and keep view state in signals.
- **Component Communication**: Use `input()`, `input.required()` and `output()` instead of decorators.
- **Reactive Forms**: Extend `BaseForm` for standardized validation feedback and error messaging.
- **Stores**: Commands return `Observable`s built with `defer()`; clone aggregates through their assembler before mutating them and replace the instance returned by the API in the signal.
- **No Comments**: Code must be self-explanatory through naming; source files do not contain comments.

### Angular Material (M3) Guidelines
- **Theme Consistency**: Use Material 3 (M3) design tokens (`var(--mat-sys-*)`) and `@angular/material` mixins (`@include mat.theme(...)`).
- **Styles Reference**: Global styles must be maintained via `src/material-theme.scss` and `src/styles.css` referenced in `angular.json`.
- **Accessibility (a11y)**:
  - All interactive elements must include descriptive `aria-label` or visible labels.
  - Image assets must supply descriptive `alt` attributes.
  - Ensure high color contrast complying with WCAG 2.1 AA standards.

### Internationalization (i18n)
- Do not hardcode UI strings in component templates or code.
- Add English keys to `public/i18n/en.json` and Spanish translations to `public/i18n/es.json`.
- Render localized strings in templates using the `translate` pipe: `{{ 'return-route.list-title' | translate }}`.

---

## Quality Assurance & Development Workflow

### Prerequisites
- Node.js (Active LTS or modern version)
- npm

### Development Commands
```bash
# Install dependencies
npm install

# Start development server
npm start

# Run ESLint linter
npm run lint

# Run unit tests (Karma / Jasmine Headless)
npm test -- --watch=false --browsers=ChromeHeadless

# Build production bundle
npm run build
```

---

## Pull Request (PR) Process

Before submitting a pull request, verify that:
1. [ ] Code adheres to DDD boundaries and OOP principles.
2. [ ] All commit messages adhere to Conventional Commits.
3. [ ] Code passes linting with zero warnings/errors (`npm run lint`).
4. [ ] All unit tests pass cleanly (`npm test -- --watch=false --browsers=ChromeHeadless`).
5. [ ] Production build succeeds without budget or compilation errors (`npm run build`).
6. [ ] Documentation, class diagrams, and ADRs are updated if architectural changes are introduced.
7. [ ] The PR targets the `develop` branch (or `main` for hotfixes).
