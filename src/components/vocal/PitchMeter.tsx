// @ts-nocheck
import React from 'react';

export default function PitchMeter({ value }) {
  return (
    <div className="w-10 h-44 rounded-full bg-[#F5F5F7] relative overflow-hidden border border-[#E5E5E5]">
      <div className="absolute bottom-0 left-0 w-full bg-[#FF1F8E]" style={{ height: `${value}%` }} />
    </div>
  );
}
