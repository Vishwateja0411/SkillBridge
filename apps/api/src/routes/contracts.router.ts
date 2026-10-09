import { Router, Response } from 'express';
import { Contract, Milestone } from '@skillbridge/shared';
import { dbStore } from '../store/index.js';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// POST /api/v1/contracts/offer - business creates contract offer
router.post('/offer', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { projectId, freelancerId, proposalId, title, terms, totalAmount, milestones } = req.body;

  const business = dbStore.getBusinessProfileByUserId(req.user!.id);
  if (!business && req.user!.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Only businesses can create contract offers' });
  }

  if (!projectId || !freelancerId || !title || !totalAmount) {
    return res.status(400).json({ success: false, message: 'Missing required contract parameters' });
  }

  const contractId = `contract-${Date.now()}`;
  const formattedMilestones: Milestone[] = (milestones || []).map((m: any, idx: number) => ({
    id: `ms-${Date.now()}-${idx}`,
    contractId,
    title: m.title,
    description: m.description || '',
    amount: Number(m.amount),
    dueDate: m.dueDate || new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString().split('T')[0],
    status: idx === 0 ? 'in_progress' : 'pending',
  }));

  const newContract: Contract = {
    id: contractId,
    projectId,
    businessId: business!.id,
    freelancerId,
    proposalId,
    title,
    terms: terms || 'Standard SkillBridge Project Terms: 100% intellectual property assignment on milestone release.',
    totalAmount: Number(totalAmount),
    status: 'offer_sent',
    milestones: formattedMilestones,
    createdAt: new Date().toISOString(),
  };

  const created = dbStore.createContract(newContract);

  // Update proposal status to accepted if linked
  if (proposalId) {
    dbStore.updateProposal(proposalId, { status: 'accepted' });
  }

  // Notify freelancer
  const freelancer = dbStore.getFreelancerProfileById(freelancerId);
  if (freelancer?.userId) {
    dbStore.createNotification({
      id: `notif-${Date.now()}`,
      recipientId: freelancer.userId,
      type: 'contract_offer',
      title: 'Contract Offer Received!',
      message: `${business!.companyName} sent you a formal contract offer for "${title}" ($${totalAmount}).`,
      link: `/freelancer/contracts/${contractId}`,
      read: false,
      createdAt: new Date().toISOString(),
    });
  }

  return res.status(201).json({ success: true, message: 'Contract offer created', contract: created });
});

// GET /api/v1/contracts - list user's contracts
router.get('/', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const contracts = dbStore.getContracts();

  if (user.role === 'admin') {
    return res.json({ success: true, contracts });
  }

  if (user.role === 'business') {
    const business = dbStore.getBusinessProfileByUserId(user.id);
    const filtered = contracts.filter((c) => c.businessId === business?.id);
    return res.json({ success: true, contracts: filtered });
  }

  if (user.role === 'freelancer') {
    const freelancer = dbStore.getFreelancerProfileByUserId(user.id);
    const filtered = contracts.filter((c) => c.freelancerId === freelancer?.id);
    return res.json({ success: true, contracts: filtered });
  }

  return res.json({ success: true, contracts: [] });
});

// GET /api/v1/contracts/:id - contract workspace details
router.get('/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const contract = dbStore.getContractById(req.params.id);
  if (!contract) {
    return res.status(404).json({ success: false, message: 'Contract not found' });
  }
  return res.json({ success: true, contract });
});

// PUT /api/v1/contracts/:id/accept - freelancer accepts offer
router.put('/:id/accept', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const contract = dbStore.getContractById(req.params.id);
  if (!contract) {
    return res.status(404).json({ success: false, message: 'Contract not found' });
  }

  const freelancer = dbStore.getFreelancerProfileByUserId(req.user!.id);
  if (contract.freelancerId !== freelancer?.id && req.user!.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized to accept this contract' });
  }

  const updated = dbStore.updateContract(contract.id, {
    status: 'active',
    startDate: new Date().toISOString(),
  });

  // Update project status to in_progress
  if (contract.projectId) {
    dbStore.updateProject(contract.projectId, { status: 'in_progress' });
  }

  // Notify business
  if (contract.business?.userId) {
    dbStore.createNotification({
      id: `notif-${Date.now()}`,
      recipientId: contract.business.userId,
      type: 'contract_active',
      title: 'Contract Accepted & Active',
      message: `${freelancer?.user?.name || 'Freelancer'} accepted the contract for "${contract.title}". Work has begun!`,
      link: `/business/contracts/${contract.id}`,
      read: false,
      createdAt: new Date().toISOString(),
    });
  }

  return res.json({ success: true, message: 'Contract accepted', contract: updated });
});

