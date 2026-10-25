import React from 'react';
import { Link } from 'react-router-dom';
import { Check, ShieldCheck } from 'lucide-react';

export const PricingPage: React.FC = () => {
  return (
    <div className="bg-[#0B3D2E] text-[#F6F1E4] min-h-screen py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C9A24B]">
            TRANSPARENT TERMS
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium text-[#F6F1E4]">
            Simple, <span className="italic text-[#E5CB86]">Predictable</span> Fee Schedule.
          </h1>
          <p className="text-xs sm:text-sm text-[#BFD0C6] leading-relaxed max-w-2xl mx-auto">
            No disguised markup or opaque fees. Clients post and hire at 0% platform surcharge, and independent talent retains 95% of every milestone payout.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Businesses */}
          <div className="bg-[#114A39] p-8 rounded-[12px] border border-[#1F5A46] flex flex-col justify-between space-y-6 shadow-sm">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#C9A24B] bg-[#072A20] px-3 py-1 rounded-[4px] border border-[#1F5A46]">
                For Businesses
              </span>
              <div className="mt-5">
                <span className="font-serif text-5xl font-medium text-[#F6F1E4]">0%</span>
                <span className="text-xs text-[#BFD0C6] ml-2">Client Platform Surcharge</span>
              </div>
              <p className="text-xs text-[#BFD0C6] mt-2 leading-relaxed">
                Post unlimited opportunities and hire verified specialists without fee inflation.
              </p>

              <ul className="mt-6 space-y-3 text-xs text-[#F6F1E4]">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#C9A24B]" />
                  <span>Unlimited project listings</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#C9A24B]" />
                  <span>Explainable 6-factor candidate scoring</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#C9A24B]" />
                  <span>Milestone review & escrow release tools</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#C9A24B]" />
                  <span>Real-time contract workspaces & audit ledger</span>
                </li>
              </ul>
            </div>

            <Link
              to="/business/projects/new"
              className="w-full text-center py-3 rounded-[6px] bg-[#072A20] hover:bg-[#0B3D2E] text-[#F6F1E4] border border-[#1F5A46] hover:border-[#C9A24B] font-semibold text-xs transition-colors"
            >
              Post an Opportunity
            </Link>
          </div>

          {/* Freelancers */}
          <div className="bg-[#114A39] p-8 rounded-[12px] border border-[#C9A24B] relative flex flex-col justify-between space-y-6 shadow-lg">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#C9A24B] text-[#0B3D2E] text-[10px] font-semibold uppercase tracking-wider px-3.5 py-0.5 rounded-[4px]">
              Standard Membership
            </div>
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#0B3D2E] bg-[#C9A24B] px-3 py-1 rounded-[4px]">
                For Professionals
              </span>
              <div className="mt-5">
                <span className="font-serif text-5xl font-medium text-[#E5CB86]">5%</span>
                <span className="text-xs text-[#BFD0C6] ml-2">Upon Milestone Payout</span>
              </div>
              <p className="text-xs text-[#BFD0C6] mt-2 leading-relaxed">
                Retain 95% of your contract value. Compare this to the 20% commission demanded by legacy brokerages.
              </p>

              <ul className="mt-6 space-y-3 text-xs text-[#F6F1E4]">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#C9A24B]" />
                  <span>Verified public portfolio & skill credentials</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#C9A24B]" />
                  <span>Submit proposals to open public projects</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#C9A24B]" />
                  <span>Escrow payment release guarantees</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#C9A24B]" />
                  <span>Verified ratings and milestone reviews</span>
                </li>
              </ul>
            </div>

            <Link
              to="/register"
              className="w-full text-center py-3 rounded-[6px] bg-[#C9A24B] hover:bg-[#E5CB86] text-[#0B3D2E] font-semibold text-xs transition-colors shadow-sm"
            >
              Join as Talent
            </Link>
          </div>

          {/* Enterprise */}
          <div className="bg-[#114A39] p-8 rounded-[12px] border border-[#1F5A46] flex flex-col justify-between space-y-6 shadow-sm">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7BC49A] bg-[#072A20] px-3 py-1 rounded-[4px] border border-[#1F5A46]">
                Enterprise
              </span>
              <div className="mt-5">
                <span className="font-serif text-5xl font-medium text-[#F6F1E4]">Custom</span>
                <span className="text-xs text-[#BFD0C6] ml-2">For High-Volume Orgs</span>
              </div>
              <p className="text-xs text-[#BFD0C6] mt-2 leading-relaxed">
                Dedicated talent concierge, custom master service agreements, and consolidated monthly settlement.
              </p>

              <ul className="mt-6 space-y-3 text-xs text-[#F6F1E4]">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#7BC49A]" />
                  <span>Dedicated concierge talent sourcing</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#7BC49A]" />
                  <span>Custom NDAs & master agreements</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#7BC49A]" />
                  <span>Single sign-on (SSO) & compliance logs</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#7BC49A]" />
                  <span>Direct dispute arbitration review</span>
                </li>
              </ul>
            </div>

            <Link
              to="/contact"
              className="w-full text-center py-3 rounded-[6px] bg-[#072A20] hover:bg-[#0B3D2E] text-[#F6F1E4] border border-[#1F5A46] hover:border-[#C9A24B] font-semibold text-xs transition-colors"
            >
              Contact Concierge
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
