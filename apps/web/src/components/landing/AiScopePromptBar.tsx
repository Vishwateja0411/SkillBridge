import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Bot,
  Cpu,
  Layers,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Clock,
  X,
  Zap,
  ChevronRight,
  ExternalLink,
  Code2,
} from 'lucide-react';

export interface PromptPreset {
  label: string;
  icon: string;
  category: string;
  query: string;
  title: string;
  skills: string[];
  budgetMin: number;
  budgetMax: number;
  duration: string;
  milestones: { title: string; share: number; deliverables: string }[];
  modelUsed?: string;
  groundingCitations?: {
    sourceTitle: string;
    similarity: number;
    sourceType: string;
    summary: string;
  }[];
}


export const PRESET_PROMPTS: PromptPreset[] = [
  {
    label: 'Voice AI Concierge',
    icon: '🎙️',
    category: 'AI & Machine Learning',
    query: 'Real-time conversational Voice AI bot with Twilio telephony, ElevenLabs voice cloning, and CRM logging',
    title: 'Custom Voice AI Telephony & Booking Concierge',
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
  {
    label: 'Autonomous Agent Pipeline',
    icon: '🤖',
    category: 'AI & Machine Learning',
    query: 'Autonomous customer support agent with LangChain, Pinecone vector search, and Stripe billing integration',
    title: 'Enterprise RAG & Autonomous Support Agent',
    skills: ['LangChain', 'Pinecone', 'OpenAI', 'Python', 'FastAPI'],
    budgetMin: 3200,
    budgetMax: 5000,
    duration: '3 weeks',
    milestones: [
      { title: 'Knowledge Base & Vector Ingestion', share: 30, deliverables: 'Chunking pipeline, Pinecone indexing, metadata filters' },
      { title: 'LangChain Agent Logic & Tool Calling', share: 45, deliverables: 'Multi-turn memory, fallbacks, Stripe invoice queries' },
      { title: 'Safety Guardrails & Admin Console', share: 25, deliverables: 'Prompt injection defenses, audit dashboard, escrow sign-off' },
    ],
  },
  {
    label: 'Full-Stack SaaS MVP',
    icon: '⚡',
    category: 'Web & Full-Stack Development',
    query: 'Production Next.js 15 SaaS MVP with TypeScript, Tailwind CSS, Supabase PostgreSQL, and Stripe subscriptions',
    title: 'Production Next.js 15 SaaS MVP Platform',
    skills: ['React', 'Next.js 15', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind', 'Stripe'],
    budgetMin: 3800,
    budgetMax: 6500,
    duration: '3–4 weeks',
    milestones: [
      { title: 'Architecture, Auth & DB Schema', share: 25, deliverables: 'PostgreSQL schema, Supabase RLS security policies, DB migrations' },
      { title: 'Core Product Features & Dashboard', share: 45, deliverables: 'Interactive dashboard, data CRUD, Server Actions, SSR layout' },
      { title: 'Stripe Billing & Production Deploy', share: 30, deliverables: 'Checkout sessions, webhooks, Vercel CI/CD release & audit' },
    ],
  },
  {
    label: 'Workflow Automation',
    icon: '🔄',
    category: 'Automation & Integration',
    query: 'Multi-app business automation connecting n8n, Make.com, Webhooks, HubSpot, and Slack alerts',
    title: 'Omnichannel n8n Business Workflow Suite',
    skills: ['n8n', 'Make.com', 'Webhooks', 'REST APIs', 'HubSpot', 'Slack'],
    budgetMin: 1800,
    budgetMax: 2600,
    duration: '10 days',
    milestones: [
      { title: 'Workflow Mapping & Webhook Setup', share: 40, deliverables: 'Data mapping document, API rate limit config, error traps' },
      { title: 'Multi-App Sync & E2E Validation', share: 60, deliverables: 'Production n8n flows, Slack alerts, 48hr burn-in test' },
    ],
  },
  {
    label: 'Figma Design System',
    icon: '🎨',
    category: 'UI/UX & Product Design',
    query: 'Enterprise Figma design system with variables, auto-layout tokens, dark mode, and developer handoff',
    title: 'Scalable Enterprise Design System & UI Kit',
    skills: ['Figma', 'Design Systems', 'UI/UX', 'Prototyping', 'Tokens'],
    budgetMin: 2200,
    budgetMax: 3400,
    duration: '2 weeks',
    milestones: [
      { title: 'Foundations & Design Tokens', share: 35, deliverables: 'Color palette, typography scale, spacing variables' },
      { title: 'Core Component Library & States', share: 45, deliverables: 'Buttons, modals, forms, tables, auto-layout hierarchy' },
      { title: 'Interactive Prototype & Dev Specs', share: 20, deliverables: 'Clickable user flows, zeroheight export, documentation' },
    ],
  },
];

/**
 * Intelligent Natural Language Parser: Converts conversational user inputs
 * into domain-specific, realistic project scopes with milestones and budget tiers.
 */
export const parseUserPrompt = (input: string): PromptPreset => {
  const text = input.toLowerCase().trim();

  // 1. Full Stack / Web Development / Frontend / Backend / React / Next
  if (
    text.includes('full stack') ||
    text.includes('fullstack') ||
    text.includes('full-stack') ||
    text.includes('saas') ||
    text.includes('web app') ||
    text.includes('website') ||
    text.includes('frontend') ||
    text.includes('backend') ||
    text.includes('react') ||
    text.includes('next.js') ||
    text.includes('node') ||
    text.includes('javascript') ||
    text.includes('typescript')
  ) {
    return {
      label: 'Full-Stack Web & SaaS',
      icon: '⚡',
      category: 'Web & Full-Stack Development',
      query: input,
      title: 'Full-Stack Web Application & SaaS Platform',
      skills: ['React', 'Next.js 15', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Stripe'],
      budgetMin: 3800,
      budgetMax: 6500,
      duration: '3–4 weeks',
      milestones: [
        {
          title: 'Phase 1: Architecture, DB Schema & Auth',
          share: 25,
          deliverables: 'PostgreSQL database modeling, Supabase/NextAuth security policies, responsive shell & API routing',
        },
        {
          title: 'Phase 2: Core Application Logic & Dashboard UI',
          share: 45,
          deliverables: 'Interactive dashboards, CRUD pipelines, Server Actions, state synchronization & real-time updates',
        },
        {
          title: 'Phase 3: Stripe Billing, Security & Deployment',
          share: 30,
          deliverables: 'Subscription webhooks, automated test suite, production Vercel/Docker release & escrow sign-off',
        },
      ],
    };
  }

  // 2. Voice AI & Telephony
  if (
    text.includes('voice') ||
    text.includes('speech') ||
    text.includes('twilio') ||
    text.includes('elevenlabs') ||
    text.includes('whisper') ||
    text.includes('call') ||
    text.includes('phone') ||
    text.includes('telephony')
  ) {
    return {
      label: 'Voice AI Concierge',
      icon: '🎙️',
      category: 'AI & Machine Learning',
      query: input,
      title: 'Real-Time Voice AI Telephony & Booking Concierge',
      skills: ['Twilio', 'ElevenLabs', 'Whisper', 'Python', 'FastAPI', 'WebSockets'],
      budgetMin: 2800,
      budgetMax: 4200,
      duration: '2 weeks',
      milestones: [
        { title: 'Telephony & Webhook Architecture', share: 30, deliverables: 'Twilio call flow, WebSocket duplex audio streaming' },
        { title: 'Voice Agent Core & LLM Pipeline', share: 45, deliverables: 'Whisper transcription, ElevenLabs synthesis, tool calling' },
        { title: 'CRM Sync & Final Testing', share: 25, deliverables: 'HubSpot/Salesforce logging, latency optimization under 600ms' },
      ],
    };
  }

  // 3. Autonomous Agents, RAG & LLMs
  if (
    text.includes('agent') ||
    text.includes('rag') ||
    text.includes('langchain') ||
    text.includes('vector') ||
    text.includes('pinecone') ||
    text.includes('gpt') ||
    text.includes('openai') ||
    text.includes('claude') ||
    text.includes('llm') ||
    text.includes('chatbot') ||
    text.includes('chat bot') ||
    text.includes('support')
  ) {
    return {
      label: 'Autonomous Agent Pipeline',
      icon: '🤖',
      category: 'AI & Machine Learning',
      query: input,
      title: 'Enterprise RAG & Autonomous Support Agent',
      skills: ['LangChain', 'Pinecone', 'OpenAI', 'Python', 'FastAPI', 'Vector DB'],
      budgetMin: 3200,
      budgetMax: 5000,
      duration: '3 weeks',
      milestones: [
        { title: 'Knowledge Base & Vector Ingestion', share: 30, deliverables: 'Chunking pipeline, Pinecone indexing, metadata filters' },
        { title: 'LangChain Agent Logic & Tool Calling', share: 45, deliverables: 'Multi-turn memory, fallbacks, Stripe invoice queries' },
        { title: 'Safety Guardrails & Admin Console', share: 25, deliverables: 'Prompt injection defenses, audit dashboard, escrow sign-off' },
      ],
    };
  }

  // 4. n8n & Workflow Automations
  if (
    text.includes('n8n') ||
    text.includes('make') ||
    text.includes('zapier') ||
    text.includes('automation') ||
    text.includes('automate') ||
    text.includes('crm') ||
    text.includes('workflow') ||
    text.includes('webhook')
  ) {
    return {
      label: 'Workflow Automation',
      icon: '🔄',
      category: 'Automation & Integration',
      query: input,
      title: 'Omnichannel n8n Business Workflow Suite',
      skills: ['n8n', 'Make.com', 'Webhooks', 'REST APIs', 'HubSpot', 'Slack'],
      budgetMin: 1800,
      budgetMax: 2600,
      duration: '10 days',
      milestones: [
        { title: 'Workflow Mapping & Webhook Setup', share: 40, deliverables: 'Data mapping document, API rate limit config, error traps' },
        { title: 'Multi-App Sync & E2E Validation', share: 60, deliverables: 'Production n8n flows, Slack alerts, 48hr burn-in test' },
      ],
    };
  }

  // 5. Figma & Design System
  if (
    text.includes('figma') ||
    text.includes('design') ||
    text.includes('ui') ||
    text.includes('ux') ||
    text.includes('wireframe') ||
    text.includes('prototype') ||
    text.includes('system')
  ) {
    return {
      label: 'Figma Design System',
      icon: '🎨',
      category: 'UI/UX & Product Design',
      query: input,
      title: 'Scalable Enterprise Design System & UI Kit',
      skills: ['Figma', 'Design Systems', 'UI/UX', 'Prototyping', 'Tokens'],
      budgetMin: 2200,
      budgetMax: 3400,
      duration: '2 weeks',
      milestones: [
        { title: 'Foundations & Design Tokens', share: 35, deliverables: 'Color palette, typography scale, spacing variables' },
        { title: 'Core Component Library & States', share: 45, deliverables: 'Buttons, modals, forms, tables, auto-layout hierarchy' },
        { title: 'Interactive Prototype & Dev Specs', share: 20, deliverables: 'Clickable user flows, zeroheight export, documentation' },
      ],
    };
  }

  // 6. Security & Audit
  if (
    text.includes('security') ||
    text.includes('audit') ||
    text.includes('guardrail') ||
    text.includes('soc2') ||
    text.includes('pentest') ||
    text.includes('compliance') ||
    text.includes('vulnerability')
  ) {
    return {
      label: 'AI Security & Guardrails',
      icon: '🛡️',
      category: 'Security & Compliance',
      query: input,
      title: 'AI Guardrails & Threat Defense Suite',
      skills: ['NeMo Guardrails', 'LangKit', 'Python', 'Docker', 'OWASP Top 10'],
      budgetMin: 3800,
      budgetMax: 5500,
      duration: '2–3 weeks',
      milestones: [
        { title: 'Vulnerability Audit & Threat Model', share: 30, deliverables: 'Attack surface report, red-teaming test harness' },
        { title: 'Guardrail Interceptor Deployment', share: 45, deliverables: 'NeMo/Llama-Guard middleware, automated redaction' },
        { title: 'Compliance Verification & Sign-off', share: 25, deliverables: 'Final pentest report, audit dashboard handover' },
      ],
    };
  }

  // 7. General Dynamic Fallback with Clean Title Formatting
  const cleanedTitle = input
    .replace(/^(tell me about|i need|build me a|how to build|looking for|create a|develop a|what is|find me a)\s+/i, '')
    .trim();
  const formattedTitle = cleanedTitle ? cleanedTitle.charAt(0).toUpperCase() + cleanedTitle.slice(1) : 'Custom Engineering';

  return {
    label: formattedTitle,
    icon: '✨',
    category: 'AI & Full-Stack Engineering',
    query: input,
    title: `${formattedTitle} — Custom Architecture & Delivery`,
    skills: ['System Architecture', 'TypeScript', 'REST APIs', 'Cloud Infrastructure', 'Testing'],
    budgetMin: 3200,
    budgetMax: 5400,
    duration: '3 weeks',
    milestones: [
      { title: 'Phase 1: Architecture & Technical Scope', share: 30, deliverables: 'System design, API contracts, sandbox environment' },
      { title: 'Phase 2: Core Engineering & Feature Pipeline', share: 45, deliverables: 'Main feature implementation, integration tests, milestone review' },
      { title: 'Phase 3: Production Review & Escrow Release', share: 25, deliverables: 'Deliverable verification, staging demo, client sign-off' },
    ],
  };
};

import { api } from '../../services/api';

export const AiScopePromptBar: React.FC = () => {
  const [promptText, setPromptText] = useState('');
  const [activeScope, setActiveScope] = useState<PromptPreset | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();

  const triggerAnalysis = async (fallbackScope: PromptPreset, customText?: string) => {
    setIsAnalyzing(true);
    const query = customText || fallbackScope.query;
    try {
      const liveResult = await api.ragScopeProject({ prompt: query, category: fallbackScope.category });
      if (liveResult && liveResult.success) {
        setActiveScope({
          label: liveResult.title,
          icon: '⚡',
          category: liveResult.category,
          query,
          title: liveResult.title,
          skills: liveResult.requiredSkills || fallbackScope.skills,
          budgetMin: liveResult.budgetMin || fallbackScope.budgetMin,
          budgetMax: liveResult.budgetMax || fallbackScope.budgetMax,
          duration: liveResult.suggestedDuration || fallbackScope.duration,
          milestones: liveResult.suggestedMilestones?.map((m: any) => ({
            title: m.title,
            share: m.percentage,
            deliverables: m.deliverables,
            acceptanceCriteria: m.acceptanceCriteria,
          })) || fallbackScope.milestones,
          modelUsed: liveResult.modelUsed,
          groundingCitations: liveResult.groundingCitations,
        });
        setIsModalOpen(true);
        setIsAnalyzing(false);
        return;
      }
    } catch (err) {
      console.warn('Live RAG scoping fallback:', err);
    }

    // Fast local fallback
    setActiveScope(fallbackScope);
    setIsModalOpen(true);
    setIsAnalyzing(false);
  };

  const handleSelectPreset = (preset: PromptPreset) => {
    setPromptText(preset.query);
    triggerAnalysis(preset, preset.query);
  };

  const handleAnalyzePrompt = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!promptText.trim()) return;

    const fallbackScope = parseUserPrompt(promptText);
    triggerAnalysis(fallbackScope, promptText);
  };


  const handleLaunchProject = (scope: PromptPreset) => {
    setIsModalOpen(false);
    navigate('/business/projects/new', {
      state: {
        title: scope.title,
        description: `Project Objective: ${scope.query}\n\nProposed Milestones:\n${scope.milestones
          .map((m, i) => `${i + 1}. ${m.title} (${m.share}% escrow) - ${m.deliverables}`)
          .join('\n')}`,
        category: scope.category,
        skills: scope.skills.join(', '),
        budgetMin: scope.budgetMin,
        budgetMax: scope.budgetMax,
        duration: scope.duration,
      },
    });
  };

  const handleBrowseMatches = (scope: PromptPreset) => {
    setIsModalOpen(false);
    navigate(`/find-freelancers?query=${encodeURIComponent(scope.skills[0] || 'AI')}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto relative z-20">
      {/* Botpool-inspired Ambient Gradient Border Container */}
      <div className="relative rounded-2xl md:rounded-3xl p-[1px] bg-gradient-to-r from-[#38BDF8] via-[#818CF8] to-[#C9A24B] shadow-[0_0_35px_rgba(56,189,248,0.15)]">
        <div className="bg-[#072A20]/95 backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 sm:p-5 text-left">
          {/* Header pill badge */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-[#38BDF8]/15 via-[#818CF8]/15 to-[#C9A24B]/15 border border-[#38BDF8]/30">
              <Sparkles className="w-3.5 h-3.5 text-[#38BDF8] animate-pulse" />
              <span className="text-[11px] font-semibold tracking-wide text-[#E5CB86] uppercase">
                AI Project Co-Pilot & Matching Engine
              </span>
            </div>
            <span className="text-[11px] text-[#BFD0C6] hidden sm:inline">
              Instant Scope • Milestones • Talent Ranking
            </span>
          </div>

          {/* Conversational Textarea Search */}
          <form onSubmit={handleAnalyzePrompt} className="relative">
            <div className="relative flex flex-col md:flex-row items-stretch md:items-center bg-[#114A39]/80 border border-[#1F5A46] focus-within:border-[#38BDF8] rounded-xl sm:rounded-2xl p-2 sm:p-2.5 transition-all duration-200 shadow-inner">
              <div className="flex-1 flex items-start gap-2.5 px-2 py-1">
                <Bot className="w-5 h-5 text-[#38BDF8] mt-1 shrink-0" />
                <textarea
                  rows={2}
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  placeholder="Describe your vision in plain English (e.g. 'I need an autonomous customer support agent' or 'tell me about full stack')..."
                  className="w-full bg-transparent text-xs sm:text-sm text-[#F6F1E4] placeholder:text-[#9DB5A8] focus:outline-none resize-none leading-relaxed"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAnalyzePrompt();
                    }
                  }}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-[#1F5A46]/60">
                <button
                  type="submit"
                  disabled={!promptText.trim() || isAnalyzing}
                  className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm bg-gradient-to-r from-[#38BDF8] via-[#818CF8] to-[#C9A24B] text-[#072A20] font-semibold hover:opacity-95 transition-all shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02]"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#072A20] border-t-transparent rounded-full animate-spin" />
                      <span>Synthesizing Scope...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generate Scope</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Quick Idea Chips (Botpool-inspired) */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-[#9DB5A8] mr-1">Try one-click prompt:</span>
            {PRESET_PROMPTS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-[#072A20] hover:bg-[#114A39] border border-[#1F5A46] hover:border-[#38BDF8] text-[#BFD0C6] hover:text-[#F6F1E4] transition-all hover:-translate-y-0.5"
              >
                <span>{preset.icon}</span>
                <span>{preset.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Inline Scope Status Pill (if scope was generated and modal closed) */}
      {activeScope && !isModalOpen && (
        <div className="mt-3 flex items-center justify-between p-3 rounded-xl bg-[#072A20] border border-[#38BDF8]/40 shadow-lg text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#38BDF8]" />
            <span className="text-[#BFD0C6]">Synthesized Scope Ready:</span>
            <span className="font-semibold text-[#F6F1E4]">{activeScope.title}</span>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3 py-1 rounded-lg bg-[#114A39] hover:bg-[#38BDF8] text-[#38BDF8] hover:text-[#072A20] font-medium border border-[#38BDF8]/30 transition-all"
          >
            Inspect Scope & Milestones &rarr;
          </button>
        </div>
      )}

      {/* Comprehensive, Unclipped AI Scope Co-Pilot Synthesis Modal */}
      <AnimatePresence>
        {isModalOpen && activeScope && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="relative w-full max-w-2xl bg-[#072A20] border border-[#38BDF8]/50 rounded-2xl p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto text-left"
            >
              {/* Background ambient glow */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#38BDF8]/10 rounded-full blur-3xl pointer-events-none" />

              {/* Header */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#1F5A46] relative z-10">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#38BDF8]">
                    <Sparkles className="w-4 h-4 text-[#38BDF8] animate-pulse" />
                    <span>AI Scope Co-Pilot Synthesis</span>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#F6F1E4] mt-1">
                    {activeScope.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] px-2 py-0.5 rounded bg-[#114A39] text-[#E5CB86] border border-[#1F5A46]">
                      {activeScope.category}
                    </span>
                    <span className="text-xs text-[#BFD0C6] italic">Based on: "{activeScope.query}"</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-lg text-[#9DB5A8] hover:text-[#F6F1E4] hover:bg-[#114A39] transition-colors"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Groq Model Badge */}
              {activeScope.modelUsed && (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#114A39]/80 border border-[#38BDF8]/40 text-xs my-3 relative z-10">
                  <div className="flex items-center gap-2 text-[#38BDF8]">
                    <Zap className="w-4 h-4 text-[#38BDF8]" />
                    <span>Inference: <strong>{activeScope.modelUsed}</strong></span>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">
                    Vector Grounded
                  </span>
                </div>
              )}

              {/* Grounding Citations */}
              {activeScope.groundingCitations && activeScope.groundingCitations.length > 0 && (
                <div className="p-3 rounded-xl bg-[#072A20]/90 border border-[#1F5A46] text-xs my-3 space-y-1.5 relative z-10">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#E5CB86]">
                    <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
                    <span>RAG Knowledge Retrieval ({activeScope.groundingCitations.length} historical comps):</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeScope.groundingCitations.map((cite, i) => (
                      <div key={i} className="p-2 rounded-lg bg-[#114A39]/60 border border-[#1F5A46] text-[11px]">
                        <div className="flex items-center justify-between font-medium text-[#38BDF8] mb-0.5">
                          <span className="truncate">{cite.sourceTitle}</span>
                          <span className="text-[10px] px-1.5 py-0.2 bg-[#072A20] text-[#7BC49A] rounded font-mono">
                            {Math.round(cite.similarity * 100)}% match
                          </span>
                        </div>
                        <p className="text-[#BFD0C6] line-clamp-2 text-[10px] leading-tight">{cite.summary}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Specs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4 relative z-10">
                <div className="bg-[#114A39]/70 rounded-xl p-3.5 border border-[#1F5A46]">
                  <div className="flex items-center gap-1.5 text-[11px] text-[#9DB5A8]">
                    <DollarSign className="w-3.5 h-3.5 text-[#E5CB86]" />
                    <span>Estimated Budget Band</span>
                  </div>
                  <div className="font-serif text-xl font-medium text-[#E5CB86] mt-1">
                    ${activeScope.budgetMin.toLocaleString()} – ${activeScope.budgetMax.toLocaleString()}
                  </div>
                </div>

                <div className="bg-[#114A39]/70 rounded-xl p-3.5 border border-[#1F5A46]">
                  <div className="flex items-center gap-1.5 text-[11px] text-[#9DB5A8]">
                    <Clock className="w-3.5 h-3.5 text-[#38BDF8]" />
                    <span>Target Delivery</span>
                  </div>
                  <div className="font-serif text-xl font-medium text-[#F6F1E4] mt-1">
                    {activeScope.duration}
                  </div>
                </div>

                <div className="bg-[#114A39]/70 rounded-xl p-3.5 border border-[#1F5A46]">
                  <div className="flex items-center gap-1.5 text-[11px] text-[#9DB5A8]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#7BC49A]" />
                    <span>Escrow Protection</span>
                  </div>
                  <div className="font-serif text-xl font-medium text-[#7BC49A] mt-1">
                    {activeScope.milestones.length} Funded Milestones
                  </div>
                </div>
              </div>

              {/* Recommended Escrow Milestones */}
              <div className="space-y-3 mb-6 relative z-10">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#E5CB86]">
                    Phased Milestone Escrow Breakdown
                  </h4>
                  <span className="text-[11px] text-[#7BC49A] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Funds released upon verification
                  </span>
                </div>

                <div className="space-y-2.5">
                  {activeScope.milestones.map((m, idx) => (
                    <div
                      key={m.title}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3.5 rounded-xl bg-[#114A39]/60 border border-[#1F5A46] text-xs"
                    >
                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-[#072A20] text-[#38BDF8] flex items-center justify-center font-bold text-xs shrink-0 border border-[#1F5A46]">
                          0{idx + 1}
                        </span>
                        <div>
                          <span className="font-serif text-base font-medium text-[#F6F1E4]">{m.title}</span>
                          <p className="text-[11px] text-[#BFD0C6] mt-0.5 leading-relaxed">{m.deliverables}</p>
                        </div>
                      </div>
                      <div className="text-right sm:shrink-0 pl-9 sm:pl-0">
                        <span className="inline-block px-2.5 py-1 rounded bg-[#072A20] text-[#E5CB86] font-semibold text-xs border border-[#1F5A46]">
                          {m.share}% Escrow Release
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills Tags */}
              <div className="mb-6 relative z-10">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9DB5A8] block mb-2">
                  Vetted Stack Alignment:
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {activeScope.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs px-2.5 py-1 rounded-md bg-[#114A39] text-[#38BDF8] border border-[#1F5A46]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Matched Talent Verification */}
              <div className="p-3.5 rounded-xl bg-[#114A39]/50 border border-[#1F5A46] flex items-center justify-between gap-3 mb-6 relative z-10">
                <div className="flex items-center gap-2 text-xs text-[#BFD0C6]">
                  <ShieldCheck className="w-4 h-4 text-[#7BC49A]" />
                  <span>
                    Matched with <strong>Senior Verified Freelancers</strong> based on 6-factor compatibility (94%+ match).
                  </span>
                </div>
              </div>

              {/* Action Bar */}
              <div className="pt-4 border-t border-[#1F5A46] flex flex-col sm:flex-row items-center justify-end gap-3 relative z-10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-medium border border-[#1F5A46] hover:bg-[#114A39] text-[#BFD0C6]"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => handleBrowseMatches(activeScope)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-medium border border-[#38BDF8]/50 hover:bg-[#38BDF8]/10 text-[#38BDF8] transition-all"
                >
                  Browse Matching Talent
                </button>
                <button
                  type="button"
                  onClick={() => handleLaunchProject(activeScope)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-[#C9A24B] hover:bg-[#E5CB86] text-[#072A20] transition-all shadow-md hover:scale-[1.02]"
                >
                  <span>Post Project with this AI Scope</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};


