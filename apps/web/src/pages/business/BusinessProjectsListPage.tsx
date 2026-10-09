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

  if (loading) return <div className="text-center py-20 text-slate-500">Loading your projects...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Company Projects</h1>
          <p className="text-xs text-slate-500 mt-1">Manage all opportunities and review matching candidates</p>
        </div>
        <Link
          to="/business/projects/new"
          className="px-4 py-2.5 rounded-xl bg-brand-navy hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post a New Project</span>
        </Link>
      </div>

      <div className="space-y-4">
        {projects.map((p) => (
          <div
            key={p.id}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:border-slate-300 transition-all"
          >
            <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-indigo bg-indigo-50 px-2.5 py-0.5 rounded">
                    {p.category}
                  </span>
                  <span className="text-xs text-slate-400">Posted {new Date(p.createdAt).toLocaleDateString()}</span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded capitalize">
                    {p.status.replace('_', ' ')}
                  </span>
                </div>
                <h3 className="font-bold text-base text-slate-900">{p.title}</h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{p.description}</p>
              </div>

              <div className="text-left sm:text-right flex-shrink-0">
                <div className="text-lg font-extrabold text-brand-navy">
                  ${p.budgetMin.toLocaleString()} - ${p.budgetMax.toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-400">{p.duration} • {p.workArrangement}</div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-semibold">{p.proposalsCount} proposals received</span>
              <div className="flex gap-2">
                <Link
                  to={`/business/projects/${p.id}/proposals`}
                  className="px-4 py-2 rounded-xl bg-indigo-50 hover:bg-brand-indigo hover:text-white text-brand-indigo font-bold text-xs transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Review Proposals & Candidates</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
