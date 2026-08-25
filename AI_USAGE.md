# Overview:

I generated this build prompt from chatgpt giving complete details about assignment and my code writing guidelins/constrains with my tech choice. initial geenrated code was almost 75%  correct, reviewed and tests ( one compile issue was also there) then asked for 2-3 fixes, manualy resolved cors error by  editing origins in code and env. then tests it works. finaly look at the code quality and most importatntly types. then tries to deploy gets migration issue, create a single clean migration file by ai , applies migrations manualy works..

then asked to generate readme and other generation prompt after reviewing and manualy chenging some sections
finaly wrote the AI_USAGES file manualy..

# Build Prompt

You are an experienced full-stack engineer helping me to build this with minimal code.

Your primary objective is:

Build a completely functional, production-quality, clean, maintainable, properly wired full-stack application that satisfies every required feature in the assignment.

The most important requirement is working functionality. Do not optimize for unnecessary complexity, excessive abstraction, or writing large amounts of code. Every implemented feature must actually work end-to-end.

## 1. Requirements

Build a small full-stack application for managing companies.

### Backend

Use:

- Node.js
- NestJS preferred
- TypeScript
- PostgreSQL + prisma
- REST API

Required API functionality:

- Create Company
- List Companies
- Search Companies by Name
- Delete Company

Company fields:

- id
- companyName
- website
- industry
- employeeCount
- createdAt

### Frontend

Use:

- Next.js preferred
- TypeScript
- Tailwind

Required functionality:

- Display companies in a table
- Create company form
- Search companies by name
- Delete company
- Loading states
- Error handling
- Responsive UI

### Optional Bonus Features

Only implement these after all required functionality is completely working:

- Pagination
- Sorting
- Form validation
- Docker setup
- Unit tests
- GitHub Actions

Do not allow bonus features to compromise or delay core functionality.

## 2. Core Development Principles

Follow these principles throughout the entire implementation.

### Working functionality comes first

Before improving architecture, styling, abstractions, or bonus features:

- Backend starts successfully.
- Database connects successfully.
- Database schema/migrations work.
- API endpoints work.
- Frontend starts successfully.
- Frontend communicates with the backend correctly.
- Creating a company works.
- Listing companies works.
- Searching works.
- Deleting works.
- Loading states work.
- Error states work.
- The complete flow works after a fresh setup.

Do not consider a feature complete merely because the code compiles.

Actually verify that the feature is properly wired from:

UI
→ frontend logic
→ HTTP request
→ backend controller
→ service
→ database
→ response
→ frontend state
→ UI update

## 3. Code Quality Requirements

Write code that is:

- Clean
- Minimal
- Organized
- Readable
- Maintainable
- Reusable where genuinely useful
- Type-safe
- Consistent
- Easy to understand
- Easy to test
- Easy to extend

Avoid:

- Overengineering
- Unnecessary abstractions
- Giant files
- Giant components
- Deeply nested logic
- Duplicate code
- Magic values
- Unnecessary dependencies
- Unnecessary design patterns
- Premature optimization
- Clever code that reduces readability

Prefer simple, obvious implementations.

If a simple solution is sufficient, use the simple solution.

## 4. Comments

Keep comments to an absolute minimum.

Do NOT add comments explaining obvious code.

Bad:

```typescript
// Delete the company
await companyRepository.delete(id);
```

Prefer self-explanatory code.

Only add comments when they explain something genuinely non-obvious, such as:

- An important architectural decision
- A tricky edge case
- A workaround for a framework/library limitation
- A non-obvious business rule

The code itself should communicate its intent through good naming and structure.

## 5. TypeScript Requirements

Use TypeScript throughout the project.

Avoid:

- any

unless there is a genuine technical reason.

Prefer:

- Explicit types
- Interfaces/types where useful
- DTOs
- Proper API response types
- Type-safe database access
- Proper error types
- Type-safe frontend state

Do not blindly add types everywhere. Keep the type system useful and readable.

## 6. Backend Architecture

Use a clean NestJS structure.

Prefer a structure similar to:

```text
backend/
├── src/
│   ├── companies/
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── companies.controller.ts
│   │   ├── companies.service.ts
│   │   └── companies.module.ts
│   │
│   ├── database/
│   ├── app.module.ts
│   └── main.ts
│
├── test/
├── .env.example
├── package.json
└── README.md
```

Adjust the structure if the selected ORM/database tooling benefits from a different organization.

Do not create folders purely for the sake of having more folders.

## 7. API Design

Design a conventional REST API.

Use appropriate HTTP methods and status codes.

For example:

```text
POST   /companies
GET    /companies
GET    /companies?search=...
DELETE /companies/:id
```

