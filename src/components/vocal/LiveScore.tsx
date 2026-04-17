// @ts-nocheck
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function LiveScore({ value }) {
  const { t } = useTranslation();
  return (
    <div className="rounded-xl border border-[#E5E5E5] px-3 py-2 bg-white">
      <p className="text-[10px] text-[#888888] uppercase">{t('vocal.liveScore')}</p>
      <p className="text-2xl font-black text-[#111111]">{value}</p>
    </div>
  );
}
