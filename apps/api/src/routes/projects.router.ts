import { Router, Response } from 'express';
import { Project, calculateMatchScore } from '@skillbridge/shared';
import { dbStore } from '../store/index.js';
import { requireAuth, requireRole, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/v1/projects - public discovery
router.get('/', (req, res: Response) => {
  const { query, category, skill, experienceLevel, budgetMin, budgetMax, duration } = req.query;

  let projects = dbStore.getProjects().filter((p) => p.status === 'published' || p.status === 'in_progress');

  if (query) {
    const q = String(query).toLowerCase();
    projects = projects.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.requiredSkills.some((s) => s.toLowerCase().includes(q))
    );
  }

  if (category) {
    projects = projects.filter((p) => p.category.toLowerCase() === String(category).toLowerCase());
  }

  if (skill) {
    const sTerm = String(skill).toLowerCase();
    projects = projects.filter((p) =>
      p.requiredSkills.some((s) => s.toLowerCase().includes(sTerm))
    );
  }

  if (experienceLevel) {
    projects = projects.filter((p) => p.experienceLevel === String(experienceLevel));
  }

  if (budgetMin) {
    projects = projects.filter((p) => p.budgetMax >= Number(budgetMin));
  }

  if (budgetMax) {
    projects = projects.filter((p) => p.budgetMin <= Number(budgetMax));
  }

  if (duration) {
    projects = projects.filter((p) => p.duration.toLowerCase().includes(String(duration).toLowerCase()));
  }

  return res.json({ success: true, count: projects.length, projects });
});

// GET /api/v1/projects/my/projects - business only
router.get('/my/projects', requireAuth, requireRole('business'), (req: AuthenticatedRequest, res: Response) => {
  const business = dbStore.getBusinessProfileByUserId(req.user!.id);
  if (!business) {
    return res.status(404).json({ success: false, message: 'Business profile not found' });
  }

  const projects = dbStore.getProjects().filter((p) => p.businessId === business.id);
  return res.json({ success: true, projects });
});

// GET /api/v1/projects/:id - single project details
router.get('/:id', (req, res: Response) => {
  const project = dbStore.getProjectById(req.params.id);
  if (!project) {
    return res.status(404).json({ success: false, message: 'Project not found' });
  }
  return res.json({ success: true, project });
});

// POST /api/v1/projects - create new project
router.post('/', requireAuth, requireRole('business'), (req: AuthenticatedRequest, res: Response) => {
  const business = dbStore.getBusinessProfileByUserId(req.user!.id);
  if (!business) {
    return res.status(404).json({ success: false, message: 'Business profile not found' });
  }

  const {
    title,
    description,
    category,
    requiredSkills,
    experienceLevel,
    budgetType,
    budgetMin,
    budgetMax,
    duration,
    deadline,
    workArrangement,
  } = req.body;

  if (!title || !description || !category || !requiredSkills || !requiredSkills.length) {
    return res.status(400).json({ success: false, message: 'Title, description, category, and skills are required' });
  }

  const newProject: Project = {
    id: `proj-${Date.now()}`,
    businessId: business.id,
    title,
    description,
    category,
    requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : [requiredSkills],
    experienceLevel: experienceLevel || 'intermediate',
    budgetType: budgetType || 'fixed',
    budgetMin: Number(budgetMin) || 1000,
    budgetMax: Number(budgetMax) || 3000,
    duration: duration || '3-4 weeks',
    deadline: deadline || new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0],
    workArrangement: workArrangement || 'remote',
    status: 'published',
    proposalsCount: 0,
    createdAt: new Date().toISOString(),
  };

  const created = dbStore.createProject(newProject);
  return res.status(201).json({ success: true, message: 'Project published successfully', project: created });
});

// PUT /api/v1/projects/:id - edit project
router.put('/:id', requireAuth, requireRole('business'), (req: AuthenticatedRequest, res: Response) => {
  const business = dbStore.getBusinessProfileByUserId(req.user!.id);
  const project = dbStore.getProjectById(req.params.id);

  if (!project) {
    return res.status(404).json({ success: false, message: 'Project not found' });
  }

  if (project.businessId !== business?.id && req.user!.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized to edit this project' });
  }

  const updated = dbStore.updateProject(req.params.id, req.body);
  return res.json({ success: true, message: 'Project updated', project: updated });
});

// DELETE /api/v1/projects/:id
router.delete('/:id', requireAuth, requireRole('business', 'admin'), (req: AuthenticatedRequest, res: Response) => {
  const business = dbStore.getBusinessProfileByUserId(req.user!.id);
  const project = dbStore.getProjectById(req.params.id);

  if (!project) {
    return res.status(404).json({ success: false, message: 'Project not found' });
  }

  if (project.businessId !== business?.id && req.user!.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized to delete this project' });
  }

  dbStore.deleteProject(req.params.id);
  return res.json({ success: true, message: 'Project removed' });
});

// GET /api/v1/projects/:id/recommendations - AI matching engine
router.get('/:id/recommendations', (req, res: Response) => {
  const project = dbStore.getProjectById(req.params.id);
  if (!project) {
    return res.status(404).json({ success: false, message: 'Project not found' });
  }

  const freelancers = dbStore.getFreelancerProfiles();

  const recommendations = freelancers.map((f) => {
    const matchBreakdown = calculateMatchScore(project, f);
    return {
      freelancer: f,
      match: matchBreakdown,
    };
  });

  // Sort descending by total score
  recommendations.sort((a, b) => b.match.totalScore - a.match.totalScore);

  return res.json({
    success: true,
    projectId: project.id,
    projectTitle: project.title,
    recommendations,
  });
});

export default router;
