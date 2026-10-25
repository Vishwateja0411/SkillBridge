import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { FreelancerProfile } from '@skillbridge/shared';
import { CheckCircle2 } from 'lucide-react';

export const FreelancerSettingsPage: React.FC = () => {
  const { user, profile, refreshMe } = useAuth();
  const fProfile = profile as FreelancerProfile;

  const [headline, setHeadline] = useState(fProfile?.headline || '');
  const [bio, setBio] = useState(fProfile?.bio || '');
  const [hourlyRate, setHourlyRate] = useState(String(fProfile?.hourlyRate || 85));
  const [availability, setAvailability] = useState(fProfile?.availability || 'full_time');
  const [location, setLocation] = useState(fProfile?.location || 'Austin, TX');
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await api.updateFreelancerProfile({
      headline,
      bio,
      hourlyRate: Number(hourlyRate),
      availability,
      location,
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
        <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C9A24B]">
          ACCOUNT CONFIGURATION
        </div>
        <h1 className="font-serif text-3xl font-medium text-[#F6F1E4] mt-1">
          Freelancer Profile <span className="italic text-[#E5CB86]">Settings</span>
        </h1>
        <p className="text-xs text-[#BFD0C6] mt-1">Update your professional headline, rates, and availability</p>
      </div>

      {saved && (
        <div className="p-3.5 rounded-[6px] bg-[#114A39] border border-[#7BC49A] text-[#7BC49A] text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#7BC49A]" />
          <span>Profile changes updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-[#114A39] p-7 rounded-[12px] border border-[#1F5A46] space-y-4">
        <div>
          <label className="block text-xs font-medium text-[#F6F1E4] mb-1">Professional Headline</label>
          <input
            type="text"
            required
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            className="w-full p-3 rounded-[6px] bg-[#072A20] border border-[#1F5A46] text-xs text-[#F6F1E4] placeholder:text-[#9DB5A8] focus:outline-none focus:border-[#C9A24B]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#F6F1E4] mb-1">Hourly Rate ($ USD)</label>
            <input
              type="number"
              required
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
              className="w-full p-3 rounded-[6px] bg-[#072A20] border border-[#1F5A46] text-xs text-[#F6F1E4] placeholder:text-[#9DB5A8] focus:outline-none focus:border-[#C9A24B]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#F6F1E4] mb-1">Availability</label>
            <select
              value={availability}
              onChange={(e) => setAvailability(e.target.value as any)}
              className="w-full p-3 rounded-[6px] bg-[#072A20] border border-[#1F5A46] text-xs text-[#F6F1E4] focus:outline-none focus:border-[#C9A24B]"
            >
              <option value="full_time">Full Time (40h/week)</option>
              <option value="part_time">Part Time (20h/week)</option>
              <option value="not_available">Not Available</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#F6F1E4] mb-1">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-3 rounded-[6px] bg-[#072A20] border border-[#1F5A46] text-xs text-[#F6F1E4] placeholder:text-[#9DB5A8] focus:outline-none focus:border-[#C9A24B]"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#F6F1E4] mb-1">Biography / About</label>
          <textarea
            rows={5}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full p-3 rounded-[6px] bg-[#072A20] border border-[#1F5A46] text-xs text-[#F6F1E4] placeholder:text-[#9DB5A8] focus:outline-none focus:border-[#C9A24B]"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-[6px] bg-[#C9A24B] hover:bg-[#E5CB86] text-[#0B3D2E] font-medium text-xs transition-colors"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};
