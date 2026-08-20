# Admission Saarthi Architecture

## Platform shape

- `app/`: Next.js App Router pages, metadata, sitemap and validated route handlers.
- `features/`: domain-owned UI and client workflows. Add `discovery`, `events`, `career`, `crm`, `admin` and `ai` as vertical slices.
- `components/`: shared accessible UI primitives and shell components.
- `lib/`: cross-cutting utilities, database, auth, validation and telemetry.
- `services/`: typed clients for storage, email, WhatsApp, analytics and AI.
- `prisma/`: PostgreSQL source of truth and migrations.

## Runtime architecture

Next.js serves the web experience and server-side APIs. PostgreSQL (Supabase) stores transactional data through Prisma. Auth.js handles sessions and RBAC. S3-compatible object storage holds documents and certificates. Rate-limited server routes own third-party calls and audit every privileged mutation.

AI Saarthi is a retrieval-first service: policy-checked user query -> intent/router -> PostgreSQL/vector retrieval -> grounded response with source IDs -> safety pass -> optional human counsellor escalation. Recommendation probability is guidance, never an admission guarantee.

## Delivery phases

1. Foundation: design system, homepage, content, WhatsApp attribution, leads, institution growth.
2. Discovery: finders, filters, detail pages, shortlist, comparison and tracker.
3. Ecosystem: events, certificates, jobs, internships and projects.
4. Intelligence: RAG assistant, recommendation engine and governed analytics.

## Security baseline

Validate request bodies at the server boundary, use secure HTTP-only sessions, enforce role checks server-side, rate-limit auth/AI/lead endpoints, sanitize rich text, encrypt sensitive values, rotate secrets in deployment, keep append-only audit events, and restrict exports by role and scope.
