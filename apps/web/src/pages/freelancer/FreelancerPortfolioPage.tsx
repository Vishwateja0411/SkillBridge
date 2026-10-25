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
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C9A24B]">
            DELIVERED WORK
          </div>
          <h1 className="font-serif text-3xl font-medium text-[#F6F1E4] mt-1">
            Portfolio <span className="italic text-[#E5CB86]">Showcase</span>
          </h1>
          <p className="text-xs text-[#BFD0C6] mt-1">
            Showcase your best delivered projects to boost your match compatibility with businesses
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-[6px] bg-[#C9A24B] hover:bg-[#E5CB86] text-[#0B3D2E] font-medium text-xs shadow-sm flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Project</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolio.map((p) => (
          <div key={p.id} className="bg-[#114A39] rounded-[12px] border border-[#1F5A46] overflow-hidden flex flex-col justify-between hover:border-[#2B6D56] transition-all">
            <div>
              {p.imageUrl && (
                <img src={p.imageUrl} alt={p.title} className="w-full h-44 object-cover border-b border-[#1F5A46]" />
              )}
              <div className="p-5 space-y-2">
                <span className="text-[10px] font-medium uppercase tracking-wider text-[#C9A24B] bg-[#072A20] px-2.5 py-0.5 rounded-[4px] border border-[#1F5A46]">
                  {p.category}
                </span>
                <h3 className="font-serif text-lg font-medium text-[#F6F1E4] leading-snug">{p.title}</h3>
                <p className="text-xs text-[#BFD0C6] line-clamp-3 leading-relaxed">{p.description}</p>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {p.skills.map((s) => (
                    <span key={s} className="text-[10px] bg-[#072A20] text-[#9DB5A8] border border-[#1F5A46] px-2 py-0.5 rounded-[4px]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-[#1F5A46] flex items-center justify-between text-xs">
              {p.projectUrl ? (
                <a
                  href={p.projectUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#E5CB86] hover:text-[#C9A24B] font-medium flex items-center gap-1 transition-colors"
                >
                  <span>Live Preview</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <span className="text-[#9DB5A8]">No external link</span>
              )}

              <button
                onClick={() => handleDelete(p.id)}
                className="text-[#9DB5A8] hover:text-[#E27C6B] p-1 rounded transition-colors"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#072A20]/80">
          <div className="bg-[#114A39] rounded-[12px] max-w-lg w-full p-8 border border-[#1F5A46] relative">
            <button onClick={() => setModalOpen(false)} className="absolute top-6 right-6 text-[#9DB5A8] hover:text-[#F6F1E4]">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-serif text-xl font-medium text-[#F6F1E4] mb-4">Add Portfolio Project</h3>

            <form onSubmit={handleAddProject} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#F6F1E4] mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Real-Time Telemetry Analytics Platform"
                  className="w-full p-3 rounded-[6px] bg-[#072A20] border border-[#1F5A46] text-xs text-[#F6F1E4] placeholder:text-[#9DB5A8] focus:outline-none focus:border-[#C9A24B]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#F6F1E4] mb-1">Category</label>
                <input
                  type="text"
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-3 rounded-[6px] bg-[#072A20] border border-[#1F5A46] text-xs text-[#F6F1E4] focus:outline-none focus:border-[#C9A24B]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#F6F1E4] mb-1">Skills Used (comma-separated)</label>
                <input
                  type="text"
                  required
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="w-full p-3 rounded-[6px] bg-[#072A20] border border-[#1F5A46] text-xs text-[#F6F1E4] focus:outline-none focus:border-[#C9A24B]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#F6F1E4] mb-1">Project URL / Live Demo</label>
                <input
                  type="url"
                  value={projectUrl}
                  onChange={(e) => setProjectUrl(e.target.value)}
                  placeholder="https://github.com/... or https://..."
                  className="w-full p-3 rounded-[6px] bg-[#072A20] border border-[#1F5A46] text-xs text-[#F6F1E4] placeholder:text-[#9DB5A8] focus:outline-none focus:border-[#C9A24B]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#F6F1E4] mb-1">Image Thumbnail URL (optional)</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-3 rounded-[6px] bg-[#072A20] border border-[#1F5A46] text-xs text-[#F6F1E4] placeholder:text-[#9DB5A8] focus:outline-none focus:border-[#C9A24B]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#F6F1E4] mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summarize key features, tech stack, and project impact..."
                  className="w-full p-3 rounded-[6px] bg-[#072A20] border border-[#1F5A46] text-xs text-[#F6F1E4] placeholder:text-[#9DB5A8] focus:outline-none focus:border-[#C9A24B]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-[6px] text-xs font-medium text-[#BFD0C6] hover:bg-[#072A20] border border-transparent hover:border-[#1F5A46] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-[6px] bg-[#C9A24B] hover:bg-[#E5CB86] text-[#0B3D2E] font-medium text-xs transition-colors"
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
