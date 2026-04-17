// @ts-nocheck
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function MirrorModeToggle({ value, onChange }) {
  const { t } = useTranslation();
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`rounded-lg px-3 py-2 text-xs font-semibold border ${value ? 'border-[#FF1F8E] text-[#FF1F8E] bg-[#FF1F8E18]' : 'border-[#E5E5E5] text-[#888888]'}`}
    >
      {t('dance.mirror')}
    </button>
  );
}
