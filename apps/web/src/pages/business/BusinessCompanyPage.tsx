import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { BusinessProfile } from '@skillbridge/shared';
import { CheckCircle2, Building2 } from 'lucide-react';

export const BusinessCompanyPage: React.FC = () => {
  const { profile, refreshMe } = useAuth();
  const bProfile = profile as BusinessProfile;

  const [companyName, setCompanyName] = useState(bProfile?.companyName || 'TechVentures AI');
  const [industry, setIndustry] = useState(bProfile?.industry || 'Software & Artificial Intelligence');
  const [companySize, setCompanySize] = useState(bProfile?.companySize || '25-50 employees');
  const [website, setWebsite] = useState(bProfile?.website || 'https://techventures.ai');
  const [location, setLocation] = useState(bProfile?.location || 'San Francisco, CA');
  const [description, setDescription] = useState(
    bProfile?.description || 'TechVentures builds predictive intelligence platforms and enterprise cloud applications.'
  );

  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await api.updateBusinessProfile({
      companyName,
      industry,
      companySize,
      website,
      location,
      description,
    });
    if (res.success) {
      setSaved(true);
      await refreshMe();
      setTimeout(() => setSaved(false), 2500);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Company Profile</h1>
        <p className="text-xs text-slate-500 mt-1">Manage public organization details and branding visible to candidates</p>
      </div>

      {saved && (
        <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Company profile updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1">Company Name</label>
          <input
            type="text"
            required
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 font-semibold focus:outline-none focus:border-brand-indigo"
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
            <input
              type="text"
              required
              value={companySize}
              onChange={(e) => setCompanySize(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-brand-indigo"
            />
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
            <label className="block text-xs font-bold text-slate-800 mb-1">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-brand-indigo"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1">About Company</label>
          <textarea
            rows={5}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-brand-indigo"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-brand-navy hover:bg-slate-800 text-white font-bold text-xs transition-colors"
          >
            Save Company Profile
          </button>
        </div>
      </form>
    </div>
  );
};
