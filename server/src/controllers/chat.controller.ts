import { Request, Response } from 'express';
import { Chat } from '../models/Chat';
import { Message } from '../models/Message';

export const listMyChats = async (req: Request & { user?: { userId: string } }, res: Response) => {
  const chats = await Chat.find({ users: req.user!.userId }).populate('users', 'name role');
  res.json(chats);
};

export const getChatMessages = async (req: Request & { user?: { userId: string } }, res: Response) => {
  const { chatId } = req.params as { chatId: string };
  const messages = await Message.find({ chat: chatId }).sort({ createdAt: 1 });
  res.json(messages);
};

export const startChat = async (req: Request & { user?: { userId: string } }, res: Response) => {
  const { otherUserId } = req.body as { otherUserId: string };
  let chat = await Chat.findOne({ users: { $all: [req.user!.userId, otherUserId] } });
  if (!chat) chat = await Chat.create({ users: [req.user!.userId, otherUserId] });
  res.status(201).json(chat);
};
