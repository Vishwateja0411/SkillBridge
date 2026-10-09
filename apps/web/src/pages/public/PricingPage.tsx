import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ShieldCheck, Zap, Building2, HelpCircle } from 'lucide-react';

export const PricingPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold text-brand-indigo uppercase tracking-wider">Transparent & Fair</span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-navy tracking-tight">
          Simple, Predictable Platform Pricing
        </h1>
        <p className="text-slate-600 text-base leading-relaxed">
          No hidden fees, no opaque markup. Businesses post and hire for free, and freelancers keep 95% of their hard-earned milestone payments.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Businesses */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
          <div>
            <span className="text-xs font-bold text-brand-navy uppercase tracking-wider bg-slate-100 px-3 py-1 rounded-full">
              For Businesses
            </span>
            <div className="mt-4">
              <span className="text-4xl font-extrabold text-brand-navy">0%</span>
              <span className="text-xs text-slate-500 font-medium ml-1">Client Platform Fee</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Post unlimited projects and hire verified specialists without fee inflation.
            </p>

            <ul className="mt-6 space-y-3 text-xs text-slate-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Unlimited project postings</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>AI matching recommendations</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Milestone review & approval tools</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Real-time team chat & file transfer</span>
              </li>
            </ul>
          </div>

          <Link
            to="/business/projects/new"
            className="w-full text-center py-3 rounded-xl bg-brand-navy hover:bg-slate-800 text-white font-bold text-xs transition-colors"
          >
            Post a Project Free
          </Link>
        </div>

        {/* Freelancers */}
        <div className="bg-white p-8 rounded-3xl border-2 border-brand-indigo shadow-xl relative flex flex-col justify-between space-y-6">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand-indigo text-white text-[11px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md">
            Most Popular
          </div>
          <div>
            <span className="text-xs font-bold text-brand-indigo uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full">
              For Freelancers
            </span>
            <div className="mt-4">
              <span className="text-4xl font-extrabold text-brand-indigo">5%</span>
              <span className="text-xs text-slate-500 font-medium ml-1">Upon Milestone Payout</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Keep 95% of your contract value. Compare this to the 20% commission on other legacy sites.
            </p>

            <ul className="mt-6 space-y-3 text-xs text-slate-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-indigo" />
                <span>Free portfolio project showcase</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-indigo" />
                <span>Apply to unlimited public projects</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-indigo" />
                <span>AI Proposal Writer & Draft Assistant</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-indigo" />
                <span>Guaranteed milestone payment protection</span>
              </li>
            </ul>
          </div>

          <Link
            to="/register"
            className="w-full text-center py-3 rounded-xl bg-brand-indigo hover:bg-brand-indigo-dark text-white font-bold text-xs transition-colors shadow-md shadow-indigo-100"
          >
            Join as Freelancer
          </Link>
        </div>

        {/* Enterprise */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
          <div>
            <span className="text-xs font-bold text-brand-teal uppercase tracking-wider bg-teal-50 px-3 py-1 rounded-full">
              Enterprise
            </span>
            <div className="mt-4">
              <span className="text-4xl font-extrabold text-brand-navy">Custom</span>
              <span className="text-xs text-slate-500 font-medium ml-1">For High-Volume Orgs</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Dedicated account manager, custom NDAs, consolidated invoicing, and SOC2 compliance.
            </p>

            <ul className="mt-6 space-y-3 text-xs text-slate-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-teal" />
                <span>Dedicated talent scout & matching</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-teal" />
                <span>Custom master service agreements</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-teal" />
                <span>Single sign-on (SSO) & audit logs</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-teal" />
                <span>Priority dispute arbitration support</span>
              </li>
            </ul>
          </div>

          <Link
            to="/contact"
            className="w-full text-center py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
          >
            Contact Enterprise Sales
          </Link>
        </div>
      </div>
    </div>
  );
};
