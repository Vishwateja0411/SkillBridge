import { Router, Response } from 'express';
import { Dispute } from '@skillbridge/shared';
import { dbStore } from '../store/index.js';
import { requireAuth, requireRole, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// POST /api/v1/disputes
router.post('/', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { contractId, reason, evidence } = req.body;

  if (!contractId || !reason) {
    return res.status(400).json({ success: false, message: 'Contract ID and reason are required' });
  }

  const contract = dbStore.getContractById(contractId);
  if (!contract) {
    return res.status(404).json({ success: false, message: 'Contract not found' });
  }

  const dispute: Dispute = {
    id: `disp-${Date.now()}`,
    contractId,
    raisedByUserId: req.user!.id,
    reason,
    evidence: evidence || '',
    status: 'open',
    createdAt: new Date().toISOString(),
  };

  const created = dbStore.createDispute(dispute);
  dbStore.updateContract(contractId, { status: 'disputed' });

  // Log action
  dbStore.logAction({
    id: `audit-${Date.now()}`,
    adminId: 'system',
    adminEmail: 'system@skillbridge.io',
    action: 'DISPUTE_OPENED',
    targetType: 'Contract',
    targetId: contractId,
    details: `Dispute opened by user ${req.user!.email}: "${reason}"`,
    createdAt: new Date().toISOString(),
  });

  return res.status(201).json({ success: true, dispute: created });
});

// GET /api/v1/disputes
router.get('/', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const disputes = dbStore.getDisputes();
  return res.json({ success: true, count: disputes.length, disputes });
});

// PUT /api/v1/disputes/:id/resolve
router.put('/:id/resolve', requireAuth, requireRole('admin'), (req: AuthenticatedRequest, res: Response) => {
  const { resolutionNotes } = req.body;
  const updated = dbStore.updateDispute(req.params.id, {
    status: 'resolved',
    resolutionNotes: resolutionNotes || 'Resolved by administrative arbitration.',
    resolvedAt: new Date().toISOString(),
  });

  if (!updated) {
    return res.status(404).json({ success: false, message: 'Dispute not found' });
  }

  dbStore.logAction({
    id: `audit-${Date.now()}`,
    adminId: req.user!.id,
    adminEmail: req.user!.email,
    action: 'DISPUTE_RESOLVED',
    targetType: 'Dispute',
    targetId: req.params.id,
    details: `Admin resolved dispute: "${resolutionNotes}"`,
    createdAt: new Date().toISOString(),
  });

  return res.json({ success: true, message: 'Dispute resolved', dispute: updated });
});

export default router;
