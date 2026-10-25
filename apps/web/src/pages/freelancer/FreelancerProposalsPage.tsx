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

  if (loading) return <div className="text-center py-20 text-[#BFD0C6]">Loading proposals...</div>;

  return (
    <div className="space-y-6">
      <div>
        <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C9A24B]">
          PROPOSAL ARCHIVE
        </div>
        <h1 className="font-serif text-3xl font-medium text-[#F6F1E4] mt-1">
          My Submitted <span className="italic text-[#E5CB86]">Proposals</span>
        </h1>
        <p className="text-xs text-[#BFD0C6] mt-1">Track application statuses, shortlists, and accepted contract offers</p>
      </div>

      {proposals.length === 0 ? (
        <div className="bg-[#114A39] p-12 text-center rounded-[12px] border border-[#1F5A46] space-y-4">
          <FileText className="w-12 h-12 text-[#9DB5A8] mx-auto" />
          <p className="text-sm font-medium text-[#F6F1E4]">You haven't submitted any proposals yet.</p>
          <Link
            to="/projects"
            className="inline-block px-5 py-2.5 rounded-[6px] bg-[#C9A24B] hover:bg-[#E5CB86] text-[#0B3D2E] font-medium text-xs transition-colors"
          >
            Browse Open Projects
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {proposals.map((p) => (
            <div
              key={p.id}
              className="bg-[#114A39] p-6 rounded-[12px] border border-[#1F5A46] space-y-4 hover:border-[#2B6D56] transition-all"
            >
              <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                <div className="space-y-1.5 max-w-3xl">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-[4px] border ${
                        p.status === 'accepted'
                          ? 'bg-[#114A39] border-[#7BC49A] text-[#7BC49A]'
                          : p.status === 'shortlisted'
                            ? 'bg-[#072A20] border-[#E5CB86] text-[#E5CB86]'
                            : p.status === 'interview_requested'
                              ? 'bg-[#072A20] border-[#C9A24B] text-[#C9A24B]'
                              : p.status === 'withdrawn'
                                ? 'bg-[#072A20] border-[#1F5A46] text-[#9DB5A8]'
                                : 'bg-[#072A20] border-[#E5CB86] text-[#E5CB86]'
                      }`}
                    >
                      {p.status.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-[#9DB5A8]">
                      Applied on {new Date(p.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <Link
                    to={`/projects/${p.projectId}`}
                    className="font-serif text-lg font-medium text-[#F6F1E4] hover:text-[#E5CB86] block transition-colors"
                  >
                    {p.project?.title || 'Project Details'}
                  </Link>

                  <p className="text-xs text-[#BFD0C6] line-clamp-2 italic leading-relaxed">
                    "{p.coverLetter}"
                  </p>
                </div>

                <div className="text-left sm:text-right flex-shrink-0">
                  <div className="font-serif text-2xl font-medium text-[#E5CB86]">${p.proposedPrice.toLocaleString()}</div>
                  <div className="text-[11px] text-[#9DB5A8]">Est. {p.estimatedDuration}</div>
                  {p.matchScore && (
                    <div className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-medium text-[#7BC49A] border border-[#1F5A46] bg-[#072A20] px-2 py-0.5 rounded-[4px]">
                      <Sparkles className="w-3 h-3 text-[#7BC49A]" />
                      <span>{p.matchScore.totalScore}% Match</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-[#1F5A46] flex items-center justify-between text-xs">
                <div className="text-[#9DB5A8]">
                  Category: {p.project?.category || 'General'}
                </div>
                <div className="flex gap-2">
                  {p.status !== 'withdrawn' && p.status !== 'accepted' && (
                    <button
                      onClick={() => handleWithdraw(p.id)}
                      className="px-3 py-1.5 text-xs text-[#E27C6B] hover:bg-[#072A20] rounded-[6px] border border-transparent hover:border-[#E27C6B] transition-colors"
                    >
                      Withdraw Proposal
                    </button>
                  )}
                  <Link
                    to={`/projects/${p.projectId}`}
                    className="px-4 py-1.5 rounded-[6px] bg-[#072A20] hover:bg-[#114A39] text-[#F6F1E4] border border-[#1F5A46] font-medium text-xs transition-colors flex items-center gap-1"
                  >
                    <span>View Project</span>
                    <ChevronRight className="w-3 h-3 text-[#C9A24B]" />
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
