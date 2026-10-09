import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Star,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Clock,
  ArrowRight,
  MessageSquare,
  FileCheck,
  X,
  ChevronDown,
  Layers,
} from 'lucide-react';
import { api } from '../../services/api';
import { Project, Proposal, MatchBreakdown } from '@skillbridge/shared';

export const BusinessProposalsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  // Contract offer modal
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [contractTerms, setContractTerms] = useState(
    'Standard SkillBridge Agreement: 100% intellectual property assignment upon milestone release.'
  );
  const [contractAmount, setContractAmount] = useState('4500');
  const [milestones, setMilestones] = useState([
    { title: 'Milestone 1: Architecture, Data Schemas & Wireframes', amount: 1200, dueDate: '2026-11-15' },
    { title: 'Milestone 2: Core Components & Interactive Telemetry UI', amount: 1800, dueDate: '2026-11-30' },
    { title: 'Milestone 3: Production QA, Security Audit & Deployment', amount: 1500, dueDate: '2026-12-15' },
  ]);

  const [creatingContract, setCreatingContract] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  const fetchProposals = async () => {
    if (!id) return;
    try {
      const res = await api.getProposalsForProject(id);
      if (res.success) {
        setProject(res.project);
        setProposals(res.proposals);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, [id]);

  const handleUpdateStatus = async (proposalId: string, status: string) => {
    const res = await api.updateProposalStatus(proposalId, status);
    if (res.success) {
      setActionSuccess(`Proposal marked as ${status.replace('_', ' ')}!`);
      await fetchProposals();
    }
  };

  const openOfferModal = (prop: Proposal) => {
    setSelectedProposal(prop);
    setContractAmount(String(prop.proposedPrice));
    setOfferModalOpen(true);
  };

  const handleCreateContract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project || !selectedProposal) return;
    setCreatingContract(true);

    try {
      const res = await api.createContractOffer({
        projectId: project.id,
        freelancerId: selectedProposal.freelancerId,
        proposalId: selectedProposal.id,
        title: project.title,
        terms: contractTerms,
        totalAmount: Number(contractAmount),
        milestones,
      });

      if (res.success) {
        setOfferModalOpen(false);
        navigate(`/business/contracts/${res.contract.id}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCreatingContract(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-slate-500">Loading candidate proposals...</div>;

  return (
    <div className="space-y-8 pb-16">
      {/* Project Header Banner */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-indigo bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
            {project?.category}
          </span>
          <span className="text-xs text-slate-400">Budget: ${project?.budgetMin.toLocaleString()} - ${project?.budgetMax.toLocaleString()}</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">{project?.title}</h1>
        <p className="text-xs text-slate-500 leading-relaxed max-w-3xl">{project?.description}</p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {project?.requiredSkills.map((s) => (
            <span key={s} className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
              {s}
            </span>
          ))}
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess('')} className="text-emerald-500 hover:text-emerald-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Proposals List Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Candidate Proposals ({proposals.length})
          </h2>
          <p className="text-xs text-slate-500">Ranked by transparent 6-factor AI compatibility scores</p>
        </div>
      </div>

      {proposals.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 text-xs text-slate-400">
          No proposals received yet for this project.
        </div>
      ) : (
        <div className="space-y-6">
          {proposals.map((prop) => {
            const freelancer = prop.freelancer;
            const match = prop.matchScore;
            return (
              <div
                key={prop.id}
                className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm space-y-6 hover:border-slate-300 transition-all"
              >
                {/* Top candidate header */}
                <div className="flex flex-col md:flex-row justify-between md:items-start gap-6">
                  <div className="flex items-start gap-4">
                    <img
                      src={freelancer?.user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${freelancer?.user?.name}`}
                      alt={freelancer?.user?.name}
                      className="w-16 h-16 rounded-2xl object-cover border border-slate-200 flex-shrink-0"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/freelancers/${freelancer?.id}`}
                          className="font-bold text-base text-slate-900 hover:text-brand-indigo"
                        >
                          {freelancer?.user?.name}
                        </Link>
                        {freelancer?.verificationStatus === 'verified' && (
                          <span title="Verified Freelancer">
                            <ShieldCheck className="w-4 h-4 text-brand-teal" />
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            prop.status === 'accepted'
                              ? 'bg-emerald-100 text-emerald-800'
                              : prop.status === 'shortlisted'
                              ? 'bg-indigo-100 text-indigo-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {prop.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-brand-indigo">{freelancer?.headline}</p>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1 text-amber-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          {freelancer?.rating} ({freelancer?.reviewCount} reviews)
                        </span>
                        <span>${freelancer?.hourlyRate}/hr</span>
                        <span>{freelancer?.completedProjectsCount} completed projects</span>
                      </div>
                    </div>
                  </div>

                  {/* AI Score Badge */}
                  <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-4 text-right flex-shrink-0">
                    <div className="flex items-center justify-end gap-1 text-brand-indigo font-extrabold text-2xl">
                      <Sparkles className="w-5 h-5 text-amber-500" />
                      <span>{match?.totalScore || 92}%</span>
                    </div>
                    <div className="text-[11px] font-bold text-brand-navy">AI Compatibility Score</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Based on 6 verified signals</div>
                  </div>
                </div>

                {/* Match Factors Explanation Card */}
                {match && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    <div className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-brand-indigo" />
                      <span>Transparent AI Factor Breakdown:</span>
                    </div>
                    <p className="text-slate-600 text-xs italic">{match.summary}</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px]">
                      <div className="bg-white p-2 rounded-lg border border-slate-100">
                        <span className="text-slate-400 block">Skills Match (35%)</span>
                        <span className="font-bold text-slate-800">{match.factors.skillsMatch.score}% Overlap</span>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-slate-100">
                        <span className="text-slate-400 block">Experience (20%)</span>
                        <span className="font-bold text-slate-800">{match.factors.experienceMatch.score}% Tier</span>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-slate-100">
                        <span className="text-slate-400 block">Portfolio (20%)</span>
                        <span className="font-bold text-slate-800">{match.factors.portfolioSimilarity.matchedCount} Similar Items</span>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-slate-100">
                        <span className="text-slate-400 block">Rating (10%)</span>
                        <span className="font-bold text-slate-800">{freelancer?.rating} / 5.0</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Cover Letter */}
                <div className="space-y-2 text-xs">
                  <div className="font-bold text-slate-800">Proposal Cover Letter:</div>
                  <p className="text-slate-700 leading-relaxed whitespace-pre-line bg-white p-4 rounded-xl border border-slate-100">
                    {prop.coverLetter}
                  </p>
                </div>

                {/* Proposed Bid & Actions */}
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-xs">
                  <div>
                    <span className="text-slate-400">Proposed Fixed Price:</span>{' '}
                    <span className="font-extrabold text-base text-brand-navy">${prop.proposedPrice.toLocaleString()}</span>{' '}
                    <span className="text-slate-400">• Est. {prop.estimatedDuration}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {prop.status !== 'shortlisted' && prop.status !== 'accepted' && (
                      <button
                        onClick={() => handleUpdateStatus(prop.id, 'shortlisted')}
                        className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
                      >
                        Shortlist Candidate
                      </button>
                    )}

                    {prop.status !== 'accepted' && (
                      <button
                        onClick={() => openOfferModal(prop)}
                        className="px-5 py-2 rounded-xl bg-brand-navy hover:bg-slate-800 text-white font-bold transition-colors shadow-sm flex items-center gap-1.5"
                      >
                        <FileCheck className="w-4 h-4 text-brand-teal" />
                        <span>Accept Proposal & Send Contract Offer</span>
                      </button>
                    )}

                    {prop.status === 'accepted' && (
                      <div className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Contract Active</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Contract Offer Creation Modal */}
      {offerModalOpen && selectedProposal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setOfferModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-700">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-brand-navy mb-1">Create Formal Contract Offer</h3>
            <p className="text-xs text-slate-500 mb-6">
              Candidate: <span className="font-semibold text-slate-800">{selectedProposal.freelancer?.user?.name}</span>
            </p>

            <form onSubmit={handleCreateContract} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Total Contract Value ($ USD)</label>
                <input
                  type="number"
                  required
                  value={contractAmount}
                  onChange={(e) => setContractAmount(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-brand-indigo"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Contract Terms & IP Assignment</label>
                <textarea
                  rows={3}
                  value={contractTerms}
                  onChange={(e) => setContractTerms(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-brand-indigo"
                />
              </div>

              {/* Milestones schedule */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-800">Milestone Roadmap</label>
                {milestones.map((m, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex justify-between items-center">
                    <div>
                      <div className="font-bold text-slate-800">{m.title}</div>
                      <div className="text-[11px] text-slate-400">Due: {m.dueDate}</div>
                    </div>
                    <div className="font-extrabold text-brand-navy">${m.amount}</div>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setOfferModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingContract}
                  className="px-6 py-2.5 rounded-xl bg-brand-navy hover:bg-slate-800 text-white font-bold text-xs"
                >
                  {creatingContract ? 'Generating Workspace...' : 'Send Contract Offer & Open Workspace'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
