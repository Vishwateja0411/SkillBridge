import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Users,
  Briefcase,
  Layers,
  FileCheck,
  CreditCard,
  MessageSquare,
  Award,
} from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold text-brand-indigo uppercase tracking-wider">Platform Architecture</span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-navy tracking-tight">
          How SkillBridge Works
        </h1>
        <p className="text-slate-600 text-base leading-relaxed">
          From job posting to milestone signoff: an intelligent, transparent platform designed to replace chaotic freelance directories with structured project success.
        </p>
      </div>

      {/* Two columns: For Businesses vs For Freelancers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Business Journey */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-brand-indigo flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-brand-navy">The Client Journey</h2>
              <p className="text-xs text-slate-500">How businesses discover and collaborate with top talent</p>
            </div>
          </div>

          <div className="space-y-6 text-xs text-slate-600">
            <div className="flex gap-4">
              <div className="w-7 h-7 rounded-full bg-brand-navy text-white flex items-center justify-center font-bold flex-shrink-0">1</div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Post a Project with AI Assistance</h3>
                <p className="mt-1 leading-relaxed">Define deliverables, required skills, and budget. Our AI helper extracts keywords and optimizes requirements.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-7 h-7 rounded-full bg-brand-navy text-white flex items-center justify-center font-bold flex-shrink-0">2</div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Review Explainable Matches</h3>
                <p className="mt-1 leading-relaxed">View proposals ranked by transparent compatibility percentages: skill overlap, verified ratings, and similar portfolio items.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-7 h-7 rounded-full bg-brand-navy text-white flex items-center justify-center font-bold flex-shrink-0">3</div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Execute in Milestone Workspaces</h3>
                <p className="mt-1 leading-relaxed">Accept proposals into contracts with dedicated workspace tools: file uploads, revision requests, and live chat.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-7 h-7 rounded-full bg-brand-navy text-white flex items-center justify-center font-bold flex-shrink-0">4</div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Approve Deliverables & Release Payout</h3>
                <p className="mt-1 leading-relaxed">Funds are only released once you inspect and approve each milestone deliverable.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Freelancer Journey */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-brand-teal flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-brand-navy">The Freelancer Journey</h2>
              <p className="text-xs text-slate-500">How independent specialists win high-value contracts</p>
            </div>
          </div>

          <div className="space-y-6 text-xs text-slate-600">
            <div className="flex gap-4">
              <div className="w-7 h-7 rounded-full bg-brand-teal text-white flex items-center justify-center font-bold flex-shrink-0">1</div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Curate Your Verified Profile</h3>
                <p className="mt-1 leading-relaxed">Showcase portfolio items with live links, verified skills, and background credentials.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-7 h-7 rounded-full bg-brand-teal text-white flex items-center justify-center font-bold flex-shrink-0">2</div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Apply with AI Proposal Assistant</h3>
                <p className="mt-1 leading-relaxed">Draft tailored bids with structured milestone breakdowns and relevant past experience talking points.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-7 h-7 rounded-full bg-brand-teal text-white flex items-center justify-center font-bold flex-shrink-0">3</div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Deliver in Protected Workspaces</h3>
                <p className="mt-1 leading-relaxed">Work directly with clients in real-time chat, upload project links, and request reviews with full version audit trails.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-7 h-7 rounded-full bg-brand-teal text-white flex items-center justify-center font-bold flex-shrink-0">4</div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Receive Payouts with 5% Fee</h3>
                <p className="mt-1 leading-relaxed">Keep 95% of your earnings. Build your public reputation and accumulate 5-star verified reviews.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Matching formula deep dive */}
      <div className="bg-gradient-to-r from-brand-navy to-slate-900 text-white rounded-3xl p-10 sm:p-14 space-y-6">
        <div className="max-w-3xl space-y-2">
          <span className="text-xs font-bold text-brand-teal uppercase tracking-wider">Explainable AI</span>
          <h2 className="text-2xl sm:text-3xl font-bold">The 6-Factor Matching Formula</h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Unlike black-box algorithms, SkillBridge computes transparent compatibility scores based on verified real-world signals:
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 pt-4">
          <div className="bg-white/10 p-4 rounded-xl text-center">
            <div className="text-2xl font-bold text-brand-teal">35%</div>
            <div className="text-xs text-slate-300 mt-1 font-semibold">Skill Overlap</div>
          </div>
          <div className="bg-white/10 p-4 rounded-xl text-center">
            <div className="text-2xl font-bold text-brand-teal">20%</div>
            <div className="text-xs text-slate-300 mt-1 font-semibold">Experience Tier</div>
          </div>
          <div className="bg-white/10 p-4 rounded-xl text-center">
            <div className="text-2xl font-bold text-brand-teal">20%</div>
            <div className="text-xs text-slate-300 mt-1 font-semibold">Portfolio Match</div>
          </div>
          <div className="bg-white/10 p-4 rounded-xl text-center">
            <div className="text-2xl font-bold text-brand-teal">10%</div>
            <div className="text-xs text-slate-300 mt-1 font-semibold">Client Rating</div>
          </div>
          <div className="bg-white/10 p-4 rounded-xl text-center">
            <div className="text-2xl font-bold text-brand-teal">10%</div>
            <div className="text-xs text-slate-300 mt-1 font-semibold">Budget Fit</div>
          </div>
          <div className="bg-white/10 p-4 rounded-xl text-center">
            <div className="text-2xl font-bold text-brand-teal">5%</div>
            <div className="text-xs text-slate-300 mt-1 font-semibold">Availability</div>
          </div>
        </div>
      </div>
    </div>
  );
};
