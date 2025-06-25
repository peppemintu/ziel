import { useState } from 'react';

export const useChat = (userRole, user) => {
  const [chatMessages, setChatMessages] = useState({});
  const [newMessages, setNewMessages] = useState({});

  const sendMessage = (submissionId) => {
    const message = newMessages[submissionId]?.trim();
    if (!message) return;

    const newMessage = {
      id: Date.now(),
      sender: userRole,
      senderName: user.name || user.email,
      text: message,
      timestamp: new Date().toLocaleString()
    };

    setChatMessages(prev => ({
      ...prev,
      [submissionId]: [...(prev[submissionId] || []), newMessage]
    }));

    setNewMessages(prev => ({
      ...prev,
      [submissionId]: ''
    }));
  };

  const updateMessage = (submissionId, message) => {
    setNewMessages(prev => ({
      ...prev,
      [submissionId]: message
    }));
  };

  return {
    chatMessages,
    newMessages,
    sendMessage,
    updateMessage
  };
};