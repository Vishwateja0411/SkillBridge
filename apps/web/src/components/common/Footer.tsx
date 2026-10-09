import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, ShieldCheck, Heart, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-indigo to-brand-teal flex items-center justify-center text-white">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Skill<span className="text-brand-teal">Bridge</span>
              </span>
            </Link>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Bridging Talent and Opportunity. An AI-powered two-sided marketplace designed for seamless hiring, milestone-based execution, and transparent collaboration.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-brand-teal" />
              <span>Verified Profiles • Protected Milestones • Escrow Tracking</span>
            </div>
          </div>

          {/* For Businesses */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">For Businesses</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/find-freelancers" className="hover:text-white transition-colors">Discover Top Talent</Link></li>
              <li><Link to="/business/projects/new" className="hover:text-white transition-colors">Post a Project</Link></li>
              <li><Link to="/how-it-works" className="hover:text-white transition-colors">AI Matching Formula</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition-colors">Business Pricing (0% Fee)</Link></li>
            </ul>
          </div>

          {/* For Freelancers */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">For Freelancers</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/projects" className="hover:text-white transition-colors">Explore Projects</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Create Freelancer Profile</Link></li>
              <li><Link to="/how-it-works" className="hover:text-white transition-colors">Milestone Workspaces</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition-colors">Earnings & 5% Platform Fee</Link></li>
            </ul>
          </div>

          {/* Company & Legal */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Support & Contact</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} SkillBridge Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-1 mt-2 sm:mt-0">
            <span>Engineered with precision for modern talent networks</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
