import http from 'http';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { CONFIG } from './config/index.js';
import { initSockets } from './sockets/index.js';

// Routers
import authRouter from './routes/auth.router.js';
import freelancersRouter from './routes/freelancers.router.js';
import businessesRouter from './routes/businesses.router.js';
import projectsRouter from './routes/projects.router.js';
import proposalsRouter from './routes/proposals.router.js';
import contractsRouter from './routes/contracts.router.js';
import messagesRouter from './routes/messages.router.js';
import notificationsRouter from './routes/notifications.router.js';
import reviewsRouter from './routes/reviews.router.js';
import disputesRouter from './routes/disputes.router.js';
import adminRouter from './routes/admin.router.js';
import aiRouter from './routes/ai.router.js';

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
initSockets(server, CONFIG.CLIENT_URL);

// Middlewares
app.use(cors({
  origin: [CONFIG.CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5174', 'http://127.0.0.1:5174'],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/api/v1/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'SkillBridge Core API',
    version: '1.0.0',
  });
});

// Mount Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/freelancers', freelancersRouter);
app.use('/api/v1/businesses', businessesRouter);
app.use('/api/v1/projects', projectsRouter);
app.use('/api/v1/proposals', proposalsRouter);
app.use('/api/v1/contracts', contractsRouter);
app.use('/api/v1/messages', messagesRouter);
app.use('/api/v1/notifications', notificationsRouter);
app.use('/api/v1/reviews', reviewsRouter);
app.use('/api/v1/disputes', disputesRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/ai', aiRouter);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Server error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Start Server
server.listen(CONFIG.PORT, () => {
  console.log(`🚀 SkillBridge API running on http://localhost:${CONFIG.PORT}`);
  console.log(`📡 Socket.io connected and ready`);
  console.log(`🔗 Health check available at http://localhost:${CONFIG.PORT}/api/v1/health`);
});
