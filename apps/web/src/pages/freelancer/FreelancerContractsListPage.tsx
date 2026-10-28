import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckSquare, ArrowRight, ShieldCheck, ChevronRight } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Contract } from '@skillbridge/shared';

export const FreelancerContractsListPage: React.FC = () => {
  const { user } = useAuth();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);

  const isBusiness = user?.role === 'business';
  const basePath = isBusiness ? '/business/contracts' : '/freelancer/contracts';

  useEffect(() => {
    api.getContracts().then((res) => {
      if (res.success) setContracts(res.contracts);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="text-center py-20 text-[#BFD0C6]">Loading contracts...</div>;

  return (
    <div className="space-y-6">
      <div>
        <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C9A24B]">
          ESCROW & DELIVERABLES
        </div>
        <h1 className="font-serif text-3xl font-medium text-[#F6F1E4] mt-1">
          Active & Past <span className="italic text-[#E5CB86]">Contracts</span>
        </h1>
        <p className="text-xs text-[#BFD0C6] mt-1">Access dedicated project workspaces, milestone reviews, and deliverable handoffs</p>
      </div>

      {contracts.length === 0 ? (
        <div className="bg-[#114A39] p-12 text-center rounded-[12px] border border-[#1F5A46] space-y-4">
          <CheckSquare className="w-12 h-12 text-[#9DB5A8] mx-auto" />
          <p className="text-sm font-medium text-[#F6F1E4]">No contracts active at this time.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {contracts.map((c) => {
            const completed = (c.milestones || []).filter((m) => m.status === 'paid').length;
            const progress = Math.round((completed / Math.max(1, c.milestones.length)) * 100);

            return (
              <div
                key={c.id}
                className="bg-[#114A39] p-6 rounded-[12px] border border-[#1F5A46] space-y-4 hover:border-[#2B6D56] transition-all"
              >
                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className="capitalize text-[10px] font-semibold px-2.5 py-0.5 rounded-[4px] border border-[#7BC49A] text-[#7BC49A] bg-[#072A20]">
                        {c.status.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-[#9DB5A8]">Started {new Date(c.createdAt).toLocaleDateString()}</span>
                    </div>

                    <Link
                      to={`${basePath}/${c.id}`}
                      className="font-serif text-xl font-medium text-[#F6F1E4] hover:text-[#E5CB86] block transition-colors"
                    >
                      {c.title}
                    </Link>

                    <div className="text-xs text-[#BFD0C6]">
                      {isBusiness ? (
                        <>Talent: <span className="font-medium text-[#F6F1E4]">{c.freelancer?.user?.name || 'Assigned Specialist'}</span></>
                      ) : (
                        <>Client: <span className="font-medium text-[#F6F1E4]">{c.business?.companyName || 'TechVentures AI'}</span></>
                      )}
                    </div>
                  </div>

                  <div className="text-left sm:text-right flex-shrink-0">
                    <div className="font-serif text-2xl font-medium text-[#E5CB86]">${c.totalAmount.toLocaleString()}</div>
                    <div className="text-[11px] text-[#9DB5A8]">
                      {completed}/{c.milestones.length} milestones complete
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-[#072A20] h-2 rounded-full overflow-hidden border border-[#1F5A46]">
                  <div className="bg-[#C9A24B] h-full rounded-full transition-all" style={{ width: `${progress}%` }} />
                </div>

                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-[#9DB5A8] font-medium">{progress}% Milestone Progress</span>
                  <Link
                    to={`${basePath}/${c.id}`}
                    className="px-4 py-2 rounded-[6px] bg-[#C9A24B] hover:bg-[#E5CB86] text-[#0B3D2E] font-medium text-xs transition-colors flex items-center gap-1.5"
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
