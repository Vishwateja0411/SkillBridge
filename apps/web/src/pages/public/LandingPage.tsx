import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ArrowRight,
  ShieldCheck,
  Star,
  Sparkles,
  CheckCircle2,
  Users,
  Briefcase,
  Layers,
  Code2,
  Palette,
  Cloud,
  Cpu,
  BarChart3,
  Lock,
  ChevronDown,
} from 'lucide-react';
import { api } from '../../services/api';
import { FreelancerProfile, Project } from '@skillbridge/shared';

export const LandingPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [freelancers, setFreelancers] = useState<FreelancerProfile[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Load initial featured items
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
      q: 'How does the AI matching system calculate candidate compatibility?',
      a: 'SkillBridge uses an explainable weighted scoring formula evaluating 6 distinct dimensions: Skill overlap (35%), Relevant experience level (20%), Similar portfolio projects (20%), Client review ratings (10%), Budget feasibility (10%), and Current availability (5%). Every score includes a transparent breakdown so you know exactly why someone is recommended.',
    },
    {
      q: 'How do milestone-based payments and escrow work?',
      a: 'When an agreement is reached, projects are divided into structured milestones. Funds are earmarked for each active milestone. Once the freelancer submits deliverables and the client reviews and approves them, the payment is securely released.',
    },
    {
      q: 'Can businesses search and hire freelancers directly without posting a project?',
      a: 'Yes! Businesses can browse our verified talent directory, filter by skill, rating, and hourly rate, review public portfolios, and initiate a direct interview or offer.',
    },
    {
      q: 'What are the platform fees?',
      a: 'Businesses pay 0% platform fees for posting and hiring. Freelancers pay a flat, transparent 5% platform fee upon successful milestone payouts, significantly lower than legacy 20% marketplaces.',
    },
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden bg-gradient-to-b from-indigo-50/50 via-white to-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Announcement pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-brand-indigo text-xs font-semibold mb-8 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-brand-indigo" />
            <span>AI-Assisted Matching & Transparent Milestone Workspaces</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-brand-navy tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none">
            Great Work Starts with the <span className="text-brand-indigo">Right Connection.</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Discover skilled independent professionals, find meaningful projects, and manage collaboration from the first conversation to final delivery.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/find-freelancers"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm bg-brand-navy hover:bg-slate-800 text-white shadow-lg shadow-slate-900/10 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            >
              <Users className="w-4 h-4 text-brand-teal" />
              <span>Find Talent</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
            <Link
              to="/projects"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm bg-brand-indigo hover:bg-brand-indigo-dark text-white shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            >
              <Briefcase className="w-4 h-4 text-white" />
              <span>Find Work</span>
            </Link>
          </div>

          {/* Live Search Component */}
          <form onSubmit={handleSearch} className="mt-12 max-w-2xl mx-auto">
            <div className="bg-white p-2 rounded-2xl shadow-xl border border-slate-200 flex items-center gap-3">
              <div className="pl-3 text-slate-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by skill (e.g. React, UI/UX, Kubernetes) or project title..."
                className="w-full bg-transparent text-sm text-slate-800 focus:outline-none placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-brand-navy text-white text-xs font-semibold hover:bg-slate-800 transition-colors flex-shrink-0"
              >
                Search
              </button>
            </div>
            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-500">
              <span className="font-medium">Popular:</span>
              {['React', 'Figma', 'TypeScript', 'Node.js', 'AWS'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    setSearchQuery(tag);
                    navigate(`/projects?skill=${tag}`);
                  }}
                  className="hover:text-brand-indigo underline cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </form>

          {/* Trust badges */}
          <div className="mt-14 pt-8 border-t border-slate-200/60 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-brand-navy">100%</div>
              <div className="text-xs text-slate-500 mt-1">Verified Identity & Skills</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-brand-navy">35% / 20%</div>
              <div className="text-xs text-slate-500 mt-1">Weighted AI Match Model</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-brand-navy">Milestone-Safe</div>
              <div className="text-xs text-slate-500 mt-1">Protected Deliverables</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-brand-navy">5% Fee</div>
              <div className="text-xs text-slate-500 mt-1">Fair & Transparent Rates</div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold text-brand-indigo uppercase tracking-wider">Specialized Disciplines</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-navy mt-1">Browse Popular Categories</h2>
          </div>
          <Link to="/projects" className="text-sm font-semibold text-brand-indigo hover:underline flex items-center gap-1 mt-2 md:mt-0">
            <span>Explore all categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.title}
                onClick={() => navigate(`/projects?category=${encodeURIComponent(c.title)}`)}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-brand-indigo group-hover:bg-brand-indigo group-hover:text-white transition-colors flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-slate-900 group-hover:text-brand-indigo transition-colors">{c.title}</h3>
                <p className="text-xs text-slate-500 mt-1">{c.desc}</p>
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">{c.count}</span>
                  <span className="text-brand-indigo font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Explore &rarr;
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Freelancers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold text-brand-teal uppercase tracking-wider">Top Tier Talent</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-navy mt-1">Featured Freelancers</h2>
          </div>
          <Link to="/find-freelancers" className="text-sm font-semibold text-brand-indigo hover:underline flex items-center gap-1 mt-2 md:mt-0">
            <span>View all talent</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {freelancers.map((f) => (
            <div
              key={f.id}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={f.user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${f.user?.name}`}
                      alt={f.user?.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-indigo-100"
                    />
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-slate-900">
                        <span>{f.user?.name}</span>
                        {f.verificationStatus === 'verified' && (
                          <span title="Verified Professional">
                            <ShieldCheck className="w-4 h-4 text-brand-teal" />
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500">{f.location}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-extrabold text-brand-navy">${f.hourlyRate}/hr</div>
                    <div className="flex items-center gap-1 text-xs text-amber-500 font-semibold justify-end">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{f.rating} ({f.reviewCount})</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs font-medium text-brand-indigo line-clamp-1 mb-2">{f.headline}</p>
                <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">{f.bio}</p>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {f.skills.slice(0, 4).map((s) => (
                    <span
                      key={s.name}
                      className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md"
                    >
                      {s.name}
                    </span>
                  ))}
                  {f.skills.length > 4 && (
                    <span className="text-[11px] font-medium bg-slate-50 text-slate-400 px-2 py-1 rounded-md">
                      +{f.skills.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400">{f.completedProjectsCount} completed projects</span>
                <Link
                  to={`/freelancers/${f.id}`}
                  className="px-4 py-2 rounded-xl bg-indigo-50 hover:bg-brand-indigo hover:text-white text-brand-indigo font-semibold text-xs transition-colors"
                >
                  View Profile
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Projects */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold text-brand-indigo uppercase tracking-wider">Active Opportunities</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-navy mt-1">Featured Projects</h2>
          </div>
          <Link to="/projects" className="text-sm font-semibold text-brand-indigo hover:underline flex items-center gap-1 mt-2 md:mt-0">
            <span>Explore all projects</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((p) => (
            <div
              key={p.id}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-50 text-brand-indigo border border-indigo-100">
                    {p.category}
                  </span>
                  <span className="text-xs font-bold text-brand-navy">
                    ${p.budgetMin.toLocaleString()} - ${p.budgetMax.toLocaleString()}
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900 line-clamp-2 mb-2">{p.title}</h3>
                <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">{p.description}</p>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {p.requiredSkills.map((s) => (
                    <span
                      key={s}
                      className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">{p.proposalsCount} proposals submitted</span>
                <Link
                  to={`/projects/${p.id}`}
                  className="px-4 py-2 rounded-xl bg-brand-navy hover:bg-slate-800 text-white font-semibold text-xs transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How SkillBridge Works */}
      <section className="bg-brand-navy text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-brand-teal uppercase tracking-wider">End-to-End Workflow</span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mt-2">How SkillBridge Works</h2>
            <p className="text-slate-300 text-sm mt-4">
              From post to payout: transparent matching, milestone escrow protection, and collaborative workspaces.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="bg-slate-800/60 p-8 rounded-2xl border border-slate-700 relative">
              <div className="w-12 h-12 rounded-xl bg-brand-indigo flex items-center justify-center font-bold text-xl text-white mb-6">
                1
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Post & AI Matching</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Businesses specify project requirements. Our 6-factor algorithm scores and ranks candidate profiles with transparent explanations.
              </p>
            </div>

            <div className="bg-slate-800/60 p-8 rounded-2xl border border-slate-700 relative">
              <div className="w-12 h-12 rounded-xl bg-brand-teal flex items-center justify-center font-bold text-xl text-white mb-6">
                2
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Milestone Workspaces</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Accepted proposals generate a structured contract workspace. Freelancers submit deliverables, clients request revisions or approve work.
              </p>
            </div>

            <div className="bg-slate-800/60 p-8 rounded-2xl border border-slate-700 relative">
              <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center font-bold text-xl text-white mb-6">
                3
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Escrow & Mutual Reviews</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Payments are securely released upon milestone approval. Both parties leave mutual verified ratings that build long-term reputation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-brand-indigo uppercase tracking-wider">Got Questions?</span>
          <h2 className="text-3xl font-bold text-brand-navy mt-1">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((f, idx) => {
            const isOpen = faqOpen === idx;
            return (
              <div
                key={f.q}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => setFaqOpen(isOpen ? null : idx)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 font-semibold text-slate-900 text-sm hover:bg-slate-50 transition-colors"
                >
                  <span>{f.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {f.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-navy via-slate-900 to-brand-indigo rounded-3xl p-10 sm:p-16 text-center text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Ready to build something extraordinary?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Join thousands of businesses and high-impact freelancers collaborating with precision, transparency, and trust on SkillBridge.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm bg-brand-teal hover:bg-teal-400 text-slate-900 shadow-lg shadow-teal-500/20 transition-all hover:scale-105"
              >
                Get Started Free
              </Link>
              <Link
                to="/find-freelancers"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors"
              >
                Browse Talent
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
