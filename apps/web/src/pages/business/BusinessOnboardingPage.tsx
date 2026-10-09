import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const BusinessOnboardingPage: React.FC = () => {
  const { refreshMe } = useAuth();
  const navigate = useNavigate();

  const [companyName, setCompanyName] = useState('TechVentures AI');
  const [industry, setIndustry] = useState('Software & Artificial Intelligence');
  const [companySize, setCompanySize] = useState('25-50 employees');
  const [website, setWebsite] = useState('https://techventures.ai');
  const [location, setLocation] = useState('San Francisco, CA');
  const [description, setDescription] = useState(
    'TechVentures builds enterprise AI platforms, predictive customer telemetry portals, and resilient cloud architectures.'
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.submitBusinessOnboarding({
        companyName,
        industry,
        companySize,
        website,
        location,
        description,
      });
      await refreshMe();
      navigate('/business/projects/new');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 space-y-8">
      <div>
        <span className="text-xs font-bold text-brand-navy uppercase tracking-wider">Business Onboarding</span>
        <h1 className="text-3xl font-extrabold text-brand-navy mt-1">Set Up Your Company Profile</h1>
        <p className="text-xs text-slate-500 mt-1">
          Provide your organization information so prospective freelancers know who they're collaborating with.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1">Company / Organization Name</label>
          <input
            type="text"
            required
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full p-3.5 rounded-xl border border-slate-200 text-xs text-slate-800 font-semibold focus:outline-none focus:border-brand-indigo"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Industry</label>
            <input
              type="text"
              required
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-brand-indigo"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Company Size</label>
            <select
              value={companySize}
              onChange={(e) => setCompanySize(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white"
            >
              <option value="1-10 employees">1-10 employees</option>
              <option value="11-50 employees">11-50 employees</option>
              <option value="51-200 employees">51-200 employees</option>
              <option value="200+ employees">200+ employees</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Website URL</label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-brand-indigo"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Headquarters / Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-brand-indigo"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1">About Your Company & Mission</label>
          <textarea
            rows={4}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-brand-indigo leading-relaxed"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-brand-navy hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2"
          >
            <span>{loading ? 'Saving Profile...' : 'Save & Post First Project'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
