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
[Proposal / Blueprint Accepted] -> [Contract Created (Offer Sent / Escrow Funded)]
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

---

## 5. Turnkey Solution Blueprints Architecture
To provide the productized speed of modern AI platforms (such as Botpool.ai) without sacrificing enterprise escrow safety, SkillBridge incorporates **Turnkey Solution Blueprints**:

- **Pre-Architected Solution Specs**: Fixed-scope solutions with defined deliverables, technology stack, and fixed pricing.
- **Phased Escrow Binding**: Each blueprint is bound to 2–4 sequential milestones with transparent escrow allocation percentages (e.g., Phase 1: Architecture 25%, Phase 2: Core Engineering 45%, Phase 3: Deployment & Sign-off 30%).
- **Automated Project Pre-Filling**: Instant one-click deployment automatically transfers blueprint scope, required skills, and milestone funding brackets into the contract engine.

---

## 6. Conversational AI Scope Co-Pilot
The landing page hero features an interactive natural language project scoping engine:
- **Semantic Intent Classifier**: Analyzes conversational queries (e.g., *"tell me about full stack"*, *"real-time voice bot"*, *"n8n workflow automation"*) to identify technical domains, required dependencies, and target delivery bands.
- **Dynamic Milestone Synthesizer**: Generates a 3-phase milestone escrow breakdown in real time with estimated budget brackets and target timelines.
- **Live Specialist Ranking**: Maps synthesized skills against verified freelancer profiles using the 6-factor compatibility engine.

---

## 7. Competitive Architecture: SkillBridge vs. Gig Marketplaces

| Architecture Dimension | Traditional Gig Marketplaces (e.g. Botpool/Fiverr) | SkillBridge Enterprise Marketplace |
| :--- | :--- | :--- |
| **Discovery Model** | Keyword search / static ad placement | **Conversational AI Scope Co-Pilot + 6-Factor Compatibility Match** |
| **Transaction Model** | All-or-nothing lump-sum checkout | **Phased Milestone Escrow with deliverable sign-offs** |
| **Collaboration Engine** | Fragmented external channels (email, Slack) | **Integrated Socket.io real-time chat, versioned links & revision loop** |
| **Governance & Trust** | Automated support ticketing | **Dedicated Admin Arbitration Portal with immutable audit logs** |
| **Fee Structure** | 10%–20% layered client commissions | **0% Client Fee, flat 5% freelancer payout fee** |

---

## 8. LLM & RAG Vector Engine Architecture (Powered by Groq LPUs)

SkillBridge integrates a production-grade Retrieval-Augmented Generation (RAG) and Large Language Model (LLM) pipeline running on Groq's high-speed LPU infrastructure:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        SKILLBRIDGE FRONTEND                            │
│  • Hero AI Scope Co-Pilot: Live prompt search with Groq RAG grounding  │
│  • Instant Scoping Modal: 3-phase milestones, escrow %, and citations │
│  • One-click pre-population into Project Creation form                 │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ (API Requests)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      BACKEND RAG & LLM SERVICE                         │
│                                                                        │
│  1. Vector Knowledge Base (`rag.service.ts`):                          │
│     • Indexes past successful projects, freelancer case studies,       │
│       turnkey blueprints, and milestone QA acceptance rubrics.         │
│     • Vector Embeddings: Normalized TF-IDF / Cosine Similarity         │
│     • Cosine Similarity search retrieving top relevant comps.          │
│                                                                        │
│  2. LLM Synthesis Engine (`llm.service.ts`):                           │
│     • Provider: Groq LPU (`openai/gpt-oss-120b`) / OpenAI / Gemini     │
│     • Prompt Grounding: Injects retrieved comps into the context       │
│     • Milestone Verifier: Audits deliverables against escrow contracts │
└────────────────────────────────────────────────────────────────────────┘
```

### Core Components:
1. **Conversational AI Project Co-Pilot (`AiScopePromptBar.tsx`)**:
   - Integrated into the Hero section of the homepage. Clients type their project requirements in natural language.
   - Powered by Groq LPU fast inference (`openai/gpt-oss-120b`) and in-memory vector search to synthesize 3-phase funded milestones, budget bands, timelines, and citations in ~380ms.
2. **Vector Knowledge Base (`rag.service.ts`)**:
   - Indexes historical completed projects, vetted freelancer portfolio achievements, turnkey blueprints, and QA escrow rubrics.
   - Computes unit-normalized vectors with smooth IDF weighting and evaluates cosine similarity $\text{sim}(q, d) = \sum_{i} q_i \cdot d_i$ to retrieve relevant comps with precision.
3. **Groq LPU Fast Inference Engine (`llm.service.ts`)**:
   - Connects to Groq's OpenAI-compatible API endpoint for sub-second responses (~380ms).
   - Generates grounded 3-phase milestone scopes, budget brackets ($min, $max), and historical citations.
4. **Autonomous Milestone Escrow Auditor (`/api/v1/ai/rag/verify-milestone`)**:
   - Evaluates submitted deliverable URLs, pull requests, and handover documentation against signed contract specifications and acceptance rubrics.
   - Calculates an objective confidence score (0–100) and produces an actionable escrow release recommendation (`APPROVE_ESCROW_RELEASE` vs `REQUEST_REVISION`) with a line-by-line audit checklist.



