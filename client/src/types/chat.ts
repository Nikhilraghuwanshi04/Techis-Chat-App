import { User } from './api';

export interface Message {
  _id: string;
  chatId: string;
  sender: User;
  content: string;
  status: 'sent' | 'delivered' | 'read';
  createdAt: string;
  updatedAt: string;
}

export interface Chat {
  _id: string;
  participants: User[];
  isGroup: boolean;
  groupName?: string;
  lastMessage?: Message;
  createdAt: string;
  updatedAt: string;
}

export interface CreateChatRequest {
  participantId: string;
  isGroup?: boolean;
  groupName?: string;
}

export interface SendMessageRequest {
  chatId: string;
  content: string;
}