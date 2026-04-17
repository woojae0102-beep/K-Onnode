// @ts-nocheck
import { useMemo, useState } from 'react';

const seedConversations = [
  {
    id: 'dm-1',
    type: 'dm',
    name: 'Mina',
    online: true,
    unread: 2,
    members: 2,
    lastMessage: '오늘 보컬 연습 같이 할래?',
    timestamp: Date.now() - 1000 * 60 * 5,
    messages: [
      { id: 'm1', sender: 'them', type: 'text', content: '오늘 보컬 연습 같이 할래?', timestamp: Date.now() - 1000 * 60 * 5, read: true },
      { id: 'm2', sender: 'me', type: 'text', content: '좋아! 8시에 하자', timestamp: Date.now() - 1000 * 60 * 4, read: true },
    ],
  },
  {
    id: 'group-1',
    type: 'group',
    name: 'ONNODE Dance Crew',
    online: false,
    unread: 0,
    members: 8,
    lastMessage: '새 챌린지 올라왔어요',
    timestamp: Date.now() - 1000 * 60 * 50,
    messages: [{ id: 'g1', sender: 'them', type: 'text', content: '새 챌린지 올라왔어요', timestamp: Date.now() - 1000 * 60 * 50, read: true }],
  },
];

export function useRealtimeChat() {
  const [conversations, setConversations] = useState(seedConversations);
  const [activeConversationId, setActiveConversationId] = useState(seedConversations[0].id);
  const [draft, setDraft] = useState('');
  const [uploading, setUploading] = useState(null);

  const activeConversation = useMemo(
    () => conversations.find((conv) => conv.id === activeConversationId) || conversations[0],
    [conversations, activeConversationId]
  );

  const sendText = (text) => {
    const value = (text || draft || '').trim();
    if (!value) return;
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === activeConversationId
          ? {
              ...conv,
              lastMessage: value,
              timestamp: Date.now(),
              messages: [...conv.messages, { id: `msg-${Date.now()}`, sender: 'me', type: 'text', content: value, timestamp: Date.now(), read: false }],
            }
          : conv
      )
    );
    setDraft('');
  };

  const sendMedia = (type) => {
    const progressId = `upload-${Date.now()}`;
    setUploading({ id: progressId, progress: 10, type });
    let progress = 10;
    const tick = setInterval(() => {
      progress += 20;
      setUploading({ id: progressId, progress, type });
      if (progress >= 100) {
        clearInterval(tick);
        setUploading(null);
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === activeConversationId
              ? {
                  ...conv,
                  lastMessage: type === 'image' ? '[image]' : '[video]',
                  timestamp: Date.now(),
                  messages: [
                    ...conv.messages,
                    {
                      id: `msg-${Date.now()}`,
                      sender: 'me',
                      type,
                      content:
                        type === 'image'
                          ? 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=800&q=80'
                          : 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4',
                      timestamp: Date.now(),
                      read: false,
                    },
                  ],
                }
              : conv
          )
        );
      }
    }, 220);
  };

  const markRead = () => {
    setConversations((prev) => prev.map((conv) => (conv.id === activeConversationId ? { ...conv, unread: 0 } : conv)));
  };

  const createConversation = (name, type = 'dm') => {
    const created = {
      id: `new-${Date.now()}`,
      type,
      name,
      online: false,
      unread: 0,
      members: type === 'group' ? 3 : 2,
      lastMessage: '',
      timestamp: Date.now(),
      messages: [],
    };
    setConversations((prev) => [created, ...prev]);
    setActiveConversationId(created.id);
  };

  return {
    conversations,
    activeConversation,
    activeConversationId,
    setActiveConversationId,
    draft,
    setDraft,
    sendText,
    sendMedia,
    uploading,
    markRead,
    createConversation,
  };
}
