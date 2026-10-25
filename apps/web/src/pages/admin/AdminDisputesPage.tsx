import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle2, ShieldCheck, X } from 'lucide-react';
import { api } from '../../services/api';
import { Dispute } from '@skillbridge/shared';

export const AdminDisputesPage: React.FC = () => {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [activeDisputeId, setActiveDisputeId] = useState('');
  const [notes, setNotes] = useState('Reviewed deliverable history and chat logs. Resolution issued.');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchDisputes = async () => {
    const res = await api.getDisputes();
    if (res.success) setDisputes(res.disputes);
    setLoading(false);
  };

  useEffect(() => {
    fetchDisputes();
  }, []);

  const handleResolve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDisputeId) return;
    const res = await api.resolveDispute(activeDisputeId, { resolutionNotes: notes });
    if (res.success) {
      setResolveModalOpen(false);
      setSuccessMsg('Dispute resolved and audited.');
      await fetchDisputes();
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  if (loading) return <div className="text-center py-20 text-[#BFD0C6]">Loading disputes...</div>;

  return (
    <div className="space-y-6">
      <div>
        <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C9A24B]">
          ESCROW GOVERNANCE
        </div>
        <h1 className="font-serif text-3xl font-medium text-[#F6F1E4] mt-1">
          Dispute <span className="italic text-[#E5CB86]">Arbitration</span> Panel
        </h1>
        <p className="text-xs text-[#BFD0C6] mt-1">Review contractual complaints, evidence, and issue formal arbitration rulings</p>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-[6px] bg-[#114A39] border border-[#7BC49A] text-[#7BC49A] text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#7BC49A]" />
          <span>{successMsg}</span>
        </div>
      )}

      {disputes.length === 0 ? (
        <div className="bg-[#114A39] p-12 text-center rounded-[12px] border border-[#1F5A46] text-xs text-[#9DB5A8] space-y-2">
          <CheckCircle2 className="w-8 h-8 text-[#7BC49A] mx-auto" />
          <div className="font-serif text-lg font-medium text-[#F6F1E4]">No Active Disputes</div>
          <p className="text-[#BFD0C6]">The platform currently has zero unresolved disputes or complaints.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {disputes.map((d) => (
            <div key={d.id} className="bg-[#114A39] p-6 rounded-[12px] border border-[#1F5A46] space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="capitalize text-[10px] font-semibold px-2.5 py-0.5 rounded-[4px] bg-[#072A20] border border-[#E27C6B] text-[#E27C6B]">
                    {d.status}
                  </span>
                  <h3 className="font-serif text-lg font-medium text-[#F6F1E4] mt-2">Contract Ref: {d.contractId}</h3>
                  <p className="text-xs text-[#BFD0C6] mt-1">Reason: "{d.reason}"</p>
                </div>
                {d.status === 'open' && (
                  <button
                    onClick={() => {
                      setActiveDisputeId(d.id);
                      setResolveModalOpen(true);
                    }}
                    className="px-4 py-2 bg-[#C9A24B] hover:bg-[#E5CB86] text-[#0B3D2E] font-medium text-xs rounded-[6px] transition-colors"
                  >
                    Arbitrate & Resolve
                  </button>
                )}
              </div>
              {d.resolutionNotes && (
                <div className="p-3 rounded-[6px] bg-[#072A20] text-xs text-[#BFD0C6] border border-[#1F5A46]">
                  <span className="font-medium text-[#E5CB86] block">Resolution:</span>
                  {d.resolutionNotes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {resolveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#072A20]/80">
          <div className="bg-[#114A39] rounded-[12px] max-w-md w-full p-6 border border-[#1F5A46] relative">
            <button onClick={() => setResolveModalOpen(false)} className="absolute top-5 right-5 text-[#9DB5A8] hover:text-[#F6F1E4]">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-serif text-xl font-medium text-[#F6F1E4] mb-2">Resolve Dispute</h3>
            <form onSubmit={handleResolve} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#F6F1E4] mb-1">Arbitration Ruling Notes</label>
                <textarea
                  rows={4}
                  required
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-3 rounded-[6px] bg-[#072A20] border border-[#1F5A46] text-xs text-[#F6F1E4] focus:outline-none focus:border-[#C9A24B]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setResolveModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-[#BFD0C6] hover:bg-[#072A20] rounded-[6px] border border-transparent hover:border-[#1F5A46] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#C9A24B] hover:bg-[#E5CB86] text-[#0B3D2E] font-medium text-xs rounded-[6px] transition-colors"
                >
                  Issue Decision
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
