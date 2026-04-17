import React from 'react';

export default function SettingsSection({ title, children }) {
  return (
    <section className="rounded-3xl border border-[#E5E5E5] bg-white p-6 shadow-sm space-y-4 mb-7">
      <h3 className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#AAAAAA]">{title}</h3>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
