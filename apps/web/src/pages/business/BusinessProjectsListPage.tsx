import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Briefcase, Sparkles, ChevronRight } from 'lucide-react';
import { api } from '../../services/api';
import { Project } from '@skillbridge/shared';

export const BusinessProjectsListPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMyProjects().then((res) => {
      if (res.success) setProjects(res.projects);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="text-center py-20 text-[#BFD0C6]">Loading your projects...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C9A24B]">
            PROJECT INVENTORY
          </div>
          <h1 className="font-serif text-3xl font-medium text-[#F6F1E4] mt-1">
            Company <span className="italic text-[#E5CB86]">Projects</span>
          </h1>
          <p className="text-xs text-[#BFD0C6] mt-1">Manage all opportunities and review matching candidates</p>
        </div>
        <Link
          to="/business/projects/new"
          className="px-4 py-2.5 rounded-[6px] bg-[#C9A24B] hover:bg-[#E5CB86] text-[#0B3D2E] font-medium text-xs flex items-center gap-1.5 transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post a New Project</span>
        </Link>
      </div>

      <div className="space-y-4">
        {projects.map((p) => (
          <div
            key={p.id}
            className="bg-[#114A39] p-6 rounded-[12px] border border-[#1F5A46] space-y-4 hover:border-[#2B6D56] transition-all"
          >
            <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#C9A24B] bg-[#072A20] px-2.5 py-0.5 rounded-[4px] border border-[#1F5A46]">
                    {p.category}
                  </span>
                  <span className="text-xs text-[#9DB5A8]">Posted {new Date(p.createdAt).toLocaleDateString()}</span>
                  <span className="text-xs font-semibold text-[#7BC49A] bg-[#072A20] border border-[#7BC49A] px-2 py-0.5 rounded-[4px] capitalize">
                    {p.status.replace('_', ' ')}
                  </span>
                </div>
                <h3 className="font-serif text-xl font-medium text-[#F6F1E4]">{p.title}</h3>
                <p className="text-xs text-[#BFD0C6] line-clamp-2 leading-relaxed">{p.description}</p>
              </div>

              <div className="text-left sm:text-right flex-shrink-0">
                <div className="font-serif text-2xl font-medium text-[#E5CB86]">
                  ${p.budgetMin.toLocaleString()} - ${p.budgetMax.toLocaleString()}
                </div>
                <div className="text-[11px] text-[#9DB5A8]">{p.duration} • {p.workArrangement}</div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#1F5A46] flex items-center justify-between text-xs">
              <span className="text-[#9DB5A8] font-medium">{p.proposalsCount} proposals received</span>
              <div className="flex gap-2">
                <Link
                  to={`/business/projects/${p.id}/proposals`}
                  className="px-4 py-2 rounded-[6px] bg-[#072A20] hover:bg-[#114A39] text-[#E5CB86] border border-[#1F5A46] hover:border-[#C9A24B] font-medium text-xs transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#C9A24B]" />
                  <span>Review Proposals & Candidates</span>
                  <ChevronRight className="w-3 h-3 text-[#C9A24B]" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
