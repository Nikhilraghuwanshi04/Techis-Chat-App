import React from 'react';
import { User, Chat } from '../types';
import { MessageSquare, Users } from 'lucide-react';

interface ChatSidebarProps {
  chats: Chat[];
  currentUser: User;
  onChatSelect: (chatId: string) => void;
  selectedChatId?: string;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  chats,
  currentUser,
  onChatSelect,
  selectedChatId,
}) => {
  return (
    <div className="w-80 border-r border-gray-200 h-full bg-white">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h2 className="font-semibold">{currentUser.name}</h2>
            <span className="text-sm text-green-500">Online</span>
          </div>
        </div>
      </div>
      
      <div className="overflow-y-auto h-[calc(100%-4rem)]">
        {chats.map((chat) => {
          const otherParticipant = chat.participants.find(
            (p) => p._id !== currentUser._id
          );
          
          return (
            <div
              key={chat._id}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                selectedChatId === chat._id ? 'bg-blue-50' : ''
              }`}
              onClick={() => onChatSelect(chat._id)}
            >
              <div className="flex items-center space-x-3">
                {chat.isGroup ? (
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-500" />
                  </div>
                ) : (
                  <img
                    src={otherParticipant?.avatar}
                    alt={otherParticipant?.name}
                    className="w-10 h-10 rounded-full"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-medium">
                    {chat.isGroup
                      ? chat.groupName
                      : otherParticipant?.name}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">
                    {chat.lastMessage?.content}
                  </p>
                </div>
                {otherParticipant?.online && (
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};