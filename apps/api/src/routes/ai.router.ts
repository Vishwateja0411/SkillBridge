import { Router, Request, Response } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';
import { llmService } from '../services/llm.service.js';
import { ragKnowledgeBase } from '../services/rag.service.js';

const router = Router();

// ==========================================
// RAG & LLM Endpoints (Powered by Groq LPU)
// ==========================================

// GET /api/v1/ai/rag/status
router.get('/rag/status', (req: Request, res: Response) => {
  const status = llmService.getStatus();
  return res.json({
    success: true,
    ...status,
  });
});

// POST /api/v1/ai/rag/configure-key
router.post('/rag/configure-key', (req: Request, res: Response) => {
  const { apiKey, provider } = req.body;
  if (!apiKey || typeof apiKey !== 'string') {
    return res.status(400).json({ success: false, message: 'Valid API key is required' });
  }

  llmService.updateApiKey(apiKey.trim(), provider === 'openai' ? 'openai' : 'groq');
  return res.json({
    success: true,
    message: `API Key updated for provider: ${provider || 'groq'}`,
    status: llmService.getStatus(),
  });
});

// POST /api/v1/ai/rag/scope-project
// Takes a conversational user prompt, retrieves relevant historical project & blueprint comps,
// and uses Groq Llama 3.3 to synthesize a structured 3-phase milestone scope.
router.post('/rag/scope-project', async (req: Request, res: Response) => {
  try {
    const { prompt, category } = req.body;

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ success: false, message: 'Project prompt is required for RAG scoping' });
    }

    const scoped = await llmService.scopeProjectWithRAG(prompt.trim(), category);
    return res.json(scoped);
  } catch (error: any) {
    console.error('RAG Scoping error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to scope project with RAG',
    });
  }
});

// POST /api/v1/ai/rag/verify-milestone
// Autonomous milestone escrow auditor: inspects deliverable against contract specifications
router.post('/rag/verify-milestone', async (req: Request, res: Response) => {
  try {
    const { milestoneTitle, deliverablesSpec, submissionNotes, deliverableUrl } = req.body;

    if (!milestoneTitle || !deliverablesSpec) {
      return res.status(400).json({
        success: false,
        message: 'milestoneTitle and deliverablesSpec are required for milestone verification',
      });
    }

    const audit = await llmService.verifyMilestoneWithRAG({
      milestoneTitle,
      deliverablesSpec,
      submissionNotes: submissionNotes || '',
      deliverableUrl,
    });

    return res.json(audit);
  } catch (error: any) {
    console.error('Milestone verification error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Milestone verification failed',
    });
  }
});

// POST /api/v1/ai/rag/query
// Semantic Q&A over the vector knowledge base
router.post('/rag/query', async (req: Request, res: Response) => {
  try {
    const { query } = req.body;
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ success: false, message: 'query string is required' });
    }

    const result = await llmService.queryRAG(query.trim());
    return res.json(result);
  } catch (error: any) {
    console.error('RAG Query error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// Existing AI Endpoints
// ==========================================

// POST /api/v1/ai/enhance-project-description
router.post('/enhance-project-description', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { title, prompt, category } = req.body;

  if (!prompt || !prompt.trim()) {
    return res.status(400).json({ success: false, message: 'Project prompt is required' });
  }

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
router.post('/extract-skills', (req: Request, res: Response) => {
  const { text } = req.body;
  if (!text) {
    return res.json({ success: true, skills: ['React', 'TypeScript', 'Node.js'] });
  }

  const commonSkills = [
    'React', 'TypeScript', 'Node.js', 'Next.js', 'Tailwind CSS', 'Figma', 'UI/UX Design',
    'Python', 'FastAPI', 'MongoDB', 'PostgreSQL', 'Docker', 'Kubernetes', 'AWS',
    'GraphQL', 'Socket.io', 'Vue.js', 'Redux', 'CI/CD Pipelines', 'Twilio', 'ElevenLabs',
    'LangChain', 'Pinecone', 'n8n', 'Vector RAG', 'OpenAI'
  ];

  const lower = text.toLowerCase();
  const matched = commonSkills.filter((s) => lower.includes(s.toLowerCase()));

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
