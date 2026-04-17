// @ts-nocheck
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function FollowAlongMode() {
  const { t } = useTranslation();
  return (
    <div className="rounded-xl border border-[#E5E5E5] bg-white p-4 space-y-3">
      <p className="text-sm font-semibold text-[#111111]">{t('korean.followTitle')}</p>
      {Array.from({ length: 4 }).map((_, idx) => (
        <div key={idx} className="rounded-lg border border-[#E5E5E5] p-3 flex items-center justify-between">
          <p className="text-sm text-[#111111]">{t('korean.lineLabel', { idx: idx + 1 })}</p>
          <div className="flex gap-2">
            <button type="button" className="rounded-lg border border-[#E5E5E5] px-2 py-1 text-xs">{t('korean.nativePlay')}</button>
            <button type="button" className="rounded-lg border border-[#E5E5E5] px-2 py-1 text-xs">{t('korean.record')}</button>
          </div>
        </div>
      ))}
    </div>
  );
}
