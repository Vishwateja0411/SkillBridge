import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Layers,
  Cpu,
  Bot,
  Zap,
  Lock,
  Code2,
  X,
  ExternalLink,
} from 'lucide-react';

interface Blueprint {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  price: number;
  deliveryDays: number;
  milestoneCount: number;
  icon: any;
  color: string;
  leadSpecialist: {
    name: string;
    avatar: string;
    role: string;
    rating: number;
  };
  stack: string[];
  deliverables: string[];
  milestones: { phase: string; title: string; share: number; deliverables: string }[];
}

const BLUEPRINTS: Blueprint[] = [
  {
    id: 'rag-knowledge-agent',
    badge: 'Trending AI',
    title: 'Enterprise RAG Knowledge Agent',
    subtitle: 'Autonomous vector search pipeline over PDF, Notion & SQL docs with conversational citations.',
    price: 3200,
    deliveryDays: 14,
    milestoneCount: 3,
    icon: Bot,
    color: 'from-[#38BDF8] to-[#818CF8]',
    leadSpecialist: {
      name: 'Sarah Jenkins',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      role: 'Senior Full-Stack & AI Engineer',
      rating: 5.0,
    },
    stack: ['LangChain', 'Pinecone', 'OpenAI', 'Python', 'FastAPI'],
    deliverables: [
      'Document chunking & vector ingestion pipeline',
      'Multi-turn conversational agent with hallucination guardrails',
      'React citation interface & admin upload dashboard',
    ],
    milestones: [
      { phase: 'Phase 1', title: 'Data Ingestion & Vector Index', share: 30, deliverables: 'Pinecone cluster setup, embedding pipelines, schema validation' },
      { phase: 'Phase 2', title: 'LangChain Agent & Tool Calling', share: 45, deliverables: 'Multi-turn memory, metadata filtering, private LLM fallbacks' },
      { phase: 'Phase 3', title: 'UI Embed & Escrow Sign-off', share: 25, deliverables: 'End-to-end load tests, citation accuracy report, production release' },
    ],
  },
  {
    id: 'voice-ai-concierge',
    badge: 'High Demand',
    title: 'Real-Time Voice AI Telephony Bot',
    subtitle: 'Human-like conversational voice agent connected to phone lines, calendar booking, and CRM.',
    price: 2800,
    deliveryDays: 10,
    milestoneCount: 2,
    icon: Cpu,
    color: 'from-[#C9A24B] to-[#F59E0B]',
    leadSpecialist: {
      name: 'Marcus Vance',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      role: 'Cloud Architect & AI Voice Specialist',
      rating: 4.9,
    },
    stack: ['Twilio', 'ElevenLabs', 'Whisper', 'WebSockets', 'Python'],
    deliverables: [
      'Bidirectional low-latency audio streaming (<600ms latency)',
      'Custom voice cloned persona with interruption handling',
      'Google Calendar & HubSpot automatic appointment scheduling',
    ],
    milestones: [
      { phase: 'Phase 1', title: 'Telephony & WebSocket Architecture', share: 40, deliverables: 'Twilio trunking, media stream server, streaming transcription' },
      { phase: 'Phase 2', title: 'Agent Logic & Production Turnkey', share: 60, deliverables: 'Tool calls, call recording, CRM sync, live phone line test' },
    ],
  },
  {
    id: 'nextjs-saas-mvp',
    badge: 'Popular',
    title: 'Production Next.js 15 SaaS MVP',
    subtitle: 'Modern full-stack web app with clean architecture, Stripe billing, auth, and analytics.',
    price: 4400,
    deliveryDays: 21,
    milestoneCount: 4,
    icon: Code2,
    color: 'from-[#818CF8] to-[#C084FC]',
    leadSpecialist: {
      name: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      role: 'Staff Full-Stack Architect',
      rating: 4.95,
    },
    stack: ['Next.js 15', 'TypeScript', 'Tailwind', 'Supabase', 'Stripe'],
    deliverables: [
      'Role-based authentication & database migrations',
      'Stripe subscription checkout, customer portal, & webhooks',
      'Responsive dashboard with data visualization charts',
    ],
    milestones: [
      { phase: 'Phase 1', title: 'Architecture, Auth & DB Schema', share: 25, deliverables: 'Supabase RLS, Prisma/Drizzle schema, OAuth sign-in' },
      { phase: 'Phase 2', title: 'Core Product Dashboard & CRUD', share: 35, deliverables: 'Server actions, optimistic updates, table pagination' },
      { phase: 'Phase 3', title: 'Stripe Subscriptions & Webhooks', share: 25, deliverables: 'Tiered plans, usage limits, portal management' },
      { phase: 'Phase 4', title: 'Vercel Deployment & Handover', share: 15, deliverables: 'Lighthouse 95+ score, docs, GitHub repository transfer' },
    ],
  },
  {
    id: 'n8n-workflow-suite',
    badge: 'Automation',
    title: 'Autonomous n8n Multi-App Workflow',
    subtitle: 'Synchronize leads, invoices, notifications, and AI processing across your entire tech stack.',
    price: 1600,
    deliveryDays: 7,
    milestoneCount: 2,
    icon: Zap,
    color: 'from-[#34D399] to-[#059669]',
    leadSpecialist: {
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      role: 'Automation & Product Workflow Specialist',
      rating: 4.98,
    },
    stack: ['n8n', 'Make.com', 'Webhooks', 'REST APIs', 'HubSpot'],
    deliverables: [
      'Self-hosted or cloud n8n production instance configuration',
      'Fault-tolerant webhook pipelines with retry queues',
      'Slack alerting & automated CRM record enrichment',
    ],
    milestones: [
      { phase: 'Phase 1', title: 'Workflow Blueprint & Connectors', share: 40, deliverables: 'API token setup, schema mapping, staging test runs' },
      { phase: 'Phase 2', title: 'Live Automation & Burn-In', share: 60, deliverables: 'Production deployment, error trap alerting, documentation' },
    ],
  },
  {
    id: 'ai-design-system',
    badge: 'Design System',
    title: 'AI Product Design System & UI Kit',
    subtitle: 'Pixel-perfect Figma tokens, component hierarchy, accessible states, and interactive prototype.',
    price: 2200,
    deliveryDays: 8,
    milestoneCount: 2,
    icon: Layers,
    color: 'from-[#F472B6] to-[#E11D48]',
    leadSpecialist: {
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      role: 'Lead UI/UX Product Designer',
      rating: 4.98,
    },
    stack: ['Figma', 'Design Tokens', 'Auto-Layout', 'Design Systems'],
    deliverables: [
      'Comprehensive color, typography, elevation & spacing tokens',
      '60+ responsive auto-layout components with interactive states',
      'High-fidelity clickable desktop & mobile user flow prototype',
    ],
    milestones: [
      { phase: 'Phase 1', title: 'Foundations & Core Atoms', share: 40, deliverables: 'Figma variables, typography scale, icon sets, button hierarchy' },
      { phase: 'Phase 2', title: 'Complex Molecules & Prototype', share: 60, deliverables: 'Dashboards, modals, tables, clickable prototype link' },
    ],
  },
  {
    id: 'ai-security-guardrails',
    badge: 'Security',
    title: 'AI Guardrails & Threat Defense Suite',
    subtitle: 'Harden LLM applications against prompt injection, jailbreaks, data exfiltration, and PII leaks.',
    price: 3800,
    deliveryDays: 12,
    milestoneCount: 3,
    icon: Lock,
    color: 'from-[#38BDF8] to-[#0284C7]',
    leadSpecialist: {
      name: 'Marcus Vance',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      role: 'DevOps & Cloud Security Architect',
      rating: 4.9,
    },
    stack: ['NeMo Guardrails', 'LangKit', 'Python', 'Docker', 'OWASP'],
    deliverables: [
      'Input/output prompt sanitization & jailbreak interception',
      'PII masking & DLP regex interceptors',
      'Audit logging endpoint compliant with SOC2 AI controls',
    ],
    milestones: [
      { phase: 'Phase 1', title: 'Vulnerability Audit & Threat Model', share: 30, deliverables: 'Attack surface report, red-teaming test harness' },
      { phase: 'Phase 2', title: 'Guardrail Interceptor Deployment', share: 45, deliverables: 'NeMo/Llama-Guard middleware, automated redaction' },
      { phase: 'Phase 3', title: 'Compliance Verification & Sign-off', share: 25, deliverables: 'Final pentest report, audit dashboard handover' },
    ],
  },
];

