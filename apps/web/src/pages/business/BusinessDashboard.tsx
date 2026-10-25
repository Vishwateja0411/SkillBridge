import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Users,
  DollarSign,
  PlusCircle,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Clock,
  Check,
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
    <div className="space-y-8 text-[#F6F1E4]">
      {/* Welcome Banner */}
      <div className="bg-[#114A39] border border-[#1F5A46] rounded-[12px] p-8 text-[#F6F1E4] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <h1 className="font-serif text-3xl font-medium">{bProfile?.companyName || 'TechVentures AI'}</h1>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#E5CB86] bg-[#072A20] px-2.5 py-0.5 rounded-[4px] border border-[#1F5A46]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C9A24B]" />
              Verified Enterprise
            </span>
          </div>
          <p className="text-xs text-[#BFD0C6] max-w-xl leading-relaxed">
            Welcome, {user?.name}. Manage your opportunity pipeline, review candidate proposals, and oversee active milestone contracts.
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            to="/business/projects/new"
            className="px-5 py-2.5 rounded-[6px] bg-[#C9A24B] hover:bg-[#E5CB86] text-[#0B3D2E] font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post an Opportunity</span>
          </Link>
          <Link
            to="/business/find-freelancers"
            className="px-5 py-2.5 rounded-[6px] bg-[#072A20] hover:bg-[#0B3D2E] text-[#F6F1E4] font-medium text-xs border border-[#1F5A46] hover:border-[#C9A24B] transition-colors"
          >
            Search Talent
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-[#114A39] p-5 rounded-[12px] border border-[#1F5A46] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-[#BFD0C6]">
            <span>Posted Projects</span>
            <Briefcase className="w-4 h-4 text-[#C9A24B]" />
          </div>
          <div className="font-serif text-3xl font-medium text-[#F6F1E4]">{projects.length}</div>
          <div className="text-[11px] text-[#9DB5A8]">
            Across all categories
          </div>
        </div>

        <div className="bg-[#114A39] p-5 rounded-[12px] border border-[#1F5A46] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-[#BFD0C6]">
            <span>Received Proposals</span>
            <Users className="w-4 h-4 text-[#E5CB86]" />
          </div>
          <div className="font-serif text-3xl font-medium text-[#F6F1E4]">{totalProposals}</div>
          <div className="text-[11px] text-[#7BC49A]">
            Active candidate bids
          </div>
        </div>

        <div className="bg-[#114A39] p-5 rounded-[12px] border border-[#1F5A46] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-[#BFD0C6]">
            <span>Active Contracts</span>
            <Clock className="w-4 h-4 text-[#7BC49A]" />
          </div>
          <div className="font-serif text-3xl font-medium text-[#F6F1E4]">{activeContracts.length}</div>
          <div className="text-[11px] text-[#9DB5A8]">
            In milestone execution
          </div>
        </div>

        <div className="bg-[#114A39] p-5 rounded-[12px] border border-[#1F5A46] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-[#BFD0C6]">
            <span>Committed Escrow</span>
            <DollarSign className="w-4 h-4 text-[#7BC49A]" />
          </div>
          <div className="font-serif text-3xl font-medium text-[#E5CB86]">${totalSpent.toLocaleString()}</div>
          <div className="text-[11px] text-[#7BC49A]">
            0% business platform fee
          </div>
        </div>
      </div>

      {/* Posted Projects Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl font-medium text-[#F6F1E4]">Your Open Opportunities</h2>
            <p className="text-xs text-[#BFD0C6]">Inspect bids and manage milestone releases</p>
          </div>
          <Link to="/business/projects" className="text-xs font-medium text-[#E5CB86] hover:underline flex items-center gap-1">
            <span>View all projects</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="p-8 text-center bg-[#114A39] rounded-[12px] border border-[#1F5A46] space-y-3">
            <p className="text-xs text-[#BFD0C6]">You have not posted any projects yet.</p>
            <Link
              to="/business/projects/new"
              className="inline-block px-4 py-2 rounded-[6px] bg-[#C9A24B] text-[#0B3D2E] font-semibold text-xs"
            >
              Post Your First Project
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((p) => (
              <div
                key={p.id}
                className="bg-[#114A39] p-6 rounded-[12px] border border-[#1F5A46] shadow-sm hover:border-[#2B6D56] transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#C9A24B]">
                      {p.category}
                    </span>
                    <span className="text-[10px] font-medium text-[#7BC49A] bg-[#072A20] px-2 py-0.5 rounded-[4px] border border-[#1F5A46]">
                      {p.status}
                    </span>
                  </div>

                  <h3 className="font-serif text-lg font-medium text-[#F6F1E4] line-clamp-1 mb-1">{p.title}</h3>
                  <p className="text-xs text-[#BFD0C6] line-clamp-2 leading-relaxed mb-3">{p.description}</p>

                  <div className="text-xs text-[#E5CB86] font-medium">
                    ${p.budgetMin.toLocaleString()} - ${p.budgetMax.toLocaleString()}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#1F5A46] flex items-center justify-between text-xs">
                  <span className="text-[#9DB5A8]">{p.proposalsCount} proposals</span>
                  <Link
                    to={`/business/projects/${p.id}/proposals`}
                    className="px-3 py-1.5 rounded-[6px] bg-[#C9A24B] hover:bg-[#E5CB86] text-[#0B3D2E] font-semibold text-xs transition-colors"
                  >
                    Review Bids
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Contract Workspaces */}
      {activeContracts.length > 0 && (
        <div className="space-y-4 pt-4">
          <h2 className="font-serif text-2xl font-medium text-[#F6F1E4]">Active Contract Workspaces</h2>
          <div className="space-y-3">
            {activeContracts.map((c) => (
              <div
                key={c.id}
                className="bg-[#114A39] p-5 rounded-[12px] border border-[#1F5A46] flex flex-col sm:flex-row justify-between sm:items-center gap-4"
              >
                <div>
                  <h3 className="font-serif text-lg font-medium text-[#F6F1E4]">{c.title}</h3>
                  <p className="text-xs text-[#BFD0C6]">
                    Talent: {c.freelancer?.user?.name || 'Assigned Specialist'} • Total Value: ${c.totalAmount.toLocaleString()}
                  </p>
                </div>
                <Link
                  to={`/business/contracts/${c.id}`}
                  className="px-4 py-2 rounded-[6px] bg-[#072A20] hover:bg-[#0B3D2E] text-[#E5CB86] border border-[#1F5A46] hover:border-[#C9A24B] font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Open Workspace</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
