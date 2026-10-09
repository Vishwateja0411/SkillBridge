import { Router, Response } from 'express';
import { Proposal, ProposalStatus } from '@skillbridge/shared';
import { dbStore } from '../store/index.js';
import { requireAuth, requireRole, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// POST /api/v1/proposals - freelancer applies to project
router.post('/', requireAuth, requireRole('freelancer'), (req: AuthenticatedRequest, res: Response) => {
  const freelancer = dbStore.getFreelancerProfileByUserId(req.user!.id);
  if (!freelancer) {
    return res.status(404).json({ success: false, message: 'Freelancer profile not found' });
  }

  const { projectId, coverLetter, proposedPrice, estimatedDuration, milestoneProposals } = req.body;

  if (!projectId || !coverLetter || !proposedPrice) {
    return res.status(400).json({ success: false, message: 'Project ID, cover letter, and proposed price are required' });
  }

  const project = dbStore.getProjectById(projectId);
  if (!project) {
    return res.status(404).json({ success: false, message: 'Project not found' });
  }

  // Prevent duplicate proposals from same freelancer
  const existingProposals = dbStore.getProposalsByProjectId(projectId);
  const alreadyApplied = existingProposals.some(
    (p) => p.freelancerId === freelancer.id && p.status !== 'withdrawn' && p.status !== 'rejected'
  );
  if (alreadyApplied) {
    return res.status(400).json({ success: false, message: 'You have already submitted a proposal for this project' });
  }

  const newProposal: Proposal = {
    id: `prop-${Date.now()}`,
    projectId,
    freelancerId: freelancer.id,
    coverLetter,
    proposedPrice: Number(proposedPrice),
    estimatedDuration: estimatedDuration || '30 days',
    milestoneProposals: milestoneProposals || [],
    status: 'submitted',
    createdAt: new Date().toISOString(),
  };

  const created = dbStore.createProposal(newProposal);

  // Send notification to project owner
  if (project.business) {
    dbStore.createNotification({
      id: `notif-${Date.now()}`,
      recipientId: project.business.userId,
      type: 'proposal_received',
      title: 'New Proposal Received',
      message: `${freelancer.user?.name || 'A freelancer'} submitted a proposal for "${project.title}".`,
      link: `/business/projects/${project.id}/proposals`,
      read: false,
      createdAt: new Date().toISOString(),
    });
  }

  return res.status(201).json({ success: true, message: 'Proposal submitted successfully', proposal: created });
});

// GET /api/v1/proposals/project/:projectId - business views proposals for project
router.get('/project/:projectId', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const project = dbStore.getProjectById(req.params.projectId);
  if (!project) {
    return res.status(404).json({ success: false, message: 'Project not found' });
  }

  const proposals = dbStore.getProposalsByProjectId(req.params.projectId);

  // Sort proposals by AI match score descending
  proposals.sort((a, b) => {
    const scoreA = a.matchScore?.totalScore || 0;
    const scoreB = b.matchScore?.totalScore || 0;
    return scoreB - scoreA;
  });

  return res.json({ success: true, project, proposals });
});

// GET /api/v1/proposals/my/proposals - freelancer views their applications
router.get('/my/proposals', requireAuth, requireRole('freelancer'), (req: AuthenticatedRequest, res: Response) => {
  const freelancer = dbStore.getFreelancerProfileByUserId(req.user!.id);
  if (!freelancer) {
    return res.status(404).json({ success: false, message: 'Freelancer profile not found' });
  }

  const proposals = dbStore.getProposalsByFreelancerId(freelancer.id);
  return res.json({ success: true, proposals });
});

// PUT /api/v1/proposals/:id/status - business shortlists, invites, or accepts
router.put('/:id/status', requireAuth, requireRole('business'), (req: AuthenticatedRequest, res: Response) => {
  const { status } = req.body;
  const proposal = dbStore.getProposalById(req.params.id);

  if (!proposal) {
    return res.status(404).json({ success: false, message: 'Proposal not found' });
  }

  const validStatuses: ProposalStatus[] = ['viewed', 'shortlisted', 'interview_requested', 'accepted', 'rejected'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid proposal status' });
  }

  const updated = dbStore.updateProposal(proposal.id, { status });

  // Notify freelancer
  if (proposal.freelancer?.userId) {
    let notifTitle = 'Proposal Update';
    let notifType: any = 'proposal_received';
    if (status === 'shortlisted') {
      notifTitle = 'You Were Shortlisted!';
      notifType = 'proposal_shortlisted';
    } else if (status === 'interview_requested') {
      notifTitle = 'Interview Requested';
      notifType = 'interview_requested';
    }

    dbStore.createNotification({
      id: `notif-${Date.now()}`,
      recipientId: proposal.freelancer.userId,
      type: notifType,
      title: notifTitle,
      message: `Your proposal for "${proposal.project?.title}" status updated to: ${status.replace('_', ' ')}.`,
      link: `/freelancer/proposals`,
      read: false,
      createdAt: new Date().toISOString(),
    });
  }

  return res.json({ success: true, proposal: updated });
});

// PUT /api/v1/proposals/:id/withdraw - freelancer withdraws proposal
router.put('/:id/withdraw', requireAuth, requireRole('freelancer'), (req: AuthenticatedRequest, res: Response) => {
  const freelancer = dbStore.getFreelancerProfileByUserId(req.user!.id);
  const proposal = dbStore.getProposalById(req.params.id);

  if (!proposal) {
    return res.status(404).json({ success: false, message: 'Proposal not found' });
  }

  if (proposal.freelancerId !== freelancer?.id) {
    return res.status(403).json({ success: false, message: 'Not authorized to withdraw this proposal' });
  }

  const updated = dbStore.updateProposal(proposal.id, { status: 'withdrawn' });
  return res.json({ success: true, message: 'Proposal withdrawn', proposal: updated });
});

export default router;
