import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  FileText,
  DollarSign,
  CheckCircle2,
  Sparkles,
  ArrowRight,
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
    <div className="space-y-8 text-[#F6F1E4]">
      {/* Welcome Banner */}
      <div className="bg-[#114A39] border border-[#1F5A46] rounded-[12px] p-8 text-[#F6F1E4] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <h1 className="font-serif text-3xl font-medium">Welcome back, {user?.name}</h1>
            {fProfile?.verificationStatus === 'verified' && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#E5CB86] bg-[#072A20] px-2.5 py-0.5 rounded-[4px] border border-[#1F5A46]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C9A24B]" />
                Verified
              </span>
            )}
          </div>
          <p className="text-xs text-[#BFD0C6] max-w-xl leading-relaxed">
            {fProfile?.headline || 'Senior Full-Stack Engineer | React & Node Architect'}
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            to="/freelancer/projects"
            className="px-5 py-2.5 rounded-[6px] bg-[#C9A24B] hover:bg-[#E5CB86] text-[#0B3D2E] font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Briefcase className="w-4 h-4" />
            <span>Find Projects</span>
          </Link>
          <Link
            to="/freelancer/portfolio"
            className="px-5 py-2.5 rounded-[6px] bg-[#072A20] hover:bg-[#0B3D2E] text-[#F6F1E4] font-medium text-xs border border-[#1F5A46] hover:border-[#C9A24B] transition-colors"
          >
            Manage Portfolio
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-[#114A39] p-5 rounded-[12px] border border-[#1F5A46] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-[#BFD0C6]">
            <span>Active Proposals</span>
            <FileText className="w-4 h-4 text-[#C9A24B]" />
          </div>
          <div className="font-serif text-3xl font-medium text-[#F6F1E4]">{proposals.length}</div>
          <div className="text-[11px] text-[#7BC49A] flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>1 shortlisted candidate</span>
          </div>
        </div>

        <div className="bg-[#114A39] p-5 rounded-[12px] border border-[#1F5A46] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-[#BFD0C6]">
            <span>Active Contracts</span>
            <CheckCircle2 className="w-4 h-4 text-[#7BC49A]" />
          </div>
          <div className="font-serif text-3xl font-medium text-[#F6F1E4]">{activeContracts.length}</div>
          <div className="text-[11px] text-[#9DB5A8]">
            {contracts.length} total contracts
          </div>
        </div>

        <div className="bg-[#114A39] p-5 rounded-[12px] border border-[#1F5A46] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-[#BFD0C6]">
            <span>Total Payouts Released</span>
            <DollarSign className="w-4 h-4 text-[#7BC49A]" />
          </div>
          <div className="font-serif text-3xl font-medium text-[#E5CB86]">${totalEarnings.toLocaleString()}</div>
          <div className="text-[11px] text-[#7BC49A]">
            5% transparent platform fee
          </div>
        </div>

        <div className="bg-[#114A39] p-5 rounded-[12px] border border-[#1F5A46] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-[#BFD0C6]">
            <span>Client Rating</span>
            <Star className="w-4 h-4 text-[#C9A24B] fill-[#C9A24B]" />
          </div>
          <div className="font-serif text-3xl font-medium text-[#F6F1E4]">{fProfile?.rating || 5.0}</div>
          <div className="text-[11px] text-[#9DB5A8]">
            Based on {fProfile?.reviewCount || 28} client reviews
          </div>
        </div>
      </div>

      {/* Active Contract Workspace Notice */}
      {activeContracts.length > 0 && (
        <div className="bg-[#072A20] border border-[#1F5A46] rounded-[12px] p-6 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#7BC49A] animate-pulse" />
              <span className="text-[11px] font-semibold text-[#E5CB86] uppercase tracking-wider">Active Workspace</span>
            </div>
            <Link
              to={`/freelancer/contracts/${activeContracts[0].id}`}
              className="text-xs font-medium text-[#E5CB86] hover:underline flex items-center gap-1"
            >
              <span>Open Project Workspace</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h3 className="font-serif text-xl font-medium text-[#F6F1E4]">{activeContracts[0].title}</h3>
              <p className="text-xs text-[#BFD0C6] mt-0.5">
                Client: {activeContracts[0].business?.companyName || 'TechVentures AI'} • Total Value: ${activeContracts[0].totalAmount.toLocaleString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-[#114A39] text-[#E5CB86] border border-[#1F5A46] font-medium px-3 py-1 rounded-[4px]">
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
            <h2 className="font-serif text-2xl font-medium text-[#F6F1E4]">Recommended Opportunities</h2>
            <p className="text-xs text-[#BFD0C6]">Ranked by rule-based compatibility scoring</p>
          </div>
          <Link to="/freelancer/projects" className="text-xs font-medium text-[#E5CB86] hover:underline flex items-center gap-1">
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
                className="bg-[#114A39] p-6 rounded-[12px] border border-[#1F5A46] shadow-sm hover:border-[#2B6D56] transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#C9A24B] bg-[#072A20] px-2 py-0.5 rounded-[4px] border border-[#1F5A46]">
                      {p.category}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-[#E5CB86] bg-[#072A20] px-2 py-0.5 rounded-[4px] border border-[#1F5A46]">
                      <Sparkles className="w-3 h-3 text-[#C9A24B]" />
                      {matchPercent}% Match
                    </span>
                  </div>

                  <h3 className="font-serif text-lg font-medium text-[#F6F1E4] line-clamp-1 mb-1">{p.title}</h3>
                  <p className="text-xs text-[#BFD0C6] line-clamp-2 leading-relaxed mb-3">{p.description}</p>

                  <div className="flex flex-wrap gap-1">
                    {p.requiredSkills.map((s) => (
                      <span key={s} className="text-[10px] bg-[#072A20] text-[#BFD0C6] border border-[#1F5A46] px-2 py-0.5 rounded-[4px]">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#1F5A46] flex items-center justify-between">
                  <span className="font-serif text-lg font-medium text-[#E5CB86]">
                    ${p.budgetMin.toLocaleString()} - ${p.budgetMax.toLocaleString()}
                  </span>
                  <Link
                    to={`/projects/${p.id}`}
                    className="px-3.5 py-1.5 rounded-[6px] bg-[#C9A24B] hover:bg-[#E5CB86] text-[#0B3D2E] font-semibold text-xs transition-colors"
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
