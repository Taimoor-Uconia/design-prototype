## Uconia Dashboards — MVP Specification

### Purpose
Demonstrate core LPS-aligned dashboards that are immediately useful for weekly planning and learning, while laying a scalable foundation for production data and exports.

### Audience
- Last Planning Coordinator (planner)
- Subcontractor Lead
- Project Director

### In-Scope (MVP)
1) Dashboard shell (Project-level)
   - Responsive grid layout with KPI tiles and charts
   - Filters: period selector (default = current week), phase/area/trade/owner
2) Widgets (v1)
   - PPC (Percent Plan Complete) for current Weekly Work Plan (WWP)
   - Variance reasons distribution (current period)
   - Lookahead readiness & constraints (next N weeks)
   - Planned vs actual progress (timeline, recent 6–8 weeks)
   - Realtime-agnostic delivery: client fetches from `/api/dashboard` with optional polling; later SSE/WS can plug in without changing the widget contract
3) Data contracts and IDs
   - Canonical variance codes and constraint types
   - Immutable snapshot IDs for weekly commitments and outcomes
4) CSV export
   - Include snapshot_id, project_id, period, filters, and generated_at
5) Seed dataset
   - Realistic sample data matching entities with 1–2 projects and multiple phases/trades

### Out-of-Scope (MVP)
- Full PDF export (use print-friendly page as interim)
- Authentication/roles (optional demo mode)
- P6 adapters (placeholder CSV import)
- Resource efficiency metrics (planned → MVP+, tracked in roadmap)

### User Stories
- As a planner, I can see PPC for the current WWP and drill to contributing activities.
- As a planner, I can see constraints and readiness in the lookahead window to prepare weekly planning.
- As a subcontractor lead, I can see variance reasons to learn and improve next week’s plan.
- As a director, I can see planned vs actual progress trends over recent weeks.
- As any user, I can export the current dashboard view to CSV with clear context.

### Data Model (MVP entities)
- Project(id, name, timezone)
- Phase(id, project_id, name, area, trade, parent_phase_id?)
- Activity(id, phase_id, title, planned_week, ready_state, planned_qty, unit, owner_company, crew_hint)
- Constraint(id, activity_id?, phase_id?, type, owner, due_date, status, created_at, resolved_at?)
- VarianceCode(id, label)
- ActivityUpdate(id, activity_id, period, completion_percent, actual_qty?, variance_code_ids[])
- Metric(id, scope(project/trade/area), period, ppc_value, variance_counts)
- ReportSnapshot(id, project_id, period_start, period_end, filters, generated_at, links)

### Calculations
- PPC = (# committed activities completed in period) / (total committed activities in period)
- Variance counts: aggregate variance_code_ids from incomplete activities in period
- Readiness share = activities in lookahead with all constraints Resolved / total activities in lookahead
- Planned vs Actual: sum(planned_qty) vs sum(actual_qty or completion-derived) per week

### UX & Visuals
- Design tone: clean, modern, elegant, low-saturation neutrals with semantic states:
  - Ready: green ramp; Blocked: red ramp; At risk: amber; Neutral: cool grays
- Layout:
  - Top row: KPI tiles (PPC, #Constraints Open, Readiness %, period range)
  - Middle: Variance Reasons (bar/donut), Constraints by Owner/Type (bar)
  - Bottom: Planned vs Actual (line/column) + Readiness heatmap (matrix by area x week)
- Interactions:
  - Filters apply to all widgets; CSV export preserves filters
  - Legend toggles; hover tooltips; empty/error states

### APIs (Next.js Route Handlers)
- GET /api/dashboard?project=:id&period=YYYY-WW&filters=...
  - Returns widget data payloads keyed by widget (storage-agnostic)
- GET /api/projects/:id/export.csv?period=...&filters=...
  - Streams CSV with snapshot context
- (MVP+) POST /api/import/csv (for seed refresh)

### Implementation Plan
1) Seed data loader (SSR) → in-memory or SQLite
2) Widget calculators (PPC, variance, constraints readiness, planned vs actual)
3) Dashboard UI with Tremor + shadcn/ui
4) CSV export endpoint
5) Print-friendly page styling
6) Promote to Prisma schema and connect Postgres for pilot

### Testing & Quality
- Unit tests for calculators (PPC, variance, readiness)
- Visual sanity for charts (screenshot diffs MVP+)
- Accessibility checks (contrast, keyboard nav, labels)

### Deployment
- GitHub repo → Vercel
  - Preview deployments for PRs
  - ENV: DATABASE_URL (sqlite for dev, postgres for prod)
  - Route Handlers for serverless

### Roadmap (MVP+)
- Resource efficiency metrics (planned vs spent hours)
- Subcontractor weekly pack export page + stable snapshot IDs
- Role dashboards and deep link drill-through
- Connect CSV import → P6 adapter


