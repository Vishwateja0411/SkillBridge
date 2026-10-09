import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  ShieldCheck,
  MapPin,
  Clock,
  Briefcase,
  ExternalLink,
  MessageSquare,
  Award,
  Globe,
  CheckCircle2,
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { FreelancerProfile, Review } from '@skillbridge/shared';

export const FreelancerProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<FreelancerProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      api.getFreelancerById(id).then((res) => {
        if (res.success) {
          setProfile(res.profile);
          setReviews(res.reviews || []);
        }
        setLoading(false);
      });
    }
  }, [id]);

  const handleStartChat = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (profile?.userId) {
      const res = await api.startConversation({ recipientUserId: profile.userId });
      if (res.success) {
        if (user.role === 'business') navigate('/business/messages');
        else navigate('/freelancer/messages');
      }
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-slate-500">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="text-center py-20 text-slate-500">Freelancer not found.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Profile Header Card */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start gap-8">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <img
            src={profile.user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${profile.user?.name}`}
            alt={profile.user?.name}
            className="w-24 h-24 rounded-2xl object-cover border-2 border-indigo-100 shadow-md"
          />
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900">{profile.user?.name}</h1>
              {profile.verificationStatus === 'verified' && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-teal bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                  <ShieldCheck className="w-4 h-4" />
                  Verified Freelancer
                </span>
              )}
            </div>

            <p className="text-sm font-semibold text-brand-indigo">{profile.headline}</p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
              {profile.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {profile.location}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {profile.availability.replace('_', ' ')}
              </span>
              <span className="flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                {profile.completedProjectsCount} completed contracts
              </span>
            </div>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="w-full md:w-auto md:text-right flex flex-col items-start md:items-end justify-between border-t md:border-t-0 pt-6 md:pt-0 border-slate-100">
          <div>
            <div className="text-3xl font-extrabold text-brand-navy">${profile.hourlyRate}<span className="text-sm font-normal text-slate-500">/hr</span></div>
            <div className="flex items-center gap-1.5 text-sm text-amber-500 font-bold md:justify-end mt-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{profile.rating}</span>
              <span className="text-slate-400 text-xs font-normal">({profile.reviewCount} client reviews)</span>
            </div>
          </div>

          <div className="mt-6 flex gap-3 w-full sm:w-auto">
            <button
              onClick={handleStartChat}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-brand-navy hover:bg-slate-800 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <MessageSquare className="w-4 h-4 text-brand-teal" />
              <span>Send Message</span>
            </button>
            <Link
              to="/business/projects/new"
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-brand-indigo hover:bg-brand-indigo-dark text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-md shadow-indigo-100"
            >
              <span>Invite to Job</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Grid: Overview & Skills vs Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Bio & Portfolio */}
        <div className="lg:col-span-2 space-y-8">
          {/* About / Bio */}
          <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <h2 className="text-base font-bold text-slate-900">About & Background</h2>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{profile.bio}</p>
          </div>

          {/* Portfolio Projects */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Portfolio Projects ({profile.portfolio?.length || 0})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {(profile.portfolio || []).map((port) => (
                <div key={port.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  {port.imageUrl && (
                    <img src={port.imageUrl} alt={port.title} className="w-full h-44 object-cover border-b border-slate-100" />
                  )}
                  <div className="p-5 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-indigo bg-indigo-50 px-2 py-0.5 rounded">
                      {port.category}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900">{port.title}</h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{port.description}</p>

                    <div className="flex flex-wrap gap-1 pt-2">
                      {port.skills.map((s) => (
                        <span key={s} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                          {s}
                        </span>
                      ))}
                    </div>

                    {port.projectUrl && (
                      <div className="pt-3 border-t border-slate-100">
                        <a
                          href={port.projectUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-brand-indigo font-semibold hover:underline"
                        >
                          <span>View Live Work</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Client Reviews */}
          <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">Client Reviews & Ratings</h2>
              <div className="flex items-center gap-1 text-sm font-bold text-amber-500">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{profile.rating} / 5.0</span>
              </div>
            </div>

            {reviews.length === 0 ? (
              <p className="text-xs text-slate-500">No verified reviews submitted yet.</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((r) => (
                  <div key={r.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">{r.reviewer?.name || 'Verified Client'}</span>
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{r.rating}.0</span>
                      </div>
                    </div>
                    <p className="text-slate-600 leading-relaxed italic">"{r.feedback}"</p>
                    <div className="text-[10px] text-slate-400">
                      Reviewed on {new Date(r.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Skills & Certifications */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900">Verified Skills</h3>
            <div className="space-y-2.5">
              {profile.skills.map((s) => (
                <div key={s.name} className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700">{s.name}</span>
                  <span className="capitalize px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-brand-indigo">
                    {s.level} {s.yearsExperience ? `• ${s.yearsExperience}y` : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {profile.certifications && profile.certifications.length > 0 && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <h3 className="font-bold text-sm text-slate-900">Certifications</h3>
              <ul className="space-y-2 text-xs text-slate-600">
                {profile.certifications.map((cert) => (
                  <li key={cert} className="flex items-start gap-2">
                    <Award className="w-4 h-4 text-brand-teal flex-shrink-0 mt-0.5" />
                    <span>{cert}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {profile.languages && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <h3 className="font-bold text-sm text-slate-900">Languages</h3>
              <div className="flex flex-wrap gap-2 text-xs">
                {profile.languages.map((l) => (
                  <span key={l} className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
                    {l}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
