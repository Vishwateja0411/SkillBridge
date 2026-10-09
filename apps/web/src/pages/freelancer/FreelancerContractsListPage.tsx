import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckSquare, ArrowRight, ShieldCheck, ChevronRight } from 'lucide-react';
import { api } from '../../services/api';
import { Contract } from '@skillbridge/shared';

export const FreelancerContractsListPage: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getContracts().then((res) => {
      if (res.success) setContracts(res.contracts);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="text-center py-20 text-slate-500">Loading contracts...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Active & Past Contracts</h1>
        <p className="text-xs text-slate-500 mt-1">Access dedicated project workspaces, milestone reviews, and deliverable handoffs</p>
      </div>

      {contracts.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 space-y-4">
          <CheckSquare className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="text-sm font-semibold text-slate-700">No contracts active at this time.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {contracts.map((c) => {
            const completed = (c.milestones || []).filter((m) => m.status === 'paid').length;
            const progress = Math.round((completed / Math.max(1, c.milestones.length)) * 100);

            return (
              <div
                key={c.id}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:border-slate-300 transition-all"
              >
                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className="capitalize text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {c.status.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-slate-400">Started {new Date(c.createdAt).toLocaleDateString()}</span>
                    </div>

                    <Link
                      to={`/freelancer/contracts/${c.id}`}
                      className="text-base font-bold text-slate-900 hover:text-brand-indigo block"
                    >
                      {c.title}
                    </Link>

                    <div className="text-xs text-slate-500">
                      Client: <span className="font-semibold text-slate-700">{c.business?.companyName || 'TechVentures AI'}</span>
                    </div>
                  </div>

                  <div className="text-left sm:text-right flex-shrink-0">
                    <div className="text-xl font-extrabold text-brand-navy">${c.totalAmount.toLocaleString()}</div>
                    <div className="text-[11px] text-slate-400">
                      {completed}/{c.milestones.length} milestones complete
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-brand-indigo h-full rounded-full" style={{ width: `${progress}%` }} />
                </div>

                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">{progress}% Milestone Progress</span>
                  <Link
                    to={`/freelancer/contracts/${c.id}`}
                    className="px-4 py-2 rounded-xl bg-brand-navy hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Open Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
