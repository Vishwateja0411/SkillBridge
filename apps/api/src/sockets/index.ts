import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';

let io: SocketIOServer | null = null;

export function initSockets(server: HTTPServer, allowedOrigin: string) {
  io = new SocketIOServer(server, {
    cors: {
      origin: allowedOrigin || '*',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket: Socket) => {
    // Join conversation room
    socket.on('join_conversation', (conversationId: string) => {
      socket.join(`conv_${conversationId}`);
    });

    socket.on('leave_conversation', (conversationId: string) => {
      socket.leave(`conv_${conversationId}`);
    });

    // Join user notification room
    socket.on('join_user', (userId: string) => {
      socket.join(`user_${userId}`);
    });

    socket.on('typing', ({ conversationId, userId, isTyping }) => {
      socket.to(`conv_${conversationId}`).emit('user_typing', { userId, isTyping });
    });

    socket.on('disconnect', () => {
      // Clean disconnect
    });
  });

  return io;
}

export function getIO(): SocketIOServer | null {
  return io;
}
