import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Briefcase, Sparkles, Tag, DollarSign, Clock, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';

export const PostProjectPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const prefill = (location.state as any) || {};

  const [title, setTitle] = useState<string>(prefill.title || '');
  const [description, setDescription] = useState<string>(prefill.description || '');
  const [category, setCategory] = useState<string>(prefill.category || 'Web Development');
  const [skills, setSkills] = useState<string>(prefill.skills || 'React, TypeScript, Node.js');
  const [budgetType, setBudgetType] = useState<'fixed' | 'hourly'>(prefill.budgetType || 'fixed');
  const [budgetMin, setBudgetMin] = useState<string>(prefill.budgetMin ? String(prefill.budgetMin) : '3000');
  const [budgetMax, setBudgetMax] = useState<string>(prefill.budgetMax ? String(prefill.budgetMax) : '4500');
  const [experienceLevel, setExperienceLevel] = useState<'entry' | 'intermediate' | 'expert'>(prefill.experienceLevel || 'expert');
  const [duration, setDuration] = useState<string>(prefill.duration || '4 weeks');
  const [workArrangement, setWorkArrangement] = useState<'remote' | 'onsite' | 'hybrid'>(prefill.workArrangement || 'remote');

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
        <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C9A24B]">
          PROJECT CREATION WIZARD
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#F6F1E4] mt-1">
          Post a New <span className="italic text-[#E5CB86]">Opportunity</span>
        </h1>
        <p className="text-xs text-[#BFD0C6] mt-1">
          Specify your project scope. Our assisted model can enhance specifications and extract skills automatically.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-[6px] bg-[#114A39] border border-[#E27C6B] text-[#E27C6B] text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-[#114A39] p-8 rounded-[12px] border border-[#1F5A46] space-y-6">
        <div>
          <label className="block text-xs font-medium text-[#F6F1E4] mb-1.5">Project Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. AI-Powered Analytics Dashboard & Customer Insights Hub"
            className="w-full p-3.5 rounded-[6px] bg-[#072A20] border border-[#1F5A46] text-xs text-[#F6F1E4] placeholder:text-[#9DB5A8] focus:outline-none focus:border-[#C9A24B]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#F6F1E4] mb-1.5">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3.5 rounded-[6px] bg-[#072A20] border border-[#1F5A46] text-xs text-[#F6F1E4] focus:outline-none focus:border-[#C9A24B]"
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
            <label className="block text-xs font-medium text-[#F6F1E4] mb-1.5">Experience Tier Required</label>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value as any)}
              className="w-full p-3.5 rounded-[6px] bg-[#072A20] border border-[#1F5A46] text-xs text-[#F6F1E4] focus:outline-none focus:border-[#C9A24B]"
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
            <label className="text-xs font-medium text-[#F6F1E4]">Project Description & Scope</label>
            <button
              type="button"
              onClick={handleEnhanceDescription}
              disabled={aiLoading}
              className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#E5CB86] hover:text-[#C9A24B] bg-[#072A20] px-3 py-1 rounded-[4px] border border-[#1F5A46] hover:border-[#C9A24B] transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C9A24B]" />
              <span>{aiLoading ? 'Enhancing with AI...' : 'AI Spec Enhancer'}</span>
            </button>
          </div>
          <textarea
            rows={8}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Outline your project requirements, goals, deliverables, and technical expectations..."
            className="w-full p-3.5 rounded-[6px] bg-[#072A20] border border-[#1F5A46] text-xs text-[#F6F1E4] placeholder:text-[#9DB5A8] focus:outline-none focus:border-[#C9A24B] leading-relaxed"
          />
        </div>

        {/* Skills with Auto-Extract */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-[#F6F1E4]">Required Skills (comma-separated)</label>
            <button
              type="button"
              onClick={handleExtractSkills}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-[#7BC49A] bg-[#072A20] px-2.5 py-0.5 rounded-[4px] border border-[#1F5A46] hover:border-[#7BC49A] transition-colors"
            >
              <Tag className="w-3 h-3 text-[#7BC49A]" />
              <span>Auto-Extract from Description</span>
            </button>
          </div>
          <input
            type="text"
            required
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            className="w-full p-3.5 rounded-[6px] bg-[#072A20] border border-[#1F5A46] text-xs text-[#F6F1E4] placeholder:text-[#9DB5A8] focus:outline-none focus:border-[#C9A24B]"
          />
        </div>

        {/* Budget & Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#F6F1E4] mb-1.5">Min Budget ($ USD)</label>
            <input
              type="number"
              required
              value={budgetMin}
              onChange={(e) => setBudgetMin(e.target.value)}
              className="w-full p-3.5 rounded-[6px] bg-[#072A20] border border-[#1F5A46] text-xs text-[#F6F1E4] focus:outline-none focus:border-[#C9A24B]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#F6F1E4] mb-1.5">Max Budget ($ USD)</label>
            <input
              type="number"
              required
              value={budgetMax}
              onChange={(e) => setBudgetMax(e.target.value)}
              className="w-full p-3.5 rounded-[6px] bg-[#072A20] border border-[#1F5A46] text-xs text-[#F6F1E4] focus:outline-none focus:border-[#C9A24B]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#F6F1E4] mb-1.5">Estimated Duration</label>
            <input
              type="text"
              required
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. 4 weeks"
              className="w-full p-3.5 rounded-[6px] bg-[#072A20] border border-[#1F5A46] text-xs text-[#F6F1E4] focus:outline-none focus:border-[#C9A24B]"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-[#1F5A46] flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/business/dashboard')}
            className="px-5 py-2.5 rounded-[6px] text-xs font-medium text-[#BFD0C6] hover:bg-[#072A20] border border-transparent hover:border-[#1F5A46] transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-7 py-3 rounded-[6px] bg-[#C9A24B] hover:bg-[#E5CB86] text-[#0B3D2E] font-medium text-xs transition-colors flex items-center gap-2"
          >
            <span>{submitting ? 'Publishing Project...' : 'Publish Project & Find Matches'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
