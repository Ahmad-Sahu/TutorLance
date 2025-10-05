import { Server } from 'socket.io';
import { Chat } from '../models/Chat';
import { Message } from '../models/Message';

export function registerSocketHandlers(io: Server) {
  io.on('connection', (socket) => {
    socket.on('join', (userId: string) => {
      socket.join(userId);
    });

    socket.on('message', async (payload: { chatId: string; senderId: string; receiverId: string; content: string }) => {
      const message = await Message.create({ chat: payload.chatId, sender: payload.senderId, content: payload.content, readBy: [payload.senderId] as any });
      await Chat.findByIdAndUpdate(payload.chatId, { lastMessageAt: new Date() });
      io.to(payload.receiverId).emit('message', { ...payload, id: message.id, createdAt: message.createdAt });
    });
  });
}
