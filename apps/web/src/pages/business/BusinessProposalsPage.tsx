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

  if (loading) return <div className="text-center py-20 text-[#BFD0C6]">Loading candidate proposals...</div>;

  return (
    <div className="space-y-8 pb-16">
      {/* Project Header Banner */}
      <div className="bg-[#114A39] p-8 rounded-[12px] border border-[#1F5A46] space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C9A24B] bg-[#072A20] px-2.5 py-0.5 rounded-[4px] border border-[#1F5A46]">
            {project?.category}
          </span>
          <span className="text-xs text-[#9DB5A8]">
            Budget: ${project?.budgetMin.toLocaleString()} - ${project?.budgetMax.toLocaleString()}
          </span>
        </div>
        <h1 className="font-serif text-3xl font-medium text-[#F6F1E4]">{project?.title}</h1>
        <p className="text-xs text-[#BFD0C6] leading-relaxed max-w-3xl">{project?.description}</p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {project?.requiredSkills.map((s) => (
            <span key={s} className="text-[10px] font-medium bg-[#072A20] text-[#9DB5A8] border border-[#1F5A46] px-2 py-0.5 rounded-[4px]">
              {s}
            </span>
          ))}
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3.5 rounded-[6px] bg-[#114A39] border border-[#7BC49A] text-[#7BC49A] text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#7BC49A]" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess('')} className="text-[#7BC49A] hover:text-[#F6F1E4]">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Proposals List Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl font-medium text-[#F6F1E4]">
            Candidate Proposals ({proposals.length})
          </h2>
          <p className="text-xs text-[#BFD0C6]">Ranked by transparent 6-factor compatibility scores</p>
        </div>
      </div>

      {proposals.length === 0 ? (
        <div className="bg-[#114A39] p-12 text-center rounded-[12px] border border-[#1F5A46] text-xs text-[#9DB5A8]">
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
                className="bg-[#114A39] p-7 rounded-[12px] border border-[#1F5A46] space-y-6 hover:border-[#2B6D56] transition-all"
              >
                {/* Top candidate header */}
                <div className="flex flex-col md:flex-row justify-between md:items-start gap-6">
                  <div className="flex items-start gap-4">
                    <img
                      src={freelancer?.user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${freelancer?.user?.name}`}
                      alt={freelancer?.user?.name}
                      className="w-16 h-16 rounded-full object-cover border border-[#1F5A46] flex-shrink-0"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/freelancers/${freelancer?.id}`}
                          className="font-serif text-lg font-medium text-[#F6F1E4] hover:text-[#E5CB86] transition-colors"
                        >
                          {freelancer?.user?.name}
                        </Link>
                        {freelancer?.verificationStatus === 'verified' && (
                          <span title="Verified Freelancer">
                            <ShieldCheck className="w-4 h-4 text-[#C9A24B]" />
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-[4px] border ${
                            prop.status === 'accepted'
                              ? 'bg-[#072A20] border-[#7BC49A] text-[#7BC49A]'
                              : prop.status === 'shortlisted'
                                ? 'bg-[#072A20] border-[#E5CB86] text-[#E5CB86]'
                                : 'bg-[#072A20] border-[#1F5A46] text-[#9DB5A8]'
                          }`}
                        >
                          {prop.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-[#E5CB86]">{freelancer?.headline}</p>
                      <div className="flex items-center gap-3 text-xs text-[#BFD0C6]">
                        <span className="flex items-center gap-1 text-[#E5CB86] font-medium">
                          <Star className="w-3.5 h-3.5 fill-[#C9A24B] text-[#C9A24B]" />
                          {freelancer?.rating} ({freelancer?.reviewCount} reviews)
                        </span>
                        <span>${freelancer?.hourlyRate}/hr</span>
                        <span>{freelancer?.completedProjectsCount} completed projects</span>
                      </div>
                    </div>
                  </div>

                  {/* Score Badge */}
                  <div className="bg-[#072A20] border border-[#1F5A46] rounded-[8px] p-4 text-right flex-shrink-0">
                    <div className="flex items-center justify-end gap-1 font-serif text-3xl font-medium text-[#E5CB86]">
                      <Sparkles className="w-4 h-4 text-[#C9A24B]" />
                      <span>{match?.totalScore || 92}%</span>
                    </div>
                    <div className="text-[11px] font-medium text-[#F6F1E4]">Compatibility Score</div>
                    <div className="text-[10px] text-[#9DB5A8] mt-0.5">Rule-based scoring</div>
                  </div>
                </div>

                {/* Match Factors Explanation Card */}
                {match && (
                  <div className="p-4 rounded-[8px] bg-[#072A20] border border-[#1F5A46] space-y-2 text-xs">
                    <div className="font-medium text-[#E5CB86] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#C9A24B]" />
                      <span>Transparent Factor Breakdown:</span>
                    </div>
                    <p className="text-[#BFD0C6] text-xs italic">{match.summary}</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px]">
                      <div className="bg-[#114A39] p-2.5 rounded-[6px] border border-[#1F5A46]">
                        <span className="text-[#9DB5A8] block">Skills Match (35%)</span>
                        <span className="font-medium text-[#F6F1E4]">{match.factors.skillsMatch.score}% Overlap</span>
                      </div>
                      <div className="bg-[#114A39] p-2.5 rounded-[6px] border border-[#1F5A46]">
                        <span className="text-[#9DB5A8] block">Experience (20%)</span>
                        <span className="font-medium text-[#F6F1E4]">{match.factors.experienceMatch.score}% Tier</span>
                      </div>
                      <div className="bg-[#114A39] p-2.5 rounded-[6px] border border-[#1F5A46]">
                        <span className="text-[#9DB5A8] block">Portfolio (20%)</span>
                        <span className="font-medium text-[#F6F1E4]">{match.factors.portfolioSimilarity.matchedCount} Similar Items</span>
                      </div>
                      <div className="bg-[#114A39] p-2.5 rounded-[6px] border border-[#1F5A46]">
                        <span className="text-[#9DB5A8] block">Rating (10%)</span>
                        <span className="font-medium text-[#F6F1E4]">{freelancer?.rating} / 5.0</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Cover Letter */}
                <div className="space-y-2 text-xs">
                  <div className="font-medium text-[#F6F1E4]">Proposal Cover Letter:</div>
                  <p className="text-[#BFD0C6] leading-relaxed whitespace-pre-line bg-[#072A20] p-4 rounded-[6px] border border-[#1F5A46]">
                    {prop.coverLetter}
                  </p>
                </div>

                {/* Proposed Bid & Actions */}
                <div className="pt-4 border-t border-[#1F5A46] flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-xs">
                  <div>
                    <span className="text-[#9DB5A8]">Proposed Fixed Price:</span>{' '}
                    <span className="font-serif text-xl font-medium text-[#E5CB86]">${prop.proposedPrice.toLocaleString()}</span>{' '}
                    <span className="text-[#9DB5A8]">• Est. {prop.estimatedDuration}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {prop.status !== 'shortlisted' && prop.status !== 'accepted' && (
                      <button
                        onClick={() => handleUpdateStatus(prop.id, 'shortlisted')}
                        className="px-3.5 py-2 rounded-[6px] bg-[#072A20] hover:bg-[#114A39] text-[#BFD0C6] border border-[#1F5A46] font-medium transition-colors"
                      >
                        Shortlist Candidate
                      </button>
                    )}

                    {prop.status !== 'accepted' && (
                      <button
                        onClick={() => openOfferModal(prop)}
                        className="px-5 py-2 rounded-[6px] bg-[#C9A24B] hover:bg-[#E5CB86] text-[#0B3D2E] font-medium transition-colors flex items-center gap-1.5"
                      >
                        <FileCheck className="w-4 h-4 text-[#0B3D2E]" />
                        <span>Accept Proposal & Send Contract Offer</span>
                      </button>
                    )}

                    {prop.status === 'accepted' && (
                      <div className="text-[#7BC49A] font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-[#7BC49A]" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#072A20]/80">
          <div className="bg-[#114A39] rounded-[12px] max-w-2xl w-full p-8 border border-[#1F5A46] relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setOfferModalOpen(false)} className="absolute top-6 right-6 text-[#9DB5A8] hover:text-[#F6F1E4]">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-serif text-2xl font-medium text-[#F6F1E4] mb-1">Create Formal Contract Offer</h3>
            <p className="text-xs text-[#BFD0C6] mb-6">
              Candidate: <span className="font-medium text-[#E5CB86]">{selectedProposal.freelancer?.user?.name}</span>
            </p>

            <form onSubmit={handleCreateContract} className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-[#F6F1E4] mb-1">Total Contract Value ($ USD)</label>
                <input
                  type="number"
                  required
                  value={contractAmount}
                  onChange={(e) => setContractAmount(e.target.value)}
                  className="w-full p-3 rounded-[6px] bg-[#072A20] border border-[#1F5A46] text-xs font-medium text-[#F6F1E4] focus:outline-none focus:border-[#C9A24B]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#F6F1E4] mb-1">Contract Terms & IP Assignment</label>
                <textarea
                  rows={3}
                  value={contractTerms}
                  onChange={(e) => setContractTerms(e.target.value)}
                  className="w-full p-3 rounded-[6px] bg-[#072A20] border border-[#1F5A46] text-xs text-[#F6F1E4] focus:outline-none focus:border-[#C9A24B]"
                />
              </div>

              {/* Milestones schedule */}
              <div className="space-y-3">
                <label className="block text-xs font-medium text-[#F6F1E4]">Milestone Roadmap</label>
                {milestones.map((m, idx) => (
                  <div key={idx} className="p-3 rounded-[6px] bg-[#072A20] border border-[#1F5A46] text-xs flex justify-between items-center">
                    <div>
                      <div className="font-medium text-[#F6F1E4]">{m.title}</div>
                      <div className="text-[11px] text-[#9DB5A8]">Due: {m.dueDate}</div>
                    </div>
                    <div className="font-serif text-base font-medium text-[#E5CB86]">${m.amount}</div>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setOfferModalOpen(false)}
                  className="px-5 py-2.5 rounded-[6px] text-xs font-medium text-[#BFD0C6] hover:bg-[#072A20] border border-transparent hover:border-[#1F5A46] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingContract}
                  className="px-6 py-2.5 rounded-[6px] bg-[#C9A24B] hover:bg-[#E5CB86] text-[#0B3D2E] font-medium text-xs transition-colors"
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
