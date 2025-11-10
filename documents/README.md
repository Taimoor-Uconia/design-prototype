## MVP TODO Plan (derived from `documents/mvp-spec.md`)

Use this as the working checklist to deliver the MVP exactly as specified.

### 0) Foundations
- [ ] Confirm Node 20+ and install dependencies
- [ ] Create `.env.local` and sample `.env.example` (document required vars)
- [ ] Add runbook in root `README.md` (local setup, scripts, troubleshooting)

### 1) Dashboard Shell (Project-level)
- [ ] Implement responsive grid layout with KPI tiles and charts
- [ ] Global filters: period selector (default current week), phase/area/trade/owner
- [ ] Ensure interactions propagate filters to all widgets
- [ ] Add print-friendly styles for the dashboard page

### 2) Widgets (v1)
- [ ] PPC (Percent Plan Complete) for current Weekly Work Plan (WWP)
- [ ] Variance reasons distribution (current period)
- [ ] Lookahead readiness & constraints (next N weeks)
- [ ] Planned vs actual progress (timeline, recent 6–8 weeks)
- [ ] Empty/error/loading states for each widget

### 3) Data Contracts and IDs
- [ ] Define canonical variance codes and constraint types
- [ ] Establish immutable snapshot IDs for weekly commitments and outcomes
- [ ] Document payload shapes per widget (contract-first)

### 4) API Layer (storage-agnostic)
- [ ] GET `/api/dashboard?project=:id&period=YYYY-WW&filters=...` returning payloads per widget
- [ ] GET `/api/projects/:id/export.csv?period=...&filters=...` streaming CSV (with snapshot_id, filters, generated_at)
- [ ] (MVP+) placeholder POST `/api/import/csv` for seed refresh

### 5) Seed Dataset
- [ ] Create realistic sample data covering 1–2 projects with phases/trades
- [ ] Align seed to entities described in the spec (see Data Model)
- [ ] Provide import script and document how to refresh the seed

### 6) Data Model (as per spec; implementation notes)
- [ ] Map current schema to spec entities:
  - Project, Phase, Activity, Constraint, VarianceCode, ActivityUpdate, Metric, ReportSnapshot
- [ ] Implement calculators for:
  - PPC
  - Variance counts (by reason/code)
  - Readiness share (lookahead readiness)
  - Planned vs Actual (weekly)

### 7) CSV Export
- [ ] Export the current dashboard view to CSV including: snapshot_id, project_id, period, filters, generated_at
- [ ] Verify CSV columns match widget contracts and spec

### 8) Testing & Quality
- [ ] Unit tests for calculators (PPC, variance, readiness, planned vs actual)
- [ ] Accessibility checks (contrast, keyboard nav, labels)
- [ ] (MVP+) Visual sanity for charts (screenshot diffs)

### 9) Deployment
- [ ] CI: install, lint, typecheck, build
- [ ] Preview deployments for PRs (e.g., Vercel/Netlify)
- [ ] Configure environment variables for preview and production

### 10) Roadmap hooks (MVP+; track but do not ship in MVP)
- [ ] Resource efficiency metrics (planned vs spent hours)
- [ ] Subcontractor weekly pack export page + stable snapshot IDs
- [ ] Role dashboards and deep link drill-through
- [ ] Connect CSV import → P6 adapter

---

Reference: see `documents/mvp-spec.md` for detailed purpose, audience, user stories, data model, and API contracts. 

