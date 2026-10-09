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

  if (loading) return <div className="text-center py-20 text-slate-500">Loading disputes...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dispute Arbitration Panel</h1>
        <p className="text-xs text-slate-500 mt-1">Review contractual complaints, evidence, and issue formal arbitration rulings</p>
      </div>

      {successMsg && (
        <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {disputes.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 text-xs text-slate-400 space-y-2">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
          <div className="font-bold text-slate-700 text-sm">No Active Disputes</div>
          <p>The platform currently has zero unresolved disputes or complaints.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {disputes.map((d) => (
            <div key={d.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="capitalize text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-red-100 text-red-800">
                    {d.status}
                  </span>
                  <h3 className="font-bold text-sm text-slate-900 mt-1">Contract Ref: {d.contractId}</h3>
                  <p className="text-xs text-slate-600 mt-1">Reason: "{d.reason}"</p>
                </div>
                {d.status === 'open' && (
                  <button
                    onClick={() => {
                      setActiveDisputeId(d.id);
                      setResolveModalOpen(true);
                    }}
                    className="px-4 py-2 bg-brand-navy hover:bg-slate-800 text-white font-bold text-xs rounded-xl"
                  >
                    Arbitrate & Resolve
                  </button>
                )}
              </div>
              {d.resolutionNotes && (
                <div className="p-3 rounded-xl bg-slate-50 text-xs text-slate-600 border border-slate-100">
                  <span className="font-bold block text-slate-800">Resolution:</span>
                  {d.resolutionNotes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {resolveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
            <button onClick={() => setResolveModalOpen(false)} className="absolute top-5 right-5 text-slate-400">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold text-slate-900 mb-2">Resolve Dispute</h3>
            <form onSubmit={handleResolve} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Arbitration Ruling Notes</label>
                <textarea
                  rows={4}
                  required
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-brand-indigo"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setResolveModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-navy text-white font-bold text-xs"
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
