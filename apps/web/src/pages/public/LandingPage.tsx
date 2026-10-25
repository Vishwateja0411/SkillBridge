import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ArrowRight,
  ShieldCheck,
  Star,
  CheckCircle2,
  Check,
  Briefcase,
  Layers,
  Code2,
  Palette,
  Cloud,
  Cpu,
  BarChart3,
  Lock,
  ChevronDown,
  Clock,
  Sparkles,
  Bot,
  Zap,
} from 'lucide-react';
import { api } from '../../services/api';
import { FreelancerProfile, Project } from '@skillbridge/shared';
import { DepthNodeNetwork } from '../../components/landing/DepthNodeNetwork';
import { Hero3DCardStack } from '../../components/landing/Hero3DCardStack';
import { TiltCard } from '../../components/common/TiltCard';
import { AiScopePromptBar } from '../../components/landing/AiScopePromptBar';

export const LandingPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [freelancers, setFreelancers] = useState<FreelancerProfile[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [workflowTab, setWorkflowTab] = useState<'business' | 'freelancer'>('business');
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const navigate = useNavigate();

  const trendingAiTags = [
    { label: 'Voice AI Concierge', icon: '🎙️', skill: 'Twilio' },
    { label: 'Autonomous Agents', icon: '🤖', skill: 'LangChain' },
    { label: 'Next.js 15 SaaS', icon: '⚡', skill: 'Next.js' },
    { label: 'n8n & Automations', icon: '🔄', skill: 'n8n' },
    { label: 'Vector RAG & LLMs', icon: '🧠', skill: 'Python' },
    { label: 'Design Systems', icon: '🎨', skill: 'Figma' },
    { label: 'Cloud MLOps', icon: '☁️', skill: 'AWS' },
    { label: 'AI Guardrails', icon: '🛡️', skill: 'Security' },
  ];

  useEffect(() => {
    api.getFreelancers().then((res) => {
      if (res.success) setFreelancers(res.freelancers.slice(0, 3));
    });
    api.getProjects().then((res) => {
      if (res.success) setProjects(res.projects.slice(0, 3));
    });
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/projects?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const categories = [
    { title: 'Web & Mobile Dev', icon: Code2, count: '1,420+ Projects', desc: 'React, Node.js, Next.js, TypeScript' },
    { title: 'UI/UX & Product Design', icon: Palette, count: '890+ Projects', desc: 'Figma, Design Systems, Mobile UX' },
    { title: 'DevOps & Cloud Infra', icon: Cloud, count: '650+ Projects', desc: 'AWS, Kubernetes, Terraform, Docker' },
    { title: 'AI & Machine Learning', icon: Cpu, count: '740+ Projects', desc: 'LLMs, PyTorch, Embeddings, RAG' },
    { title: 'Data Analytics & BI', icon: BarChart3, count: '510+ Projects', desc: 'Dashboards, Python, SQL, Tableau' },
    { title: 'Security & Compliance', icon: Lock, count: '320+ Projects', desc: 'Audits, SOC2, Penetration Testing' },
  ];

  const faqs = [
    {
      q: 'How does the candidate matching model work?',
      a: 'SkillBridge uses an explainable weighted scoring model evaluating 6 distinct dimensions: Skill overlap (35%), Relevant experience tier (20%), Similar portfolio projects (20%), Client review ratings (10%), Budget feasibility (10%), and Current availability (5%). Every match clearly details why a candidate is suitable.',
    },
    {
      q: 'How do milestone-based payments protect both parties?',
      a: 'Agreements are divided into structured milestones. Funds are placed into escrow prior to work commencement. Once deliverables are reviewed and approved, payments are released instantly with zero delays or chargeback surprises.',
    },
    {
      q: 'What are the platform fee structures?',
      a: 'Businesses pay 0% fees for posting projects and hiring talent. Freelancers pay a flat 5% platform fee upon successful milestone payouts, significantly lower than legacy 20% marketplaces.',
    },
    {
      q: 'Can businesses hire freelancers directly without posting a project?',
      a: 'Yes. You can browse our directory of verified professionals, evaluate ratings and case studies, and initiate a direct proposal or interview inquiry.',
    },
  ];

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter((p) => p.category.toLowerCase().includes(selectedCategory.toLowerCase()));

  return (
    <div className="bg-[#0B3D2E] text-[#F6F1E4] min-h-screen">
      {/* 1. HERO SECTION & TRUST STRIP: Unified Single Viewport View */}
      <section
        id="hero"
        className="scroll-mt-24 relative border-b border-[#1F5A46] min-h-[calc(100vh-4rem)] flex flex-col justify-between"
      >
        {/* Subtly animated depth-based node network */}
        <DepthNodeNetwork className="opacity-90" />

        {/* Subtle radial ambient highlight behind cards */}
        <div className="absolute right-0 top-1/4 w-[500px] h-[500px] bg-[#114A39]/30 rounded-full blur-3xl pointer-events-none" />

        {/* Hero Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex-1 flex items-center py-4 sm:py-6 lg:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center w-full">
            {/* Left Column: Staggered Fade-and-Rise Content */}
            <div className="lg:col-span-7 space-y-3.5 sm:space-y-4">
              {/* Eyebrow */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-[#38BDF8]/15 via-[#818CF8]/15 to-[#C9A24B]/15 border border-[#38BDF8]/30"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#E5CB86]">
                  AI-POWERED MATCHING • MILESTONE ESCROW
                </span>
              </motion.div>

              {/* Headline with serif and italic highlight */}
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="font-serif text-4xl sm:text-5xl lg:text-[48px] xl:text-[54px] font-normal text-[#F6F1E4] leading-[1.08] tracking-tight"
              >
                Hire with confidence.{' '}
                <span className="italic text-[#E5CB86] font-normal">Work</span>{' '}
                with clarity.
              </motion.h1>

              {/* Supporting Text */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="text-sm sm:text-base text-[#BFD0C6] font-normal leading-relaxed max-w-xl"
              >
                The enterprise talent marketplace for AI and engineering. Transparent 6-factor compatibility matching, conversational project scoping, and guaranteed milestone escrow safety.
              </motion.p>

              {/* CTA Buttons with Hover Light Reflections */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
                className="pt-1 flex flex-wrap items-center gap-3"
              >
                <Link
                  to="/find-freelancers"
                  className="relative overflow-hidden group px-5 py-2.5 rounded-[8px] font-medium text-xs sm:text-sm bg-[#C9A24B] hover:bg-[#E5CB86] text-[#0B3D2E] transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                >
                  <span className="relative z-10">Explore Talent</span>
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
                </Link>
                <Link
                  to="/projects"
                  className="relative overflow-hidden group px-5 py-2.5 rounded-[8px] font-medium text-xs sm:text-sm bg-transparent hover:bg-[#114A39] text-[#F6F1E4] border border-[#2B6D56] hover:border-[#C9A24B] transition-all duration-300 hover:-translate-y-0.5"
                >
                  <span className="relative z-10">Find Projects</span>
                </Link>
                <a
                  href="#how-it-works"
                  className="relative overflow-hidden group px-4 py-2.5 rounded-[8px] font-medium text-xs sm:text-sm text-[#BFD0C6] hover:text-[#E5CB86] transition-colors"
                >
                  <span>How It Works &rarr;</span>
                </a>
              </motion.div>

              {/* Conversational AI Scope Prompt Bar (Botpool-inspired) */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="pt-2 w-full"
              >
                <AiScopePromptBar />
              </motion.div>
            </div>

            {/* Right Column: 3D Tilt Card Composition */}
            <div className="lg:col-span-5 relative">
              <Hero3DCardStack />
            </div>
          </div>
        </div>

        {/* 2. DOCKED TRUST STRIP (Integrated into Hero Viewport) */}
        <div id="trust-strip" className="scroll-mt-24 w-full border-t border-[#1F5A46] bg-[#072A20]/60 backdrop-blur-sm relative z-10 py-3.5 sm:py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 divide-y-0 sm:divide-x divide-[#1F5A46] gap-y-3 sm:gap-y-0">
              <div className="px-2 sm:px-4 lg:px-6 first:pl-0">
                <h4 className="font-serif text-base sm:text-lg font-medium text-[#E5CB86] leading-snug">Verified talent</h4>
                <p className="text-[11px] text-[#BFD0C6] mt-0.5 leading-normal">Identity and skills checked</p>
              </div>
              <div className="px-2 sm:px-4 lg:px-6">
                <h4 className="font-serif text-base sm:text-lg font-medium text-[#E5CB86] leading-snug">Weighted matching</h4>
                <p className="text-[11px] text-[#BFD0C6] mt-0.5 leading-normal">Skills & track record scored</p>
              </div>
              <div className="px-2 sm:px-4 lg:px-6">
                <h4 className="font-serif text-base sm:text-lg font-medium text-[#E5CB86] leading-snug">Milestone safe</h4>
                <p className="text-[11px] text-[#BFD0C6] mt-0.5 leading-normal">Pay as work is approved</p>
              </div>
              <div className="px-2 sm:px-4 lg:px-6 last:pr-0">
                <h4 className="font-serif text-base sm:text-lg font-medium text-[#E5CB86] leading-snug">Transparent fee</h4>
                <p className="text-[11px] text-[#BFD0C6] mt-0.5 leading-normal">Shown before you commit</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRENDING AI CAPABILITY STRIP (Botpool-inspired) */}
      <section className="bg-[#072A20] border-b border-[#1F5A46] py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-[#BFD0C6] shrink-0">
            <span className="flex h-2 w-2 rounded-full bg-[#38BDF8] animate-ping" />
            <span className="font-semibold text-[#E5CB86] uppercase tracking-wider text-[11px]">Trending AI Capabilities:</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto w-full no-scrollbar py-1">
            {trendingAiTags.map((tag) => (
              <button
                key={tag.label}
                onClick={() => navigate(`/find-freelancers?query=${encodeURIComponent(tag.skill)}`)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] bg-[#114A39] hover:bg-[#114A39]/80 border border-[#1F5A46] hover:border-[#38BDF8] text-[#F6F1E4] whitespace-nowrap transition-all hover:-translate-y-0.5 shadow-sm"
              >
                <span>{tag.icon}</span>
                <span>{tag.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FREELANCER DISCOVERY (Ivory Section) */}
      <section id="freelancers" className="scroll-mt-24 bg-[#F6F1E4] text-[#0B3D2E] py-20 border-b border-[#E5DFD0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-end justify-between mb-12"
          >
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C9A24B]">
                CURATED DIRECTORY
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-[#0B3D2E] mt-1">
                Meet the <span className="italic text-[#A37F33]">People</span> Behind Great Work.
              </h2>
            </div>
            <Link
              to="/find-freelancers"
              className="text-xs font-medium text-[#0B3D2E] hover:text-[#C9A24B] transition-colors flex items-center gap-1.5 mt-3 md:mt-0 underline"
            >
              <span>Explore all talent</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {freelancers.map((f) => (
              <TiltCard key={f.id} maxTilt={4} className="h-full">
                <div className="bg-white rounded-[12px] border border-[#E5DFD0] p-6 shadow-sm hover:shadow-md hover:border-[#C9A24B] transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={f.user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${f.user?.name}`}
                          alt={f.user?.name}
                          className="w-13 h-13 rounded-full object-cover border border-[#E5DFD0]"
                        />
                        <div>
                          <div className="flex items-center gap-1.5 font-serif text-lg font-medium text-[#0B3D2E]">
                            <span>{f.user?.name}</span>
                            {f.verificationStatus === 'verified' && (
                              <span title="Verified Professional">
                                <ShieldCheck className="w-4 h-4 text-[#C9A24B]" />
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-[#4F6B5E]">{f.location || 'Remote'}</div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-serif text-lg font-medium text-[#0B3D2E]">${f.hourlyRate}/hr</div>
                        <div className="flex items-center gap-1 text-xs text-[#C9A24B] font-medium justify-end">
                          <Star className="w-3 h-3 fill-[#C9A24B] text-[#C9A24B]" />
                          <span>{f.rating}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs font-semibold text-[#0B3D2E] line-clamp-1 mb-1.5">{f.headline}</p>
                    <p className="text-xs text-[#4F6B5E] line-clamp-2 mb-4 leading-relaxed">{f.bio}</p>

                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {f.skills.slice(0, 3).map((s) => (
                        <span
                          key={s.name}
                          className="text-[11px] font-medium bg-[#FAF7F0] text-[#0B3D2E] px-2.5 py-0.5 rounded-[4px] border border-[#E5DFD0]"
                        >
                          {s.name}
                        </span>
                      ))}
                      {f.skills.length > 3 && (
                        <span className="text-[11px] text-[#4F6B5E] px-1.5 py-0.5">
                          +{f.skills.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#E5DFD0] flex items-center justify-between">
                    <span className="text-xs text-[#4F6B5E]">
                      {f.completedProjectsCount} completed
                    </span>
                    <Link
                      to={`/freelancers/${f.id}`}
                      className="relative overflow-hidden group px-4 py-2 rounded-[6px] bg-[#0B3D2E] hover:bg-[#114A39] text-[#F6F1E4] text-xs font-medium transition-all duration-300 hover:shadow-sm"
                    >
                      <span className="relative z-10">View profile</span>
                      <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />
                    </Link>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* 4. PROJECT DISCOVERY (Emerald Section) */}
      <section id="projects" className="scroll-mt-24 bg-[#0B3D2E] text-[#F6F1E4] py-20 border-b border-[#1F5A46]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-end justify-between mb-10"
          >
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C9A24B]">
                ACTIVE OPPORTUNITIES
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-[#F6F1E4] mt-1">
                Find <span className="italic text-[#E5CB86]">Projects</span> Worth Building.
              </h2>
            </div>
            <Link
              to="/projects"
              className="text-xs font-medium text-[#BFD0C6] hover:text-[#E5CB86] transition-colors flex items-center gap-1.5 mt-3 md:mt-0 underline"
            >
              <span>Explore all projects</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 mb-8">
            {['All', 'Web', 'Design', 'AI', 'Cloud'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3.5 py-1.5 rounded-[6px] transition-all border hover:-translate-y-0.5 ${
                  selectedCategory === cat
                    ? 'bg-[#C9A24B] text-[#0B3D2E] border-[#C9A24B] font-medium shadow-sm'
                    : 'bg-[#114A39] text-[#BFD0C6] border-[#1F5A46] hover:text-[#F6F1E4] hover:bg-[#114A39]/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredProjects.map((p) => (
              <TiltCard key={p.id} maxTilt={4} className="h-full">
                <div className="bg-[#114A39] border border-[#1F5A46] rounded-[12px] p-6 hover:border-[#C9A24B] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between shadow-sm h-full">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#C9A24B]">
                        {p.category}
                      </span>
                      <span className="font-serif text-base font-medium text-[#E5CB86]">
                        ${p.budgetMin.toLocaleString()} - ${p.budgetMax.toLocaleString()}
                      </span>
                    </div>

                    <h3 className="font-serif text-xl font-medium text-[#F6F1E4] line-clamp-1 mb-2">
                      {p.title}
                    </h3>
                    <p className="text-xs text-[#BFD0C6] line-clamp-3 mb-4 leading-relaxed">
                      {p.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {p.requiredSkills.map((s) => (
                        <span
                          key={s}
                          className="text-[11px] bg-[#072A20] text-[#BFD0C6] border border-[#1F5A46] px-2.5 py-0.5 rounded-[4px]"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#1F5A46] flex items-center justify-between text-xs">
                    <span className="text-[#9DB5A8]">
                      {p.proposalsCount} proposals
                    </span>
                    <Link
                      to={`/projects/${p.id}`}
                      className="relative overflow-hidden group px-4 py-2 rounded-[6px] bg-[#C9A24B] hover:bg-[#E5CB86] text-[#0B3D2E] font-medium transition-all duration-300 shadow-sm"
                    >
                      <span className="relative z-10">View project</span>
                      <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-600 ease-out bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
                    </Link>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS SECTION (Ivory Section) */}
      <section id="how-it-works" className="scroll-mt-24 bg-[#F6F1E4] text-[#0B3D2E] py-20 border-b border-[#E5DFD0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C9A24B] mb-2">
              DISCIPLINED PROCESS
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-[#0B3D2E]">
              A Clear Path from <span className="italic text-[#A37F33]">Vision</span> to Delivery.
            </h2>

            {/* Workflow Toggle Tabs */}
            <div className="mt-6 inline-flex p-1 rounded-[6px] bg-[#EAE4D5] border border-[#DDD5C3]">
              <button
                onClick={() => setWorkflowTab('business')}
                className={`px-4 py-1.5 text-xs rounded-[4px] transition-colors ${
                  workflowTab === 'business'
                    ? 'bg-[#0B3D2E] text-[#F6F1E4] font-medium'
                    : 'text-[#0B3D2E] hover:text-[#C9A24B]'
                }`}
              >
                For Businesses
              </button>
              <button
                onClick={() => setWorkflowTab('freelancer')}
                className={`px-4 py-1.5 text-xs rounded-[4px] transition-colors ${
                  workflowTab === 'freelancer'
                    ? 'bg-[#0B3D2E] text-[#F6F1E4] font-medium'
                    : 'text-[#0B3D2E] hover:text-[#C9A24B]'
                }`}
              >
                For Professionals
              </button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Subtle connecting line across steps */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
              className="hidden md:block absolute top-12 left-12 right-12 h-[1px] bg-gradient-to-r from-transparent via-[#C9A24B]/30 to-transparent pointer-events-none origin-left"
            />

            <div className="bg-white p-8 rounded-[12px] border border-[#E5DFD0] space-y-4 shadow-sm hover:shadow-md transition-all">
              <motion.div
                initial={{ opacity: 0, rotateY: -35 }}
                whileInView={{ opacity: 1, rotateY: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                style={{ perspective: 600, transformStyle: 'preserve-3d' }}
                className="font-serif text-4xl text-[#C9A24B] font-medium origin-left"
              >
                01
              </motion.div>
              <h3 className="font-serif text-xl font-medium text-[#0B3D2E]">
                {workflowTab === 'business' ? 'Post requirements' : 'Discover opportunities'}
              </h3>
              <p className="text-xs text-[#4F6B5E] leading-relaxed">
                {workflowTab === 'business'
                  ? 'Define scope, budget, and milestones. Our weighted system matches verified professionals whose demonstrated portfolios align directly.'
                  : 'Search active milestone projects matching your verified skill stack. Review terms and budget before proposing.'}
              </p>
            </div>

            <div className="bg-white p-8 rounded-[12px] border border-[#E5DFD0] space-y-4 shadow-sm hover:shadow-md transition-all">
              <motion.div
                initial={{ opacity: 0, rotateY: -35 }}
                whileInView={{ opacity: 1, rotateY: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                style={{ perspective: 600, transformStyle: 'preserve-3d' }}
                className="font-serif text-4xl text-[#C9A24B] font-medium origin-left"
              >
                02
              </motion.div>
              <h3 className="font-serif text-xl font-medium text-[#0B3D2E]">
                {workflowTab === 'business' ? 'Review & connect' : 'Submit & interview'}
              </h3>
              <p className="text-xs text-[#4F6B5E] leading-relaxed">
                {workflowTab === 'business'
                  ? 'Inspect transparent candidate match breakdowns, portfolio artifacts, and client reviews. Conduct structured discussions without friction.'
                  : 'Propose milestone plans, timeline estimates, and deliverables with clear accountability.'}
              </p>
            </div>

            <div className="bg-white p-8 rounded-[12px] border border-[#E5DFD0] space-y-4 shadow-sm hover:shadow-md transition-all">
              <motion.div
                initial={{ opacity: 0, rotateY: -35 }}
                whileInView={{ opacity: 1, rotateY: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                style={{ perspective: 600, transformStyle: 'preserve-3d' }}
                className="font-serif text-4xl text-[#C9A24B] font-medium origin-left"
              >
                03
              </motion.div>
              <h3 className="font-serif text-xl font-medium text-[#0B3D2E]">Collaborate & deliver</h3>
              <p className="text-xs text-[#4F6B5E] leading-relaxed">
                {workflowTab === 'business'
                  ? 'Work in a shared milestone contract workspace. Escrow funds are secured, deliverables are approved, and reviews are exchanged.'
                  : 'Submit deliverables milestone-by-milestone, receive prompt payouts upon client sign-off, and earn verified reputation.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. MATCHING FEATURE SECTION (Deep Emerald Section) */}
      <section id="matching" className="scroll-mt-24 bg-[#072A20] text-[#F6F1E4] py-20 border-b border-[#1F5A46]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-14"
          >
            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C9A24B] mb-2">
              TRANSPARENT MATCHING
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-[#F6F1E4]">
              Less Searching. <span className="italic text-[#E5CB86]">Better</span> Connections.
            </h2>
            <p className="text-xs text-[#BFD0C6] mt-3">
              Documented 6-factor compatibility scoring. Labelled as demo rule-based matching.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.7 }}
            className="bg-[#114A39] border border-[#1F5A46] rounded-[12px] p-6 sm:p-10 max-w-4xl mx-auto space-y-8 shadow-xl"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1F5A46]">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#9DB5A8]">
                  Candidate Recommendation
                </span>
                <h3 className="font-serif text-2xl font-medium text-[#F6F1E4] mt-0.5">
                  Sarah Jenkins &rarr; Fintech Trading Interface
                </h3>
              </div>
              <div className="text-left sm:text-right">
                <span className="font-serif text-3xl font-medium text-[#E5CB86]">94%</span>
                <span className="block text-[10px] text-[#9DB5A8]">Demo, rule-based</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="bg-[#072A20] p-4 rounded-[8px] border border-[#1F5A46] hover:border-[#C9A24B]/50 hover:-translate-y-0.5 transition-all space-y-1">
                <span className="text-[10px] text-[#9DB5A8] uppercase tracking-wider block">Skills Overlap (35%)</span>
                <span className="font-serif text-lg text-[#F6F1E4]">100% Match</span>
                <p className="text-[11px] text-[#BFD0C6]">React, TypeScript, Tailwind, WebSockets</p>
              </div>

              <div className="bg-[#072A20] p-4 rounded-[8px] border border-[#1F5A46] hover:border-[#C9A24B]/50 hover:-translate-y-0.5 transition-all space-y-1">
                <span className="text-[10px] text-[#9DB5A8] uppercase tracking-wider block">Experience Tier (20%)</span>
                <span className="font-serif text-lg text-[#F6F1E4]">Senior Tier</span>
                <p className="text-[11px] text-[#BFD0C6]">6+ years building trading & data tools</p>
              </div>

              <div className="bg-[#072A20] p-4 rounded-[8px] border border-[#1F5A46] hover:border-[#C9A24B]/50 hover:-translate-y-0.5 transition-all space-y-1">
                <span className="text-[10px] text-[#9DB5A8] uppercase tracking-wider block">Portfolio (20%)</span>
                <span className="font-serif text-lg text-[#F6F1E4]">High Relevance</span>
                <p className="text-[11px] text-[#BFD0C6]">Crypto exchange UI & live charts</p>
              </div>

              <div className="bg-[#072A20] p-4 rounded-[8px] border border-[#1F5A46] hover:border-[#C9A24B]/50 hover:-translate-y-0.5 transition-all space-y-1">
                <span className="text-[10px] text-[#9DB5A8] uppercase tracking-wider block">Availability (10%)</span>
                <span className="font-serif text-lg text-[#7BC49A]">Immediate</span>
                <p className="text-[11px] text-[#BFD0C6]">Full-time 40h/week dedicated</p>
              </div>

              <div className="bg-[#072A20] p-4 rounded-[8px] border border-[#1F5A46] hover:border-[#C9A24B]/50 hover:-translate-y-0.5 transition-all space-y-1">
                <span className="text-[10px] text-[#9DB5A8] uppercase tracking-wider block">Budget Fit (10%)</span>
                <span className="font-serif text-lg text-[#F6F1E4]">Target Aligned</span>
                <p className="text-[11px] text-[#BFD0C6]">$95/hr matches proposed project band</p>
              </div>

              <div className="bg-[#072A20] p-4 rounded-[8px] border border-[#1F5A46] hover:border-[#C9A24B]/50 hover:-translate-y-0.5 transition-all space-y-1">
                <span className="text-[10px] text-[#9DB5A8] uppercase tracking-wider block">Ratings Record (5%)</span>
                <span className="font-serif text-lg text-[#E5CB86]">5.0 / 5.0</span>
                <p className="text-[11px] text-[#BFD0C6]">14 verified milestone completions</p>
              </div>
            </div>

            <div className="p-4 rounded-[8px] bg-[#072A20]/60 border border-[#1F5A46] text-xs text-[#BFD0C6] flex items-center justify-between">
              <span>Why recommended: Full skill coverage, demonstrated fintech portfolio, immediate capacity.</span>
              <span className="text-[#C9A24B] font-medium text-[11px]">Rule-based Engine</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 7. POPULAR DISCIPLINES */}
      <section id="disciplines" className="scroll-mt-24 bg-[#0B3D2E] text-[#F6F1E4] py-20 border-b border-[#1F5A46]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-xl mx-auto mb-12"
          >
            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C9A24B] mb-1">
              EXPERTISE
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#F6F1E4]">
              Browse Disciplines
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((c) => {
              const Icon = c.icon;
              return (
                <div
                  key={c.title}
                  onClick={() => navigate(`/projects?category=${encodeURIComponent(c.title)}`)}
                  className="bg-[#114A39] p-6 rounded-[12px] border border-[#1F5A46] hover:border-[#C9A24B] hover:-translate-y-1 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-[6px] bg-[#072A20] text-[#C9A24B] border border-[#1F5A46] flex items-center justify-center mb-4 transition-transform group-hover:scale-105">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-xl font-medium text-[#F6F1E4] group-hover:text-[#E5CB86] transition-colors">
                    {c.title}
                  </h3>
                  <p className="text-xs text-[#BFD0C6] mt-1">{c.desc}</p>
                  <div className="mt-4 pt-3 border-t border-[#1F5A46] flex items-center justify-between text-xs text-[#9DB5A8]">
                    <span>{c.count}</span>
                    <span className="text-[#C9A24B] font-medium group-hover:translate-x-1 transition-transform">Explore &rarr;</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. FAQS */}
      <section id="faqs" className="scroll-mt-24 bg-[#0B3D2E] text-[#F6F1E4] py-20 border-b border-[#1F5A46]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C9A24B] mb-1">
              QUESTIONS
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#F6F1E4]">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((f, idx) => {
              const isOpen = faqOpen === idx;
              return (
                <div
                  key={f.q}
                  className="bg-[#114A39] rounded-[8px] border border-[#1F5A46] overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setFaqOpen(isOpen ? null : idx)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-serif text-lg font-medium text-[#F6F1E4] hover:text-[#E5CB86] transition-colors"
                  >
                    <span>{f.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#9DB5A8] transition-transform ${
                        isOpen ? 'rotate-180 text-[#C9A24B]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 text-xs text-[#BFD0C6] leading-relaxed border-t border-[#1F5A46] pt-3">
                      {f.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. FINAL CALL TO ACTION */}
      <section id="get-started" className="scroll-mt-24 bg-[#0B3D2E] text-[#F6F1E4] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
            className="bg-[#114A39] border border-[#2B6D56] rounded-[12px] p-10 sm:p-16 text-center text-[#F6F1E4] shadow-xl relative overflow-hidden"
          >
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C9A24B]">
                HERITAGE STANDARD
              </div>
              <h2 className="font-serif text-3xl sm:text-5xl font-medium leading-tight text-[#F6F1E4]">
                Ready to work with <span className="italic text-[#E5CB86]">absolute</span> clarity?
              </h2>
              <p className="text-xs sm:text-sm text-[#BFD0C6] leading-relaxed">
                Join verified businesses and dedicated professionals collaborating through structured milestone escrow on SkillBridge.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <Link
                  to="/register"
                  className="relative overflow-hidden group w-full sm:w-auto px-7 py-3 rounded-[6px] font-semibold text-sm bg-[#C9A24B] hover:bg-[#E5CB86] text-[#0B3D2E] transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                >
                  <span className="relative z-10">Get started</span>
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
                </Link>
                <Link
                  to="/find-freelancers"
                  className="relative overflow-hidden group w-full sm:w-auto px-7 py-3 rounded-[6px] font-medium text-sm border border-[#2B6D56] hover:border-[#C9A24B] text-[#F6F1E4] hover:bg-[#072A20] transition-all duration-300 hover:-translate-y-0.5"
                >
                  <span className="relative z-10">Explore talent</span>
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
