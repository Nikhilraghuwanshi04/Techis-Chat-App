import { User, Chat } from '../types';

export const currentUser: User = {
  _id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
  online: true,
};

export const contacts: User[] = [
  {
    _id: '2',
    name: 'Alice Smith',
    email: 'alice@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    online: true,
  },
  {
    _id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    online: false,
  },
];

export const mockChats: Chat[] = [
  {
    _id: '1',
    participants: [currentUser, contacts[0]],
    isGroup: false,
    messages: [
      {
        _id: '1',
        chatId: '1',
        content: 'Hey, how are you?',
        sender: contacts[0],
        status: 'read',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        updatedAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        _id: '2',
        chatId: '1',
        content: 'I\'m good, thanks! How about you?',
        sender: currentUser,
        status: 'delivered',
        createdAt: new Date(Date.now() - 3000000).toISOString(),
        updatedAt: new Date(Date.now() - 3000000).toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];