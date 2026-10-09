import React, { useState, useEffect } from 'react';
import { DollarSign, ShieldCheck, Download, AlertCircle, FileCheck, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';
import { Contract } from '@skillbridge/shared';

export const BusinessPaymentsPage: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);

  useEffect(() => {
    api.getContracts().then((res) => {
      if (res.success) setContracts(res.contracts);
    });
  }, []);

  const allMilestones = contracts.flatMap((c) =>
    (c.milestones || []).map((m) => ({
      ...m,
      contractTitle: c.title,
      freelancerName: c.freelancer?.user?.name || 'Sarah Jenkins',
    }))
  );

  const totalCommitted = contracts.reduce((s, c) => s + c.totalAmount, 0);
  const releasedFunds = allMilestones.filter((m) => m.status === 'paid').reduce((s, m) => s + m.amount, 0);
  const heldInEscrow = totalCommitted - releasedFunds;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Payments & Escrow Billing</h1>
        <p className="text-xs text-slate-500 mt-1">Manage milestone disbursements, invoices, and transaction receipts</p>
      </div>

      {/* Sandbox Escrow Notice */}
      <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-xs text-slate-700 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-brand-teal flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-900 block">Verified Escrow Architecture (Sandbox Provider Active)</span>
          Milestone funds are earmarked upon contract agreement and strictly released only upon your final approval of submitted deliverables. All simulated orders are validated server-side.
        </div>
      </div>

      {/* Stripe-style KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="text-xs text-slate-500 font-medium">Currently Held in Escrow</div>
          <div className="text-3xl font-extrabold text-brand-navy">${heldInEscrow.toLocaleString()}</div>
          <div className="text-[11px] text-slate-400">Guaranteed for in-flight active deliverables</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="text-xs text-slate-500 font-medium">Total Released Payouts</div>
          <div className="text-3xl font-extrabold text-slate-900">${releasedFunds.toLocaleString()}</div>
          <div className="text-[11px] text-emerald-600 font-semibold">100% deliverable satisfaction</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="text-xs text-slate-500 font-medium">Total Contract Commitments</div>
          <div className="text-3xl font-extrabold text-slate-900">${totalCommitted.toLocaleString()}</div>
          <div className="text-[11px] text-slate-400">0% client platform service fee</div>
        </div>
      </div>

      {/* Transaction & Invoices Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-sm text-slate-900">Milestone Invoices & Audit Trail</h2>
          <span className="text-xs text-slate-400">{allMilestones.length} line items</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
              <tr>
                <th className="py-3 px-5">Invoice Reference</th>
                <th className="py-3 px-5">Milestone & Project</th>
                <th className="py-3 px-5">Recipient</th>
                <th className="py-3 px-5">Amount</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allMilestones.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50">
                  <td className="py-3.5 px-5 font-mono text-[11px] text-slate-500">INV-{m.id.slice(-6).toUpperCase()}</td>
                  <td className="py-3.5 px-5">
                    <div className="font-semibold text-slate-900">{m.title}</div>
                    <div className="text-[11px] text-slate-400">{m.contractTitle}</div>
                  </td>
                  <td className="py-3.5 px-5 text-slate-600 font-medium">{m.freelancerName}</td>
                  <td className="py-3.5 px-5 font-bold text-slate-900">${m.amount.toLocaleString()}</td>
                  <td className="py-3.5 px-5">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        m.status === 'paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : m.status === 'submitted'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {m.status === 'paid' ? 'Paid / Released' : m.status === 'submitted' ? 'In Review' : 'Earmarked'}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <button
                      onClick={() => alert(`Downloading formal PDF receipt for ${m.title} ($${m.amount})`)}
                      className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg inline-flex items-center gap-1 text-[11px]"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>PDF</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
