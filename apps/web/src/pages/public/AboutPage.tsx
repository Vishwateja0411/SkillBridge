import React from 'react';
import { Briefcase, Target, ShieldCheck, Heart, Sparkles } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold text-brand-indigo uppercase tracking-wider">Our Mission</span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-navy tracking-tight">
          Bridging Talent and Opportunity
        </h1>
        <p className="text-slate-600 text-base leading-relaxed">
          SkillBridge was founded to build an honest, transparent marketplace where independent engineers and designers collaborate seamlessly with visionary companies.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-brand-indigo flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-slate-900">Explainable AI Matching</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            We reject manipulative bidding wars and hidden ranking metrics. We use an open, documented 6-factor model so clients and freelancers understand every recommendation.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-brand-teal flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-slate-900">Milestone Escrow Protection</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Freelancers shouldn't chase invoices, and clients shouldn't pay for incomplete work. Structured workspaces align milestones, deliverables, and payments safely.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-slate-900">Fair Economics</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            By charging a transparent 5% fee instead of traditional 20% gouging, independent talent retains the fruits of their expertise.
          </p>
        </div>
      </div>
    </div>
  );
};
