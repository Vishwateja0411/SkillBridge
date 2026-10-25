import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Star, ShieldCheck, ArrowRight, Check } from 'lucide-react';
import { api } from '../../services/api';
import { FreelancerProfile } from '@skillbridge/shared';

export const FindFreelancersPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [freelancers, setFreelancers] = useState<FreelancerProfile[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [query, setQuery] = useState(searchParams.get('query') || '');
  const [selectedSkill, setSelectedSkill] = useState(searchParams.get('skill') || '');
  const [minRating, setMinRating] = useState('');
  const [maxRate, setMaxRate] = useState('');
  const [availability, setAvailability] = useState('');

  const popularSkills = ['All', 'React', 'TypeScript', 'Node.js', 'Figma', 'UI/UX Design', 'AWS', 'Python'];

  const fetchFreelancers = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (query) params.query = query;
      if (selectedSkill && selectedSkill !== 'All') params.skill = selectedSkill;
      if (minRating) params.minRating = minRating;
      if (maxRate) params.maxRate = maxRate;
      if (availability) params.availability = availability;

      const res = await api.getFreelancers(params);
      if (res.success) {
        setFreelancers(res.freelancers);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFreelancers();
  }, [query, selectedSkill, minRating, maxRate, availability]);

  return (
    <div className="bg-[#0B3D2E] text-[#F6F1E4] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Page Title */}
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C9A24B] mb-1">
            TALENT DIRECTORY
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-medium text-[#F6F1E4]">
            Discover <span className="italic text-[#E5CB86]">Verified</span> Talent.
          </h1>
          <p className="text-xs sm:text-sm text-[#BFD0C6] mt-2 max-w-2xl leading-relaxed">
            Connect with pre-vetted senior engineers, designers, and systems architects ready for milestone engagement.
          </p>
        </div>

        {/* Search and Filters Header */}
        <div className="bg-[#114A39] p-5 rounded-[12px] border border-[#1F5A46] space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#9DB5A8] absolute left-3.5 top-3" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, headline, bio, or skills..."
                className="w-full pl-10 pr-4 py-2.5 rounded-[6px] bg-[#072A20] border border-[#1F5A46] text-xs text-[#F6F1E4] placeholder:text-[#9DB5A8] focus:outline-none focus:border-[#C9A24B]"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <select
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
                className="px-3 py-2 rounded-[6px] border border-[#1F5A46] text-xs font-medium text-[#F6F1E4] bg-[#072A20] focus:outline-none focus:border-[#C9A24B]"
              >
                <option value="">Any Rating</option>
                <option value="4.5">4.5+ Stars</option>
                <option value="4.8">4.8+ Stars</option>
                <option value="5.0">5.0 Stars</option>
              </select>

              <select
                value={maxRate}
                onChange={(e) => setMaxRate(e.target.value)}
                className="px-3 py-2 rounded-[6px] border border-[#1F5A46] text-xs font-medium text-[#F6F1E4] bg-[#072A20] focus:outline-none focus:border-[#C9A24B]"
              >
                <option value="">Any Hourly Rate</option>
                <option value="50">Up to $50/hr</option>
                <option value="80">Up to $80/hr</option>
                <option value="100">Up to $100/hr</option>
              </select>

              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="px-3 py-2 rounded-[6px] border border-[#1F5A46] text-xs font-medium text-[#F6F1E4] bg-[#072A20] focus:outline-none focus:border-[#C9A24B]"
              >
                <option value="">Any Availability</option>
                <option value="full_time">Full Time</option>
                <option value="part_time">Part Time</option>
              </select>
            </div>
          </div>

          {/* Skill Pill Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-[#1F5A46]">
            <span className="text-xs text-[#9DB5A8] mr-1">Filter by Skill:</span>
            {popularSkills.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSkill(s === selectedSkill ? '' : s)}
                className={`text-xs px-3 py-1 rounded-[6px] transition-colors border ${
                  (s === 'All' && !selectedSkill) || selectedSkill === s
                    ? 'bg-[#C9A24B] text-[#0B3D2E] border-[#C9A24B] font-medium'
                    : 'bg-[#072A20] text-[#BFD0C6] border-[#1F5A46] hover:text-[#F6F1E4]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Results List */}
        {loading ? (
          <div className="text-center py-20 text-[#9DB5A8] text-xs">Searching verified talent...</div>
        ) : freelancers.length === 0 ? (
          <div className="text-center py-16 bg-[#114A39] rounded-[12px] border border-[#1F5A46] p-8">
            <p className="text-[#BFD0C6] text-sm">No freelancers matched your filter criteria.</p>
            <button
              onClick={() => {
                setQuery('');
                setSelectedSkill('');
                setMinRating('');
                setMaxRate('');
                setAvailability('');
              }}
              className="mt-3 text-xs text-[#E5CB86] font-medium hover:underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-xs text-[#9DB5A8]">Showing {freelancers.length} available talent profiles</div>
            {freelancers.map((f) => (
              <div
                key={f.id}
                className="bg-[#114A39] p-6 rounded-[12px] border border-[#1F5A46] shadow-sm hover:border-[#2B6D56] transition-all flex flex-col md:flex-row gap-6 justify-between items-start"
              >
                <div className="flex items-start gap-5">
                  <img
                    src={f.user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${f.user?.name}`}
                    alt={f.user?.name}
                    className="w-14 h-14 rounded-full object-cover border border-[#1F5A46] flex-shrink-0"
                  />
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2.5">
                      <Link
                        to={`/freelancers/${f.id}`}
                        className="font-serif text-xl font-medium text-[#F6F1E4] hover:text-[#E5CB86] transition-colors"
                      >
                        {f.user?.name}
                      </Link>
                      {f.verificationStatus === 'verified' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#E5CB86] bg-[#072A20] px-2 py-0.5 rounded-[4px] border border-[#1F5A46]">
                          <Check className="w-3 h-3 text-[#C9A24B]" />
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-[#E5CB86]">{f.headline}</p>
                    <p className="text-xs text-[#BFD0C6] line-clamp-2 max-w-2xl leading-relaxed">{f.bio}</p>

                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {f.skills.map((s) => (
                        <span
                          key={s.name}
                          className="text-[11px] font-medium bg-[#072A20] text-[#BFD0C6] px-2.5 py-0.5 rounded-[4px] border border-[#1F5A46]"
                        >
                          {s.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right column with stats & actions */}
                <div className="w-full md:w-auto md:min-w-[190px] flex md:flex-col justify-between md:items-end border-t md:border-t-0 pt-4 md:pt-0 border-[#1F5A46]">
                  <div className="text-left md:text-right mb-4">
                    <div className="font-serif text-2xl font-medium text-[#F6F1E4]">${f.hourlyRate}/hr</div>
                    <div className="flex items-center gap-1 text-xs text-[#C9A24B] font-medium md:justify-end mt-0.5">
                      <Star className="w-3.5 h-3.5 fill-[#C9A24B] text-[#C9A24B]" />
                      <span>{f.rating} ({f.reviewCount} reviews)</span>
                    </div>
                    <div className="text-[11px] text-[#9DB5A8] mt-1">
                      {f.completedProjectsCount} completed • {f.availability.replace('_', ' ')}
                    </div>
                  </div>

                  <Link
                    to={`/freelancers/${f.id}`}
                    className="px-4 py-2 rounded-[6px] bg-[#C9A24B] hover:bg-[#E5CB86] text-[#0B3D2E] font-semibold text-xs transition-colors flex items-center gap-1.5"
                  >
                    <span>View profile</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
