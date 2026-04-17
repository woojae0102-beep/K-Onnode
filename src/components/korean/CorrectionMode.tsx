// @ts-nocheck
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function CorrectionMode() {
  const { t } = useTranslation();
  return (
    <div className="rounded-xl border border-[#E5E5E5] bg-white p-4 space-y-3">
      <p className="text-sm font-semibold text-[#111111]">{t('korean.correctionTitle')}</p>
      <div className="space-y-2">
        <div className="ml-auto max-w-[75%] rounded-[16px_16px_4px_16px] bg-[#FF1F8E] text-white text-sm px-3 py-2">{t('korean.correctionUser')}</div>
        <div className="max-w-[75%] rounded-[16px_16px_16px_4px] bg-[#F5F5F7] text-[#111111] text-sm px-3 py-2">{t('korean.correctionAI')}</div>
      </div>
    </div>
  );
}
