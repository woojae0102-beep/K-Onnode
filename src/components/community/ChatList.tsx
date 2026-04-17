// @ts-nocheck
import React from 'react';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ChatList({ conversations, tab, onTab, activeId, onSelect, onNewChat }) {
  const { t } = useTranslation();
  return (
    <aside className="w-full md:w-[280px] border-r border-[#E5E5E5] bg-white md:h-full flex flex-col">
      <div className="p-3 space-y-3">
        <div className="rounded-xl border border-[#E5E5E5] px-3 py-2 text-sm flex items-center gap-2 text-[#888888]">
          <Search size={14} />
          {t('community.search')}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {['dm', 'group'].map((item) => (
            <button
              key={item}
              type="button"
              className={`rounded-lg py-2 text-xs font-semibold border ${tab === item ? 'border-[#FF1F8E] text-[#FF1F8E] bg-[#FF1F8E18]' : 'border-[#E5E5E5] text-[#888888]'}`}
              onClick={() => onTab(item)}
            >
              {t(`community.tabs.${item}`)}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {conversations
          .filter((conv) => conv.type === tab)
          .map((conv) => (
            <button
              key={conv.id}
              type="button"
              onClick={() => onSelect(conv.id)}
              className={`w-full px-3 py-3 text-left border-b border-[#F0F0F0] ${activeId === conv.id ? 'bg-[#FFF5F9]' : 'bg-white'}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#111111] truncate">{conv.name}</p>
                  <p className="text-xs text-[#888888] truncate">{conv.lastMessage || '-'}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-[#888888]">{new Date(conv.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  {conv.unread > 0 ? <span className="inline-flex mt-1 text-[10px] px-2 py-0.5 rounded-full bg-[#FF1F8E] text-white">{conv.unread}</span> : null}
                </div>
              </div>
            </button>
          ))}
      </div>
      <div className="p-3">
        <button type="button" onClick={onNewChat} className="w-full rounded-xl py-2 bg-[#FF1F8E] text-white text-sm font-semibold">
          {t('community.newChat')}
        </button>
      </div>
    </aside>
  );
}
