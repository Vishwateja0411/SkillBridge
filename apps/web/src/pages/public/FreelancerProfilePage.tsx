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
  Check,
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
    return <div className="text-center py-20 text-[#9DB5A8] bg-[#0B3D2E] min-h-screen">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="text-center py-20 text-[#9DB5A8] bg-[#0B3D2E] min-h-screen">Freelancer not found.</div>;
  }

  return (
    <div className="bg-[#0B3D2E] text-[#F6F1E4] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Profile Header Card */}
        <div className="bg-[#114A39] p-8 rounded-[12px] border border-[#1F5A46] shadow-sm flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <img
              src={profile.user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${profile.user?.name}`}
              alt={profile.user?.name}
              className="w-24 h-24 rounded-full object-cover border border-[#1F5A46] shadow-md flex-shrink-0"
            />
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <h1 className="font-serif text-3xl font-medium text-[#F6F1E4]">{profile.user?.name}</h1>
                {profile.verificationStatus === 'verified' && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#E5CB86] bg-[#072A20] px-2.5 py-0.5 rounded-[4px] border border-[#1F5A46]">
                    <Check className="w-3.5 h-3.5 text-[#C9A24B]" />
                    Verified
                  </span>
                )}
              </div>

              <p className="text-xs font-semibold text-[#E5CB86]">{profile.headline}</p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-[#BFD0C6]">
                {profile.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#9DB5A8]" />
                    {profile.location}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#9DB5A8]" />
                  {profile.availability.replace('_', ' ')}
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-[#9DB5A8]" />
                  {profile.completedProjectsCount} completed contracts
                </span>
              </div>
            </div>
          </div>

          {/* Pricing & CTA */}
          <div className="w-full md:w-auto md:text-right flex flex-col items-start md:items-end justify-between border-t md:border-t-0 pt-6 md:pt-0 border-[#1F5A46]">
            <div>
              <div className="font-serif text-3xl font-medium text-[#F6F1E4]">
                ${profile.hourlyRate}<span className="text-xs font-normal text-[#BFD0C6]">/hr</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#C9A24B] font-medium md:justify-end mt-1">
                <Star className="w-3.5 h-3.5 fill-[#C9A24B] text-[#C9A24B]" />
                <span>{profile.rating}</span>
                <span className="text-[#9DB5A8]">({profile.reviewCount} client reviews)</span>
              </div>
            </div>

            <div className="mt-6 flex gap-3 w-full sm:w-auto">
              <button
                onClick={handleStartChat}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-[6px] bg-[#072A20] hover:bg-[#0B3D2E] text-[#F6F1E4] border border-[#1F5A46] hover:border-[#C9A24B] font-semibold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#C9A24B]" />
                <span>Send Message</span>
              </button>
              <Link
                to="/business/projects/new"
                className="flex-1 sm:flex-initial px-5 py-2.5 rounded-[6px] bg-[#C9A24B] hover:bg-[#E5CB86] text-[#0B3D2E] font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Invite to Opportunity</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Main Grid: Overview & Skills vs Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Bio & Portfolio */}
          <div className="lg:col-span-2 space-y-8">
            {/* About / Bio */}
            <div className="bg-[#114A39] p-7 rounded-[12px] border border-[#1F5A46] shadow-sm space-y-3">
              <h2 className="font-serif text-xl font-medium text-[#F6F1E4]">Professional Background</h2>
              <p className="text-xs text-[#BFD0C6] leading-relaxed whitespace-pre-line">{profile.bio}</p>
            </div>

            {/* Portfolio Projects */}
            <div className="space-y-4">
              <h2 className="font-serif text-2xl font-medium text-[#F6F1E4]">
                Portfolio Case Studies ({profile.portfolio?.length || 0})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {(profile.portfolio || []).map((port) => (
                  <div key={port.id} className="bg-[#114A39] rounded-[12px] border border-[#1F5A46] overflow-hidden shadow-sm hover:border-[#2B6D56] transition-all">
                    {port.imageUrl && (
                      <img src={port.imageUrl} alt={port.title} className="w-full h-40 object-cover border-b border-[#1F5A46]" />
                    )}
                    <div className="p-5 space-y-2">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#C9A24B]">
                        {port.category}
                      </span>
                      <h3 className="font-serif text-lg font-medium text-[#F6F1E4]">{port.title}</h3>
                      <p className="text-xs text-[#BFD0C6] line-clamp-2 leading-relaxed">{port.description}</p>

                      <div className="flex flex-wrap gap-1 pt-1">
                        {port.skills.map((s) => (
                          <span key={s} className="text-[10px] bg-[#072A20] text-[#BFD0C6] border border-[#1F5A46] px-2 py-0.5 rounded-[4px]">
                            {s}
                          </span>
                        ))}
                      </div>

                      {port.projectUrl && (
                        <div className="pt-3 border-t border-[#1F5A46]">
                          <a
                            href={port.projectUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-[#E5CB86] hover:underline"
                          >
                            <span>Inspect Live Project</span>
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
            <div className="bg-[#114A39] p-7 rounded-[12px] border border-[#1F5A46] shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-xl font-medium text-[#F6F1E4]">Client Reviews & Reputation</h2>
                <div className="flex items-center gap-1 text-xs font-semibold text-[#C9A24B]">
                  <Star className="w-4 h-4 fill-[#C9A24B] text-[#C9A24B]" />
                  <span>{profile.rating} / 5.0</span>
                </div>
              </div>

              {reviews.length === 0 ? (
                <p className="text-xs text-[#9DB5A8]">No verified reviews submitted yet.</p>
              ) : (
                <div className="space-y-3">
                  {reviews.map((r) => (
                    <div key={r.id} className="p-4 rounded-[8px] bg-[#072A20] border border-[#1F5A46] space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-[#F6F1E4]">{r.reviewer?.name || 'Verified Client'}</span>
                        <div className="flex items-center gap-1 text-[#C9A24B]">
                          <Star className="w-3 h-3 fill-[#C9A24B] text-[#C9A24B]" />
                          <span>{r.rating}.0</span>
                        </div>
                      </div>
                      <p className="text-[#BFD0C6] leading-relaxed italic">"{r.feedback}"</p>
                      <div className="text-[10px] text-[#9DB5A8]">
                        Reviewed on {new Date(r.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Col: Verified Skills & Details */}
          <div className="space-y-6">
            <div className="bg-[#114A39] p-6 rounded-[12px] border border-[#1F5A46] shadow-sm space-y-4">
              <h3 className="font-serif text-lg font-medium text-[#F6F1E4]">Verified Skills</h3>
              <div className="space-y-2">
                {profile.skills.map((s) => (
                  <div key={s.name} className="flex items-center justify-between text-xs p-2 rounded-[6px] bg-[#072A20] border border-[#1F5A46]">
                    <span className="font-medium text-[#F6F1E4]">{s.name}</span>
                    <span className="text-[10px] text-[#E5CB86] uppercase font-semibold">
                      {s.level} {s.yearsExperience ? `• ${s.yearsExperience}y` : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {profile.certifications && profile.certifications.length > 0 && (
              <div className="bg-[#114A39] p-6 rounded-[12px] border border-[#1F5A46] shadow-sm space-y-3">
                <h3 className="font-serif text-lg font-medium text-[#F6F1E4]">Certifications</h3>
                <ul className="space-y-2 text-xs text-[#BFD0C6]">
                  {profile.certifications.map((cert) => (
                    <li key={cert} className="flex items-start gap-2">
                      <Award className="w-4 h-4 text-[#C9A24B] flex-shrink-0 mt-0.5" />
                      <span>{cert}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {profile.languages && (
              <div className="bg-[#114A39] p-6 rounded-[12px] border border-[#1F5A46] shadow-sm space-y-3">
                <h3 className="font-serif text-lg font-medium text-[#F6F1E4]">Languages</h3>
                <div className="flex flex-wrap gap-2 text-xs">
                  {profile.languages.map((l) => (
                    <span key={l} className="bg-[#072A20] text-[#BFD0C6] border border-[#1F5A46] px-2.5 py-1 rounded-[4px]">
                      {l}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
