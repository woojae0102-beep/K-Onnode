import React from 'react';
import { ChevronRight } from 'lucide-react';

export default function SettingsItem({ icon: Icon, label, description, rightContent, onClick, asButton = true }) {
  const Wrapper = asButton ? 'button' : 'div';
  return (
    <Wrapper
      type={asButton ? 'button' : undefined}
      onClick={onClick}
      className={`w-full rounded-2xl border border-[#E5E5E5] bg-[#F5F5F7] px-[14px] py-[13px] flex items-start gap-3 ${
        asButton ? 'hover:border-pink-300 hover:bg-pink-50/50 transition text-left' : ''
      }`}
    >
      <div className="w-8 h-8 rounded-lg bg-white border border-[#E5E5E5] flex items-center justify-center shrink-0">
        {Icon ? <Icon size={18} className="text-slate-600" /> : null}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-medium text-[#111111]">{label}</p>
        {description ? <p className="text-xs font-normal text-[#888888] mt-1">{description}</p> : null}
      </div>
      <div className="shrink-0 flex items-center gap-2">
        {rightContent}
        {asButton ? <ChevronRight size={14} className="text-[#CCCCCC]" /> : null}
      </div>
    </Wrapper>
  );
}
