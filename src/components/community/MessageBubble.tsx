// @ts-nocheck
import React from 'react';
import { Play } from 'lucide-react';

export default function MessageBubble({ message }) {
  const mine = message.sender === 'me';
  return (
    <div className={`flex ${mine ? 'justify-end' : 'justify-start'} mb-2`}>
      <div className={`max-w-[70%] px-3 py-2 ${mine ? 'bg-[#FF1F8E] text-white rounded-[18px_18px_4px_18px]' : 'bg-[#F5F5F7] text-[#111111] rounded-[18px_18px_18px_4px]'}`}>
        {message.type === 'text' ? <p className="text-sm">{message.content}</p> : null}
        {message.type === 'image' ? <img src={message.content} alt="chat media" className="max-w-[240px] rounded-lg" /> : null}
        {message.type === 'video' ? (
          <div className="relative">
            <video src={message.content} className="max-w-[240px] rounded-lg" />
            <span className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center">
              <Play size={16} />
            </span>
          </div>
        ) : null}
        <p className={`text-[10px] mt-1 ${mine ? 'text-white/80' : 'text-[#888888]'}`}>{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
      </div>
    </div>
  );
}
