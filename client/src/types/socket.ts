import { Message } from './chat';

export interface ServerToClientEvents {
  'message received': (message: Message) => void;
  'user status': (data: { userId: string; online: boolean }) => void;
  'typing': (data: { chatId: string; userId: string }) => void;
  'stop typing': (data: { chatId: string; userId: string }) => void;
}

export interface ClientToServerEvents {
  'join chat': (chatId: string) => void;
  'new message': (message: Message) => void;
  'typing': (chatId: string) => void;
  'stop typing': (chatId: string) => void;
}