Ensure:

- Correct status codes
- Consistent response format
- Proper validation
- Proper error handling
- Meaningful error messages
- Correct handling of missing records
- No leaking of internal errors unnecessarily

The API should be predictable and easy to consume from the frontend.

## 8. Database

Use PostgreSQL as required by the assignment. And prisma for ORM

Design the companies table appropriately.

Ensure:

- Correct data types
- Primary key
- Required fields are enforced where appropriate
- createdAt is generated correctly
- Database schema is reproducible
- Migrations/schema setup are included
- Environment-based database configuration is used

Do not hardcode credentials.

Provide:

- .env.example

with the required variables.

Never commit real credentials.

## 9. Validation

Implement sensible validation.

At minimum, validate:

- companyName
- website where applicable
- industry
- employeeCount

Handle invalid input gracefully.

Validation should happen at the appropriate backend boundary rather than trusting the frontend.

If frontend validation is implemented, it should complement backend validation rather than replace it.

## 10. Frontend Architecture

Use a clean Next.js structure.

Prefer something similar to:

```text
frontend/
├── app/
├── components/
├── lib/
├── services/
├── types/
├── hooks/
└── ...
```

Do not force this exact structure if the application is simpler.

Keep responsibilities separated.

For example:

- UI components → presentation
- API/service functions → HTTP communication
- Types → shared frontend types
- Hooks → reusable stateful logic where justified

Avoid putting all API logic directly inside large UI components.

## 11. UI Requirements

The interface should be simple and professional.

Required:

### Company table

Display:

- Company name
- Website
- Industry
- Employee count
- Created date
- Actions

### Create company

Provide a clear form.

After successful creation:

- Update the UI appropriately
- Clear/reset the form where appropriate
- Show useful feedback if needed

### Search

Searching by company name must actually query/filter the data correctly.

Do not create a fake frontend-only search if the intended implementation is API-based.

### Delete

Deleting must:

- Trigger the correct API request.
- Handle success.
- Update the UI.
- Handle failure.

### Loading states

Every asynchronous operation that can take noticeable time should have an appropriate loading state.

### Error states

Handle:

- API failure
- Network failure
- Invalid input
- Empty results
- Failed deletion
- Failed creation
- Database/backend errors surfaced through the API

Do not leave the user with a blank screen or silently fail.

## 12. Responsive Design

The application must work reasonably on:

- Desktop
- Tablet
- Mobile

Do not over-design the UI.

Prioritize:

- Readability
- Spacing
- Usability
- Clear hierarchy
- Responsive table behavior
- Usable forms
- Accessible buttons and inputs

## 13. API ↔ Frontend Wiring

This is extremely important.

Every frontend action must connect to a real backend endpoint.

Do NOT create:

- Fake API responses
- Hardcoded companies
- Mock data pretending to be real data
- Buttons that do nothing
- Forms that only update local state
- Delete buttons without actual deletion
- Search fields without working search
- UI states that don't reflect actual request states

The application must work as one connected system.

## 14. Error Handling

Implement errors deliberately.

### Backend:

- Bad request
- Not found
- Database failure
- Unexpected server failure

### Frontend:

- Request failed
- Network unavailable
- Validation error
- Empty state
- Unexpected response

Errors should be handled without crashing the application.

Do not expose sensitive internal information to users.

## 15. Reusability

Create reusable components/functions only where reuse or clarity genuinely benefits the code.

Examples:

- Button
- Input
- Modal
- LoadingState
- ErrorState
- CompanyForm
- CompanyTable
- API client/service

But do not create abstractions simply because they are theoretically reusable.

A small assignment should remain easy to understand.

## 16. Dependencies

Keep dependencies minimal.

Before introducing a package, ask:

- Is it necessary?
- Does it significantly simplify the implementation?
- Is it reliable?
- Can the same functionality reasonably be implemented without it?

Do not add libraries just because they are popular.

## 17. Testing

Testing is optional according to the assignment, but if time permits, prioritize meaningful tests over high coverage.

If adding tests, test actual behavior such as:

- Creating a company
- Listing companies
- Searching
- Deleting
- Validation
- Error handling

Do not write meaningless tests purely to claim test coverage.

## 18. Bonus Features

Only after all required functionality is confirmed working, consider:

- Form validation
- Pagination
- Sorting
- Unit/integration tests
- Docker
- GitHub Actions
- Deployment

Prioritize based on time and stability.

A fully working core application is more valuable than several partially working bonus features.

# Documentation prompt:

```Generate the necessary Dockerfiles(modify), a single docker-compose.yml, a vercel.json for single-repo deployment, and a concise README.md covering the overview, folder structure, tech stack, setup guide, and routes.```
