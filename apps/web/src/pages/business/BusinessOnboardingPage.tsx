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
        <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C9A24B]">
          BUSINESS ONBOARDING
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#F6F1E4] mt-1">
          Set Up Your <span className="italic text-[#E5CB86]">Company Profile</span>
        </h1>
        <p className="text-xs text-[#BFD0C6] mt-1">
          Provide your organization information so prospective freelancers know who they're collaborating with.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#114A39] p-8 rounded-[12px] border border-[#1F5A46] space-y-5">
        <div>
          <label className="block text-xs font-medium text-[#F6F1E4] mb-1">Company / Organization Name</label>
          <input
            type="text"
            required
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full p-3.5 rounded-[6px] bg-[#072A20] border border-[#1F5A46] text-xs text-[#F6F1E4] focus:outline-none focus:border-[#C9A24B]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#F6F1E4] mb-1">Industry</label>
            <input
              type="text"
              required
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full p-3 rounded-[6px] bg-[#072A20] border border-[#1F5A46] text-xs text-[#F6F1E4] focus:outline-none focus:border-[#C9A24B]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#F6F1E4] mb-1">Company Size</label>
            <select
              value={companySize}
              onChange={(e) => setCompanySize(e.target.value)}
              className="w-full p-3 rounded-[6px] bg-[#072A20] border border-[#1F5A46] text-xs text-[#F6F1E4] focus:outline-none focus:border-[#C9A24B]"
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
            <label className="block text-xs font-medium text-[#F6F1E4] mb-1">Website URL</label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full p-3 rounded-[6px] bg-[#072A20] border border-[#1F5A46] text-xs text-[#F6F1E4] focus:outline-none focus:border-[#C9A24B]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#F6F1E4] mb-1">Headquarters / Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-3 rounded-[6px] bg-[#072A20] border border-[#1F5A46] text-xs text-[#F6F1E4] focus:outline-none focus:border-[#C9A24B]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#F6F1E4] mb-1">Overview & Mission</label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 rounded-[6px] bg-[#072A20] border border-[#1F5A46] text-xs text-[#F6F1E4] focus:outline-none focus:border-[#C9A24B]"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-[6px] bg-[#C9A24B] hover:bg-[#E5CB86] text-[#0B3D2E] font-medium text-xs transition-colors flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Setting Up...' : 'Save Organization Profile & Post First Project'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
