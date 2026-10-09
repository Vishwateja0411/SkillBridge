import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ExternalLink, Image as ImageIcon, X } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { FreelancerProfile, PortfolioItem } from '@skillbridge/shared';

export const FreelancerPortfolioPage: React.FC = () => {
  const { profile, refreshMe } = useAuth();
  const fProfile = profile as FreelancerProfile;

  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Web Development');
  const [skills, setSkills] = useState('React, TypeScript, Node.js');
  const [projectUrl, setProjectUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const skillArray = skills.split(',').map((s) => s.trim()).filter(Boolean);
      const res = await api.addPortfolioItem({
        title,
        description,
        category,
        skills: skillArray,
        projectUrl,
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
      });
      if (res.success) {
        setModalOpen(false);
        setTitle('');
        setDescription('');
        setProjectUrl('');
        setImageUrl('');
        await refreshMe();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this portfolio project?')) {
      await api.removePortfolioItem(id);
      await refreshMe();
    }
  };

  const portfolio = fProfile?.portfolio || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Portfolio Showcase</h1>
          <p className="text-xs text-slate-500 mt-1">
            Showcase your best delivered projects to boost your AI Match score with businesses
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-brand-indigo hover:bg-brand-indigo-dark text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Project</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolio.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between">
            <div>
              {p.imageUrl && (
                <img src={p.imageUrl} alt={p.title} className="w-full h-44 object-cover border-b border-slate-100" />
              )}
              <div className="p-5 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-indigo bg-indigo-50 px-2.5 py-0.5 rounded">
                  {p.category}
                </span>
                <h3 className="font-bold text-sm text-slate-900">{p.title}</h3>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{p.description}</p>
                <div className="flex flex-wrap gap-1 pt-2">
                  {p.skills.map((s) => (
                    <span key={s} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs">
              {p.projectUrl ? (
                <a
                  href={p.projectUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-brand-indigo font-bold hover:underline flex items-center gap-1"
                >
                  <span>Live Preview</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <span className="text-slate-400">No external link</span>
              )}

              <button
                onClick={() => handleDelete(p.id)}
                className="text-slate-400 hover:text-red-600 p-1 rounded transition-colors"
                title="Remove"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-slate-200 relative">
            <button onClick={() => setModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-700">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-slate-900 mb-4">Add Portfolio Project</h3>

            <form onSubmit={handleAddProject} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Real-Time Telemetry Analytics Platform"
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-brand-indigo"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Category</label>
                <input
                  type="text"
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-brand-indigo"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Skills Used (comma-separated)</label>
                <input
                  type="text"
                  required
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-brand-indigo"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Project URL / Live Demo</label>
                <input
                  type="url"
                  value={projectUrl}
                  onChange={(e) => setProjectUrl(e.target.value)}
                  placeholder="https://github.com/... or https://..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-brand-indigo"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Image Thumbnail URL (optional)</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-brand-indigo"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summarize key features, tech stack, and project impact..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-brand-indigo"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-brand-indigo hover:bg-brand-indigo-dark text-white font-bold text-xs"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
