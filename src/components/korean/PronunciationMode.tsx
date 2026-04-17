// @ts-nocheck
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function PronunciationMode() {
  const { t } = useTranslation();
  return (
    <div className="rounded-xl border border-[#E5E5E5] bg-white p-4 space-y-3">
      <p className="text-xl font-semibold text-[#111111]">{t('korean.sampleSentence')}</p>
      <div className="flex gap-2">
        <button type="button" className="rounded-lg border border-[#E5E5E5] px-3 py-2 text-xs">
          {t('korean.toggleRomanized')}
        </button>
        <button type="button" className="rounded-lg border border-[#E5E5E5] px-3 py-2 text-xs">
          {t('korean.toggleTranslation')}
        </button>
        <button type="button" className="rounded-lg bg-[#FF1F8E] text-white px-3 py-2 text-xs">
          {t('korean.record')}
        </button>
      </div>
      <div className="rounded-lg bg-[#F5F5F7] p-3 text-sm text-[#888888]">{t('korean.syllableFeedback')}</div>
    </div>
  );
}
