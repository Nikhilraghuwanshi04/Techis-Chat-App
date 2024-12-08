import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { ChatSidebar } from '../components/ChatSidebar';
import { ChatWindow } from '../components/ChatWindow';
import { useAuthStore } from '../store/authStore';
import { Chat } from '../types';
import { chats as chatService } from '../services/api';

export const ChatPage: React.FC = () => {
  const { user } = useAuthStore();
  const [selectedChatId, setSelectedChatId] = useState<string>();
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | undefined>();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const fetchedChats = await chatService.getChats();
        setChats(fetchedChats);
      } catch (error) {
        console.error('Failed to fetch chats:', error);
      }
    };

    if (user) {
      fetchChats();
    }
  }, [user]);

  useEffect(() => {
    if (selectedChatId && chats.length > 0) {
      const chat = chats.find(c => c._id === selectedChatId);
      setSelectedChat(chat);
    } else {
      setSelectedChat(undefined);
    }
  }, [selectedChatId, chats]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <div className="flex-1 container mx-auto py-6 px-4 max-w-6xl">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden h-[calc(100vh-8rem)]">
          <div className="flex h-full">
            <ChatSidebar
              chats={chats}
              currentUser={user}
              onChatSelect={setSelectedChatId}
              selectedChatId={selectedChatId}
            />
            <ChatWindow chat={selectedChat} currentUser={user} />
          </div>
        </div>
      </div>
    </div>
  );
};