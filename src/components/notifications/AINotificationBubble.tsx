// @ts-nocheck
import React from 'react';

export default function AINotificationBubble({ title, message, actionLabel, unread, onAction }) {
  return (
    <div className={`rounded-xl border border-[#E5E5E5] p-4 ${unread ? 'bg-[#FFF5F9]' : 'bg-white'}`}>
      <div className="flex items-start gap-2">
        {unread ? <span className="mt-1 w-2 h-2 rounded-full bg-[#FF1F8E]" /> : null}
        <div className="flex-1">
          <p className="text-sm font-semibold text-[#111111]">{title}</p>
          <p className="text-sm text-[#888888] mt-1">{message}</p>
          {actionLabel ? (
            <button type="button" className="mt-3 text-xs rounded-lg px-3 py-2 bg-[#FF1F8E] text-white" onClick={onAction}>
              {actionLabel}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
