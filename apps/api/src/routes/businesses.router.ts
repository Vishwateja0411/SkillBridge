import { Router, Response } from 'express';
import { dbStore } from '../store/index.js';
import { requireAuth, requireRole, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/v1/businesses/:id
router.get('/:id', (req, res: Response) => {
  let profile = dbStore.getBusinessProfileById(req.params.id);
  if (!profile) {
    profile = dbStore.getBusinessProfileByUserId(req.params.id);
  }

  if (!profile) {
    return res.status(404).json({ success: false, message: 'Business profile not found' });
  }

  if (profile.user) {
    const { passwordHash: _, ...safeUser } = profile.user as any;
    profile = { ...profile, user: safeUser };
  }

  // Get public projects posted by this business
  const projects = dbStore.getProjects().filter((p) => p.businessId === profile!.id && p.status === 'published');

  return res.json({ success: true, profile, activeProjects: projects });
});

// PUT /api/v1/businesses/me/profile
router.put('/me/profile', requireAuth, requireRole('business'), (req: AuthenticatedRequest, res: Response) => {
  const profile = dbStore.getBusinessProfileByUserId(req.user!.id);
  if (!profile) {
    return res.status(404).json({ success: false, message: 'Business profile not found' });
  }

  const updates = req.body;
  const updated = dbStore.updateBusinessProfile(profile.id, updates);

  return res.json({ success: true, message: 'Company profile updated', profile: updated });
});

// POST /api/v1/businesses/me/onboarding
router.post('/me/onboarding', requireAuth, requireRole('business'), (req: AuthenticatedRequest, res: Response) => {
  const profile = dbStore.getBusinessProfileByUserId(req.user!.id);
  if (!profile) {
    return res.status(404).json({ success: false, message: 'Business profile not found' });
  }

  const { companyName, industry, companySize, website, description, location } = req.body;
  const updated = dbStore.updateBusinessProfile(profile.id, {
    companyName: companyName || profile.companyName,
    industry: industry || profile.industry,
    companySize: companySize || profile.companySize,
    website: website || profile.website,
    description: description || profile.description,
    location: location || profile.location,
  });

  return res.json({ success: true, message: 'Company onboarding completed', profile: updated });
});

export default router;
