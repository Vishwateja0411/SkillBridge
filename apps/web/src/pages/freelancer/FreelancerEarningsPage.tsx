import React, { useState, useEffect } from 'react';
import { DollarSign, ArrowUpRight, ShieldCheck, Download, CheckCircle2, TrendingUp } from 'lucide-react';
import { api } from '../../services/api';
import { Contract } from '@skillbridge/shared';

export const FreelancerEarningsPage: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [payoutSuccess, setPayoutSuccess] = useState(false);

  useEffect(() => {
    api.getContracts().then((res) => {
      if (res.success) setContracts(res.contracts);
    });
  }, []);

  const paidMilestones = contracts.flatMap((c) =>
    (c.milestones || []).filter((m) => m.status === 'paid').map((m) => ({ ...m, contractTitle: c.title }))
  );

  const grossEarnings = paidMilestones.reduce((s, m) => s + m.amount, 0);
  const platformFee = Math.round(grossEarnings * 0.05);
  const netEarnings = grossEarnings - platformFee;

  const pendingMilestones = contracts.flatMap((c) =>
    (c.milestones || []).filter((m) => m.status === 'in_progress' || m.status === 'submitted')
  );
  const pendingFunds = pendingMilestones.reduce((s, m) => s + m.amount, 0);

  const handlePayout = () => {
    setPayoutSuccess(true);
    setTimeout(() => setPayoutSuccess(false), 3000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Earnings & Financial Summary</h1>
        <p className="text-xs text-slate-500 mt-1">Track milestone releases, fees, and bank transfers</p>
      </div>

      {payoutSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Payout of ${netEarnings.toLocaleString()} successfully simulated to linked checking account!</span>
        </div>
      )}

      {/* Stripe-style Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="text-xs text-slate-500 font-medium">Net Withdrawable Balance</div>
          <div className="text-3xl font-extrabold text-slate-900">${netEarnings.toLocaleString()}</div>
          <div className="text-[11px] text-slate-400">After 5% SkillBridge platform fee (${platformFee.toLocaleString()})</div>
          <button
            onClick={handlePayout}
            className="mt-3 w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Transfer to Bank Account
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="text-xs text-slate-500 font-medium">Pending in Escrow</div>
          <div className="text-3xl font-extrabold text-brand-navy">${pendingFunds.toLocaleString()}</div>
          <div className="text-[11px] text-slate-400">{pendingMilestones.length} milestones in progress / review</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="text-xs text-slate-500 font-medium">Total Lifetime Gross</div>
          <div className="text-3xl font-extrabold text-slate-900">${grossEarnings.toLocaleString()}</div>
          <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>100% on-time milestone signoffs</span>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-sm text-slate-900">Milestone Payout History</h2>
          <span className="text-xs text-slate-400">{paidMilestones.length} completed transactions</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
              <tr>
                <th className="py-3 px-5">Milestone</th>
                <th className="py-3 px-5">Project</th>
                <th className="py-3 px-5">Gross Amount</th>
                <th className="py-3 px-5">Fee (5%)</th>
                <th className="py-3 px-5">Net Released</th>
                <th className="py-3 px-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paidMilestones.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No completed payout records yet.
                  </td>
                </tr>
              ) : (
                paidMilestones.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50">
                    <td className="py-3.5 px-5 font-semibold text-slate-900">{m.title}</td>
                    <td className="py-3.5 px-5 text-slate-500">{m.contractTitle}</td>
                    <td className="py-3.5 px-5 font-bold text-slate-800">${m.amount.toLocaleString()}</td>
                    <td className="py-3.5 px-5 text-slate-400">-${(m.amount * 0.05).toFixed(2)}</td>
                    <td className="py-3.5 px-5 font-bold text-emerald-700">${(m.amount * 0.95).toFixed(2)}</td>
                    <td className="py-3.5 px-5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Paid
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
