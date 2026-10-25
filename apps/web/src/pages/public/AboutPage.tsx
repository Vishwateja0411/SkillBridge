import React from 'react';
import { Target, ShieldCheck, Award } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="bg-[#0B3D2E] text-[#F6F1E4] min-h-screen py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C9A24B]">
            FOUNDING PRINCIPLES
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium text-[#F6F1E4]">
            Integrity, Clarity, and <span className="italic text-[#E5CB86]">Craft</span>.
          </h1>
          <p className="text-xs sm:text-sm text-[#BFD0C6] leading-relaxed max-w-2xl mx-auto">
            SkillBridge was founded to establish a trustworthy marketplace where independent specialists collaborate with ambitious enterprises through structured milestone accountability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#114A39] p-8 rounded-[12px] border border-[#1F5A46] space-y-4 shadow-sm">
            <div className="w-10 h-10 rounded-[6px] bg-[#072A20] text-[#C9A24B] border border-[#1F5A46] flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl font-medium text-[#F6F1E4]">Explainable Matching</h3>
            <p className="text-xs text-[#BFD0C6] leading-relaxed">
              We reject opaque ranking systems and bidding wars. Our open 6-factor model explains exactly why a candidate is suitable based on verified capabilities.
            </p>
          </div>

          <div className="bg-[#114A39] p-8 rounded-[12px] border border-[#1F5A46] space-y-4 shadow-sm">
            <div className="w-10 h-10 rounded-[6px] bg-[#072A20] text-[#C9A24B] border border-[#1F5A46] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl font-medium text-[#F6F1E4]">Milestone Safe Escrow</h3>
            <p className="text-xs text-[#BFD0C6] leading-relaxed">
              Professionals should not chase receivables, and clients should not risk unfulfilled work. Funds are secured prior to work and released upon deliverable sign-off.
            </p>
          </div>

          <div className="bg-[#114A39] p-8 rounded-[12px] border border-[#1F5A46] space-y-4 shadow-sm">
            <div className="w-10 h-10 rounded-[6px] bg-[#072A20] text-[#C9A24B] border border-[#1F5A46] flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl font-medium text-[#F6F1E4]">Transparent Economics</h3>
            <p className="text-xs text-[#BFD0C6] leading-relaxed">
              By charging a flat 5% service fee instead of legacy 20% markups, independent practitioners retain their rightful earnings while clients pay 0% fees.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
