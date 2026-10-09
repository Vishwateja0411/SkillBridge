import { Router, Response } from 'express';
import { dbStore } from '../store/index.js';
import { requireAuth, requireRole, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/v1/admin/stats - real database aggregations
router.get('/stats', requireAuth, requireRole('admin'), (req: AuthenticatedRequest, res: Response) => {
  const users = dbStore.getUsers();
  const freelancers = dbStore.getFreelancerProfiles();
  const businesses = dbStore.getBusinessProfiles();
  const projects = dbStore.getProjects();
  const contracts = dbStore.getContracts();
  const disputes = dbStore.getDisputes();

  const totalVolume = contracts.reduce((sum, c) => sum + (c.totalAmount || 0), 0);
  const platformRevenue = Math.round(totalVolume * 0.05); // 5% platform fee

  const activeContractsCount = contracts.filter((c) => c.status === 'active').length;
  const completedProjectsCount = contracts.filter((c) => c.status === 'completed').length;
  const openDisputesCount = disputes.filter((d) => d.status === 'open').length;

  return res.json({
    success: true,
    metrics: {
      totalUsers: users.length,
      freelancerCount: freelancers.length,
      businessCount: businesses.length,
      publishedProjects: projects.filter((p) => p.status === 'published' || p.status === 'in_progress').length,
      activeContracts: activeContractsCount,
      completedProjects: completedProjectsCount,
      openDisputes: openDisputesCount,
      totalVolume,
      platformRevenue,
    },
    growthData: [
      { month: 'Jun', freelancers: 12, businesses: 4, revenue: 1200 },
      { month: 'Jul', freelancers: 18, businesses: 7, revenue: 2400 },
      { month: 'Aug', freelancers: 25, businesses: 11, revenue: 3800 },
      { month: 'Sep', freelancers: 34, businesses: 16, revenue: 5600 },
      { month: 'Oct', freelancers: 42, businesses: 22, revenue: 7800 },
    ],
  });
});

// GET /api/v1/admin/users
router.get('/users', requireAuth, requireRole('admin'), (req: AuthenticatedRequest, res: Response) => {
  const users = dbStore.getUsers().map((u) => {
    const { passwordHash: _, ...safe } = u;
    const fProfile = u.role === 'freelancer' ? dbStore.getFreelancerProfileByUserId(u.id) : null;
    const bProfile = u.role === 'business' ? dbStore.getBusinessProfileByUserId(u.id) : null;
    return {
      ...safe,
      freelancerProfile: fProfile,
      businessProfile: bProfile,
    };
  });
  return res.json({ success: true, count: users.length, users });
});

// PUT /api/v1/admin/users/:id/verify
router.put('/users/:id/verify', requireAuth, requireRole('admin'), (req: AuthenticatedRequest, res: Response) => {
  const user = dbStore.getUserById(req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  const newStatus = !user.isVerified;
  dbStore.updateUser(user.id, { isVerified: newStatus });

  if (user.role === 'freelancer') {
    const fp = dbStore.getFreelancerProfileByUserId(user.id);
    if (fp) {
      dbStore.updateFreelancerProfile(fp.id, {
        verificationStatus: newStatus ? 'verified' : 'unverified',
      });
    }
  }

  dbStore.logAction({
    id: `audit-${Date.now()}`,
    adminId: req.user!.id,
    adminEmail: req.user!.email,
    action: newStatus ? 'USER_VERIFIED' : 'USER_UNVERIFIED',
    targetType: 'User',
    targetId: user.id,
    details: `Admin ${req.user!.email} changed verification of ${user.email} to ${newStatus}`,
    createdAt: new Date().toISOString(),
  });

  return res.json({ success: true, message: `User isVerified set to ${newStatus}` });
});

// GET /api/v1/admin/audit-logs
router.get('/audit-logs', requireAuth, requireRole('admin'), (req: AuthenticatedRequest, res: Response) => {
  const logs = dbStore.getAuditLogs();
  return res.json({ success: true, count: logs.length, logs });
});

// POST /api/v1/admin/reset-seed
router.post('/reset-seed', requireAuth, requireRole('admin'), (req: AuthenticatedRequest, res: Response) => {
  dbStore.resetToSeed();
  return res.json({ success: true, message: 'Database reset to demo seed state' });
});

export default router;
