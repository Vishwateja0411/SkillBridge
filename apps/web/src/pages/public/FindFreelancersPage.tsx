import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, Star, ShieldCheck, MapPin, ArrowRight, CheckCircle2 } from 'lucide-react';
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

  const popularSkills = ['All', 'React', 'TypeScript', 'Node.js', 'Figma', 'UI/UX Design', 'AWS', 'Kubernetes'];

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-brand-navy">Discover Independent Talent</h1>
        <p className="text-slate-500 text-sm mt-1">
          Connect with pre-vetted senior engineers, designers, and cloud architects ready for your next project.
        </p>
      </div>

      {/* Search and Filters Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, headline, bio, or skills..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-indigo"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white"
            >
              <option value="">Any Rating</option>
              <option value="4.5">4.5+ Stars</option>
              <option value="4.8">4.8+ Stars</option>
              <option value="5.0">5.0 Stars</option>
            </select>

            <select
              value={maxRate}
              onChange={(e) => setMaxRate(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white"
            >
              <option value="">Any Hourly Rate</option>
              <option value="50">Up to $50/hr</option>
              <option value="80">Up to $80/hr</option>
              <option value="100">Up to $100/hr</option>
            </select>

            <select
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white"
            >
              <option value="">Any Availability</option>
              <option value="full_time">Full Time</option>
              <option value="part_time">Part Time</option>
            </select>
          </div>
        </div>

        {/* Skill Pill Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-semibold text-slate-500 mr-1">Filter by Skill:</span>
          {popularSkills.map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSkill(s === selectedSkill ? '' : s)}
              className={`text-xs px-3 py-1 rounded-lg font-medium transition-colors ${
                (s === 'All' && !selectedSkill) || selectedSkill === s
                  ? 'bg-brand-indigo text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Results List */}
      {loading ? (
        <div className="text-center py-20 text-slate-500 text-sm">Searching verified freelancers...</div>
      ) : freelancers.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
          <p className="text-slate-600 font-medium">No freelancers matched your filter criteria.</p>
          <button
            onClick={() => {
              setQuery('');
              setSelectedSkill('');
              setMinRating('');
              setMaxRate('');
              setAvailability('');
            }}
            className="mt-3 text-xs text-brand-indigo font-semibold hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-xs text-slate-500 font-medium">Showing {freelancers.length} available talent profiles</div>
          {freelancers.map((f) => (
            <div
              key={f.id}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col md:flex-row gap-6 justify-between items-start"
            >
              <div className="flex items-start gap-5">
                <img
                  src={f.user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${f.user?.name}`}
                  alt={f.user?.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-200 flex-shrink-0"
                />
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Link to={`/freelancers/${f.id}`} className="text-lg font-bold text-slate-900 hover:text-brand-indigo transition-colors">
                      {f.user?.name}
                    </Link>
                    {f.verificationStatus === 'verified' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-teal bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-brand-indigo">{f.headline}</p>
                  <p className="text-xs text-slate-600 line-clamp-2 max-w-2xl leading-relaxed">{f.bio}</p>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {f.skills.map((s) => (
                      <span key={s.name} className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded">
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right column with stats & actions */}
              <div className="w-full md:w-auto md:min-w-[200px] flex md:flex-col justify-between md:items-end border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                <div className="text-left md:text-right mb-4">
                  <div className="text-xl font-extrabold text-brand-navy">${f.hourlyRate}/hr</div>
                  <div className="flex items-center gap-1 text-xs text-amber-500 font-semibold md:justify-end mt-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{f.rating} ({f.reviewCount} reviews)</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    {f.completedProjectsCount} completed • {f.availability.replace('_', ' ')}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link
                    to={`/freelancers/${f.id}`}
                    className="px-4 py-2 rounded-xl bg-brand-navy hover:bg-slate-800 text-white font-semibold text-xs transition-colors flex items-center gap-1"
                  >
                    <span>View Profile</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
