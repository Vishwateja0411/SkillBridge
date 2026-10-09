import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Clock,
  DollarSign,
  Calendar,
  Building2,
  ShieldCheck,
  Send,
  Sparkles,
  CheckCircle2,
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
            description: 'Foundations and initial components',
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
            description: 'Documentation and deployment handoff',
            amount: Math.round(Number(proposedPrice) * 0.20),
            estimatedDays: 7,
          },
        ],
      });

      if (res.success) {
        setSuccessMsg('Proposal submitted successfully! Redirecting to your proposals...');
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
    return <div className="text-center py-20 text-slate-500">Loading project...</div>;
  }

  if (!project) {
    return <div className="text-center py-20 text-slate-500">Project not found.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header breadcrumb & summary */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start gap-8">
        <div className="space-y-3 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-50 text-brand-indigo border border-indigo-100">
              {project.category}
            </span>
            <span className="text-xs text-slate-400">• Posted {new Date(project.createdAt).toLocaleDateString()}</span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full capitalize">
              {project.status.replace('_', ' ')}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">{project.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Duration: {project.duration}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Deadline: {project.deadline}
            </span>
            <span className="flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5 text-slate-400" />
              {project.workArrangement}
            </span>
          </div>
        </div>

        {/* Budget Card & Apply CTA */}
        <div className="w-full md:w-auto md:text-right flex flex-col items-start md:items-end justify-between border-t md:border-t-0 pt-6 md:pt-0 border-slate-100">
          <div>
            <div className="text-3xl font-extrabold text-brand-navy">
              ${project.budgetMin.toLocaleString()} - ${project.budgetMax.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500 font-medium capitalize mt-1">
              {project.budgetType} Budget • {project.experienceLevel} Tier
            </div>
          </div>

          <div className="mt-6 w-full sm:w-auto">
            {user?.role === 'freelancer' ? (
              <button
                onClick={() => setModalOpen(true)}
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-brand-indigo hover:bg-brand-indigo-dark text-white font-bold text-sm shadow-md shadow-indigo-100 flex items-center justify-center gap-2 transition-all hover:scale-105"
              >
                <Send className="w-4 h-4" />
                <span>Submit a Proposal</span>
              </button>
            ) : user?.role === 'business' ? (
              <div className="text-xs text-slate-500 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
                Logged in as Business Client
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-brand-navy hover:bg-slate-800 text-white font-bold text-sm shadow-sm flex items-center justify-center gap-2"
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
          <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900">Project Overview & Deliverables</h2>
            <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line space-y-2">
              {project.description}
            </div>
          </div>

          {/* Required Skills */}
          <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <h2 className="text-base font-bold text-slate-900">Required Skills & Technologies</h2>
            <div className="flex flex-wrap gap-2">
              {project.requiredSkills.map((s) => (
                <span
                  key={s}
                  className="px-3 py-1 rounded-xl bg-indigo-50 border border-indigo-100 text-brand-indigo text-xs font-semibold"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Client Card & Activity */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900">About the Client</h3>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="font-bold text-sm text-brand-navy">
                {project.business?.companyName || 'Verified Enterprise'}
              </div>
              <div>{project.business?.industry || 'Technology & Innovation'}</div>
              <div className="flex items-center gap-1 text-slate-500 pt-1">
                <ShieldCheck className="w-4 h-4 text-brand-teal" />
                <span>Payment Method Verified</span>
              </div>
              <div className="text-slate-400 pt-2 border-t border-slate-100">
                {project.proposalsCount} proposals received so far
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Proposal Submission Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-brand-navy mb-1">Submit Proposal</h2>
            <p className="text-xs text-slate-500 mb-6">
              Applying to: <span className="font-semibold text-slate-800">{project.title}</span>
            </p>

            {errorMsg && (
              <div className="p-3 mb-4 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 mb-4 rounded-xl bg-emerald-50 text-emerald-700 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleProposalSubmit} className="space-y-5">
              {/* Cover Letter with AI assist */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-800">Cover Letter</label>
                  <button
                    type="button"
                    onClick={handleAiDraft}
                    disabled={aiGenerating}
                    className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-brand-indigo hover:text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100"
                  >
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>{aiGenerating ? 'Generating...' : 'AI Proposal Assistant'}</span>
                  </button>
                </div>
                <textarea
                  rows={6}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Introduce yourself, highlight relevant past work, and explain how you plan to tackle this project..."
                  required
                  className="w-full p-3.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-brand-indigo"
                />
              </div>

              {/* Proposed Price & Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">Your Proposed Bid ($ USD)</label>
                  <input
                    type="number"
                    value={proposedPrice}
                    onChange={(e) => setProposedPrice(e.target.value)}
                    required
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-brand-indigo"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">Estimated Duration</label>
                  <input
                    type="text"
                    value={estimatedDuration}
                    onChange={(e) => setEstimatedDuration(e.target.value)}
                    required
                    placeholder="e.g. 3-4 weeks"
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-brand-indigo"
                  />
                </div>
              </div>

              {/* Milestones Breakdown Notice */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                <div className="font-semibold text-slate-800">Automated Milestone Proposal:</div>
                <div>• Phase 1: Architecture & Design Spec (35%)</div>
                <div>• Phase 2: Core Development & Integration (45%)</div>
                <div>• Phase 3: QA & Production Delivery (20%)</div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-brand-indigo hover:bg-brand-indigo-dark text-white font-bold text-xs shadow-md shadow-indigo-100"
                >
                  {submitting ? 'Submitting...' : 'Send Proposal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
