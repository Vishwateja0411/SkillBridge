import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, ShieldCheck, Sparkles, Scale, Lock, RefreshCw, Zap } from 'lucide-react';

interface ComparisonRow {
  dimension: string;
  description: string;
  skillbridge: {
    title: string;
    detail: string;
    highlight: boolean;
  };
  traditional: {
    title: string;
    detail: string;
  };
}

const COMPARISONS: ComparisonRow[] = [
  {
    dimension: 'AI Matching Engine',
    description: 'How candidate compatibility is determined',
    skillbridge: {
      title: 'Explainable 6-Factor Algorithm',
      detail: 'Transparent breakdown (Skill 35%, Experience 20%, Portfolio 20%, Ratings 10%, Budget 10%, Availability 5%). No black box.',
      highlight: true,
    },
    traditional: {
      title: 'Opaque Keyword Search',
      detail: 'Basic tag matching or sponsored placement. Clients must manually read dozens of unvetted resumes.',
    },
  },
  {
    dimension: 'Payment & Escrow Protection',
    description: 'Financial security and delivery sign-offs',
    skillbridge: {
      title: 'Phased Milestone Escrow',
      detail: 'Funds are placed in escrow milestone-by-milestone and released only upon deliverable inspection and sign-off.',
      highlight: true,
    },
    traditional: {
      title: 'Lump-Sum Gig Checkout',
      detail: 'High-risk upfront payments or rigid all-or-nothing transactions with limited revision leverage.',
    },
  },
  {
    dimension: 'Active Workspaces',
    description: 'Real-time collaboration during delivery',
    skillbridge: {
      title: 'Integrated Real-Time Collaboration',
      detail: 'Live Socket.io chat, deliverable submission links, version notes, and revision requests inside the project contract.',
      highlight: true,
    },
    traditional: {
      title: 'Scattered External Channels',
      detail: 'Fragmented across email, WhatsApp, and Slack with no centralized deliverable version tracking.',
    },
  },
  {
    dimension: 'Disputes & Governance',
    description: 'Platform oversight when issues arise',
    skillbridge: {
      title: 'Administrative Arbitration & Audit Logs',
      detail: 'Dedicated administrative arbitration portal with immutable system audit logs for compliance and fairness.',
      highlight: true,
    },
    traditional: {
      title: 'Automated Bot Tickets',
      detail: 'Protracted support tickets with automated template replies and no human arbitration dashboard.',
    },
  },
  {
    dimension: 'Client Fee Structure',
    description: 'Total cost of engagement',
    skillbridge: {
      title: '0% Business Hiring Fee',
      detail: 'Post unlimited projects and hire verified talent with zero buyer surcharge. Flat 5% freelancer payout fee.',
      highlight: true,
    },
    traditional: {
      title: '10% – 20% Layered Fees',
      detail: 'Layered buyer processing fees plus 10%–20% freelancer commission cuts.',
    },
  },
];

export const MarketplaceComparisonSection: React.FC = () => {
  return (
    <section id="comparison" className="scroll-mt-24 py-20 bg-[#F6F1E4] text-[#0B3D2E] border-b border-[#E5DFD0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C9A24B] mb-2">
            WHY SKILLBRIDGE STANDS OUT
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-[#0B3D2E]">
            Built for Enterprise <span className="italic text-[#A37F33]">Trust</span>, Not Gig Roulette.
          </h2>
          <p className="text-xs sm:text-sm text-[#4F6B5E] mt-3 leading-relaxed">
            See how SkillBridge replaces the friction of traditional gig sites with mathematically transparent matching and guaranteed milestone escrow safety.
          </p>
        </div>

        {/* Comparison Table / Matrix */}
        <div className="bg-white rounded-2xl border border-[#E5DFD0] shadow-sm overflow-hidden">
          {/* Header row */}
          <div className="grid grid-cols-12 bg-[#FAF7F0] border-b border-[#E5DFD0] p-4 sm:p-6 text-xs font-semibold uppercase tracking-wider text-[#0B3D2E]">
            <div className="col-span-12 sm:col-span-4 text-[#4F6B5E]">Dimension</div>
            <div className="col-span-12 sm:col-span-4 mt-2 sm:mt-0 flex items-center gap-1.5 text-[#0B3D2E]">
              <span className="w-2 h-2 rounded-full bg-[#C9A24B]" />
              <span>SkillBridge Platform</span>
            </div>
            <div className="col-span-12 sm:col-span-4 mt-2 sm:mt-0 text-[#8C9B93] hidden sm:block">
              Traditional Gig & Bot Sites
            </div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-[#E5DFD0]">
            {COMPARISONS.map((row, idx) => (
              <div
                key={row.dimension}
                className={`grid grid-cols-12 p-4 sm:p-6 gap-4 sm:gap-6 items-start transition-colors ${
                  idx % 2 === 0 ? 'bg-white' : 'bg-[#FAF7F0]/40'
                }`}
              >
                {/* Dimension & Description */}
                <div className="col-span-12 sm:col-span-4">
                  <h4 className="font-serif text-lg font-medium text-[#0B3D2E]">{row.dimension}</h4>
                  <p className="text-[11px] text-[#4F6B5E] mt-0.5">{row.description}</p>
                </div>

                {/* SkillBridge Solution */}
                <div className="col-span-12 sm:col-span-4 p-3.5 sm:p-4 rounded-xl bg-[#0B3D2E] text-[#F6F1E4] border border-[#1F5A46] shadow-sm">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-5 h-5 rounded-full bg-[#C9A24B] text-[#0B3D2E] flex items-center justify-center font-bold text-xs shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span className="font-serif text-base font-medium text-[#E5CB86]">
                      {row.skillbridge.title}
                    </span>
                  </div>
                  <p className="text-xs text-[#BFD0C6] leading-relaxed pl-7">
                    {row.skillbridge.detail}
                  </p>
                </div>

                {/* Legacy Alternative */}
                <div className="col-span-12 sm:col-span-4 p-3.5 sm:p-4 rounded-xl bg-[#FAF7F0] border border-[#E5DFD0] text-[#4F6B5E]">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-5 h-5 rounded-full bg-[#E5DFD0] text-[#8C9B93] flex items-center justify-center font-bold text-xs shrink-0">
                      <X className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-medium text-xs text-[#0B3D2E]">
                      {row.traditional.title}
                    </span>
                  </div>
                  <p className="text-xs text-[#4F6B5E] leading-relaxed pl-7">
                    {row.traditional.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
