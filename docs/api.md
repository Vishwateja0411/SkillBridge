# SkillBridge — REST API v1 Specification

All endpoints are versioned under `/api/v1`.

## Auth Endpoints (`/api/v1/auth`)
- `POST /register`: Register as `freelancer` or `business` (Admin accounts protected).
- `POST /login`: Authenticate and obtain JWT token and HTTP-only cookie.
- `GET /me`: Fetch authenticated user and profile.
- `POST /logout`: Clear session cookies.
- `POST /forgot-password`: Password reset dispatch.

## Freelancers (`/api/v1/freelancers`)
- `GET /`: Search and filter freelancers (query, skill, minRating, maxRate, availability).
- `GET /:id`: Public freelancer profile with reviews.
- `PUT /me/profile`: Update current freelancer profile (Auth: Freelancer).
- `POST /me/portfolio`: Add portfolio item.
- `DELETE /me/portfolio/:itemId`: Delete portfolio project.
- `POST /me/onboarding`: Complete onboarding workflow.

## Businesses (`/api/v1/businesses`)
- `GET /:id`: Public business profile.
- `PUT /me/profile`: Update company profile (Auth: Business).
- `POST /me/onboarding`: Complete company onboarding.

## Projects (`/api/v1/projects`)
- `GET /`: Public search and discovery with multi-faceted filtering.
- `GET /:id`: Project details.
- `POST /`: Create project (Auth: Business).
- `PUT /:id`: Update project.
- `DELETE /:id`: Remove project.
- `GET /my/projects`: Business projects list.
- `GET /:id/recommendations`: AI matching ranked freelancer recommendations with factor breakdown.

## Proposals (`/api/v1/proposals`)
- `POST /`: Submit proposal (Auth: Freelancer, prevents duplicate active proposals).
- `GET /project/:projectId`: Business review proposals sorted by AI score.
- `GET /my/proposals`: Freelancer proposal list.
- `PUT /:id/status`: Update status (`shortlisted`, `interview_requested`, `rejected`, `accepted`).
- `PUT /:id/withdraw`: Freelancer withdraws proposal.

## Contracts & Milestones (`/api/v1/contracts`)
- `POST /offer`: Create contract offer with milestones (Auth: Business).
- `GET /`: List user's contracts.
- `GET /:id`: Detailed contract workspace.
- `PUT /:id/accept`: Accept offer into active state (Auth: Freelancer).
- `PUT /:id/milestones/:milestoneId/submit`: Submit deliverable (Auth: Freelancer).
- `PUT /:id/milestones/:milestoneId/approve`: Approve deliverable & release payout (Auth: Business).
- `PUT /:id/milestones/:milestoneId/revision`: Request revision (Auth: Business).
- `PUT /:id/complete`: Finalize project completion and unlock mutual reviews.

## Real-Time Messaging (`/api/v1/messages`)
- `GET /conversations`: User's conversations list.
- `POST /conversations`: Get or create conversation.
- `GET /conversations/:id/messages`: Message history.
- `POST /conversations/:id/messages`: Send message and broadcast to Socket.io room.

## AI Assistant (`/api/v1/ai`)
- `POST /enhance-project-description`: AI specification enhancer.
- `POST /extract-skills`: Auto-extract required skills.
- `POST /proposal-assistant`: AI proposal draft and talking point generator.

## Admin (`/api/v1/admin`)
- `GET /stats`: Real-time aggregated platform metrics.
- `GET /users`: User directory.
- `PUT /users/:id/verify`: Toggle verified badge with audit log.
- `GET /audit-logs`: Audit trail of administrative actions.
- `POST /reset-seed`: Developer utility to re-seed database.
