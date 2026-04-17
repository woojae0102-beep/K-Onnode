// @ts-nocheck
import React from 'react';
import { useTranslation } from 'react-i18next';

function angleText(value) {
  if (value == null) return '—';
  return `${Math.round(value)}°`;
}

export default function PoseFeedbackOverlay({ score, issue, summary, metrics, feedbackList = [], onShareCommunity }) {
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
      <div className="grid grid-cols-2 gap-2 text-[11px]">
        <div className="rounded-lg border border-[#E5E5E5] p-2">
          <p className="text-[#888888]">팔 각도 (좌/우)</p>
          <p className="font-semibold text-[#111111]">{angleText(metrics?.leftElbowDeg)} / {angleText(metrics?.rightElbowDeg)}</p>
        </div>
        <div className="rounded-lg border border-[#E5E5E5] p-2">
          <p className="text-[#888888]">무릎 각도 (좌/우)</p>
          <p className="font-semibold text-[#111111]">{angleText(metrics?.leftKneeDeg)} / {angleText(metrics?.rightKneeDeg)}</p>
        </div>
        <div className="rounded-lg border border-[#E5E5E5] p-2">
          <p className="text-[#888888]">상체/골반 기울기</p>
          <p className="font-semibold text-[#111111]">{angleText(metrics?.shoulderTiltDeg)} / {angleText(metrics?.hipTiltDeg)}</p>
        </div>
        <div className="rounded-lg border border-[#E5E5E5] p-2">
          <p className="text-[#888888]">신뢰도/활동성</p>
          <p className="font-semibold text-[#111111]">{metrics?.poseConfidence ?? 0}% / {metrics?.danceActivity ?? 0}%</p>
        </div>
      </div>
      <div className="rounded-xl border border-[#E5E5E5] p-3 space-y-1">
        <p className="text-xs font-semibold text-[#111111]">상세 코칭 피드백</p>
        {(feedbackList || []).length ? (
          <ul className="list-disc pl-4 space-y-1 text-[11px] text-[#555555]">
            {feedbackList.map((item, idx) => (
              <li key={`${idx}-${item.slice(0, 16)}`}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="text-[11px] text-[#888888]">카메라를 켜고 전신이 보이도록 서면 세부 피드백이 표시됩니다.</p>
        )}
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
