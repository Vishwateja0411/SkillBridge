import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Briefcase, Clock, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';
import { Project } from '@skillbridge/shared';

export const FindProjectsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [query, setQuery] = useState(searchParams.get('query') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [selectedSkill, setSelectedSkill] = useState(searchParams.get('skill') || '');
  const [experienceLevel, setExperienceLevel] = useState('');

  const categories = ['All', 'Web Development', 'UI/UX Design', 'DevOps & Cloud', 'E-Commerce', 'Mobile'];

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (query) params.query = query;
      if (category && category !== 'All') params.category = category;
      if (selectedSkill) params.skill = selectedSkill;
      if (experienceLevel) params.experienceLevel = experienceLevel;

      const res = await api.getProjects(params);
      if (res.success) {
        setProjects(res.projects);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [query, category, selectedSkill, experienceLevel]);

  return (
    <div className="bg-[#0B3D2E] text-[#F6F1E4] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C9A24B] mb-1">
            PROJECT MARKETPLACE
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-medium text-[#F6F1E4]">
            Explore <span className="italic text-[#E5CB86]">Available</span> Projects.
          </h1>
          <p className="text-xs sm:text-sm text-[#BFD0C6] mt-2 max-w-2xl leading-relaxed">
            Apply to genuine opportunities posted by verified businesses with guaranteed milestone escrow.
          </p>
        </div>

        {/* Filter bar */}
        <div className="bg-[#114A39] p-5 rounded-[12px] border border-[#1F5A46] space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#9DB5A8] absolute left-3.5 top-3" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by keywords, technologies, or title..."
                className="w-full pl-10 pr-4 py-2.5 rounded-[6px] bg-[#072A20] border border-[#1F5A46] text-xs text-[#F6F1E4] placeholder:text-[#9DB5A8] focus:outline-none focus:border-[#C9A24B]"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="px-3 py-2 rounded-[6px] border border-[#1F5A46] text-xs font-medium text-[#F6F1E4] bg-[#072A20] focus:outline-none focus:border-[#C9A24B]"
              >
                <option value="">Any Experience</option>
                <option value="entry">Entry Level</option>
                <option value="intermediate">Intermediate</option>
                <option value="expert">Expert</option>
              </select>
            </div>
          </div>

          {/* Categories Tabs */}
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-[#1F5A46]">
            <span className="text-xs text-[#9DB5A8] mr-1">Category:</span>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c === category ? '' : c)}
                className={`text-xs px-3 py-1 rounded-[6px] font-medium transition-colors border ${
                  (c === 'All' && !category) || category === c
                    ? 'bg-[#C9A24B] text-[#0B3D2E] border-[#C9A24B]'
                    : 'bg-[#072A20] text-[#BFD0C6] border-[#1F5A46] hover:text-[#F6F1E4]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Projects List */}
        {loading ? (
          <div className="text-center py-20 text-[#9DB5A8] text-xs">Loading open projects...</div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16 bg-[#114A39] rounded-[12px] border border-[#1F5A46] p-8">
            <p className="text-[#BFD0C6] text-sm">No projects matched your criteria.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-xs text-[#9DB5A8]">Showing {projects.length} open projects</div>
            {projects.map((p) => (
              <div
                key={p.id}
                className="bg-[#114A39] p-6 rounded-[12px] border border-[#1F5A46] shadow-sm hover:border-[#2B6D56] transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1.5 max-w-3xl">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#C9A24B]">
                        {p.category}
                      </span>
                      <span className="text-xs text-[#9DB5A8]">• Posted {new Date(p.createdAt).toLocaleDateString()}</span>
                    </div>
                    <Link
                      to={`/projects/${p.id}`}
                      className="font-serif text-2xl font-medium text-[#F6F1E4] hover:text-[#E5CB86] transition-colors block"
                    >
                      {p.title}
                    </Link>
                    <p className="text-xs text-[#BFD0C6] line-clamp-3 leading-relaxed">{p.description}</p>
                  </div>

                  <div className="text-left sm:text-right flex-shrink-0">
                    <div className="font-serif text-2xl font-medium text-[#E5CB86]">
                      ${p.budgetMin.toLocaleString()} - ${p.budgetMax.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-[#9DB5A8] capitalize mt-0.5">
                      {p.budgetType} Price • {p.experienceLevel}
                    </div>
                  </div>
                </div>

                {/* Required Skills Badges */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {p.requiredSkills.map((s) => (
                    <span
                      key={s}
                      className="text-[11px] font-medium bg-[#072A20] text-[#BFD0C6] border border-[#1F5A46] px-2.5 py-0.5 rounded-[4px]"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                {/* Bottom metadata */}
                <div className="pt-3 border-t border-[#1F5A46] flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#BFD0C6] gap-3">
                  <div className="flex items-center gap-4 text-[11px]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#9DB5A8]" />
                      Duration: {p.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-[#9DB5A8]" />
                      {p.workArrangement}
                    </span>
                    <span>{p.proposalsCount} proposals</span>
                  </div>

                  <Link
                    to={`/projects/${p.id}`}
                    className="px-4 py-2 rounded-[6px] bg-[#C9A24B] hover:bg-[#E5CB86] text-[#0B3D2E] font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>View project & apply</span>
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
