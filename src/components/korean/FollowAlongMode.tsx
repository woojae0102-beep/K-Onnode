// @ts-nocheck
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useKoreanSpeechCoach } from '../../hooks/useKoreanSpeechCoach';

const PRACTICE_LINES = [
  '오늘도 차근차근 발음을 맞춰 볼게요.',
  '리듬에 맞춰 또박또박 말해 보세요.',
  '어려운 받침도 천천히 정확하게 연습해요.',
  '마지막 문장까지 호흡을 일정하게 유지해요.',
];

export default function FollowAlongMode({ onReportUpdate }) {
  const { t } = useTranslation();
  const [activeLineIdx, setActiveLineIdx] = useState(-1);
  const [recording, setRecording] = useState(false);
  const [lineScores, setLineScores] = useState(Array.from({ length: PRACTICE_LINES.length }, () => null));
  const scoreAccRef = useRef({ sum: 0, count: 0 });
  const currentLineRef = useRef(-1);
  const { combinedTranscript, metrics, micError, speechError } = useKoreanSpeechCoach({
    active: recording,
    referenceText: activeLineIdx >= 0 ? PRACTICE_LINES[activeLineIdx] : '',
  });

  const finalizeLineScore = () => {
    const idx = currentLineRef.current;
    if (idx < 0) return;
    const { sum, count } = scoreAccRef.current;
    if (!count) return;
    const avg = Math.round(sum / count);
    setLineScores((prev) => {
      const next = [...prev];
      next[idx] = avg;
      return next;
    });
    scoreAccRef.current = { sum: 0, count: 0 };
  };

  useEffect(() => {
    if (!recording) return undefined;
    const timer = setInterval(() => {
      scoreAccRef.current.sum += metrics.overall;
      scoreAccRef.current.count += 1;
    }, 500);
    return () => clearInterval(timer);
  }, [metrics.overall, recording]);

  useEffect(() => {
    const validScores = lineScores.filter((value) => Number.isFinite(value));
    const avg = validScores.length ? Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length) : null;
    onReportUpdate?.({
      mode: 'korean-follow',
      recording,
      activeLineIdx,
      transcript: combinedTranscript,
      metrics,
      lineScores,
      lineAverage: avg,
      updatedAt: Date.now(),
    });
  }, [activeLineIdx, combinedTranscript, lineScores, metrics, onReportUpdate, recording]);

  const toggleLineRecording = (idx) => {
    if (recording && idx === activeLineIdx) {
      finalizeLineScore();
      setRecording(false);
      setActiveLineIdx(-1);
      currentLineRef.current = -1;
      return;
    }
    if (recording) finalizeLineScore();
    scoreAccRef.current = { sum: 0, count: 0 };
    setActiveLineIdx(idx);
    currentLineRef.current = idx;
    setRecording(true);
  };

  return (
    <div className="rounded-xl border border-[#E5E5E5] bg-white p-4 space-y-3">
      <p className="text-sm font-semibold text-[#111111]">{t('korean.followTitle')}</p>
      {PRACTICE_LINES.map((line, idx) => (
        <div key={idx} className="rounded-lg border border-[#E5E5E5] p-3 flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-[#111111]">{line}</p>
            <p className="text-[11px] text-[#666666] mt-0.5">
              점수: {lineScores[idx] ?? '—'} {activeLineIdx === idx && recording ? `· 실시간 ${metrics.overall}` : ''}
            </p>
          </div>
          <div className="flex gap-2">
            <button type="button" className="rounded-lg border border-[#E5E5E5] px-2 py-1 text-xs">{t('korean.nativePlay')}</button>
            <button
              type="button"
              onClick={() => toggleLineRecording(idx)}
              className={`rounded-lg px-2 py-1 text-xs text-white ${recording && activeLineIdx === idx ? 'bg-rose-500' : 'bg-[#FF1F8E]'}`}
            >
              {recording && activeLineIdx === idx ? '중지' : t('korean.record')}
            </button>
          </div>
        </div>
      ))}
      <div className="rounded-lg bg-[#F5F5F7] p-3">
        <p className="text-xs text-[#666666]">실시간 인식</p>
        <p className="text-sm text-[#111111] mt-1">{combinedTranscript || '라인 녹음을 시작하면 실시간 문장이 표시됩니다.'}</p>
        <p className="text-xs text-[#666666] mt-2">문장 일치 {metrics.similarity}% · 속도 {metrics.pace}% · 선명도 {metrics.clarity}%</p>
      </div>
      {micError ? <p className="text-xs text-rose-500">{micError}</p> : null}
      {speechError ? <p className="text-xs text-rose-500">{speechError}</p> : null}
    </div>
  );
}
