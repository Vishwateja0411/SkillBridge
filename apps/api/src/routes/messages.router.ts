import { Router, Response } from 'express';
import { Message } from '@skillbridge/shared';
import { dbStore } from '../store/index.js';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';
import { getIO } from '../sockets/index.js';

const router = Router();

// GET /api/v1/messages/conversations
router.get('/conversations', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const conversations = dbStore.getConversationsByUserId(req.user!.id);
  return res.json({ success: true, conversations });
});

// POST /api/v1/messages/conversations - get or create conversation
router.post('/conversations', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { recipientUserId, projectId, contractId } = req.body;
  if (!recipientUserId) {
    return res.status(400).json({ success: false, message: 'Recipient user ID is required' });
  }

  const conversation = dbStore.getOrCreateConversation(
    req.user!.id,
    recipientUserId,
    projectId,
    contractId
  );

  return res.json({ success: true, conversation });
});

// GET /api/v1/messages/conversations/:id/messages
router.get('/conversations/:id/messages', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const messages = dbStore.getMessagesByConversationId(req.params.id);
  dbStore.markMessagesRead(req.params.id, req.user!.id);
  return res.json({ success: true, messages });
});

// POST /api/v1/messages/conversations/:id/messages
router.post('/conversations/:id/messages', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { text, attachments } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ success: false, message: 'Message content is required' });
  }

  const newMessage: Message = {
    id: `msg-${Date.now()}`,
    conversationId: req.params.id,
    senderId: req.user!.id,
    text: text.trim(),
    attachments: attachments || [],
    read: false,
    createdAt: new Date().toISOString(),
  };

  const saved = dbStore.createMessage(newMessage);

  // Broadcast to socket room
  try {
    const io = getIO();
    if (io) {
      io.to(`conv_${req.params.id}`).emit('new_message', saved);
    }
  } catch (err) {
    // Socket emit optional
  }

  return res.status(201).json({ success: true, message: saved });
});

// PUT /api/v1/messages/conversations/:id/read
router.put('/conversations/:id/read', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  dbStore.markMessagesRead(req.params.id, req.user!.id);
  return res.json({ success: true, message: 'Marked as read' });
});

export default router;
