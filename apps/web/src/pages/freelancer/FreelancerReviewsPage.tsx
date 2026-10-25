import React, { useState, useEffect } from 'react';
import { Star, ShieldCheck } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Review, FreelancerProfile } from '@skillbridge/shared';

export const FreelancerReviewsPage: React.FC = () => {
  const { user, profile } = useAuth();
  const fProfile = profile as FreelancerProfile;

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      api.getUserReviews(user.id).then((res) => {
        if (res.success) setReviews(res.reviews);
        setLoading(false);
      });
    }
  }, [user?.id]);

  return (
    <div className="space-y-6">
      <div>
        <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C9A24B]">
          REPUTATION & INTEGRITY
        </div>
        <h1 className="font-serif text-3xl font-medium text-[#F6F1E4] mt-1">
          Client Reviews & <span className="italic text-[#E5CB86]">Reputation</span>
        </h1>
        <p className="text-xs text-[#BFD0C6] mt-1">Verified reviews received upon completed contracts</p>
      </div>

      <div className="bg-[#114A39] p-6 rounded-[12px] border border-[#1F5A46] flex items-center justify-between">
        <div>
          <div className="font-serif text-4xl font-medium text-[#E5CB86]">{fProfile?.rating || 5.0}</div>
          <div className="text-xs text-[#BFD0C6] mt-1">Average rating across {reviews.length} completed projects</div>
        </div>
        <div className="flex gap-1 text-[#C9A24B]">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} className="w-5 h-5 fill-[#C9A24B] text-[#C9A24B]" />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="bg-[#114A39] p-12 text-center rounded-[12px] border border-[#1F5A46] text-xs text-[#9DB5A8]">
            No client reviews submitted yet. Complete projects to accumulate verified ratings!
          </div>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="bg-[#114A39] p-6 rounded-[12px] border border-[#1F5A46] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-serif text-base font-medium text-[#F6F1E4]">{r.reviewer?.name || 'Client'}</div>
                  <div className="text-[11px] text-[#9DB5A8]">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[#E5CB86] font-medium text-xs">
                  <Star className="w-3.5 h-3.5 fill-[#C9A24B] text-[#C9A24B]" />
                  <span>{r.rating}.0</span>
                </div>
              </div>
              <p className="text-xs text-[#BFD0C6] leading-relaxed italic">"{r.feedback}"</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
