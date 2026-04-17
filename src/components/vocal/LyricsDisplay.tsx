// @ts-nocheck
import React from 'react';

export default function LyricsDisplay({ lines, activeIndex }) {
  return (
    <div className="rounded-xl border border-[#E5E5E5] bg-white p-4 space-y-2">
      {lines.map((line, idx) => (
        <p key={`${line}-${idx}`} className={`text-sm ${activeIndex === idx ? 'text-[#111111] font-semibold' : 'text-[#888888]'}`}>
          {line}
        </p>
      ))}
    </div>
  );
}
