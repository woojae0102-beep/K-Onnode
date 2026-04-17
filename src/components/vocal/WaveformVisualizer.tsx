// @ts-nocheck
import React from 'react';

export default function WaveformVisualizer({ active }) {
  const bars = Array.from({ length: 48 }).map((_, idx) => ({ id: idx, h: 12 + Math.random() * (active ? 60 : 18) }));
  return (
    <div className="h-24 rounded-xl bg-[#111111] px-3 py-2 flex items-end gap-1 overflow-hidden">
      {bars.map((bar) => (
        <span key={bar.id} className="w-1 rounded-full bg-[#FF1F8E]" style={{ height: `${bar.h}%`, opacity: active ? 1 : 0.4 }} />
      ))}
    </div>
  );
}
