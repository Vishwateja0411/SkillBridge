import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  CheckSquare,
  MessageSquare,
  ShieldCheck,
  FileCheck,
  Star,
  X,
  ExternalLink,
  AlertCircle,
  Send,
  Check,
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Contract, Message } from '@skillbridge/shared';

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
          const conv = convRes.conversations.find((c: any) => c.contractId === id) || convRes.conversations[0];
          const msgRes = await api.getMessages(conv.id);
          if (msgRes.success) setMessages(msgRes.messages);
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
      setActionSuccess('Milestone deliverable submitted for review!');
      await loadContract();
    }
  };

  const handleApproveMilestone = async (milestoneId: string) => {
    if (!contract) return;
    if (confirm('Approve milestone deliverables and release escrow funds?')) {
      const res = await api.approveMilestone(contract.id, milestoneId);
      if (res.success) {
        setActionSuccess('Milestone approved and escrow funds released!');
        await loadContract();
      }
    }
  };

  const handleRevisionRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract || !activeMilestoneId) return;
    const res = await api.requestMilestoneRevision(contract.id, activeMilestoneId, revisionNotes);
    if (res.success) {
      setRevisionModalOpen(false);
      setRevisionNotes('');
      setActionSuccess('Revision request sent to talent!');
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
    return <div className="text-center py-20 text-[#9DB5A8] bg-[#0B3D2E] min-h-screen">Loading workspace...</div>;
  }

  if (!contract) {
    return <div className="text-center py-20 text-[#9DB5A8] bg-[#0B3D2E] min-h-screen">Contract not found.</div>;
  }

  const completedMilestones = (contract.milestones || []).filter((m) => m.status === 'paid');
  const progressPercent = Math.round((completedMilestones.length / Math.max(1, contract.milestones.length)) * 100);

  const isBusiness = user?.role === 'business';
  const isFreelancer = user?.role === 'freelancer';

  return (
    <div className="space-y-8 pb-16 text-[#F6F1E4]">
      {/* Workspace Header */}
      <div className="bg-[#114A39] p-8 rounded-[12px] border border-[#1F5A46] shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#C9A24B] bg-[#072A20] px-2.5 py-0.5 rounded-[4px] border border-[#1F5A46]">
                Contract Workspace
              </span>
              <span className="text-xs text-[#9DB5A8]">ID: {contract.id}</span>
              <span className="capitalize text-xs font-medium text-[#7BC49A] bg-[#072A20] px-2 py-0.5 rounded-[4px] border border-[#1F5A46]">
                {contract.status.replace('_', ' ')}
              </span>
            </div>
            <h1 className="font-serif text-3xl font-medium text-[#F6F1E4]">{contract.title}</h1>
            <p className="text-xs text-[#BFD0C6]">
              {isBusiness
                ? `Talent: ${contract.freelancer?.user?.name || 'Sarah Jenkins'} (${contract.freelancer?.headline})`
                : `Client: ${contract.business?.companyName || 'TechVentures AI'} (${contract.business?.user?.name})`}
            </p>
          </div>

          <div className="text-left md:text-right">
            <div className="font-serif text-3xl font-medium text-[#E5CB86]">${contract.totalAmount.toLocaleString()}</div>
            <div className="text-xs text-[#BFD0C6] mt-0.5">
              ${completedMilestones.reduce((s, m) => s + m.amount, 0).toLocaleString()} released • {completedMilestones.length}/{contract.milestones.length} milestones
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5 pt-2 border-t border-[#1F5A46]">
          <div className="flex justify-between text-xs font-medium text-[#BFD0C6]">
            <span>Overall Contract Progress</span>
            <span className="text-[#E5CB86]">{progressPercent}% Complete</span>
          </div>
          <div className="w-full bg-[#072A20] h-2 rounded-full overflow-hidden border border-[#1F5A46]">
            <div
              className="bg-[#C9A24B] h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {actionSuccess && (
          <div className="p-3 rounded-[6px] bg-[#7BC49A]/15 border border-[#7BC49A]/30 text-[#7BC49A] text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 flex-shrink-0" />
              <span>{actionSuccess}</span>
            </div>
            <button onClick={() => setActionSuccess('')} className="text-[#7BC49A] hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex gap-4 border-b border-[#1F5A46] pt-2 text-xs font-medium">
          <button
            onClick={() => setActiveTab('milestones')}
            className={`pb-3 flex items-center gap-1.5 border-b-2 transition-colors ${
              activeTab === 'milestones'
                ? 'border-[#C9A24B] text-[#E5CB86]'
                : 'border-transparent text-[#9DB5A8] hover:text-[#F6F1E4]'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>Milestones & Deliverables ({contract.milestones.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`pb-3 flex items-center gap-1.5 border-b-2 transition-colors ${
              activeTab === 'chat'
                ? 'border-[#C9A24B] text-[#E5CB86]'
                : 'border-transparent text-[#9DB5A8] hover:text-[#F6F1E4]'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Project Chat ({messages.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`pb-3 flex items-center gap-1.5 border-b-2 transition-colors ${
              activeTab === 'terms'
                ? 'border-[#C9A24B] text-[#E5CB86]'
                : 'border-transparent text-[#9DB5A8] hover:text-[#F6F1E4]'
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
            <h2 className="font-serif text-2xl font-medium text-[#F6F1E4]">Milestone Roadmap</h2>
            {contract.status === 'active' && completedMilestones.length === contract.milestones.length && (
              <button
                onClick={handleCompleteContract}
                className="px-4 py-2 rounded-[6px] bg-[#7BC49A] hover:bg-[#68B388] text-[#072A20] font-semibold text-xs flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Mark Project Fully Completed</span>
              </button>
            )}
          </div>

          <div className="space-y-4">
            {contract.milestones.map((m, idx) => (
              <div
                key={m.id}
                className="bg-[#114A39] p-6 rounded-[12px] border border-[#1F5A46] shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#072A20] text-[#E5CB86] text-xs font-serif flex items-center justify-center border border-[#1F5A46]">
                        {idx + 1}
                      </span>
                      <h3 className="font-serif text-lg font-medium text-[#F6F1E4]">{m.title}</h3>
                      <span
                        className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-[4px] border ${
                          m.status === 'paid'
                            ? 'bg-[#072A20] text-[#7BC49A] border-[#7BC49A]/40'
                            : m.status === 'submitted'
                            ? 'bg-[#072A20] text-[#E5CB86] border-[#C9A24B]/40 animate-pulse'
                            : m.status === 'revision_requested'
                            ? 'bg-[#072A20] text-[#E27C6B] border-[#E27C6B]/40'
                            : 'bg-[#072A20] text-[#BFD0C6] border-[#1F5A46]'
                        }`}
                      >
                        {m.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-[#BFD0C6] leading-relaxed pl-8">{m.description}</p>
                  </div>

                  <div className="text-left sm:text-right pl-8 sm:pl-0">
                    <div className="font-serif text-xl font-medium text-[#E5CB86]">${m.amount.toLocaleString()}</div>
                    <div className="text-[11px] text-[#9DB5A8]">Due: {m.dueDate}</div>
                  </div>
                </div>

                {/* Deliverable notes if submitted */}
                {m.deliverableUrl && (
                  <div className="p-4 rounded-[8px] bg-[#072A20] border border-[#1F5A46] text-xs space-y-2">
                    <div className="font-semibold text-[#F6F1E4] flex items-center gap-1.5">
                      <FileCheck className="w-4 h-4 text-[#C9A24B]" />
                      <span>Submitted Deliverable</span>
                    </div>
                    {m.deliverableNotes && <p className="text-[#BFD0C6] italic">"{m.deliverableNotes}"</p>}
                    <div>
                      <a
                        href={m.deliverableUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-[#E5CB86] font-medium hover:underline"
                      >
                        <span>Inspect Deliverables</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                )}

                {/* Revision notes if requested */}
                {m.revisionNotes && (
                  <div className="p-4 rounded-[8px] bg-[#072A20] border border-[#E27C6B]/40 text-xs text-[#E27C6B] space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4" />
                      <span>Revision Instructions from Client</span>
                    </div>
                    <p className="text-[#BFD0C6]">{m.revisionNotes}</p>
                  </div>
                )}

                {/* Role-specific Actions */}
                <div className="pt-3 border-t border-[#1F5A46] flex flex-wrap items-center justify-end gap-3 text-xs">
                  {isFreelancer && (m.status === 'in_progress' || m.status === 'revision_requested') && (
                    <button
                      onClick={() => {
                        setActiveMilestoneId(m.id);
                        setSubmitModalOpen(true);
                      }}
                      className="px-4 py-2 rounded-[6px] bg-[#C9A24B] hover:bg-[#E5CB86] text-[#0B3D2E] font-semibold transition-colors"
                    >
                      Submit Milestone Deliverable
                    </button>
                  )}

                  {isBusiness && m.status === 'submitted' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setActiveMilestoneId(m.id);
                          setRevisionModalOpen(true);
                        }}
                        className="px-4 py-2 rounded-[6px] bg-[#072A20] hover:bg-[#0B3D2E] text-[#BFD0C6] hover:text-[#F6F1E4] border border-[#1F5A46]"
                      >
                        Request Revision
                      </button>
                      <button
                        onClick={() => handleApproveMilestone(m.id)}
                        className="px-5 py-2 rounded-[6px] bg-[#7BC49A] hover:bg-[#68B388] text-[#072A20] font-semibold shadow-sm"
                      >
                        Approve & Release ${m.amount.toLocaleString()}
                      </button>
                    </div>
                  )}

                  {m.status === 'paid' && (
                    <div className="text-[#7BC49A] font-medium flex items-center gap-1">
                      <Check className="w-4 h-4 text-[#7BC49A]" />
                      <span>Paid & Verified in Escrow</span>
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
        <div className="bg-[#114A39] rounded-[12px] border border-[#1F5A46] shadow-sm overflow-hidden flex flex-col h-[550px]">
          <div className="p-4 border-b border-[#1F5A46] bg-[#072A20] flex items-center justify-between text-xs">
            <div className="font-serif text-base font-medium text-[#F6F1E4]">
              Workspace Chat • {isBusiness ? contract.freelancer?.user?.name : contract.business?.companyName}
            </div>
            <div className="flex items-center gap-1.5 text-[#7BC49A] font-medium text-[11px]">
              <span className="w-2 h-2 rounded-full bg-[#7BC49A] animate-pulse" />
              <span>Real-Time Socket Connected</span>
            </div>
          </div>

          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-20 text-xs text-[#9DB5A8]">
                Start your collaboration chat. All messages are encrypted and logged for contract records.
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.senderId === user?.id;
                return (
                  <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`max-w-md p-3 rounded-[8px] text-xs leading-relaxed border ${
                        isMe
                          ? 'bg-[#C9A24B] text-[#0B3D2E] border-[#C9A24B] font-medium'
                          : 'bg-[#072A20] text-[#F6F1E4] border-[#1F5A46]'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-[#9DB5A8] mt-1 px-1">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          <form onSubmit={handleSendMessage} className="p-3 border-t border-[#1F5A46] bg-[#072A20] flex gap-2">
            <input
              type="text"
              value={newMessageText}
              onChange={(e) => setNewMessageText(e.target.value)}
              placeholder="Type message to collaborator..."
              className="flex-1 px-4 py-2 rounded-[6px] bg-[#114A39] border border-[#1F5A46] text-xs text-[#F6F1E4] placeholder:text-[#9DB5A8] focus:outline-none focus:border-[#C9A24B]"
            />
            <button
              type="submit"
              className="px-5 py-2 rounded-[6px] bg-[#C9A24B] hover:bg-[#E5CB86] text-[#0B3D2E] font-semibold text-xs transition-colors flex items-center gap-1.5"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: Terms & Agreement */}
      {activeTab === 'terms' && (
        <div className="bg-[#114A39] p-8 rounded-[12px] border border-[#1F5A46] shadow-sm space-y-6">
          <h2 className="font-serif text-2xl font-medium text-[#F6F1E4]">Contractual Terms & Master Scope</h2>
          <div className="p-5 rounded-[8px] bg-[#072A20] border border-[#1F5A46] text-xs text-[#BFD0C6] leading-relaxed whitespace-pre-line">
            {contract.terms}
          </div>
          <div className="p-4 rounded-[8px] bg-[#072A20] border border-[#1F5A46] text-xs text-[#BFD0C6] flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#C9A24B] flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-medium text-[#F6F1E4] block mb-0.5">SkillBridge Escrow Standard:</span>
              Milestone payouts are held in escrow and released upon client acceptance of deliverables or administrative arbitration in the event of dispute.
            </div>
          </div>
        </div>
      )}

      {/* Submit Deliverable Modal (Freelancer) */}
      {submitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#114A39] text-[#F6F1E4] rounded-[12px] max-w-lg w-full p-8 shadow-2xl border border-[#1F5A46] relative">
            <button onClick={() => setSubmitModalOpen(false)} className="absolute top-6 right-6 text-[#9DB5A8] hover:text-[#F6F1E4]">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-serif text-2xl font-medium text-[#F6F1E4] mb-1">Submit Milestone Deliverables</h3>
            <p className="text-xs text-[#BFD0C6] mb-5">Provide URLs to GitHub repositories, Figma files, or deployment links.</p>

            <form onSubmit={handleDeliverableSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#F6F1E4] mb-1">Deliverable URL / Link</label>
                <input
                  type="url"
                  required
                  value={deliverableUrl}
                  onChange={(e) => setDeliverableUrl(e.target.value)}
                  placeholder="https://github.com/... or https://preview.example.com"
                  className="w-full p-2.5 rounded-[6px] bg-[#072A20] border border-[#1F5A46] text-xs text-[#F6F1E4] placeholder:text-[#9DB5A8] focus:outline-none focus:border-[#C9A24B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#F6F1E4] mb-1">Submission Notes</label>
                <textarea
                  rows={4}
                  value={deliverableNotes}
                  onChange={(e) => setDeliverableNotes(e.target.value)}
                  placeholder="Summarize what was completed, how to inspect, or relevant notes..."
                  className="w-full p-2.5 rounded-[6px] bg-[#072A20] border border-[#1F5A46] text-xs text-[#F6F1E4] placeholder:text-[#9DB5A8] focus:outline-none focus:border-[#C9A24B]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSubmitModalOpen(false)}
                  className="px-4 py-2 rounded-[6px] text-xs font-medium text-[#BFD0C6] hover:bg-[#072A20]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-[6px] bg-[#C9A24B] hover:bg-[#E5CB86] text-[#0B3D2E] font-semibold text-xs"
                >
                  Submit for Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Revision Request Modal (Business) */}
      {revisionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#114A39] text-[#F6F1E4] rounded-[12px] max-w-lg w-full p-8 shadow-2xl border border-[#1F5A46] relative">
            <button onClick={() => setRevisionModalOpen(false)} className="absolute top-6 right-6 text-[#9DB5A8] hover:text-[#F6F1E4]">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-serif text-2xl font-medium text-[#F6F1E4] mb-1">Request Milestone Revision</h3>
            <p className="text-xs text-[#BFD0C6] mb-5">Describe adjustments required before this milestone can be signed off.</p>

            <form onSubmit={handleRevisionRequest} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#F6F1E4] mb-1">Revision Instructions</label>
                <textarea
                  rows={4}
                  required
                  value={revisionNotes}
                  onChange={(e) => setRevisionNotes(e.target.value)}
                  placeholder="Please update unit test coverage and refine responsive mobile drawer styles..."
                  className="w-full p-2.5 rounded-[6px] bg-[#072A20] border border-[#1F5A46] text-xs text-[#F6F1E4] placeholder:text-[#9DB5A8] focus:outline-none focus:border-[#C9A24B]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRevisionModalOpen(false)}
                  className="px-4 py-2 rounded-[6px] text-xs font-medium text-[#BFD0C6] hover:bg-[#072A20]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-[6px] bg-[#E27C6B] hover:bg-[#d66a59] text-white font-semibold text-xs"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#114A39] text-[#F6F1E4] rounded-[12px] max-w-lg w-full p-8 shadow-2xl border border-[#1F5A46] relative">
            <button onClick={() => setReviewModalOpen(false)} className="absolute top-6 right-6 text-[#9DB5A8] hover:text-[#F6F1E4]">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-serif text-2xl font-medium text-[#F6F1E4] mb-1">Leave a Verified Review</h3>
            <p className="text-xs text-[#BFD0C6] mb-5">Rate your experience collaborating on this contract.</p>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#F6F1E4] mb-1">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1.5"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= rating ? 'fill-[#C9A24B] text-[#C9A24B]' : 'text-[#1F5A46]'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#F6F1E4] mb-1">Feedback</label>
                <textarea
                  rows={4}
                  required
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Share details regarding execution, timeliness, and output quality..."
                  className="w-full p-2.5 rounded-[6px] bg-[#072A20] border border-[#1F5A46] text-xs text-[#F6F1E4] placeholder:text-[#9DB5A8] focus:outline-none focus:border-[#C9A24B]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="px-4 py-2 rounded-[6px] text-xs font-medium text-[#BFD0C6] hover:bg-[#072A20]"
                >
                  Skip
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-[6px] bg-[#C9A24B] hover:bg-[#E5CB86] text-[#0B3D2E] font-semibold text-xs"
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
