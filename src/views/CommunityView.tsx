// @ts-nocheck
import React, { useState } from 'react';
import ChatList from '../components/community/ChatList';
import ChatWindow from '../components/community/ChatWindow';
import NewChatModal from '../components/community/NewChatModal';
import { useRealtimeChat } from '../hooks/useRealtimeChat';

export default function CommunityView() {
  const [tab, setTab] = useState('dm');
  const [newChatOpen, setNewChatOpen] = useState(false);
  const { conversations, activeConversation, activeConversationId, setActiveConversationId, draft, setDraft, sendText, sendMedia, uploading, markRead, createConversation } =
    useRealtimeChat();

  return (
    <div className="min-h-full bg-[#F5F5F7]">
      <div className="flex min-h-full flex-col md:flex-row">
        <ChatList
          conversations={conversations}
          tab={tab}
          onTab={setTab}
          activeId={activeConversationId}
          onSelect={setActiveConversationId}
          onNewChat={() => setNewChatOpen(true)}
        />
        <div className="flex-1 min-h-[60vh] md:min-h-0">
          <ChatWindow conversation={activeConversation} draft={draft} setDraft={setDraft} onSend={sendText} onMedia={sendMedia} uploading={uploading} onRead={markRead} />
        </div>
      </div>
      <NewChatModal open={newChatOpen} onClose={() => setNewChatOpen(false)} onCreate={createConversation} />
    </div>
  );
}
