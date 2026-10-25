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
        <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C9A24B]">
          FINANCIAL LEDGER
        </div>
        <h1 className="font-serif text-3xl font-medium text-[#F6F1E4] mt-1">
          Earnings & <span className="italic text-[#E5CB86]">Financial</span> Summary
        </h1>
        <p className="text-xs text-[#BFD0C6] mt-1">Track milestone releases, transparent fees, and bank transfers</p>
      </div>

      {payoutSuccess && (
        <div className="p-3.5 rounded-[6px] bg-[#114A39] border border-[#7BC49A] text-[#7BC49A] text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#7BC49A]" />
          <span>Payout of ${netEarnings.toLocaleString()} successfully simulated to linked checking account!</span>
        </div>
      )}

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-[#114A39] p-6 rounded-[12px] border border-[#1F5A46] space-y-2">
          <div className="text-xs text-[#BFD0C6] font-medium">Net Withdrawable Balance</div>
          <div className="font-serif text-3xl sm:text-4xl font-medium text-[#E5CB86]">${netEarnings.toLocaleString()}</div>
          <div className="text-[11px] text-[#9DB5A8]">After 5% platform fee (${platformFee.toLocaleString()})</div>
          <button
            onClick={handlePayout}
            className="mt-3 w-full py-2 bg-[#C9A24B] hover:bg-[#E5CB86] text-[#0B3D2E] rounded-[6px] text-xs font-medium transition-colors"
          >
            Transfer to Bank Account
          </button>
        </div>

        <div className="bg-[#114A39] p-6 rounded-[12px] border border-[#1F5A46] space-y-2">
          <div className="text-xs text-[#BFD0C6] font-medium">Pending in Escrow</div>
          <div className="font-serif text-3xl sm:text-4xl font-medium text-[#F6F1E4]">${pendingFunds.toLocaleString()}</div>
          <div className="text-[11px] text-[#9DB5A8]">{pendingMilestones.length} milestones in progress / review</div>
        </div>

        <div className="bg-[#114A39] p-6 rounded-[12px] border border-[#1F5A46] space-y-2">
          <div className="text-xs text-[#BFD0C6] font-medium">Total Lifetime Gross</div>
          <div className="font-serif text-3xl sm:text-4xl font-medium text-[#E5CB86]">${grossEarnings.toLocaleString()}</div>
          <div className="text-[11px] text-[#7BC49A] font-medium flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>100% on-time milestone signoffs</span>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-[#114A39] rounded-[12px] border border-[#1F5A46] overflow-hidden">
        <div className="p-5 border-b border-[#1F5A46] flex items-center justify-between">
          <h2 className="font-serif text-lg font-medium text-[#F6F1E4]">Milestone Payout History</h2>
          <span className="text-xs text-[#9DB5A8]">{paidMilestones.length} completed transactions</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#072A20] text-[#9DB5A8] uppercase tracking-wider text-[10px] font-medium border-b border-[#1F5A46]">
              <tr>
                <th className="py-3 px-5">Milestone</th>
                <th className="py-3 px-5">Project</th>
                <th className="py-3 px-5">Gross Amount</th>
                <th className="py-3 px-5">Fee (5%)</th>
                <th className="py-3 px-5">Net Released</th>
                <th className="py-3 px-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F5A46]">
              {paidMilestones.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#9DB5A8]">
                    No completed payout records yet.
                  </td>
                </tr>
              ) : (
                paidMilestones.map((m) => (
                  <tr key={m.id} className="hover:bg-[#0B3D2E]/50 transition-colors">
                    <td className="py-3.5 px-5 font-medium text-[#F6F1E4]">{m.title}</td>
                    <td className="py-3.5 px-5 text-[#BFD0C6]">{m.contractTitle}</td>
                    <td className="py-3.5 px-5 font-medium text-[#F6F1E4]">${m.amount.toLocaleString()}</td>
                    <td className="py-3.5 px-5 text-[#9DB5A8]">-${(m.amount * 0.05).toFixed(2)}</td>
                    <td className="py-3.5 px-5 font-medium text-[#7BC49A]">${(m.amount * 0.95).toFixed(2)}</td>
                    <td className="py-3.5 px-5">
                      <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-medium bg-[#072A20] border border-[#7BC49A] text-[#7BC49A]">
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