export const TurnkeyBlueprintsSection: React.FC = () => {
  const [selectedBlueprint, setSelectedBlueprint] = useState<Blueprint | null>(null);
  const navigate = useNavigate();

  const handleLaunchBlueprint = (bp: Blueprint) => {
    navigate('/business/projects/new', {
      state: {
        title: bp.title,
        description: `Turnkey Blueprint Deployment: ${bp.subtitle}\n\nDeliverables:\n${bp.deliverables
          .map((d, i) => `${i + 1}. ${d}`)
          .join('\n')}\n\nPlanned Milestones:\n${bp.milestones
          .map((m) => `- ${m.phase}: ${m.title} (${m.share}% escrow) - ${m.deliverables}`)
          .join('\n')}`,
        category: bp.badge.includes('AI') ? 'AI & Machine Learning' : 'Web Development',
        skills: bp.stack.join(', '),
        budgetMin: bp.price,
        budgetMax: Math.round(bp.price * 1.25),
        duration: `${bp.deliveryDays} days`,
      },
    });
  };

  return (
    <section id="blueprints" className="scroll-mt-24 py-20 bg-[#072A20] border-b border-[#1F5A46] relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-[#38BDF8]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-[#818CF8]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-[#38BDF8]/15 via-[#818CF8]/15 to-[#C9A24B]/15 border border-[#38BDF8]/30 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#E5CB86]">
              Instant Turnkey Solutions
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-[#F6F1E4]">
            Pre-Scoped Solutions. <span className="italic text-[#E5CB86]">Milestone Escrow</span> Protected.
          </h2>
          <p className="text-xs sm:text-sm text-[#BFD0C6] mt-3 leading-relaxed">
            Unlike gig sites with unpredictable outcomes, SkillBridge Turnkey Blueprints are pre-architected packages delivered in structured, verifiable milestone phases.
          </p>
        </div>

        {/* Blueprint Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BLUEPRINTS.map((bp) => {
            const Icon = bp.icon;
            return (
              <div
                key={bp.id}
                className="group relative rounded-2xl bg-[#114A39]/90 border border-[#1F5A46] hover:border-[#38BDF8]/60 p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.35)]"
              >
                {/* Top Badge & Price */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#072A20] text-[#38BDF8] border border-[#1F5A46]">
                      {bp.badge}
                    </span>
                    <div className="text-right">
                      <span className="font-serif text-xl font-medium text-[#E5CB86]">
                        ${bp.price.toLocaleString()}
                      </span>
                      <span className="block text-[10px] text-[#9DB5A8]">Fixed milestone package</span>
                    </div>
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-center gap-3 mb-2.5">
                    <div className="w-10 h-10 rounded-xl bg-[#072A20] border border-[#1F5A46] flex items-center justify-center text-[#38BDF8] group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif text-xl font-medium text-[#F6F1E4] group-hover:text-[#E5CB86] transition-colors leading-snug">
                      {bp.title}
                    </h3>
                  </div>

                  {/* Subtitle */}
                  <p className="text-xs text-[#BFD0C6] leading-relaxed line-clamp-2 mb-4">
                    {bp.subtitle}
                  </p>

                  {/* Deliverables snippet */}
                  <div className="space-y-1.5 mb-5 p-3 rounded-xl bg-[#072A20]/60 border border-[#1F5A46]/70">
                    {bp.deliverables.slice(0, 2).map((d) => (
                      <div key={d} className="flex items-start gap-2 text-[11px] text-[#BFD0C6]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#7BC49A] shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{d}</span>
                      </div>
                    ))}
                  </div>

                  {/* Stack Chips */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {bp.stack.map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] px-2 py-0.5 rounded bg-[#072A20] text-[#BFD0C6] border border-[#1F5A46]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Bar: Timeline, Milestones, Action */}
                <div className="pt-4 border-t border-[#1F5A46] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3 text-[#9DB5A8] text-[11px]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#38BDF8]" />
                      {bp.deliveryDays}d
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#7BC49A]" />
                      {bp.milestoneCount} Milestones
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedBlueprint(bp)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C9A24B] hover:bg-[#E5CB86] text-[#072A20] font-medium text-xs transition-all shadow-sm"
                  >
                    <span>Inspect</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Blueprint Detail Modal */}
      <AnimatePresence>
        {selectedBlueprint && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBlueprint(null)}
              className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-2xl bg-[#072A20] border border-[#38BDF8]/40 rounded-2xl p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#1F5A46]">
                <div>
                  <div className="inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-[#114A39] text-[#38BDF8] border border-[#1F5A46] mb-1.5">
                    {selectedBlueprint.badge}
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#F6F1E4]">
                    {selectedBlueprint.title}
                  </h3>
                  <p className="text-xs text-[#BFD0C6] mt-1">{selectedBlueprint.subtitle}</p>
                </div>
                <button
                  onClick={() => setSelectedBlueprint(null)}
                  className="p-1.5 rounded-lg text-[#9DB5A8] hover:text-[#F6F1E4] hover:bg-[#114A39] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Price & Delivery Strip */}
              <div className="grid grid-cols-3 gap-3 my-5">
                <div className="p-3 rounded-xl bg-[#114A39]/60 border border-[#1F5A46]">
                  <span className="text-[10px] text-[#9DB5A8] uppercase tracking-wider block">Package Price</span>
                  <span className="font-serif text-xl font-medium text-[#E5CB86]">
                    ${selectedBlueprint.price.toLocaleString()}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#114A39]/60 border border-[#1F5A46]">
                  <span className="text-[10px] text-[#9DB5A8] uppercase tracking-wider block">Delivery Timeline</span>
                  <span className="font-serif text-xl font-medium text-[#F6F1E4]">
                    {selectedBlueprint.deliveryDays} Days
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#114A39]/60 border border-[#1F5A46]">
                  <span className="text-[10px] text-[#9DB5A8] uppercase tracking-wider block">Escrow Security</span>
                  <span className="font-serif text-xl font-medium text-[#7BC49A]">
                    {selectedBlueprint.milestoneCount} Phases
                  </span>
                </div>
              </div>

              {/* Milestone Escrow Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#E5CB86]">
                    Phased Milestone Delivery & Escrow Release
                  </h4>
                  <span className="text-[11px] text-[#9DB5A8]">Zero upfront risk</span>
                </div>

                <div className="space-y-2">
                  {selectedBlueprint.milestones.map((m) => (
                    <div
                      key={m.title}
                      className="p-3.5 rounded-xl bg-[#114A39]/50 border border-[#1F5A46] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-[#38BDF8] uppercase tracking-wider">
                            {m.phase}
                          </span>
                          <span className="font-medium text-[#F6F1E4]">{m.title}</span>
                        </div>
                        <p className="text-[11px] text-[#BFD0C6] mt-0.5">{m.deliverables}</p>
                      </div>
                      <span className="inline-block px-2.5 py-1 rounded bg-[#072A20] text-[#E5CB86] font-semibold text-[11px] border border-[#1F5A46] shrink-0">
                        {m.share}% (${Math.round((selectedBlueprint.price * m.share) / 100)})
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lead Specialist Match */}
              <div className="p-4 rounded-xl bg-[#114A39]/70 border border-[#1F5A46] flex items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedBlueprint.leadSpecialist.avatar}
                    alt={selectedBlueprint.leadSpecialist.name}
                    className="w-12 h-12 rounded-full object-cover border border-[#38BDF8]"
                  />
                  <div>
                    <span className="text-[10px] font-bold text-[#38BDF8] uppercase tracking-wider">
                      Vetted Lead Specialist
                    </span>
                    <div className="font-serif text-lg font-medium text-[#F6F1E4]">
                      {selectedBlueprint.leadSpecialist.name}
                    </div>
                    <div className="text-[11px] text-[#BFD0C6]">
                      {selectedBlueprint.leadSpecialist.role} • ★ {selectedBlueprint.leadSpecialist.rating}
                    </div>
                  </div>
                </div>
                <div className="hidden sm:block text-right">
                  <span className="inline-flex items-center gap-1 text-[11px] text-[#7BC49A] bg-[#072A20] px-2.5 py-1 rounded-md border border-[#1F5A46]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Identity
                  </span>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-[#1F5A46] flex flex-col sm:flex-row items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedBlueprint(null)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-medium border border-[#1F5A46] hover:bg-[#114A39] text-[#BFD0C6]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleLaunchBlueprint(selectedBlueprint);
                    setSelectedBlueprint(null);
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-[#C9A24B] hover:bg-[#E5CB86] text-[#072A20] transition-all shadow-md hover:scale-[1.02]"
                >
                  <span>Deploy Blueprint with Milestone Escrow</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