// PUT /api/v1/contracts/:id/milestones/:milestoneId/submit - freelancer submits deliverable
router.put('/:id/milestones/:milestoneId/submit', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { deliverableUrl, deliverableNotes } = req.body;
  const contract = dbStore.getContractById(req.params.id);
  if (!contract) {
    return res.status(404).json({ success: false, message: 'Contract not found' });
  }

  const milestone = dbStore.updateMilestone(contract.id, req.params.milestoneId, {
    status: 'submitted',
    deliverableUrl,
    deliverableNotes,
    submittedAt: new Date().toISOString(),
  });

  // Notify business
  if (contract.business?.userId) {
    dbStore.createNotification({
      id: `notif-${Date.now()}`,
      recipientId: contract.business.userId,
      type: 'milestone_submitted',
      title: 'Milestone Submitted for Review',
      message: `Deliverables submitted for "${milestone?.title}". Please review and approve.`,
      link: `/business/contracts/${contract.id}`,
      read: false,
      createdAt: new Date().toISOString(),
    });
  }

  return res.json({ success: true, message: 'Deliverable submitted for review', milestone });
});

// PUT /api/v1/contracts/:id/milestones/:milestoneId/approve - business approves deliverable
router.put('/:id/milestones/:milestoneId/approve', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const contract = dbStore.getContractById(req.params.id);
  if (!contract) {
    return res.status(404).json({ success: false, message: 'Contract not found' });
  }

  const milestone = dbStore.updateMilestone(contract.id, req.params.milestoneId, {
    status: 'paid',
    approvedAt: new Date().toISOString(),
    paidAt: new Date().toISOString(),
  });

  // Mark next milestone in_progress if any
  const currentIdx = contract.milestones.findIndex((m) => m.id === req.params.milestoneId);
  if (currentIdx !== -1 && currentIdx + 1 < contract.milestones.length) {
    const nextMilestone = contract.milestones[currentIdx + 1];
    if (nextMilestone.status === 'pending') {
      dbStore.updateMilestone(contract.id, nextMilestone.id, { status: 'in_progress' });
    }
  }

  // Notify freelancer
  if (contract.freelancer?.userId) {
    dbStore.createNotification({
      id: `notif-${Date.now()}`,
      recipientId: contract.freelancer.userId,
      type: 'milestone_approved',
      title: 'Milestone Approved & Paid!',
      message: `Your deliverable for "${milestone?.title}" was approved! $${milestone?.amount} has been released.`,
      link: `/freelancer/contracts/${contract.id}`,
      read: false,
      createdAt: new Date().toISOString(),
    });
  }

  return res.json({ success: true, message: 'Milestone approved and payment released', milestone });
});

// PUT /api/v1/contracts/:id/milestones/:milestoneId/revision - request revisions
router.put('/:id/milestones/:milestoneId/revision', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { revisionNotes } = req.body;
  const contract = dbStore.getContractById(req.params.id);
  if (!contract) {
    return res.status(404).json({ success: false, message: 'Contract not found' });
  }

  const milestone = dbStore.updateMilestone(contract.id, req.params.milestoneId, {
    status: 'revision_requested',
    revisionNotes: revisionNotes || 'Please adjust the deliverable according to our discussion.',
  });

  // Notify freelancer
  if (contract.freelancer?.userId) {
    dbStore.createNotification({
      id: `notif-${Date.now()}`,
      recipientId: contract.freelancer.userId,
      type: 'revision_requested',
      title: 'Revision Requested',
      message: `Client requested revisions for "${milestone?.title}". Notes: ${revisionNotes || 'Check workspace.'}`,
      link: `/freelancer/contracts/${contract.id}`,
      read: false,
      createdAt: new Date().toISOString(),
    });
  }

  return res.json({ success: true, message: 'Revision request recorded', milestone });
});

// PUT /api/v1/contracts/:id/complete - complete contract
router.put('/:id/complete', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const contract = dbStore.getContractById(req.params.id);
  if (!contract) {
    return res.status(404).json({ success: false, message: 'Contract not found' });
  }

  const updated = dbStore.updateContract(contract.id, {
    status: 'completed',
    completedDate: new Date().toISOString(),
  });

  // Update project status
  if (contract.projectId) {
    dbStore.updateProject(contract.projectId, { status: 'completed' });
  }

  // Increment completed projects count for freelancer
  if (contract.freelancerId) {
    const f = dbStore.getFreelancerProfileById(contract.freelancerId);
    if (f) {
      dbStore.updateFreelancerProfile(f.id, {
        completedProjectsCount: (f.completedProjectsCount || 0) + 1,
      });
    }
  }

  return res.json({ success: true, message: 'Contract marked as completed', contract: updated });
});

export default router;
