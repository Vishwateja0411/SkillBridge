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
        <h1 className="text-2xl font-bold text-slate-900">Client Reviews & Reputation</h1>
        <p className="text-xs text-slate-500 mt-1">Verified reviews received upon completed contracts</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <div className="text-3xl font-extrabold text-slate-900">{fProfile?.rating || 5.0}</div>
          <div className="text-xs text-slate-500 mt-1">Average rating across {reviews.length} completed projects</div>
        </div>
        <div className="flex gap-1 text-amber-500">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} className="w-6 h-6 fill-amber-400 text-amber-400" />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-xs text-slate-400">
            No client reviews submitted yet. Complete projects to accumulate verified ratings!
          </div>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-slate-900">{r.reviewer?.name || 'Client'}</div>
                  <div className="text-[11px] text-slate-400">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{r.rating}.0</span>
                </div>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed italic">"{r.feedback}"</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
