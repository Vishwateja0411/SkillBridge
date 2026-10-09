import React, { useState, useEffect } from 'react';
import {
  Users,
  Briefcase,
  CheckSquare,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  RotateCcw,
  History,
  CheckCircle2,
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

  if (loading) return <div className="text-center py-20 text-slate-500">Loading admin metrics...</div>;

  return (
    <div className="space-y-8 pb-16">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Administrative Governance</span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-0.5">Platform Overview & Metrics</h1>
          <p className="text-xs text-slate-500">Real-time aggregated stats across users, contracts, and platform volume</p>
        </div>

        <button
          onClick={handleResetSeed}
          disabled={resetting}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 border border-slate-200 transition-colors"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
          <span>Reset Demo Seed Data</span>
        </button>
      </div>

      {notice && (
        <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{notice}</span>
        </div>
      )}

      {/* KPI Aggregated Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-500">
            <span>Total Registered Users</span>
            <Users className="w-4 h-4 text-brand-navy" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{metrics?.totalUsers || 0}</div>
          <div className="text-[11px] text-slate-400">
            {metrics?.freelancerCount} Freelancers • {metrics?.businessCount} Businesses
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-500">
            <span>Published Projects</span>
            <Briefcase className="w-4 h-4 text-brand-indigo" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{metrics?.publishedProjects || 0}</div>
          <div className="text-[11px] text-emerald-600 font-semibold">
            {metrics?.activeContracts} Active Contracts
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-500">
            <span>Gross Contract Volume</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">${(metrics?.totalVolume || 0).toLocaleString()}</div>
          <div className="text-[11px] text-slate-400">Escrow and milestone commitments</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-500">
            <span>Platform Revenue (5%)</span>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-extrabold text-purple-700">${(metrics?.platformRevenue || 0).toLocaleString()}</div>
          <div className="text-[11px] text-slate-400">Transparent freelancer take-rate</div>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Growth Bar Chart Simulation */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-sm text-slate-900">Monthly User & Volume Growth</h2>
            <span className="text-xs text-slate-400">Last 5 Months</span>
          </div>

          <div className="pt-4 flex items-end justify-between h-48 gap-4 px-2">
            {growthData.map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div className="w-full flex items-end justify-center gap-1.5 h-36">
                  {/* Freelancer bar */}
                  <div
                    className="w-1/2 bg-brand-indigo rounded-t-lg transition-all"
                    style={{ height: `${(d.freelancers / 45) * 100}%` }}
                    title={`${d.freelancers} Freelancers`}
                  />
                  {/* Business bar */}
                  <div
                    className="w-1/2 bg-brand-teal rounded-t-lg transition-all"
                    style={{ height: `${(d.businesses / 25) * 100}%` }}
                    title={`${d.businesses} Businesses`}
                  />
                </div>
                <span className="text-[11px] font-bold text-slate-600">{d.month}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-6 pt-2 border-t border-slate-100 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-brand-indigo" />
              <span>Freelancers</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-brand-teal" />
              <span>Businesses</span>
            </div>
          </div>
        </div>

        {/* Platform Integrity & Operational Summary */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="font-bold text-sm text-slate-900 mb-1">Platform Integrity & Compliance</h2>
            <p className="text-xs text-slate-500">Moderation health and arbitration status</p>

            <div className="mt-4 space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                <span className="font-medium text-slate-700">Open Disputes</span>
                <span className={`font-bold px-2.5 py-0.5 rounded-full ${metrics?.openDisputes > 0 ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'}`}>
                  {metrics?.openDisputes || 0} Cases
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                <span className="font-medium text-slate-700">Completed Contracts</span>
                <span className="font-bold text-slate-900">{metrics?.completedProjects || 0} Delivered</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                <span className="font-medium text-slate-700">Verification Engine</span>
                <span className="font-bold text-brand-teal flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" />
                  Active
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50 text-purple-900 text-xs space-y-1">
            <span className="font-bold block">Security Role Enforcement:</span>
            Backend RBAC verifies JWT tokens and rejects any unauthorized modification of sensitive administrative or transactional records.
          </div>
        </div>
      </div>
    </div>
  );
};
