import React, { useState, useEffect } from 'react';
import {
  Users,
  Briefcase,
  DollarSign,
  TrendingUp,
  RotateCcw,
  Check,
} from 'lucide-react';
import { api } from '../../services/api';

export const AdminDashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [growthData, setGrowthData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);
  const [notice, setNotice] = useState('');

  const fetchStats = async () => {
    try {
      const res = await api.getAdminStats();
      if (res.success) {
        setMetrics(res.metrics);
        setGrowthData(res.growthData || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleResetSeed = async () => {
    if (confirm('Re-seed the entire SkillBridge database back to default demo state?')) {
      setResetting(true);
      const res = await api.resetSeedData();
      if (res.success) {
        setNotice('Database reinitialized to seed state!');
        await fetchStats();
        setTimeout(() => setNotice(''), 3000);
      }
      setResetting(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-[#9DB5A8] bg-[#0B3D2E] min-h-screen">Loading admin metrics...</div>;

  return (
    <div className="space-y-8 pb-16 text-[#F6F1E4]">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <span className="text-[10px] font-semibold text-[#C9A24B] uppercase tracking-wider">
            ADMINISTRATIVE GOVERNANCE
          </span>
          <h1 className="font-serif text-3xl font-medium text-[#F6F1E4] mt-0.5">Platform Overview & Metrics</h1>
          <p className="text-xs text-[#BFD0C6]">Real-time aggregated statistics across users, contracts, and platform volume</p>
        </div>

        <button
          onClick={handleResetSeed}
          disabled={resetting}
          className="px-4 py-2 rounded-[6px] bg-[#072A20] hover:bg-[#0B3D2E] text-[#BFD0C6] hover:text-[#F6F1E4] font-medium text-xs flex items-center gap-2 border border-[#1F5A46] hover:border-[#C9A24B] transition-colors"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin text-[#C9A24B]' : ''}`} />
          <span>Reset Demo Seed Data</span>
        </button>
      </div>

      {notice && (
        <div className="p-3.5 rounded-[6px] bg-[#7BC49A]/15 border border-[#7BC49A]/30 text-[#7BC49A] text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-[#7BC49A]" />
          <span>{notice}</span>
        </div>
      )}

      {/* KPI Aggregated Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-[#114A39] p-5 rounded-[12px] border border-[#1F5A46] shadow-sm space-y-2">
          <div className="flex justify-between items-center text-xs text-[#BFD0C6]">
            <span>Total Registered Users</span>
            <Users className="w-4 h-4 text-[#C9A24B]" />
          </div>
          <div className="font-serif text-3xl font-medium text-[#F6F1E4]">{metrics?.totalUsers || 0}</div>
          <div className="text-[11px] text-[#9DB5A8]">
            {metrics?.freelancerCount} Freelancers • {metrics?.businessCount} Businesses
          </div>
        </div>

        <div className="bg-[#114A39] p-5 rounded-[12px] border border-[#1F5A46] shadow-sm space-y-2">
          <div className="flex justify-between items-center text-xs text-[#BFD0C6]">
            <span>Published Projects</span>
            <Briefcase className="w-4 h-4 text-[#E5CB86]" />
          </div>
          <div className="font-serif text-3xl font-medium text-[#F6F1E4]">{metrics?.publishedProjects || 0}</div>
          <div className="text-[11px] text-[#7BC49A]">
            {metrics?.activeContracts} Active Contracts
          </div>
        </div>

        <div className="bg-[#114A39] p-5 rounded-[12px] border border-[#1F5A46] shadow-sm space-y-2">
          <div className="flex justify-between items-center text-xs text-[#BFD0C6]">
            <span>Gross Contract Volume</span>
            <DollarSign className="w-4 h-4 text-[#7BC49A]" />
          </div>
          <div className="font-serif text-3xl font-medium text-[#E5CB86]">${(metrics?.totalVolume || 0).toLocaleString()}</div>
          <div className="text-[11px] text-[#9DB5A8]">Escrow commitments</div>
        </div>

        <div className="bg-[#114A39] p-5 rounded-[12px] border border-[#1F5A46] shadow-sm space-y-2">
          <div className="flex justify-between items-center text-xs text-[#BFD0C6]">
            <span>Platform Revenue (5%)</span>
            <TrendingUp className="w-4 h-4 text-[#C9A24B]" />
          </div>
          <div className="font-serif text-3xl font-medium text-[#E5CB86]">${(metrics?.platformRevenue || 0).toLocaleString()}</div>
          <div className="text-[11px] text-[#9DB5A8]">Transparent 5% fee</div>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Growth Bar Chart Simulation */}
        <div className="bg-[#114A39] p-6 rounded-[12px] border border-[#1F5A46] shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-serif text-xl font-medium text-[#F6F1E4]">Monthly User & Volume Velocity</h2>
            <span className="text-xs text-[#9DB5A8]">Last 5 Months</span>
          </div>

          <div className="pt-4 flex items-end justify-between h-48 gap-4 px-2">
            {growthData.map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div className="w-full flex items-end justify-center gap-1.5 h-36">
                  {/* Freelancer bar */}
                  <div
                    className="w-1/2 bg-[#C9A24B] rounded-t-[4px] transition-all"
                    style={{ height: `${(d.freelancers / 45) * 100}%` }}
                    title={`${d.freelancers} Freelancers`}
                  />
                  {/* Business bar */}
                  <div
                    className="w-1/2 bg-[#7BC49A] rounded-t-[4px] transition-all"
                    style={{ height: `${(d.businesses / 25) * 100}%` }}
                    title={`${d.businesses} Businesses`}
                  />
                </div>
                <span className="text-[11px] font-medium text-[#BFD0C6]">{d.month}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-6 pt-3 border-t border-[#1F5A46] text-xs text-[#BFD0C6]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-[2px] bg-[#C9A24B]" />
              <span>Talent</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-[2px] bg-[#7BC49A]" />
              <span>Clients</span>
            </div>
          </div>
        </div>

        {/* Platform Integrity & Operational Summary */}
        <div className="bg-[#114A39] p-6 rounded-[12px] border border-[#1F5A46] shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="font-serif text-xl font-medium text-[#F6F1E4] mb-1">Platform Governance & Health</h2>
            <p className="text-xs text-[#BFD0C6]">Moderation status and arbitration queues</p>

            <div className="mt-4 space-y-3 text-xs">
              <div className="p-3 rounded-[6px] bg-[#072A20] border border-[#1F5A46] flex justify-between items-center">
                <span className="text-[#BFD0C6]">Open Disputes</span>
                <span className={`px-2.5 py-0.5 rounded-[4px] font-medium ${metrics?.openDisputes > 0 ? 'bg-[#E27C6B]/20 text-[#E27C6B] border border-[#E27C6B]/40' : 'bg-[#7BC49A]/20 text-[#7BC49A]'}`}>
                  {metrics?.openDisputes || 0} Cases
                </span>
              </div>
              <div className="p-3 rounded-[6px] bg-[#072A20] border border-[#1F5A46] flex justify-between items-center">
                <span className="text-[#BFD0C6]">Pending Identity Verifications</span>
                <span className="px-2.5 py-0.5 rounded-[4px] bg-[#114A39] text-[#E5CB86] border border-[#1F5A46] font-medium">
                  {metrics?.pendingVerifications || 0} Profiles
                </span>
              </div>
              <div className="p-3 rounded-[6px] bg-[#072A20] border border-[#1F5A46] flex justify-between items-center">
                <span className="text-[#BFD0C6]">Active Milestones in Escrow</span>
                <span className="px-2.5 py-0.5 rounded-[4px] bg-[#114A39] text-[#7BC49A] border border-[#1F5A46] font-medium">
                  {metrics?.activeContracts || 0} Milestones
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#1F5A46] text-[11px] text-[#9DB5A8]">
            Immutable governance ledger running on encrypted database store.
          </div>
        </div>
      </div>
    </div>
  );
};
