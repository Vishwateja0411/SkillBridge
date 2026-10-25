import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Users, ShieldCheck, Check, ArrowRight } from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  return (
    <div className="bg-[#0B3D2E] text-[#F6F1E4] min-h-screen py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C9A24B]">
            DISCIPLINED COLLABORATION
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium text-[#F6F1E4]">
            How SkillBridge <span className="italic text-[#E5CB86]">Works</span>.
          </h1>
          <p className="text-xs sm:text-sm text-[#BFD0C6] leading-relaxed max-w-2xl mx-auto">
            From project scoping to milestone escrow releases: a structured platform designed for reliable hiring and accountable delivery.
          </p>
        </div>

        {/* Two Columns: Client Journey vs Freelancer Journey */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Business Journey */}
          <div id="business-journey" className="scroll-mt-24 bg-[#114A39] p-8 rounded-[12px] border border-[#1F5A46] space-y-6 shadow-sm">
            <div className="flex items-center gap-3 border-b border-[#1F5A46] pb-4">
              <div className="w-10 h-10 rounded-[6px] bg-[#072A20] text-[#C9A24B] border border-[#1F5A46] flex items-center justify-center">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-2xl font-medium text-[#F6F1E4]">The Business Journey</h2>
                <p className="text-xs text-[#BFD0C6]">How companies engage and oversee verified specialists</p>
              </div>
            </div>

            <div className="space-y-6 text-xs text-[#BFD0C6]">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#072A20] border border-[#1F5A46] text-[#E5CB86] flex items-center justify-center font-serif text-base font-medium flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-serif text-lg text-[#F6F1E4]">Define Project & Milestones</h3>
                  <p className="mt-1 leading-relaxed">
                    Set clear objectives, required skill proficiencies, timeline, and structured milestone checkpoints with budget caps.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#072A20] border border-[#1F5A46] text-[#E5CB86] flex items-center justify-center font-serif text-base font-medium flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-serif text-lg text-[#F6F1E4]">Review Explainable Matches</h3>
                  <p className="mt-1 leading-relaxed">
                    Examine candidate proposals ranked by transparent criteria: skill coverage, verified ratings, and relevant case studies.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#072A20] border border-[#1F5A46] text-[#E5CB86] flex items-center justify-center font-serif text-base font-medium flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-serif text-lg text-[#F6F1E4]">Fund Milestones in Escrow</h3>
                  <p className="mt-1 leading-relaxed">
                    Formalize terms into a contract workspace. Milestone funds are held safely until deliverables meet specifications.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#072A20] border border-[#1F5A46] text-[#E5CB86] flex items-center justify-center font-serif text-base font-medium flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="font-serif text-lg text-[#F6F1E4]">Approve & Release Funds</h3>
                  <p className="mt-1 leading-relaxed">
                    Inspect deliverables directly in the contract audit ledger. Release payouts with a single click once satisfied.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Freelancer Journey */}
          <div id="freelancer-journey" className="scroll-mt-24 bg-[#114A39] p-8 rounded-[12px] border border-[#1F5A46] space-y-6 shadow-sm">
            <div className="flex items-center gap-3 border-b border-[#1F5A46] pb-4">
              <div className="w-10 h-10 rounded-[6px] bg-[#072A20] text-[#7BC49A] border border-[#1F5A46] flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-2xl font-medium text-[#F6F1E4]">The Professional Journey</h2>
                <p className="text-xs text-[#BFD0C6]">How independent talent delivers work with guaranteed payouts</p>
              </div>
            </div>

            <div className="space-y-6 text-xs text-[#BFD0C6]">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#072A20] border border-[#1F5A46] text-[#7BC49A] flex items-center justify-center font-serif text-base font-medium flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-serif text-lg text-[#F6F1E4]">Build a Verified Profile</h3>
                  <p className="mt-1 leading-relaxed">
                    Curate your public portfolio, verified skill badges, hourly rates, and track record of completed contracts.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#072A20] border border-[#1F5A46] text-[#7BC49A] flex items-center justify-center font-serif text-base font-medium flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-serif text-lg text-[#F6F1E4]">Submit Targeted Proposals</h3>
                  <p className="mt-1 leading-relaxed">
                    Bid on high-value projects with proposed milestone roadmaps, delivery schedules, and price commitments.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#072A20] border border-[#1F5A46] text-[#7BC49A] flex items-center justify-center font-serif text-base font-medium flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-serif text-lg text-[#F6F1E4]">Deliver in Shared Workspaces</h3>
                  <p className="mt-1 leading-relaxed">
                    Submit work, attach review links, and maintain clear communications via synchronized contract chat.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#072A20] border border-[#1F5A46] text-[#7BC49A] flex items-center justify-center font-serif text-base font-medium flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="font-serif text-lg text-[#F6F1E4]">Receive 95% Net Payouts</h3>
                  <p className="mt-1 leading-relaxed">
                    Keep 95% of every dollar earned with our flat 5% service fee. Accumulate verified 5-star reputation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 6-Factor Matching Breakdown */}
        <div className="bg-[#072A20] border border-[#1F5A46] rounded-[12px] p-8 sm:p-12 space-y-6">
          <div className="max-w-2xl space-y-2">
            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C9A24B]">
              SCIENTIFIC ALLOCATION
            </div>
            <h2 className="font-serif text-3xl font-medium text-[#F6F1E4]">The 6-Factor Matching Weighting</h2>
            <p className="text-xs text-[#BFD0C6] leading-relaxed">
              SkillBridge evaluates potential connections through an open, transparent formula rather than hidden scoring:
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 pt-2">
            <div className="bg-[#114A39] p-4 rounded-[8px] border border-[#1F5A46] text-center">
              <div className="font-serif text-3xl font-medium text-[#E5CB86]">35%</div>
              <div className="text-xs text-[#F6F1E4] mt-1 font-medium">Skill Overlap</div>
            </div>
            <div className="bg-[#114A39] p-4 rounded-[8px] border border-[#1F5A46] text-center">
              <div className="font-serif text-3xl font-medium text-[#E5CB86]">20%</div>
              <div className="text-xs text-[#F6F1E4] mt-1 font-medium">Experience Tier</div>
            </div>
            <div className="bg-[#114A39] p-4 rounded-[8px] border border-[#1F5A46] text-center">
              <div className="font-serif text-3xl font-medium text-[#E5CB86]">20%</div>
              <div className="text-xs text-[#F6F1E4] mt-1 font-medium">Portfolio Fit</div>
            </div>
            <div className="bg-[#114A39] p-4 rounded-[8px] border border-[#1F5A46] text-center">
              <div className="font-serif text-3xl font-medium text-[#E5CB86]">10%</div>
              <div className="text-xs text-[#F6F1E4] mt-1 font-medium">Client Rating</div>
            </div>
            <div className="bg-[#114A39] p-4 rounded-[8px] border border-[#1F5A46] text-center">
              <div className="font-serif text-3xl font-medium text-[#E5CB86]">10%</div>
              <div className="text-xs text-[#F6F1E4] mt-1 font-medium">Budget Fit</div>
            </div>
            <div className="bg-[#114A39] p-4 rounded-[8px] border border-[#1F5A46] text-center">
              <div className="font-serif text-3xl font-medium text-[#E5CB86]">5%</div>
              <div className="text-xs text-[#F6F1E4] mt-1 font-medium">Availability</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
