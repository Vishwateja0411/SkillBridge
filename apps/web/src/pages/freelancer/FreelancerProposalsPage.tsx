import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Clock, DollarSign, Sparkles, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';
import { api } from '../../services/api';
import { Proposal } from '@skillbridge/shared';

export const FreelancerProposalsPage: React.FC = () => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProposals = async () => {
    const res = await api.getMyProposals();
    if (res.success) setProposals(res.proposals);
    setLoading(false);
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  const handleWithdraw = async (id: string) => {
    if (confirm('Are you sure you want to withdraw this proposal?')) {
      await api.withdrawProposal(id);
      await fetchProposals();
    }
  };

  if (loading) return <div className="text-center py-20 text-slate-500">Loading proposals...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Submitted Proposals</h1>
        <p className="text-xs text-slate-500 mt-1">Track application statuses, shortlists, and accepted contract offers</p>
      </div>

      {proposals.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 space-y-4">
          <FileText className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="text-sm font-semibold text-slate-700">You haven't submitted any proposals yet.</p>
          <Link
            to="/freelancer/projects"
            className="inline-block px-5 py-2.5 rounded-xl bg-brand-indigo text-white font-bold text-xs"
          >
            Browse Open Projects
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {proposals.map((p) => (
            <div
              key={p.id}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:border-slate-300 transition-all"
            >
              <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                <div className="space-y-1.5 max-w-3xl">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        p.status === 'accepted'
                          ? 'bg-emerald-100 text-emerald-800'
                          : p.status === 'shortlisted'
                          ? 'bg-indigo-100 text-indigo-800 animate-pulse'
                          : p.status === 'interview_requested'
                          ? 'bg-purple-100 text-purple-800'
                          : p.status === 'withdrawn'
                          ? 'bg-slate-100 text-slate-500'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {p.status.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-slate-400">
                      Applied on {new Date(p.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <Link
                    to={`/projects/${p.projectId}`}
                    className="text-base font-bold text-slate-900 hover:text-brand-indigo block"
                  >
                    {p.project?.title || 'Project Details'}
                  </Link>

                  <p className="text-xs text-slate-600 line-clamp-2 italic leading-relaxed">
                    "{p.coverLetter}"
                  </p>
                </div>

                <div className="text-left sm:text-right flex-shrink-0">
                  <div className="text-lg font-extrabold text-brand-navy">${p.proposedPrice.toLocaleString()}</div>
                  <div className="text-[11px] text-slate-400">Est. {p.estimatedDuration}</div>
                  {p.matchScore && (
                    <div className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                      <Sparkles className="w-3 h-3" />
                      <span>{p.matchScore.totalScore}% Match</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="text-slate-400">
                  Category: {p.project?.category || 'General'}
                </div>
                <div className="flex gap-2">
                  {p.status !== 'withdrawn' && p.status !== 'accepted' && (
                    <button
                      onClick={() => handleWithdraw(p.id)}
                      className="px-3 py-1.5 text-xs text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Withdraw Proposal
                    </button>
                  )}
                  <Link
                    to={`/projects/${p.projectId}`}
                    className="px-4 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1"
                  >
                    <span>View Project</span>
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
