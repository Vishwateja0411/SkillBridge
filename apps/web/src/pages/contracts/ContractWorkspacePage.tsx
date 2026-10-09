import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckSquare,
  Clock,
  DollarSign,
  Send,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  RefreshCw,
  FileCheck,
  ChevronRight,
  Sparkles,
  Star,
  X,
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Contract, Milestone, Message, User } from '@skillbridge/shared';

export const ContractWorkspacePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [contract, setContract] = useState<Contract | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [activeTab, setActiveTab] = useState<'milestones' | 'chat' | 'terms'>('milestones');
  const [loading, setLoading] = useState(true);

  // Deliverable submission modal (Freelancer)
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [activeMilestoneId, setActiveMilestoneId] = useState('');
  const [deliverableUrl, setDeliverableUrl] = useState('');
  const [deliverableNotes, setDeliverableNotes] = useState('');

  // Revision request modal (Business)
  const [revisionModalOpen, setRevisionModalOpen] = useState(false);
  const [revisionNotes, setRevisionNotes] = useState('');

  // Review modal (on complete)
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');

  const [actionSuccess, setActionSuccess] = useState('');

  const loadContract = async () => {
    if (!id) return;
    try {
      const res = await api.getContractById(id);
      if (res.success) {
        setContract(res.contract);

        // Load conversation
        const convRes = await api.getConversations();
        if (convRes.success && convRes.conversations.length > 0) {
          const matchingConv = convRes.conversations.find((c: any) => c.contractId === id) || convRes.conversations[0];
          if (matchingConv) {
            const msgRes = await api.getMessages(matchingConv.id);
            if (msgRes.success) setMessages(msgRes.messages);
          }
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContract();
  }, [id]);

  const handleDeliverableSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract || !activeMilestoneId) return;

    const res = await api.submitMilestoneDeliverable(contract.id, activeMilestoneId, {
      deliverableUrl,
      deliverableNotes,
    });

    if (res.success) {
      setSubmitModalOpen(false);
      setDeliverableUrl('');
      setDeliverableNotes('');
      setActionSuccess('Deliverables submitted successfully! Client has been notified.');
      await loadContract();
    }
  };

  const handleApproveMilestone = async (milestoneId: string) => {
    if (!contract) return;
    const res = await api.approveMilestone(contract.id, milestoneId);
    if (res.success) {
      setActionSuccess('Milestone approved! Funds successfully released to freelancer.');
      await loadContract();
    }
  };

  const handleRevisionRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract || !activeMilestoneId) return;
    const res = await api.requestMilestoneRevision(contract.id, activeMilestoneId, {
      revisionNotes,
    });
    if (res.success) {
      setRevisionModalOpen(false);
      setRevisionNotes('');
      setActionSuccess('Revision request submitted to freelancer.');
      await loadContract();
    }
  };

  const handleCompleteContract = async () => {
    if (!contract) return;
    const res = await api.completeContract(contract.id);
    if (res.success) {
      setActionSuccess('Contract marked as completed! You can now leave a verified review.');
      await loadContract();
      setReviewModalOpen(true);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract) return;
    const otherUserId = user?.role === 'business' ? contract.freelancer?.userId : contract.business?.userId;
    if (!otherUserId) return;

    const res = await api.submitReview({
      contractId: contract.id,
      reviewedUserId: otherUserId,
      rating,
      feedback,
    });

    if (res.success) {
      setReviewModalOpen(false);
      setActionSuccess('Mutual verified review published!');
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim() || !contract) return;

    // Send message to first conversation
    const convRes = await api.getConversations();
    if (convRes.success && convRes.conversations.length > 0) {
      const conv = convRes.conversations.find((c: any) => c.contractId === contract.id) || convRes.conversations[0];
      const sendRes = await api.sendMessage(conv.id, { text: newMessageText });
      if (sendRes.success) {
        setMessages((prev) => [...prev, sendRes.message]);
        setNewMessageText('');
      }
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-slate-500">Loading project workspace...</div>;
  }

  if (!contract) {
    return <div className="text-center py-20 text-slate-500">Contract not found.</div>;
  }

  const completedMilestones = (contract.milestones || []).filter((m) => m.status === 'paid');
  const progressPercent = Math.round((completedMilestones.length / Math.max(1, contract.milestones.length)) * 100);

  const isBusiness = user?.role === 'business';
  const isFreelancer = user?.role === 'freelancer';

  return (
    <div className="space-y-8 pb-16">
      {/* Workspace Header */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-indigo bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                Active Project Workspace
              </span>
              <span className="text-xs text-slate-400">ID: {contract.id}</span>
              <span className="capitalize text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                {contract.status.replace('_', ' ')}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">{contract.title}</h1>
            <p className="text-xs text-slate-500">
              {isBusiness
                ? `Freelancer: ${contract.freelancer?.user?.name || 'Sarah Jenkins'} (${contract.freelancer?.headline})`
                : `Client: ${contract.business?.companyName || 'TechVentures AI'} (${contract.business?.user?.name})`}
            </p>
          </div>

          <div className="text-left md:text-right">
            <div className="text-2xl font-extrabold text-brand-navy">${contract.totalAmount.toLocaleString()}</div>
            <div className="text-xs text-slate-500 mt-0.5">
              ${completedMilestones.reduce((s, m) => s + m.amount, 0).toLocaleString()} released • {completedMilestones.length}/{contract.milestones.length} milestones
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100">
          <div className="flex justify-between text-xs font-semibold text-slate-600">
            <span>Overall Contract Progress</span>
            <span>{progressPercent}% Complete</span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-brand-indigo h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {actionSuccess && (
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{actionSuccess}</span>
            </div>
            <button onClick={() => setActionSuccess('')} className="text-emerald-500 hover:text-emerald-800">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex gap-4 border-b border-slate-200 pt-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('milestones')}
            className={`pb-3 flex items-center gap-1.5 border-b-2 transition-colors ${
              activeTab === 'milestones' ? 'border-brand-indigo text-brand-indigo' : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>Milestones & Deliverables ({contract.milestones.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`pb-3 flex items-center gap-1.5 border-b-2 transition-colors ${
              activeTab === 'chat' ? 'border-brand-indigo text-brand-indigo' : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Project Chat ({messages.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`pb-3 flex items-center gap-1.5 border-b-2 transition-colors ${
              activeTab === 'terms' ? 'border-brand-indigo text-brand-indigo' : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Terms & Agreements</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Milestones */}
      {activeTab === 'milestones' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Milestone Roadmap</h2>
            {contract.status === 'active' && completedMilestones.length === contract.milestones.length && (
              <button
                onClick={handleCompleteContract}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark Project Fully Completed</span>
              </button>
            )}
          </div>

          <div className="space-y-4">
            {contract.milestones.map((m, idx) => (
              <div
                key={m.id}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <h3 className="font-bold text-sm text-slate-900">{m.title}</h3>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                          m.status === 'paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : m.status === 'submitted'
                            ? 'bg-amber-100 text-amber-800 animate-pulse'
                            : m.status === 'revision_requested'
                            ? 'bg-red-100 text-red-800'
                            : m.status === 'in_progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {m.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed pl-8">{m.description}</p>
                  </div>

                  <div className="text-left sm:text-right pl-8 sm:pl-0">
                    <div className="text-base font-extrabold text-brand-navy">${m.amount.toLocaleString()}</div>
                    <div className="text-[11px] text-slate-400">Due: {m.dueDate}</div>
                  </div>
                </div>

                {/* Deliverable notes if submitted */}
                {m.deliverableUrl && (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                    <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                      <FileCheck className="w-4 h-4 text-brand-indigo" />
                      <span>Submitted Deliverable</span>
                    </div>
                    {m.deliverableNotes && <p className="text-slate-600 italic">"{m.deliverableNotes}"</p>}
                    <div>
                      <a
                        href={m.deliverableUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-brand-indigo font-bold hover:underline"
                      >
                        <span>Access Deliverable Files / Link</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                )}

                {/* Revision notes if requested */}
                {m.revisionNotes && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4" />
                      <span>Revision Notes from Client</span>
                    </div>
                    <p>{m.revisionNotes}</p>
                  </div>
                )}

                {/* Role-specific Actions */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-end gap-3 text-xs">
                  {/* Freelancer submit trigger */}
                  {isFreelancer && (m.status === 'in_progress' || m.status === 'revision_requested') && (
                    <button
                      onClick={() => {
                        setActiveMilestoneId(m.id);
                        setSubmitModalOpen(true);
                      }}
                      className="px-4 py-2 rounded-xl bg-brand-indigo hover:bg-brand-indigo-dark text-white font-bold transition-colors shadow-sm"
                    >
                      Submit Milestone Deliverable
                    </button>
                  )}

                  {/* Business approve / revision triggers */}
                  {isBusiness && m.status === 'submitted' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setActiveMilestoneId(m.id);
                          setRevisionModalOpen(true);
                        }}
                        className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
                      >
                        Request Revision
                      </button>
                      <button
                        onClick={() => handleApproveMilestone(m.id)}
                        className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors shadow-sm"
                      >
                        Approve & Release ${m.amount.toLocaleString()}
                      </button>
                    </div>
                  )}

                  {m.status === 'paid' && (
                    <div className="text-emerald-700 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Paid & Verified</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Project Chat */}
      {activeTab === 'chat' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[600px]">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
            <div className="font-bold text-slate-800">
              Workspace Chat • {isBusiness ? contract.freelancer?.user?.name : contract.business?.companyName}
            </div>
            <div className="flex items-center gap-1.5 text-emerald-600 font-semibold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Real-Time Socket Connected</span>
            </div>
          </div>

          {/* Messages list */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-20 text-xs text-slate-400">
                Start your collaboration chat. All messages are encrypted and logged for contract records.
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.senderId === user?.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                        isMe
                          ? 'bg-brand-indigo text-white rounded-br-none shadow-sm'
                          : 'bg-slate-100 text-slate-800 rounded-bl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 px-1">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          {/* Input form */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 bg-white flex gap-2">
            <input
              type="text"
              value={newMessageText}
              onChange={(e) => setNewMessageText(e.target.value)}
              placeholder="Type message to collaborator..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-brand-indigo"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-brand-navy hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: Terms & Agreement */}
      {activeTab === 'terms' && (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-slate-900">Contractual Master Terms</h2>
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed whitespace-pre-line">
            {contract.terms}
          </div>
          <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs text-slate-600 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-brand-teal flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800 block">SkillBridge Escrow Protection:</span>
              Milestone payouts are held in escrow and only released upon formal approval of submitted deliverables by the client or through administrative arbitration in event of dispute.
            </div>
          </div>
        </div>
      )}

      {/* Submit Deliverable Modal (Freelancer) */}
      {submitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-slate-200 relative">
            <button onClick={() => setSubmitModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-700">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Submit Milestone Deliverables</h3>
            <p className="text-xs text-slate-500 mb-5">Provide links to GitHub, Figma, preview deployment, or file storage.</p>

            <form onSubmit={handleDeliverableSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Deliverable URL / Link</label>
                <input
                  type="url"
                  required
                  value={deliverableUrl}
                  onChange={(e) => setDeliverableUrl(e.target.value)}
                  placeholder="https://github.com/... or https://staging.example.com"
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-brand-indigo"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Submission Notes</label>
                <textarea
                  rows={4}
                  value={deliverableNotes}
                  onChange={(e) => setDeliverableNotes(e.target.value)}
                  placeholder="Summarize what was completed, how to test, or key updates..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-brand-indigo"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSubmitModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-indigo hover:bg-brand-indigo-dark text-white font-bold text-xs"
                >
                  Submit for Client Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Revision Request Modal (Business) */}
      {revisionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-slate-200 relative">
            <button onClick={() => setRevisionModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-700">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Request Milestone Revision</h3>
            <p className="text-xs text-slate-500 mb-5">Detail what needs adjustment before this milestone can be approved.</p>

            <form onSubmit={handleRevisionRequest} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Revision Instructions</label>
                <textarea
                  rows={4}
                  required
                  value={revisionNotes}
                  onChange={(e) => setRevisionNotes(e.target.value)}
                  placeholder="Please fix the responsive table padding on mobile and check API error handling..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-brand-indigo"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRevisionModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-navy hover:bg-slate-800 text-white font-bold text-xs"
                >
                  Send Revision Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mutual Review Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-slate-200 relative">
            <button onClick={() => setReviewModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-700">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Leave a Verified Review</h3>
            <p className="text-xs text-slate-500 mb-5">Rate your experience working on this contract.</p>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-2"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Feedback</label>
                <textarea
                  rows={4}
                  required
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Share details of the collaboration, communication, and code quality..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-brand-indigo"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Skip
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-indigo hover:bg-brand-indigo-dark text-white font-bold text-xs"
                >
                  Publish Verified Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
