# SkillBridge — AI-Powered Freelancer & Business Marketplace

> **Bridging Talent and Opportunity.**

SkillBridge is a production-grade full-stack talent marketplace connecting businesses with verified independent professionals. The platform supports the end-to-end project lifecycle: from AI-driven discovery and transparent compatibility scoring to proposal submission, contract offer generation, milestone-based escrow workspaces, live real-time messaging, and mutual verified reviews.

---

## 🌟 Key Features

### 1. Two-Sided Ecosystem & Role Security
- **Freelancers**: Build verified profiles, showcase interactive portfolio projects, browse recommended projects with AI match breakdown, submit proposals with automated milestone suggestions, collaborate in active contract workspaces, and track earnings.
- **Businesses**: Post projects with AI spec enhancement & skill extraction, discover top talent, compare candidate proposals ranked by compatibility, conduct live interviews, send binding contract offers, and review deliverables before releasing escrow payouts.
- **Administrators**: Dedicated administrative suite with aggregated platform metrics, user directory, verification granting/revocation, dispute arbitration, and immutable audit logs.
- **Role-Based Access Control (RBAC)**: Backend verification on every protected route. Public registration strictly disallows selecting the Admin role.

### 2. Explainable 6-Factor AI Matching Engine
Compatibility scores ($0-100\%$) are calculated using an open, documented formula:
- **Skill Overlap (35%)**: Exact tokenized intersection between project requirements and freelancer skills.
- **Experience Alignment (20%)**: Distance matrix comparing requested tier with candidate background.
- **Portfolio Similarity (20%)**: Domain and keyword matching on delivered projects.
- **Client Rating (10%)**: Verified review averages scaled to 100.
- **Budget Feasibility (10%)**: Rate compatibility with project budget boundaries.
- **Availability (5%)**: Full-time vs part-time allocation.

### 3. Turnkey Solution Blueprints & AI Scope Co-Pilot
- **Conversational Project Scoping**: Natural language prompt input that analyzes intent (e.g. *"tell me about full stack"*, *"real-time voice concierge"*) and auto-synthesizes a 3-phase milestone escrow scope with budget and delivery estimates.
- **Productized Milestone Blueprints**: Pre-architected solution packages across RAG Knowledge Agents, Voice AI, Next.js 15 SaaS MVP, n8n Automations, Figma Design Systems, and AI Security Guardrails.
- **100% Escrow Protected**: Unlike commodity gig platforms, every turnkey package is divided into funded milestone phases that release only upon verified deliverable inspection.

### 4. Active Contract Workspaces
Active contracts feature a dedicated collaboration workspace:
- Multi-phase milestone progress tracking
- Deliverable submission links & version notes
- Revision request workflows
- Integrated real-time Socket.io chat
- Milestone-specific escrow payout release
- Post-completion mutual verified reviews

### 5. Zero-Setup Local Persistence
The backend runs out of the box with zero external database installation required, utilizing an automatic disk-backed persistent store (`data/store.json`), while also supporting MongoDB Atlas via `MONGODB_URI`.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 18+ (tested on Node v24)
- npm 9+

### 1. Install Dependencies
```bash
npm install
```

### 2. Seed Database
Reinitializes realistic demo accounts, projects, proposals, active contracts, and audit logs:
```bash
npm run seed
```

### 3. Run Automated Integration Tests
Runs the 26-test automated integration suite validating auth, AI matching, milestone transitions, duplicate prevention, and audit logs:
```bash
npm test
```

### 4. Start Development Servers
Runs both the Express API (port `5000`) and the React + Vite frontend (port `5173`):
```bash
npm run dev
```
Open your browser at: **`http://localhost:5173`**

---

---

## 📁 Repository Monorepo Structure

```
SkillBridge/
├── apps/
│   ├── api/                    # Express + TypeScript + Socket.io REST API
│   │   ├── src/
│   │   │   ├── config/         # Environment variables & constants
│   │   │   ├── middleware/     # JWT authentication & RBAC
│   │   │   ├── routes/         # REST API v1 endpoints
│   │   │   ├── seed/           # Realistic seed dataset
│   │   │   ├── sockets/        # Real-time Socket.io server
│   │   │   ├── store/          # Disk-persisted storage repository
│   │   │   ├── tests/          # Integration test suite (26 assertions)
│   │   │   └── server.ts       # Main server entrypoint
│   │   └── package.json
│   └── web/                    # React 18 + Vite + TypeScript Frontend
│       ├── src/
│       │   ├── components/     # UI design system & Linear-style layouts
│       │   ├── context/        # AuthContext & SocketContext
│       │   ├── pages/          # Public, Freelancer, Business, Admin pages
│       │   ├── services/       # Type-safe API client
│       │   ├── App.tsx         # Comprehensive routing definitions
│       │   └── main.tsx
│       └── vite.config.ts
├── packages/
│   └── shared/                 # Shared TypeScript models & AI scoring engine
├── docs/                       # Architecture, database schema & API docs
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 🛡️ License
Private project repository. Built for SkillBridge Inc.
