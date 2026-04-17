// @ts-nocheck
import React from 'react';

export default function GoalProgressCard({ goal }) {
  return (
    <div className="rounded-xl border border-[#E5E5E5] bg-white p-3 space-y-2">
      <p className="text-sm font-semibold text-[#111111]">{goal.title}</p>
      <div className="h-2 bg-[#F5F5F7] rounded-full overflow-hidden">
        <div className="h-full bg-[#FF1F8E]" style={{ width: `${goal.percent}%` }} />
      </div>
      <p className="text-xs text-[#888888]">
        {goal.progress} · {goal.percent}%
      </p>
    </div>
  );
}
