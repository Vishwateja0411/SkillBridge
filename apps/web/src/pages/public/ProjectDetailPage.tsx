import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Clock,
  Calendar,
  ShieldCheck,
  Send,
  Sparkles,
  Check,
  AlertCircle,
  X,
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Project } from '@skillbridge/shared';

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  // Proposal modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [proposedPrice, setProposedPrice] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (id) {
      api.getProjectById(id).then((res) => {
        if (res.success) {
          setProject(res.project);
          if (res.project) {
            setProposedPrice(String(res.project.budgetMin));
            setEstimatedDuration(res.project.duration || '3 weeks');
          }
        }
        setLoading(false);
      });
    }
  }, [id]);

  const handleAiDraft = async () => {
    if (!project) return;
    setAiGenerating(true);
    try {
      const res = await api.getProposalDraft({
        projectTitle: project.title,
        projectDescription: project.description,
        freelancerSkills: (profile as any)?.skills?.map((s: any) => s.name) || project.requiredSkills,
      });
      if (res.success && res.draftCoverLetter) {
        setCoverLetter(res.draftCoverLetter);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAiGenerating(false);
    }
  };

  const handleProposalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;
    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await api.submitProposal({
        projectId: project.id,
        coverLetter,
        proposedPrice: Number(proposedPrice),
        estimatedDuration,
        milestoneProposals: [
          {
            title: 'Phase 1: Architecture, Core Contracts & Design Approval',
            description: 'Foundations and initial specifications',
            amount: Math.round(Number(proposedPrice) * 0.35),
            estimatedDays: 7,
          },
          {
            title: 'Phase 2: Core Feature Implementation & Integration',
            description: 'Major functional modules and test suites',
            amount: Math.round(Number(proposedPrice) * 0.45),
            estimatedDays: 14,
          },
          {
            title: 'Phase 3: QA Polish, Final Verification & Delivery',
            description: 'Documentation and production delivery handoff',
            amount: Math.round(Number(proposedPrice) * 0.20),
            estimatedDays: 7,
          },
        ],
      });

      if (res.success) {
        setSuccessMsg('Proposal submitted successfully! Redirecting...');
        setTimeout(() => {
          navigate('/freelancer/proposals');
        }, 1200);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit proposal');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-[#9DB5A8] bg-[#0B3D2E] min-h-screen">Loading project...</div>;
  }

  if (!project) {
    return <div className="text-center py-20 text-[#9DB5A8] bg-[#0B3D2E] min-h-screen">Project not found.</div>;
  }

  return (
    <div className="bg-[#0B3D2E] text-[#F6F1E4] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header breadcrumb & summary */}
        <div className="bg-[#114A39] p-8 rounded-[12px] border border-[#1F5A46] shadow-sm flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#C9A24B] bg-[#072A20] px-2.5 py-0.5 rounded-[4px] border border-[#1F5A46]">
                {project.category}
              </span>
              <span className="text-xs text-[#9DB5A8]">• Posted {new Date(project.createdAt).toLocaleDateString()}</span>
              <span className="text-xs font-medium text-[#7BC49A] bg-[#072A20] px-2 py-0.5 rounded-[4px] border border-[#1F5A46] capitalize">
                {project.status.replace('_', ' ')}
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#F6F1E4] leading-snug">
              {project.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-[#BFD0C6] pt-1">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#9DB5A8]" />
                Duration: {project.duration}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#9DB5A8]" />
                Deadline: {project.deadline}
              </span>
              <span className="flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-[#9DB5A8]" />
                {project.workArrangement}
              </span>
            </div>
          </div>

          {/* Budget Card & Apply CTA */}
          <div className="w-full md:w-auto md:text-right flex flex-col items-start md:items-end justify-between border-t md:border-t-0 pt-6 md:pt-0 border-[#1F5A46]">
            <div>
              <div className="font-serif text-3xl font-medium text-[#E5CB86]">
                ${project.budgetMin.toLocaleString()} - ${project.budgetMax.toLocaleString()}
              </div>
              <div className="text-xs text-[#BFD0C6] mt-1 capitalize">
                {project.budgetType} Budget • {project.experienceLevel} Tier
              </div>
            </div>

            <div className="mt-6 w-full sm:w-auto">
              {user?.role === 'freelancer' ? (
                <button
                  onClick={() => setModalOpen(true)}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-[6px] bg-[#C9A24B] hover:bg-[#E5CB86] text-[#0B3D2E] font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit a Proposal</span>
                </button>
              ) : user?.role === 'business' ? (
                <div className="text-xs text-[#BFD0C6] bg-[#072A20] px-4 py-2 rounded-[6px] border border-[#1F5A46]">
                  Logged in as Client
                </div>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-[6px] bg-[#C9A24B] hover:bg-[#E5CB86] text-[#0B3D2E] font-semibold text-xs transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <span>Sign in to Apply</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Project Description & Requirements */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-[#114A39] p-7 rounded-[12px] border border-[#1F5A46] shadow-sm space-y-3">
              <h2 className="font-serif text-xl font-medium text-[#F6F1E4]">Project Scope & Deliverables</h2>
              <div className="text-xs text-[#BFD0C6] leading-relaxed whitespace-pre-line space-y-2">
                {project.description}
              </div>
            </div>

            {/* Required Skills */}
            <div className="bg-[#114A39] p-7 rounded-[12px] border border-[#1F5A46] shadow-sm space-y-3">
              <h2 className="font-serif text-xl font-medium text-[#F6F1E4]">Required Skills & Technologies</h2>
              <div className="flex flex-wrap gap-2">
                {project.requiredSkills.map((s) => (
                  <span
                    key={s}
                    className="px-3 py-1 rounded-[4px] bg-[#072A20] border border-[#1F5A46] text-[#E5CB86] text-xs font-medium"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Client Card & Activity */}
          <div className="space-y-6">
            <div className="bg-[#114A39] p-6 rounded-[12px] border border-[#1F5A46] shadow-sm space-y-4">
              <h3 className="font-serif text-lg font-medium text-[#F6F1E4]">About the Client</h3>
              <div className="space-y-2 text-xs text-[#BFD0C6]">
                <div className="font-medium text-sm text-[#F6F1E4]">
                  {project.business?.companyName || 'Verified Enterprise'}
                </div>
                <div>{project.business?.industry || 'Technology & Innovation'}</div>
                <div className="flex items-center gap-1.5 text-[#7BC49A] pt-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Escrow Account Verified</span>
                </div>
                <div className="text-[#9DB5A8] pt-2 border-t border-[#1F5A46]">
                  {project.proposalsCount} proposals received so far
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Proposal Submission Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-[#114A39] text-[#F6F1E4] rounded-[12px] max-w-2xl w-full p-8 shadow-2xl border border-[#1F5A46] relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-6 right-6 text-[#9DB5A8] hover:text-[#F6F1E4]"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-[10px] font-semibold uppercase tracking-wider text-[#C9A24B] mb-1">
                CONTRACT PROPOSAL
              </div>
              <h2 className="font-serif text-2xl font-medium text-[#F6F1E4] mb-1">Submit Proposal</h2>
              <p className="text-xs text-[#BFD0C6] mb-6">
                Applying to: <span className="font-medium text-[#F6F1E4]">{project.title}</span>
              </p>

              {errorMsg && (
                <div className="p-3 mb-4 rounded-[6px] bg-[#E27C6B]/15 border border-[#E27C6B]/30 text-xs text-[#F6F1E4] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-[#E27C6B] flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3 mb-4 rounded-[6px] bg-[#7BC49A]/15 border border-[#7BC49A]/30 text-xs text-[#7BC49A] flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#7BC49A] flex-shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              <form onSubmit={handleProposalSubmit} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-[#F6F1E4]">Cover Letter</label>
                    <button
                      type="button"
                      onClick={handleAiDraft}
                      disabled={aiGenerating}
                      className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#E5CB86] hover:text-white bg-[#072A20] px-2.5 py-1 rounded-[4px] border border-[#1F5A46]"
                    >
                      <Sparkles className="w-3 h-3 text-[#C9A24B]" />
                      <span>{aiGenerating ? 'Generating...' : 'AI Proposal Assistant'}</span>
                    </button>
                  </div>
                  <textarea
                    rows={6}
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Introduce yourself, highlight relevant past work, and explain how you plan to tackle this project..."
                    required
                    className="w-full p-3 rounded-[6px] bg-[#072A20] border border-[#1F5A46] text-xs text-[#F6F1E4] placeholder:text-[#9DB5A8] focus:outline-none focus:border-[#C9A24B]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#F6F1E4] mb-1.5">Your Proposed Bid ($ USD)</label>
                    <input
                      type="number"
                      value={proposedPrice}
                      onChange={(e) => setProposedPrice(e.target.value)}
                      required
                      className="w-full p-2.5 rounded-[6px] bg-[#072A20] border border-[#1F5A46] text-xs text-[#F6F1E4] focus:outline-none focus:border-[#C9A24B]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#F6F1E4] mb-1.5">Estimated Duration</label>
                    <input
                      type="text"
                      value={estimatedDuration}
                      onChange={(e) => setEstimatedDuration(e.target.value)}
                      required
                      placeholder="e.g. 3-4 weeks"
                      className="w-full p-2.5 rounded-[6px] bg-[#072A20] border border-[#1F5A46] text-xs text-[#F6F1E4] focus:outline-none focus:border-[#C9A24B]"
                    />
                  </div>
                </div>

                <div className="p-3.5 rounded-[6px] bg-[#072A20] border border-[#1F5A46] text-xs text-[#BFD0C6] space-y-1">
                  <div className="font-semibold text-[#F6F1E4]">Automated Milestone Distribution:</div>
                  <div>• Phase 1: Architecture & Design Spec (35%)</div>
                  <div>• Phase 2: Core Development & Integration (45%)</div>
                  <div>• Phase 3: QA Polish & Production Delivery (20%)</div>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-[6px] text-xs text-[#BFD0C6] hover:bg-[#072A20]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2 rounded-[6px] bg-[#C9A24B] hover:bg-[#E5CB86] text-[#0B3D2E] font-semibold text-xs shadow-sm"
                  >
                    {submitting ? 'Submitting...' : 'Send Proposal'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
