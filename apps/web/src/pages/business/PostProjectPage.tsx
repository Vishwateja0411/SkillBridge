import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Sparkles, Tag, DollarSign, Clock, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';

export const PostProjectPage: React.FC = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Web Development');
  const [skills, setSkills] = useState('React, TypeScript, Node.js');
  const [budgetType, setBudgetType] = useState<'fixed' | 'hourly'>('fixed');
  const [budgetMin, setBudgetMin] = useState('3000');
  const [budgetMax, setBudgetMax] = useState('4500');
  const [experienceLevel, setExperienceLevel] = useState<'entry' | 'intermediate' | 'expert'>('expert');
  const [duration, setDuration] = useState('4 weeks');
  const [workArrangement, setWorkArrangement] = useState<'remote' | 'onsite' | 'hybrid'>('remote');

  const [aiLoading, setAiLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // AI Description Enhancer
  const handleEnhanceDescription = async () => {
    if (!description.trim()) {
      alert('Please enter a brief outline or idea first so the AI can expand it.');
      return;
    }
    setAiLoading(true);
    try {
      const res = await api.enhanceProjectDescription({
        title,
        prompt: description,
        category,
      });
      if (res.success && res.enhancedDescription) {
        setDescription(res.enhancedDescription);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  // AI Skill Extractor
  const handleExtractSkills = async () => {
    if (!description.trim()) return;
    try {
      const res = await api.extractSkills(description);
      if (res.success && res.skills.length > 0) {
        setSkills(res.skills.join(', '));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      const skillArray = skills.split(',').map((s) => s.trim()).filter(Boolean);
      const res = await api.createProject({
        title,
        description,
        category,
        requiredSkills: skillArray,
        experienceLevel,
        budgetType,
        budgetMin: Number(budgetMin),
        budgetMax: Number(budgetMax),
        duration,
        workArrangement,
      });

      if (res.success) {
        navigate(`/business/projects/${res.project.id}/proposals`);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to publish project');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <span className="text-xs font-bold text-brand-indigo uppercase tracking-wider">Project Creation Wizard</span>
        <h1 className="text-3xl font-extrabold text-brand-navy mt-1">Post a New Opportunity</h1>
        <p className="text-xs text-slate-500 mt-1">
          Specify your project scope. Our AI assistant can enhance your specifications and extract skills automatically.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5">Project Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. AI-Powered Analytics Dashboard & Customer Insights Hub"
            className="w-full p-3.5 rounded-xl border border-slate-200 text-xs text-slate-800 font-semibold focus:outline-none focus:border-brand-indigo"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white"
            >
              <option value="Web Development">Web Development</option>
              <option value="UI/UX Design">UI/UX Design</option>
              <option value="DevOps & Cloud">DevOps & Cloud</option>
              <option value="E-Commerce">E-Commerce</option>
              <option value="Mobile Development">Mobile Development</option>
              <option value="AI & Machine Learning">AI & Machine Learning</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">Experience Tier Required</label>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value as any)}
              className="w-full p-3.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white"
            >
              <option value="entry">Entry Level (Junior)</option>
              <option value="intermediate">Intermediate (Mid-Level)</option>
              <option value="expert">Expert (Senior / Architect)</option>
            </select>
          </div>
        </div>

        {/* Description with AI Enhancer */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-slate-800">Project Description & Scope</label>
            <button
              type="button"
              onClick={handleEnhanceDescription}
              disabled={aiLoading}
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-brand-indigo hover:text-indigo-800 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{aiLoading ? 'Enhancing with AI...' : 'AI Spec Enhancer'}</span>
            </button>
          </div>
          <textarea
            rows={8}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Outline your project requirements, goals, deliverables, and technical expectations..."
            className="w-full p-3.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-brand-indigo leading-relaxed"
          />
        </div>

        {/* Skills with Auto-Extract */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-slate-800">Required Skills (comma-separated)</label>
            <button
              type="button"
              onClick={handleExtractSkills}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-teal bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-200"
            >
              <Tag className="w-3 h-3" />
              <span>Auto-Extract from Description</span>
            </button>
          </div>
          <input
            type="text"
            required
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            className="w-full p-3.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-brand-indigo"
          />
        </div>

        {/* Budget & Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">Min Budget ($ USD)</label>
            <input
              type="number"
              required
              value={budgetMin}
              onChange={(e) => setBudgetMin(e.target.value)}
              className="w-full p-3.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-brand-indigo"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">Max Budget ($ USD)</label>
            <input
              type="number"
              required
              value={budgetMax}
              onChange={(e) => setBudgetMax(e.target.value)}
              className="w-full p-3.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-brand-indigo"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">Estimated Duration</label>
            <input
              type="text"
              required
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. 4 weeks"
              className="w-full p-3.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-brand-indigo"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/business/dashboard')}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-7 py-3 rounded-xl bg-brand-navy hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <span>{submitting ? 'Publishing Project...' : 'Publish Project & Find Matches'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
