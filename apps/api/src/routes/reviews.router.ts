import { Router, Response } from 'express';
import { Review } from '@skillbridge/shared';
import { dbStore } from '../store/index.js';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// POST /api/v1/reviews
router.post('/', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { contractId, reviewedUserId, rating, feedback } = req.body;

  if (!contractId || !reviewedUserId || !rating || !feedback) {
    return res.status(400).json({ success: false, message: 'All review fields are required' });
  }

  const contract = dbStore.getContractById(contractId);
  if (!contract) {
    return res.status(404).json({ success: false, message: 'Contract not found' });
  }

  // Prevent duplicate reviews from same reviewer for same contract
  const existing = dbStore.getReviews().find(
    (r) => r.contractId === contractId && r.reviewerId === req.user!.id
  );
  if (existing) {
    return res.status(400).json({ success: false, message: 'You have already submitted a review for this contract' });
  }

  const newReview: Review = {
    id: `rev-${Date.now()}`,
    contractId,
    reviewerId: req.user!.id,
    reviewedUserId,
    rating: Math.min(5, Math.max(1, Number(rating))),
    feedback: feedback.trim(),
    createdAt: new Date().toISOString(),
  };

  const created = dbStore.createReview(newReview);

  // Send notification to reviewed user
  dbStore.createNotification({
    id: `notif-${Date.now()}`,
    recipientId: reviewedUserId,
    type: 'review_received',
    title: 'New Review Received!',
    message: `You received a ${rating}★ review: "${feedback.slice(0, 60)}..."`,
    link: `/freelancer/reviews`,
    read: false,
    createdAt: new Date().toISOString(),
  });

  return res.status(201).json({ success: true, review: created });
});

// GET /api/v1/reviews/user/:userId
router.get('/user/:userId', (req, res: Response) => {
  const reviews = dbStore.getReviewsForUser(req.params.userId);
  return res.json({ success: true, count: reviews.length, reviews });
});

export default router;
