import { Router, Response } from 'express';
import { dbStore } from '../store/index.js';
import { requireAuth, requireRole, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/v1/freelancers - public search and discovery
router.get('/', (req, res: Response) => {
  const { query, skill, minRating, maxRate, availability, experienceLevel } = req.query;

  let freelancers = dbStore.getFreelancerProfiles();

  if (query) {
    const q = String(query).toLowerCase();
    freelancers = freelancers.filter(
      (f) =>
        f.headline.toLowerCase().includes(q) ||
        f.bio.toLowerCase().includes(q) ||
        f.user?.name.toLowerCase().includes(q) ||
        f.skills.some((s) => s.name.toLowerCase().includes(q))
    );
  }

  if (skill) {
    const sTerm = String(skill).toLowerCase();
    freelancers = freelancers.filter((f) =>
      f.skills.some((s) => s.name.toLowerCase().includes(sTerm))
    );
  }

  if (minRating) {
    const min = parseFloat(String(minRating));
    freelancers = freelancers.filter((f) => f.rating >= min);
  }

  if (maxRate) {
    const max = parseFloat(String(maxRate));
    freelancers = freelancers.filter((f) => f.hourlyRate <= max);
  }

  if (availability) {
    freelancers = freelancers.filter((f) => f.availability === String(availability));
  }

  if (experienceLevel) {
    freelancers = freelancers.filter((f) => f.experienceLevel === String(experienceLevel));
  }

  // Remove passwordHash from user
  const sanitized = freelancers.map((f) => {
    if (f.user) {
      const { passwordHash: _, ...safeUser } = f.user as any;
      return { ...f, user: safeUser };
    }
    return f;
  });

  return res.json({ success: true, count: sanitized.length, freelancers: sanitized });
});

// GET /api/v1/freelancers/:id - profile details
router.get('/:id', (req, res: Response) => {
  let profile = dbStore.getFreelancerProfileById(req.params.id);
  if (!profile) {
    profile = dbStore.getFreelancerProfileByUserId(req.params.id);
  }

  if (!profile) {
    return res.status(404).json({ success: false, message: 'Freelancer profile not found' });
  }

  const reviews = dbStore.getReviewsForUser(profile.userId);

  if (profile.user) {
    const { passwordHash: _, ...safeUser } = profile.user as any;
    profile = { ...profile, user: safeUser };
  }

  return res.json({ success: true, profile, reviews });
});

// PUT /api/v1/freelancers/me/profile - update current profile
router.put('/me/profile', requireAuth, requireRole('freelancer'), (req: AuthenticatedRequest, res: Response) => {
  const profile = dbStore.getFreelancerProfileByUserId(req.user!.id);
  if (!profile) {
    return res.status(404).json({ success: false, message: 'Profile not found' });
  }

  const updates = req.body;
  const updated = dbStore.updateFreelancerProfile(profile.id, updates);

  return res.json({ success: true, message: 'Profile updated successfully', profile: updated });
});

// POST /api/v1/freelancers/me/portfolio - add portfolio project
router.post('/me/portfolio', requireAuth, requireRole('freelancer'), (req: AuthenticatedRequest, res: Response) => {
  const profile = dbStore.getFreelancerProfileByUserId(req.user!.id);
  if (!profile) {
    return res.status(404).json({ success: false, message: 'Profile not found' });
  }

  const { title, description, category, skills, projectUrl, imageUrl } = req.body;
  if (!title || !description) {
    return res.status(400).json({ success: false, message: 'Title and description are required' });
  }

  const newItem = {
    id: `port-${Date.now()}`,
    title,
    description,
    category: category || 'General',
    skills: Array.isArray(skills) ? skills : [],
    projectUrl,
    imageUrl: imageUrl || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
    completedAt: new Date().toISOString(),
  };

  const updatedPortfolio = [...(profile.portfolio || []), newItem];
  const updated = dbStore.updateFreelancerProfile(profile.id, { portfolio: updatedPortfolio });

  return res.status(201).json({ success: true, item: newItem, profile: updated });
});

// DELETE /api/v1/freelancers/me/portfolio/:itemId
router.delete('/me/portfolio/:itemId', requireAuth, requireRole('freelancer'), (req: AuthenticatedRequest, res: Response) => {
  const profile = dbStore.getFreelancerProfileByUserId(req.user!.id);
  if (!profile) {
    return res.status(404).json({ success: false, message: 'Profile not found' });
  }

  const updatedPortfolio = (profile.portfolio || []).filter((p) => p.id !== req.params.itemId);
  const updated = dbStore.updateFreelancerProfile(profile.id, { portfolio: updatedPortfolio });

  return res.json({ success: true, message: 'Portfolio item removed', profile: updated });
});

// POST /api/v1/freelancers/me/onboarding
router.post('/me/onboarding', requireAuth, requireRole('freelancer'), (req: AuthenticatedRequest, res: Response) => {
  const profile = dbStore.getFreelancerProfileByUserId(req.user!.id);
  if (!profile) {
    return res.status(404).json({ success: false, message: 'Profile not found' });
  }

  const { headline, bio, skills, hourlyRate, experienceLevel, availability, location, languages } = req.body;
  const updated = dbStore.updateFreelancerProfile(profile.id, {
    headline: headline || profile.headline,
    bio: bio || profile.bio,
    skills: Array.isArray(skills) ? skills : profile.skills,
    hourlyRate: hourlyRate ? Number(hourlyRate) : profile.hourlyRate,
    experienceLevel: experienceLevel || profile.experienceLevel,
    availability: availability || profile.availability,
    location: location || profile.location,
    languages: Array.isArray(languages) ? languages : profile.languages,
    verificationStatus: 'pending', // marks as submitted for admin verification
  });

  return res.json({ success: true, message: 'Onboarding completed successfully', profile: updated });
});

export default router;
