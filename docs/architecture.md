# SkillBridge — Architecture & System Design

## 1. System Topology
SkillBridge is organized as an enterprise monorepo with strict separation of concerns:

- **Apps**:
  - `apps/web`: React 18, Vite, TypeScript, Tailwind CSS, Lucide icons, React Router v6, Socket.io client.
  - `apps/api`: Node.js, Express, TypeScript, Socket.io, JSON Web Token (JWT) + HTTP-only cookies, BCrypt.
- **Packages**:
  - `packages/shared`: Centralized TypeScript interfaces, role definitions, project/contract statuses, and the 6-factor AI matching algorithm.
- **Data Layer**:
  - Zero-setup file-backed store (`data/store.json`) with automated seeding and disk persistence, with seamless MongoDB Atlas connection hook via `MONGODB_URI`.

---

## 2. Real-Time Communication
- **Socket.io Gateway**:
  - Private user notification rooms (`user_${userId}`) for live push notifications (contract offers, approvals, revisions).
  - Project conversation rooms (`conv_${conversationId}`) for live milestone chat and typing indicators.

---

## 3. AI Matching Engine Architecture
The compatibility engine computes a multi-dimensional weighted score between a project's requirements and freelancer profile:
- **Skill Overlap (35%)**: Exact tokenized intersection between required skills and verified candidate skills.
- **Experience Alignment (20%)**: Distance matrix comparing requested tier (`entry`, `intermediate`, `expert`) with candidate background.
- **Portfolio Similarity (20%)**: Keyword matching on previous delivered projects, domain categories, and stack tags.
- **Client Rating (10%)**: Historical client rating scaled to 0-100.
- **Budget Feasibility (10%)**: Candidate rate alignment with min/max project budget boundaries.
- **Availability (5%)**: Full-time vs part-time vs unavailable weighting.
Every recommendation response provides transparent, explainable factors.

---

## 4. Milestone Escrow Lifecycle
```
[Proposal Accepted] -> [Contract Created (Offer Sent)]
         |
         v
[Freelancer Accepts Offer] -> [Contract Active]
         |
         v
[Milestone In Progress] -> [Freelancer Submits Deliverable] -> [Status: Submitted]
                                                                     |
                     +-----------------------------------------------+
                     |                                               |
                     v                                               v
        [Client Requests Revision]                       [Client Approves Deliverable]
                     |                                               |
                     v                                               v
        [Milestone: Revision Requested]                  [Milestone: Paid / Escrow Released]
                     |                                               |
                     +-----> [Freelancer Resubmits]                  v
                                                         [Next Milestone Activated]
                                                                     |
                                                                     v
                                                         [Final Milestone Completed]
                                                                     |
                                                                     v
                                                         [Contract Completed]
                                                                     |
                                                                     v
                                                         [Mutual Reviews Exchanged]
```
