// @ts-nocheck
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function PoseFeedbackOverlay({ score, issue, summary, onShareCommunity }) {
  const { t } = useTranslation();
  return (
    <div className="rounded-2xl border border-[#E5E5E5] bg-white p-4 space-y-3">
      <p className="text-sm font-semibold text-[#111111]">{t('dance.liveFeedback')}</p>
      <div className="h-2 bg-[#F5F5F7] rounded-full overflow-hidden">
        <div className="h-full bg-[#FF1F8E]" style={{ width: `${score}%` }} />
      </div>
      <p className="text-xs text-[#888888]">{issue}</p>
      <div className="rounded-xl bg-[#F5F5F7] p-3 text-xs text-[#111111] space-y-1">
        <p>{t('dance.summary.total')}: {summary.totalScore}</p>
        <p>{t('dance.summary.best')}: {summary.bestMoment}</p>
        <p>{t('dance.summary.needs')}: {summary.needs}</p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <button type="button" className="rounded-lg border border-[#E5E5E5] py-2 text-xs">{t('dance.retry')}</button>
        <button type="button" className="rounded-lg border border-[#E5E5E5] py-2 text-xs">{t('dance.save')}</button>
        <button type="button" className="rounded-lg bg-[#FF1F8E] text-white py-2 text-xs" onClick={onShareCommunity}>
          {t('dance.share')}
        </button>
      </div>
    </div>
  );
}
