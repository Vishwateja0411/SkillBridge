import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const location = useLocation();

  const handleNavClick = (targetPath: string) => {
    if (location.pathname === targetPath) {
      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const behavior: ScrollBehavior = prefersReducedMotion ? 'instant' : 'smooth';
      window.scrollTo({ top: 0, left: 0, behavior });
      document.documentElement.scrollTo({ top: 0, left: 0, behavior });
      document.body.scrollTo({ top: 0, left: 0, behavior });
    }
  };

  return (
    <footer className="bg-[#072A20] text-[#BFD0C6] border-t border-[#1F5A46] text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" onClick={() => handleNavClick('/')} className="flex items-center gap-3">
              <div className="w-5 h-5 border-[1.5px] border-[#C9A24B] rotate-45 transform flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-[#C9A24B]" />
              </div>
              <span className="font-serif text-2xl tracking-normal text-[#F6F1E4] font-medium">
                SkillBridge
              </span>
            </Link>
            <p className="text-[#9DB5A8] text-xs leading-relaxed max-w-sm">
              An established talent marketplace built on verified qualifications, milestone escrow protections, and transparent collaboration between businesses and independent professionals.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#E5CB86]">
              <ShieldCheck className="w-4 h-4 text-[#C9A24B]" />
              <span>Verified Identity • Milestone Escrow • Transparent Pricing</span>
            </div>
          </div>

          {/* For Businesses */}
          <div>
            <h4 className="font-serif text-[#E5CB86] text-base mb-3 font-normal">For Businesses</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/find-freelancers" onClick={() => handleNavClick('/find-freelancers')} className="hover:text-[#F6F1E4] transition-colors">Discover Talent</Link></li>
              <li><Link to="/business/projects/new" onClick={() => handleNavClick('/business/projects/new')} className="hover:text-[#F6F1E4] transition-colors">Post an Opportunity</Link></li>
              <li><Link to="/how-it-works" onClick={() => handleNavClick('/how-it-works')} className="hover:text-[#F6F1E4] transition-colors">How Milestones Work</Link></li>
              <li><Link to="/pricing" onClick={() => handleNavClick('/pricing')} className="hover:text-[#F6F1E4] transition-colors">Enterprise Terms (0% Client Fee)</Link></li>
            </ul>
          </div>

          {/* For Professionals */}
          <div>
            <h4 className="font-serif text-[#E5CB86] text-base mb-3 font-normal">For Professionals</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/projects" onClick={() => handleNavClick('/projects')} className="hover:text-[#F6F1E4] transition-colors">Explore Projects</Link></li>
              <li><Link to="/register" onClick={() => handleNavClick('/register')} className="hover:text-[#F6F1E4] transition-colors">Apply for Membership</Link></li>
              <li><Link to="/how-it-works" onClick={() => handleNavClick('/how-it-works')} className="hover:text-[#F6F1E4] transition-colors">Milestone Workspaces</Link></li>
              <li><Link to="/pricing" onClick={() => handleNavClick('/pricing')} className="hover:text-[#F6F1E4] transition-colors">Earnings & 5% Service Fee</Link></li>
            </ul>
          </div>

          {/* Company & Legal */}
          <div>
            <h4 className="font-serif text-[#E5CB86] text-base mb-3 font-normal">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/about" onClick={() => handleNavClick('/about')} className="hover:text-[#F6F1E4] transition-colors">About SkillBridge</Link></li>
              <li><Link to="/contact" onClick={() => handleNavClick('/contact')} className="hover:text-[#F6F1E4] transition-colors">Support & Concierge</Link></li>
              <li><Link to="/how-it-works" onClick={() => handleNavClick('/how-it-works')} className="hover:text-[#F6F1E4] transition-colors">Trust & Safety</Link></li>
              <li><Link to="/pricing" onClick={() => handleNavClick('/pricing')} className="hover:text-[#F6F1E4] transition-colors">Fee Schedule</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#1F5A46] mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#9DB5A8]">
          <div>
            © {new Date().getFullYear()} SkillBridge Marketplace. All rights reserved.
          </div>
          <div className="flex items-center gap-3 mt-2 sm:mt-0 text-[11px]">
            <span>Deep emerald security</span>
            <span>•</span>
            <span>Milestone protection</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
