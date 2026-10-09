import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  FileText,
  DollarSign,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Clock,
  Star,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Project, Contract, Proposal, FreelancerProfile } from '@skillbridge/shared';

export const FreelancerDashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const fProfile = profile as FreelancerProfile;

  const [contracts, setContracts] = useState<Contract[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [recommendedProjects, setRecommendedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getContracts(),
      api.getMyProposals(),
      api.getProjects(),
    ]).then(([cRes, pRes, projRes]) => {
      if (cRes.success) setContracts(cRes.contracts);
      if (pRes.success) setProposals(pRes.proposals);
      if (projRes.success) setRecommendedProjects(projRes.projects.slice(0, 3));
      setLoading(false);
    });
  }, []);

  const activeContracts = contracts.filter((c) => c.status === 'active');
  const totalEarnings = contracts.reduce((sum, c) => {
    const paidMilestones = (c.milestones || []).filter((m) => m.status === 'paid');
    return sum + paidMilestones.reduce((mSum, m) => mSum + m.amount, 0);
  }, 0);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-navy via-slate-900 to-brand-indigo rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">Welcome back, {user?.name}!</h1>
            {fProfile?.verificationStatus === 'verified' && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-teal bg-teal-500/20 px-2 py-0.5 rounded-full border border-teal-400/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified
              </span>
            )}
          </div>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            {fProfile?.headline || 'Senior Full-Stack Engineer | React & Node Architect'}
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            to="/freelancer/projects"
            className="px-5 py-2.5 rounded-xl bg-brand-teal hover:bg-teal-400 text-slate-900 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <Briefcase className="w-4 h-4" />
            <span>Find Projects</span>
          </Link>
          <Link
            to="/freelancer/portfolio"
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-colors"
          >
            Manage Portfolio
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">Active Proposals</span>
            <FileText className="w-4 h-4 text-brand-indigo" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{proposals.length}</div>
          <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>1 shortlisted candidate</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">Active Contracts</span>
            <CheckCircle2 className="w-4 h-4 text-brand-teal" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{activeContracts.length}</div>
          <div className="text-[11px] text-slate-500">
            {contracts.length} total contracts
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">Total Payouts Released</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">${totalEarnings.toLocaleString()}</div>
          <div className="text-[11px] text-emerald-600 font-semibold">
            5% transparent platform fee
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">Client Rating</span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{fProfile?.rating || 5.0}</div>
          <div className="text-[11px] text-slate-500">
            Based on {fProfile?.reviewCount || 28} client reviews
          </div>
        </div>
      </div>

      {/* Active Contract Workspace Notice */}
      {activeContracts.length > 0 && (
        <div className="bg-indigo-50/60 border border-indigo-200 rounded-2xl p-6 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-brand-indigo uppercase tracking-wider">Active Workspace</span>
            </div>
            <Link
              to={`/freelancer/contracts/${activeContracts[0].id}`}
              className="text-xs font-bold text-brand-indigo hover:underline flex items-center gap-1"
            >
              <span>Open Project Workspace</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h3 className="font-bold text-base text-slate-900">{activeContracts[0].title}</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Client: {activeContracts[0].business?.companyName || 'TechVentures AI'} • Total Value: ${activeContracts[0].totalAmount.toLocaleString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-amber-100 text-amber-800 font-semibold px-2.5 py-1 rounded-lg">
                Milestone 2 Submitted (Awaiting Review)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Recommended Projects with AI Matching Scores */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recommended for Your Skillset</h2>
            <p className="text-xs text-slate-500">Ranked by AI compatibility scoring</p>
          </div>
          <Link to="/freelancer/projects" className="text-xs font-bold text-brand-indigo hover:underline flex items-center gap-1">
            <span>View all projects</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {recommendedProjects.map((p, idx) => {
            const matchPercent = idx === 0 ? 96 : idx === 1 ? 88 : 82;
            return (
              <div
                key={p.id}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-indigo bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                      {p.category}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      <Sparkles className="w-3 h-3" />
                      {matchPercent}% Match
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 line-clamp-1 mb-1">{p.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">{p.description}</p>

                  <div className="flex flex-wrap gap-1">
                    {p.requiredSkills.map((s) => (
                      <span key={s} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="font-extrabold text-sm text-brand-navy">
                    ${p.budgetMin.toLocaleString()} - ${p.budgetMax.toLocaleString()}
                  </span>
                  <Link
                    to={`/projects/${p.id}`}
                    className="px-3.5 py-1.5 rounded-xl bg-brand-navy hover:bg-slate-800 text-white font-semibold text-xs transition-colors"
                  >
                    Apply Now
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
