import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Users,
  DollarSign,
  PlusCircle,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Building2,
  FileText,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Project, Contract, BusinessProfile } from '@skillbridge/shared';

export const BusinessDashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const bProfile = profile as BusinessProfile;

  const [projects, setProjects] = useState<Project[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getMyProjects(),
      api.getContracts(),
    ]).then(([pRes, cRes]) => {
      if (pRes.success) setProjects(pRes.projects);
      if (cRes.success) setContracts(cRes.contracts);
      setLoading(false);
    });
  }, []);

  const totalSpent = contracts.reduce((s, c) => s + (c.totalAmount || 0), 0);
  const activeContracts = contracts.filter((c) => c.status === 'active');
  const totalProposals = projects.reduce((s, p) => s + (p.proposalsCount || 0), 0);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-navy via-slate-900 to-brand-indigo rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{bProfile?.companyName || 'TechVentures AI'}</h1>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-teal bg-teal-500/20 px-2 py-0.5 rounded-full border border-teal-400/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Enterprise
            </span>
          </div>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            Welcome, {user?.name}. Manage your talent pipelines, active project milestones, and contract workspaces.
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            to="/business/projects/new"
            className="px-5 py-2.5 rounded-xl bg-brand-teal hover:bg-teal-400 text-slate-900 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post New Project</span>
          </Link>
          <Link
            to="/business/find-freelancers"
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-colors"
          >
            Search Talent
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">Total Open Projects</span>
            <Briefcase className="w-4 h-4 text-brand-indigo" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{projects.length}</div>
          <div className="text-[11px] text-slate-400">
            {projects.filter((p) => p.status === 'published').length} published & accepting proposals
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">Candidate Proposals</span>
            <FileText className="w-4 h-4 text-brand-teal" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{totalProposals}</div>
          <div className="text-[11px] text-brand-indigo font-semibold">
            Ranked with AI compatibility scores
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">Active Contracts</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{activeContracts.length}</div>
          <div className="text-[11px] text-slate-400">
            Dedicated milestone workspaces
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">Total Escrow Value</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">${totalSpent.toLocaleString()}</div>
          <div className="text-[11px] text-emerald-600 font-semibold">
            0% business platform fees
          </div>
        </div>
      </div>

      {/* Active Contract Alert */}
      {activeContracts.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-base font-bold text-slate-900">Active Workspace Needs Attention</h2>
            </div>
            <Link
              to={`/business/contracts/${activeContracts[0].id}`}
              className="text-xs font-bold text-brand-indigo hover:underline flex items-center gap-1"
            >
              <span>Review Deliverables in Workspace</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <div>
              <div className="text-xs font-bold text-amber-900">Milestone Deliverable Submitted for Review</div>
              <div className="text-xs text-amber-800 mt-0.5">
                Sarah Jenkins submitted Milestone 2: "Interactive Analytics Charts & Core Telemetry Feeds" ($1,800).
              </div>
            </div>
            <Link
              to={`/business/contracts/${activeContracts[0].id}`}
              className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold transition-colors whitespace-nowrap shadow-sm text-center"
            >
              Inspect & Approve
            </Link>
          </div>
        </div>
      )}

      {/* Projects List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Your Posted Projects</h2>
            <p className="text-xs text-slate-500">Manage listings and compare candidate proposals</p>
          </div>
          <Link
            to="/business/projects/new"
            className="text-xs font-bold text-brand-indigo hover:underline flex items-center gap-1"
          >
            <span>+ Create new project</span>
          </Link>
        </div>

        <div className="space-y-3">
          {projects.map((p) => (
            <div
              key={p.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-slate-300 transition-all"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-indigo bg-indigo-50 px-2 py-0.5 rounded">
                    {p.category}
                  </span>
                  <span className="text-xs font-bold text-slate-800 capitalize">
                    {p.status.replace('_', ' ')}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-slate-900">{p.title}</h3>
                <div className="text-xs text-slate-500">
                  Budget: ${p.budgetMin.toLocaleString()} - ${p.budgetMax.toLocaleString()} • {p.duration}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  to={`/business/projects/${p.id}/proposals`}
                  className="px-4 py-2 rounded-xl bg-indigo-50 hover:bg-brand-indigo hover:text-white text-brand-indigo font-bold text-xs transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Review Proposals ({p.proposalsCount})</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
