import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { UserRole } from '@skillbridge/shared';
import { dbStore } from '../store/index.js';
import { generateToken, requireAuth, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// POST /api/v1/auth/register
router.post('/register', async (req, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Never allow public admin creation
    if (role === 'admin') {
      return res.status(403).json({ success: false, message: 'Admin accounts cannot be registered publicly' });
    }

    if (role !== 'freelancer' && role !== 'business') {
      return res.status(400).json({ success: false, message: 'Role must be either freelancer or business' });
    }

    const existing = dbStore.getUserByEmail(email);
    if (existing) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const userId = `user-${Date.now()}`;

    const newUser = dbStore.createUser({
      id: userId,
      name,
      email: email.toLowerCase().trim(),
      passwordHash,
      role: role as UserRole,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      isVerified: false,
      createdAt: new Date().toISOString(),
    });

    // Create initial profile
    if (role === 'freelancer') {
      dbStore.createFreelancerProfile({
        id: `fp-${Date.now()}`,
        userId: newUser.id,
        headline: 'Professional Freelancer',
        bio: 'Welcome to my profile. Add your experience and skills here.',
        skills: [],
        hourlyRate: 50,
        experienceLevel: 'intermediate',
        availability: 'full_time',
        rating: 5.0,
        reviewCount: 0,
        completedProjectsCount: 0,
        portfolio: [],
        languages: ['English'],
        certifications: [],
        verificationStatus: 'unverified',
      });
    } else if (role === 'business') {
      dbStore.createBusinessProfile({
        id: `bp-${Date.now()}`,
        userId: newUser.id,
        companyName: `${name}'s Company`,
        industry: 'Technology',
        companySize: '1-10 employees',
        description: 'New company on SkillBridge.',
        verified: false,
        totalSpent: 0,
        activeContractsCount: 0,
      });
    }

    const token = generateToken({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });

    res.cookie('sb_token', token, { httpOnly: true, secure: false, maxAge: 7 * 24 * 3600 * 1000 });

    const { passwordHash: _, ...userSafe } = newUser;
    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: userSafe,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message || 'Registration failed' });
  }
});

// POST /api/v1/auth/login
router.post('/login', async (req, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = dbStore.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = bcrypt.compareSync(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    res.cookie('sb_token', token, { httpOnly: true, secure: false, maxAge: 7 * 24 * 3600 * 1000 });

    const { passwordHash: _, ...userSafe } = user;
    let profile = null;
    if (user.role === 'freelancer') {
      profile = dbStore.getFreelancerProfileByUserId(user.id);
    } else if (user.role === 'business') {
      profile = dbStore.getBusinessProfileByUserId(user.id);
    }

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      user: userSafe,
      profile,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message || 'Login failed' });
  }
});

// GET /api/v1/auth/me
router.get('/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const user = dbStore.getUserById(req.user!.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  const { passwordHash: _, ...userSafe } = user;
  let profile = null;
  if (user.role === 'freelancer') {
    profile = dbStore.getFreelancerProfileByUserId(user.id);
  } else if (user.role === 'business') {
    profile = dbStore.getBusinessProfileByUserId(user.id);
  }

  return res.json({
    success: true,
    user: userSafe,
    profile,
  });
});

// POST /api/v1/auth/forgot-password
router.post('/forgot-password', (req, res: Response) => {
  const { email } = req.body;
  // Always return generic success to prevent account enumeration
  return res.json({
    success: true,
    message: 'If an account exists with this email, a password recovery link has been dispatched.',
  });
});

// POST /api/v1/auth/logout
router.post('/logout', (req, res: Response) => {
  res.clearCookie('sb_token');
  return res.json({ success: true, message: 'Logged out successfully' });
});

export default router;
