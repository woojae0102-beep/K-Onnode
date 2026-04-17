// @ts-nocheck
import React from 'react';

export default function WaveformVisualizer({ active, bars = [] }) {
  const waveBars = bars.length ? bars : Array.from({ length: 48 }, () => 6);
  return (
    <div className="h-24 rounded-xl bg-[#111111] px-3 py-2 flex items-end gap-1 overflow-hidden">
      {waveBars.map((height, idx) => (
        <span key={`${idx}-${height}`} className="w-1 rounded-full bg-[#FF1F8E]" style={{ height: `${height}%`, opacity: active ? 1 : 0.35 }} />
      ))}
    </div>
  );
}
