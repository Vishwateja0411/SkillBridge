import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Sparkles, User, Briefcase, DollarSign, Layers } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const FreelancerOnboardingPage: React.FC = () => {
  const { refreshMe } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [headline, setHeadline] = useState('Senior Full-Stack Engineer | React, Node.js & Cloud');
  const [bio, setBio] = useState('Passionate about crafting fast, resilient web applications and intuitive interfaces.');
  const [skills, setSkills] = useState('React, TypeScript, Node.js, Tailwind CSS');
  const [hourlyRate, setHourlyRate] = useState('75');
  const [experienceLevel, setExperienceLevel] = useState('expert');
  const [availability, setAvailability] = useState('full_time');
  const [location, setLocation] = useState('San Francisco, CA');
  const [loading, setLoading] = useState(false);

  const handleFinish = async () => {
    setLoading(true);
    try {
      const skillObjects = skills.split(',').map((s) => ({
        name: s.trim(),
        level: 'expert' as const,
        yearsExperience: 5,
      }));

      await api.submitFreelancerOnboarding({
        headline,
        bio,
        skills: skillObjects,
        hourlyRate: Number(hourlyRate),
        experienceLevel,
        availability,
        location,
      });

      await refreshMe();
      navigate('/freelancer/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 space-y-8">
      <div>
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C9A24B]">Freelancer Onboarding</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#F6F1E4] mt-1">
          Complete Your <span className="italic text-[#E5CB86]">Professional Profile</span>
        </h1>
        <p className="text-xs text-[#BFD0C6] mt-1">Step {step} of 3</p>
      </div>

      {/* Progress pill */}
      <div className="flex gap-2">
        <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? 'bg-[#C9A24B]' : 'bg-[#1F5A46]'}`} />
        <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? 'bg-[#C9A24B]' : 'bg-[#1F5A46]'}`} />
        <div className={`h-1.5 flex-1 rounded-full ${step >= 3 ? 'bg-[#C9A24B]' : 'bg-[#1F5A46]'}`} />
      </div>

      <div className="bg-[#114A39] p-8 rounded-[12px] border border-[#1F5A46] space-y-6">
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="font-serif text-lg font-medium text-[#F6F1E4]">Step 1: Role & Biography</h2>
            <div>
              <label className="block text-xs font-medium text-[#F6F1E4] mb-1">Headline</label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full p-3 rounded-[6px] bg-[#072A20] border border-[#1F5A46] text-xs text-[#F6F1E4] placeholder:text-[#9DB5A8] focus:outline-none focus:border-[#C9A24B]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#F6F1E4] mb-1">About & Experience Summary</label>
              <textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-3 rounded-[6px] bg-[#072A20] border border-[#1F5A46] text-xs text-[#F6F1E4] placeholder:text-[#9DB5A8] focus:outline-none focus:border-[#C9A24B]"
              />
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
            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-2.5 rounded-[6px] bg-[#C9A24B] hover:bg-[#E5CB86] text-[#0B3D2E] font-medium text-xs flex items-center gap-2 transition-colors"
              >
                <span>Next: Skills & Experience</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="font-serif text-lg font-medium text-[#F6F1E4]">Step 2: Skills & Expertise Tier</h2>
            <div>
              <label className="block text-xs font-medium text-[#F6F1E4] mb-1">Primary Skills (comma-separated)</label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="w-full p-3 rounded-[6px] bg-[#072A20] border border-[#1F5A46] text-xs text-[#F6F1E4] placeholder:text-[#9DB5A8] focus:outline-none focus:border-[#C9A24B]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#F6F1E4] mb-1">Experience Level</label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full p-3 rounded-[6px] bg-[#072A20] border border-[#1F5A46] text-xs text-[#F6F1E4] focus:outline-none focus:border-[#C9A24B]"
              >
                <option value="entry">Entry Level (1-2 years)</option>
                <option value="intermediate">Intermediate (3-5 years)</option>
                <option value="expert">Expert (5+ years senior/architect)</option>
              </select>
            </div>
            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 text-xs font-medium text-[#BFD0C6] hover:bg-[#072A20] border border-transparent hover:border-[#1F5A46] rounded-[6px] transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-6 py-2.5 rounded-[6px] bg-[#C9A24B] hover:bg-[#E5CB86] text-[#0B3D2E] font-medium text-xs flex items-center gap-2 transition-colors"
              >
                <span>Next: Rates & Availability</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="font-serif text-lg font-medium text-[#F6F1E4]">Step 3: Hourly Rate & Availability</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#F6F1E4] mb-1">Target Hourly Rate ($ USD)</label>
                <input
                  type="number"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  className="w-full p-3 rounded-[6px] bg-[#072A20] border border-[#1F5A46] text-xs text-[#F6F1E4] focus:outline-none focus:border-[#C9A24B]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#F6F1E4] mb-1">Availability</label>
                <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  className="w-full p-3 rounded-[6px] bg-[#072A20] border border-[#1F5A46] text-xs text-[#F6F1E4] focus:outline-none focus:border-[#C9A24B]"
                >
                  <option value="full_time">Full Time</option>
                  <option value="part_time">Part Time</option>
                </select>
              </div>
            </div>

            <div className="p-4 rounded-[6px] bg-[#072A20] border border-[#1F5A46] text-xs text-[#BFD0C6]">
              <span className="font-medium text-[#E5CB86] block">Verification Notice:</span>
              Upon completion, your profile will be submitted for SkillBridge identity & credential badge review.
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 text-xs font-medium text-[#BFD0C6] hover:bg-[#072A20] border border-transparent hover:border-[#1F5A46] rounded-[6px] transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleFinish}
                disabled={loading}
                className="px-6 py-2.5 rounded-[6px] bg-[#C9A24B] hover:bg-[#E5CB86] text-[#0B3D2E] font-medium text-xs flex items-center gap-2 transition-colors"
              >
                <span>{loading ? 'Submitting...' : 'Complete Onboarding & Go to Dashboard'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
