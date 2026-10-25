import { SEED_PROJECTS, SEED_FREELANCER_PROFILES } from '../seed/seedData.js';

export interface KnowledgeChunk {
  id: string;
  sourceType: 'project' | 'freelancer' | 'blueprint' | 'escrow_rubric';
  title: string;
  content: string;
  metadata: {
    category?: string;
    skills?: string[];
    budgetMin?: number;
    budgetMax?: number;
    duration?: string;
    milestones?: { title: string; share: number; deliverables?: string }[];
    freelancerId?: string;
    hourlyRate?: number;
    rating?: number;
  };
  vector?: Map<string, number>;
}

export interface RetrievalResult {
  chunk: KnowledgeChunk;
  similarity: number;
}

// Pre-defined Turnkey Blueprints for RAG knowledge
const TURNKEY_BLUEPRINTS_KNOWLEDGE: KnowledgeChunk[] = [
  {
    id: 'kb-bp-1',
    sourceType: 'blueprint',
    title: 'Voice AI Telephony & Booking Concierge Blueprint',
    content: 'Full-duplex real-time conversational Voice AI bot with Twilio telephony, ElevenLabs ultra-low-latency voice synthesis, and CRM sync. Milestones: 1) Telephony & WebSocket Architecture (30%), 2) Voice Agent Core & LLM Pipeline with tool calling (45%), 3) CRM Sync, latency optimization under 600ms, and final testing (25%). Typical budget: $2,800 - $4,200. Duration: 2 weeks. Required skills: Twilio, ElevenLabs, Python, FastAPI, WebSockets.',
    metadata: {
      category: 'AI & Machine Learning',
      skills: ['Twilio', 'ElevenLabs', 'Python', 'FastAPI', 'WebSockets'],
      budgetMin: 2800,
      budgetMax: 4200,
      duration: '2 weeks',
      milestones: [
        { title: 'Telephony & Webhook Architecture', share: 30, deliverables: 'Twilio call flow, WebSocket duplex audio streaming' },
        { title: 'Voice Agent Core & LLM Pipeline', share: 45, deliverables: 'Whisper transcription, ElevenLabs synthesis, tool calling' },
        { title: 'CRM Sync & Final Testing', share: 25, deliverables: 'HubSpot/Salesforce logging, latency optimization under 600ms' },
      ],
    },
  },
  {
    id: 'kb-bp-2',
    sourceType: 'blueprint',
    title: 'Enterprise RAG & Autonomous Support Agent Blueprint',
    content: 'Autonomous customer support agent with LangChain, Pinecone vector search, multi-turn memory, and Stripe billing queries. Milestones: 1) Knowledge Base Ingestion & Vector Pipeline (30%), 2) LangChain Agent Tool Calling & Fallback Logic (45%), 3) Prompt Injection Defenses, Admin Dashboard, and Escrow Verification (25%). Typical budget: $3,200 - $5,000. Duration: 3 weeks. Required skills: LangChain, Pinecone, OpenAI, Python, FastAPI, Vector RAG.',
    metadata: {
      category: 'AI & Machine Learning',
      skills: ['LangChain', 'Pinecone', 'OpenAI', 'Python', 'FastAPI', 'Vector RAG'],
      budgetMin: 3200,
      budgetMax: 5000,
      duration: '3 weeks',
      milestones: [
        { title: 'Knowledge Base & Vector Ingestion', share: 30, deliverables: 'Chunking pipeline, Pinecone indexing, metadata filters' },
        { title: 'LangChain Agent Logic & Tool Calling', share: 45, deliverables: 'Multi-turn memory, fallbacks, Stripe invoice queries' },
        { title: 'Safety Guardrails & Admin Console', share: 25, deliverables: 'Prompt injection defenses, audit dashboard, escrow sign-off' },
      ],
    },
  },
  {
    id: 'kb-bp-3',
    sourceType: 'blueprint',
    title: 'Production Next.js 15 SaaS MVP Blueprint',
    content: 'Scalable Next.js 15 SaaS MVP with TypeScript, Tailwind CSS, PostgreSQL schema, Supabase RLS security policies, and Stripe subscription billing. Milestones: 1) Architecture, Auth & DB Schema (25%), 2) Core Product Features & Dashboard with Server Actions (45%), 3) Stripe Billing, Webhooks, CI/CD, and Production Launch (30%). Typical budget: $3,800 - $6,500. Duration: 3-4 weeks. Required skills: React, Next.js 15, TypeScript, Node.js, PostgreSQL, Tailwind, Stripe.',
    metadata: {
      category: 'Web & Full-Stack Development',
      skills: ['React', 'Next.js 15', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind', 'Stripe'],
      budgetMin: 3800,
      budgetMax: 6500,
      duration: '3-4 weeks',
      milestones: [
        { title: 'Architecture, Auth & DB Schema', share: 25, deliverables: 'PostgreSQL schema, Supabase RLS security policies, DB migrations' },
        { title: 'Core Product Features & Dashboard', share: 45, deliverables: 'Interactive dashboard, data CRUD, Server Actions, SSR layout' },
        { title: 'Stripe Billing & Production Deploy', share: 30, deliverables: 'Checkout sessions, webhooks, Vercel CI/CD release & audit' },
      ],
    },
  },
  {
    id: 'kb-bp-4',
    sourceType: 'blueprint',
    title: 'Omnichannel n8n Business Workflow Suite Blueprint',
    content: 'Multi-app business automation connecting n8n, Make.com, Webhooks, HubSpot, and Slack alerts. Milestones: 1) Workflow Mapping & Webhook Setup (40%), 2) Multi-App Sync, Slack Alert Routing & 48-hour Validation (60%). Typical budget: $1,800 - $2,600. Duration: 10 days. Required skills: n8n, Make.com, Webhooks, REST APIs, HubSpot, Slack.',
    metadata: {
      category: 'Automation & Integration',
      skills: ['n8n', 'Make.com', 'Webhooks', 'REST APIs', 'HubSpot', 'Slack'],
      budgetMin: 1800,
      budgetMax: 2600,
      duration: '10 days',
      milestones: [
        { title: 'Workflow Mapping & Webhook Setup', share: 40, deliverables: 'Data mapping document, API rate limit config, error traps' },
        { title: 'Multi-App Sync & E2E Validation', share: 60, deliverables: 'Production n8n flows, Slack alerts, 48hr burn-in test' },
      ],
    },
  },
  {
    id: 'kb-bp-5',
    sourceType: 'blueprint',
    title: 'Enterprise Figma Design System & Component Library Blueprint',
    content: 'Complete design system with dark mode tokens, accessible WCAG AA contrast, responsive autolayout variants, and developer handoff specs. Milestones: 1) Design Token Foundations & Color/Type Scale (35%), 2) Interactive Components & State Variants (40%), 3) Documentation, Storybook Alignment & Guidelines (25%). Typical budget: $2,500 - $3,800. Duration: 2-3 weeks. Required skills: Figma, UI/UX Design, Design Systems, Tokens, WCAG.',
    metadata: {
      category: 'UI/UX Design',
      skills: ['Figma', 'UI/UX Design', 'Design Systems', 'Design Tokens'],
      budgetMin: 2500,
      budgetMax: 3800,
      duration: '2-3 weeks',
      milestones: [
        { title: 'Token Foundations & Style Guide', share: 35, deliverables: 'Color palettes, typography scale, spacing tokens, icons' },
        { title: 'Component Library & Autolayout Variants', share: 40, deliverables: 'Buttons, modals, tables, form inputs with hover/active states' },
        { title: 'Design System Handoff & Storybook Sync', share: 25, deliverables: 'Handoff documentation, developer token export, prototype' },
      ],
    },
  },
];

// Milestone Escrow acceptance criteria for RAG verification
const ESCROW_RUBRICS_KNOWLEDGE: KnowledgeChunk[] = [
  {
    id: 'kb-rubric-arch',
    sourceType: 'escrow_rubric',
    title: 'Phase 1: Architecture, Setup & Schema Acceptance Rubric',
    content: 'Phase 1 Deliverable Verification Criteria: Repository initialized with type-safe configuration. Database migrations and entity relationship schemas defined. Environment configuration documented. Mock data seed scripts or initial contract endpoints responsive. If frontend: responsive wireframes or page shell. Release criteria: Clean build, lint passing, no unhandled exceptions on startup.',
    metadata: {},
  },
  {
    id: 'kb-rubric-core',
    sourceType: 'escrow_rubric',
    title: 'Phase 2: Core Feature Implementation & Workflows Acceptance Rubric',
    content: 'Phase 2 Deliverable Verification Criteria: Primary user flows operable. API endpoints return validated JSON with error handling. State management synchronized across client-server. Unit/integration tests written for core business logic. Live preview link or staging demo accessible to client. Release criteria: Key user stories pass manual review without blocking bugs.',
    metadata: {},
  },
  {
    id: 'kb-rubric-final',
    sourceType: 'escrow_rubric',
    title: 'Phase 3: Integration, Polish, Security & Deployment Acceptance Rubric',
    content: 'Phase 3 Deliverable Verification Criteria: Production build passes with 0 critical vulnerabilities. Payment gateways or webhooks tested in sandbox with valid signatures. SSL/TLS configured and domain deployed to staging/production. Comprehensive README, API documentation, and handover notes delivered. Release criteria: Final client sign-off and 100% escrow balance disbursement.',
    metadata: {},
  },
];

export class VectorKnowledgeBase {
  private chunks: KnowledgeChunk[] = [];
  private idfMap: Map<string, number> = new Map();
  private totalDocs = 0;

  constructor() {
    this.initializeKnowledgeBase();
  }

  private initializeKnowledgeBase() {
    this.chunks = [];

    // 1. Ingest Turnkey Blueprints
    for (const bp of TURNKEY_BLUEPRINTS_KNOWLEDGE) {
      this.chunks.push(bp);
    }

    // 2. Ingest Historical Projects
    for (const proj of SEED_PROJECTS) {
      this.chunks.push({
        id: `kb-proj-${proj.id}`,
        sourceType: 'project',
        title: proj.title,
        content: `Historical Project: "${proj.title}". Category: ${proj.category}. Required Skills: ${proj.requiredSkills.join(', ')}. Budget: $${proj.budgetMin} - $${proj.budgetMax}. Duration: ${proj.duration}. Experience: ${proj.experienceLevel}. Scope description: ${proj.description}`,
        metadata: {
          category: proj.category,
          skills: proj.requiredSkills,
          budgetMin: proj.budgetMin,
          budgetMax: proj.budgetMax,
          duration: proj.duration,
        },
      });
    }

    // 3. Ingest Freelancer Profiles & Case Studies
    for (const free of SEED_FREELANCER_PROFILES) {
      const skillNames = free.skills.map((s) => s.name).join(', ');
      const portfolioSummaries = free.portfolio
        .map((p) => `Portfolio project "${p.title}": ${p.description} (${p.skills.join(', ')})`)
        .join('. ');

      this.chunks.push({
        id: `kb-free-${free.id}`,
        sourceType: 'freelancer',
        title: `${free.headline} (Rating: ${free.rating}/5.0)`,
        content: `Senior Specialist Profile: ${free.headline}. Location: ${free.location}. Rate: $${free.hourlyRate}/hr. Verified skills: ${skillNames}. Rating: ${free.rating}/5.0 (${free.completedProjectsCount} completed projects). Bio: ${free.bio}. Portfolio case studies: ${portfolioSummaries}`,
        metadata: {
          freelancerId: free.userId,
          hourlyRate: free.hourlyRate,
          rating: free.rating,
          skills: free.skills.map((s) => s.name),
        },
      });
    }

    // 4. Ingest Escrow Verification Rubrics
    for (const rubric of ESCROW_RUBRICS_KNOWLEDGE) {
      this.chunks.push(rubric);
    }

    this.totalDocs = this.chunks.length;
    this.buildIDF();
    this.vectorizeAll();
  }

  /**
   * Tokenizes text into normalized words and n-grams
   */
  private tokenize(text: string): string[] {
    const clean = text
      .toLowerCase()
      .replace(/[^a-z0-9+#.\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    const tokens = clean.split(' ').filter((t) => t.length > 1);

    // Add bi-grams for semantic phrases (e.g., "voice ai", "next js", "full stack", "vector rag")
    const bigrams: string[] = [];
    for (let i = 0; i < tokens.length - 1; i++) {
      bigrams.push(`${tokens[i]}_${tokens[i + 1]}`);
    }

    return [...tokens, ...bigrams];
  }

  /**
   * Computes Inverse Document Frequency (IDF)
   */
  private buildIDF() {
    const docFreq = new Map<string, number>();

    for (const chunk of this.chunks) {
      const tokens = new Set(this.tokenize(`${chunk.title} ${chunk.content}`));
      for (const token of tokens) {
        docFreq.set(token, (docFreq.get(token) || 0) + 1);
      }
    }

    this.idfMap.clear();
    for (const [token, count] of docFreq.entries()) {
      // Standard smooth IDF formula
      const idf = Math.log(1 + (this.totalDocs - count + 0.5) / (count + 0.5));
      this.idfMap.set(token, Math.max(0.1, idf));
    }
  }

  /**
   * Computes normalized TF-IDF vector for a string
   */
  public vectorize(text: string): Map<string, number> {
    const tokens = this.tokenize(text);
    const tfMap = new Map<string, number>();

    for (const token of tokens) {
      tfMap.set(token, (tfMap.get(token) || 0) + 1);
    }

    const vector = new Map<string, number>();
    let normSq = 0;

    for (const [token, count] of tfMap.entries()) {
      const tf = 1 + Math.log(count);
      const idf = this.idfMap.get(token) || 0.5;
      const weight = tf * idf;
      vector.set(token, weight);
      normSq += weight * weight;
    }

    // Normalize to unit Euclidean length
    const norm = Math.sqrt(normSq) || 1;
    for (const [token, weight] of vector.entries()) {
      vector.set(token, weight / norm);
    }

    return vector;
  }

  private vectorizeAll() {
    for (const chunk of this.chunks) {
      chunk.vector = this.vectorize(`${chunk.title} ${chunk.content}`);
    }
  }

  /**
   * Calculates cosine similarity between two normalized vectors
   */
  private cosineSimilarity(v1: Map<string, number>, v2: Map<string, number>): number {
    let dot = 0;
    // Iterate over the smaller vector for speed
    const [smaller, larger] = v1.size < v2.size ? [v1, v2] : [v2, v1];
    for (const [term, val] of smaller.entries()) {
      const otherVal = larger.get(term);
      if (otherVal !== undefined) {
        dot += val * otherVal;
      }
    }
    return Math.max(0, Math.min(1, dot));
  }

  /**
   * Retrieve top K relevant chunks using vector cosine similarity
   */
  public retrieve(query: string, topK = 4, filterType?: KnowledgeChunk['sourceType']): RetrievalResult[] {
    const queryVector = this.vectorize(query);
    const results: RetrievalResult[] = [];

    for (const chunk of this.chunks) {
      if (filterType && chunk.sourceType !== filterType) {
        continue;
      }
      if (!chunk.vector) continue;

      const sim = this.cosineSimilarity(queryVector, chunk.vector);
      if (sim > 0.05) {
        results.push({
          chunk,
          similarity: Math.round(sim * 100) / 100,
        });
      }
    }

    // Sort descending by similarity
    results.sort((a, b) => b.similarity - a.similarity);

    // If query has few direct keyword matches, fallback to the top chunks
    if (results.length === 0) {
      return this.chunks.slice(0, topK).map((chunk) => ({ chunk, similarity: 0.5 }));
    }

    return results.slice(0, topK);
  }

  public getStats() {
    return {
      totalIndexedChunks: this.chunks.length,
      blueprintsCount: this.chunks.filter((c) => c.sourceType === 'blueprint').length,
      projectsCount: this.chunks.filter((c) => c.sourceType === 'project').length,
      freelancersCount: this.chunks.filter((c) => c.sourceType === 'freelancer').length,
      rubricsCount: this.chunks.filter((c) => c.sourceType === 'escrow_rubric').length,
      vocabularySize: this.idfMap.size,
    };
  }
}

// Export singleton instance
export const ragKnowledgeBase = new VectorKnowledgeBase();
