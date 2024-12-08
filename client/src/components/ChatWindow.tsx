import React, { useState, useEffect } from 'react';
import { User, Chat, Message } from '../types';
import { Send, MessageSquare } from 'lucide-react';
import { socketService } from '../services/socket';

interface ChatWindowProps {
  chat?: Chat;
  currentUser: User;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ chat, currentUser }) => {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (chat) {
      socketService.joinChat(chat._id);
      socketService.onMessageReceived((message) => {
        setMessages((prev) => [...prev, message]);
      });
    }
  }, [chat]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !chat) return;

    const message = {
      _id: Date.now().toString(),
      chatId: chat._id,
      content: newMessage,
      sender: currentUser,
      status: 'sent',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as Message;

    socketService.sendMessage(message);
    setMessages((prev) => [...prev, message]);
    setNewMessage('');
  };

  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600">
            Select a chat to start messaging
          </h2>
        </div>
      </div>
    );
  }

  const otherParticipant = chat.participants.find(
    (p) => p._id !== currentUser._id
  );

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-3">
          <img
            src={otherParticipant?.avatar}
            alt={otherParticipant?.name}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h2 className="font-semibold">{otherParticipant?.name}</h2>
            <span className="text-sm text-gray-500">
              {otherParticipant?.online ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => {
          const isOwnMessage = message.sender._id === currentUser._id;
          return (
            <div
              key={message._id}
              className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  isOwnMessage
                    ? 'bg-blue-500 text-white'
                    : 'bg-white border border-gray-200'
                }`}
              >
                <p>{message.content}</p>
                <div
                  className={`text-xs mt-1 ${
                    isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                  }`}
                >
                  {new Date(message.createdAt).toLocaleTimeString()}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <form
        onSubmit={handleSendMessage}
        className="p-4 border-t border-gray-200 bg-white"
      >
        <div className="flex space-x-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white rounded-lg px-6 py-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};