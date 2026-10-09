import { Router, Response } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// POST /api/v1/ai/enhance-project-description
router.post('/enhance-project-description', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { title, prompt, category } = req.body;

  if (!prompt || !prompt.trim()) {
    return res.status(400).json({ success: false, message: 'Project prompt is required' });
  }

  // Structured enhancement engine
  const enhanced = `### Project Objective
We are building "${title || 'this project'}" to deliver a scalable, enterprise-grade solution.

### Core Deliverables
- **Architecture & System Design**: Robust schema definitions, type-safe API contracts, and responsive layout.
- **Interactive UI & Workflows**: High-performance components with real-time feedback, intuitive UX, and mobile responsiveness.
- **Quality Assurance & Security**: Input validation, error boundary handlers, and production deployment scripts.

### Ideal Candidate
A professional with proven hands-on experience in ${category || 'modern web development'}, excellent communication, and an attention to detail.

### Additional Notes
Please provide relevant portfolio references and an outline of your proposed milestone schedule with your application.`;

  return res.json({
    success: true,
    enhancedDescription: enhanced,
    suggestedDuration: '3-4 weeks',
    suggestedMilestones: [
      { title: 'Phase 1: Architecture & Technical Specifications', percentage: 25 },
      { title: 'Phase 2: Core Feature Implementation & Testing', percentage: 50 },
      { title: 'Phase 3: Final Integration, Polish & Delivery', percentage: 25 },
    ],
  });
});

// POST /api/v1/ai/extract-skills
router.post('/extract-skills', (req, res: Response) => {
  const { text } = req.body;
  if (!text) {
    return res.json({ success: true, skills: ['React', 'TypeScript', 'Node.js'] });
  }

  const commonSkills = [
    'React', 'TypeScript', 'Node.js', 'Next.js', 'Tailwind CSS', 'Figma', 'UI/UX Design',
    'Python', 'FastAPI', 'MongoDB', 'PostgreSQL', 'Docker', 'Kubernetes', 'AWS',
    'GraphQL', 'Socket.io', 'Vue.js', 'Redux', 'CI/CD Pipelines'
  ];

  const lower = text.toLowerCase();
  const matched = commonSkills.filter((s) => lower.includes(s.toLowerCase()));

  // If no match found, fallback to reasonable defaults
  const skills = matched.length > 0 ? matched : ['React', 'TypeScript', 'Node.js'];
  return res.json({ success: true, skills });
});

// POST /api/v1/ai/proposal-assistant
router.post('/proposal-assistant', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { projectTitle, projectDescription, freelancerSkills } = req.body;

  const samplePoints = [
    `Highlight your hands-on background working on similar projects like "${projectTitle || 'this project'}".`,
    `Emphasize your proficiency in ${(freelancerSkills || ['React', 'TypeScript']).slice(0, 3).join(', ')}.`,
    `Outline a structured 3-phase delivery roadmap to give the client immediate confidence.`,
    `Mention your proactive communication style and commitment to meeting milestone deadlines.`,
  ];

  const draftCoverLetter = `Hi! I reviewed the requirements for "${projectTitle || 'your project'}" and would love to collaborate.

With my background in ${(freelancerSkills || ['full-stack engineering']).slice(0, 3).join(', ')}, I can build this with clean architecture, great performance, and thorough documentation.

I propose delivering this in clear milestones so you can review progress at every step:
1. Architecture setup & initial wireframes/contracts
2. Core features & interactive workflows
3. Final polish, testing, and production handoff

Looking forward to discussing the specifics!`;

  return res.json({
    success: true,
    draftCoverLetter,
    talkingPoints: samplePoints,
  });
});

export default router;
