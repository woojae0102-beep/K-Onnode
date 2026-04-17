// @ts-nocheck
import React, { useEffect, useRef, useState } from 'react';
import { Paperclip, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import MessageBubble from './MessageBubble';
import AttachmentPicker from './AttachmentPicker';

export default function ChatWindow({ conversation, draft, setDraft, onSend, onMedia, uploading, onRead }) {
  const { t } = useTranslation();
  const [pickerOpen, setPickerOpen] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (conversation) onRead();
  }, [conversation, onRead]);

  if (!conversation) return <div className="flex-1 grid place-items-center text-[#888888]">{t('community.empty')}</div>;

  return (
    <section className="flex-1 h-full min-h-[60vh] md:min-h-0 flex flex-col bg-white">
      <header className="h-16 border-b border-[#E5E5E5] px-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-[#111111]">{conversation.name}</p>
          <p className="text-xs text-[#888888]">{conversation.online ? t('community.online') : t('community.offline')}</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-3">
        {conversation.messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {uploading ? (
          <div className="max-w-[70%] ml-auto mb-2 px-3 py-2 rounded-[18px_18px_4px_18px] bg-[#FF1F8E] text-white">
            <p className="text-xs">{t('community.uploading')}</p>
            <div className="h-1.5 mt-1 bg-white/30 rounded-full overflow-hidden">
              <div className="h-full bg-white" style={{ width: `${uploading.progress}%` }} />
            </div>
          </div>
        ) : null}
        <div ref={endRef} />
      </div>

      <div className="border-t border-[#E5E5E5] p-3 flex items-end gap-2 relative">
        <button type="button" className="w-10 h-10 rounded-xl border border-[#E5E5E5] grid place-items-center" onClick={() => setPickerOpen((v) => !v)}>
          <Paperclip size={16} />
        </button>
        <AttachmentPicker open={pickerOpen} onClose={() => setPickerOpen(false)} onPick={onMedia} />
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={t('community.messagePlaceholder')}
          className="flex-1 min-h-[42px] max-h-[120px] rounded-xl border border-[#E5E5E5] px-3 py-2 text-sm resize-none"
          rows={1}
        />
        <button type="button" className="w-10 h-10 rounded-xl bg-[#FF1F8E] text-white grid place-items-center" onClick={() => onSend(draft)}>
          <Send size={16} />
        </button>
      </div>
    </section>
  );
}
