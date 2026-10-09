import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Briefcase, Calendar, Clock, DollarSign, ArrowRight, Tag } from 'lucide-react';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-brand-navy">Explore Available Projects</h1>
        <p className="text-slate-500 text-sm mt-1">
          Apply to genuine opportunities posted by verified businesses with guaranteed milestone escrow.
        </p>
      </div>

      {/* Filter bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by keywords, technologies, or title..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-indigo"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white"
            >
              <option value="">Any Experience</option>
              <option value="entry">Entry Level</option>
              <option value="intermediate">Intermediate</option>
              <option value="expert">Expert</option>
            </select>
          </div>
        </div>

        {/* Categories Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-semibold text-slate-500 mr-1">Category:</span>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c === category ? '' : c)}
              className={`text-xs px-3 py-1 rounded-lg font-medium transition-colors ${
                (c === 'All' && !category) || category === c
                  ? 'bg-brand-navy text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Projects List */}
      {loading ? (
        <div className="text-center py-20 text-slate-500 text-sm">Loading projects...</div>
      ) : projects.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
          <p className="text-slate-600 font-medium">No projects matched your criteria.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-xs text-slate-500 font-medium">Showing {projects.length} open projects</div>
          {projects.map((p) => (
            <div
              key={p.id}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1.5 max-w-3xl">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 text-brand-indigo border border-indigo-100">
                      {p.category}
                    </span>
                    <span className="text-xs text-slate-400">• Posted {new Date(p.createdAt).toLocaleDateString()}</span>
                  </div>
                  <Link
                    to={`/projects/${p.id}`}
                    className="text-lg font-bold text-slate-900 hover:text-brand-indigo transition-colors block"
                  >
                    {p.title}
                  </Link>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{p.description}</p>
                </div>

                <div className="text-left sm:text-right flex-shrink-0">
                  <div className="text-xl font-extrabold text-brand-navy">
                    ${p.budgetMin.toLocaleString()} - ${p.budgetMax.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium capitalize mt-0.5">
                    {p.budgetType} Price • {p.experienceLevel}
                  </div>
                </div>
              </div>

              {/* Required Skills Badges */}
              <div className="flex flex-wrap items-center gap-1.5 pt-2">
                {p.requiredSkills.map((s) => (
                  <span key={s} className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded">
                    {s}
                  </span>
                ))}
              </div>

              {/* Bottom metadata */}
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-3">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Est. Duration: {p.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                    {p.workArrangement}
                  </span>
                  <span>{p.proposalsCount} proposals</span>
                </div>

                <Link
                  to={`/projects/${p.id}`}
                  className="px-4 py-2 rounded-xl bg-brand-indigo hover:bg-brand-indigo-dark text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>View Project & Apply</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
