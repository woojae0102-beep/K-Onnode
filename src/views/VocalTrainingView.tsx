// @ts-nocheck
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import LyricsDisplay from '../components/vocal/LyricsDisplay';
import LiveScore from '../components/vocal/LiveScore';
import PitchGraph from '../components/vocal/PitchGraph';
import PitchMeter from '../components/vocal/PitchMeter';
import WaveformVisualizer from '../components/vocal/WaveformVisualizer';
import { useAudioAnalysis } from '../hooks/useAudioAnalysis';

export default function VocalTrainingView({ onNavigate }) {
  const { t } = useTranslation();
  const [recording, setRecording] = useState(false);
  const { pitchSeries, pitchScore, rhythmScore, liveScore, summary } = useAudioAnalysis(recording);
  const [lineIdx, setLineIdx] = useState(0);
  const lines = useMemo(() => [t('vocal.line1'), t('vocal.line2'), t('vocal.line3'), t('vocal.line4')], [t]);

  return (
    <div className="h-full overflow-y-auto p-6 bg-[#F5F5F7] space-y-4">
      <header className="rounded-xl border border-[#E5E5E5] bg-white p-4 flex items-center justify-between">
        <input placeholder={t('vocal.searchSong')} className="flex-1 rounded-xl border border-[#E5E5E5] px-3 py-2 text-sm" />
        <div className="flex gap-2 ml-3">
          {['myUpload', 'popular', 'discover'].map((tab) => (
            <button key={tab} type="button" className="rounded-lg border border-[#E5E5E5] px-3 py-2 text-xs text-[#888888]">
              {t(`vocal.tabs.${tab}`)}
            </button>
          ))}
        </div>
      </header>

      <div className="rounded-xl border border-[#E5E5E5] bg-white p-4 space-y-3">
        <WaveformVisualizer active={recording} />
        <LyricsDisplay lines={lines} activeIndex={lineIdx} />
        <div className="flex items-center gap-3">
          <button
            type="button"
            className={`w-16 h-16 rounded-full ${recording ? 'bg-red-500' : 'bg-[#FF1F8E]'} text-white text-xs font-semibold`}
            onClick={() => {
              setRecording((v) => !v);
              setLineIdx((idx) => (idx + 1) % lines.length);
            }}
          >
            {recording ? t('vocal.stop') : t('vocal.record')}
          </button>
          <PitchMeter value={pitchScore} />
          <div className="flex-1">
            <PitchGraph data={pitchSeries} />
          </div>
          <LiveScore value={liveScore} />
        </div>
      </div>

      <div className="rounded-xl border border-[#E5E5E5] bg-white p-4 space-y-3">
        <p className="text-lg font-semibold text-[#111111]">{t('vocal.result')}</p>
        <p className="text-4xl font-black text-[#111111]">{summary.total}</p>
        <div className="grid grid-cols-4 gap-2">
          <ScoreCard label={t('vocal.pitch')} value={summary.pitch} />
          <ScoreCard label={t('vocal.rhythm')} value={summary.rhythm} />
          <ScoreCard label={t('vocal.voice')} value={summary.voice} />
          <ScoreCard label={t('vocal.emotion')} value={summary.emotion} />
        </div>
        <p className="text-sm text-[#888888]">{t('vocal.aiComment')}</p>
        <div className="grid grid-cols-3 gap-2">
          <button type="button" className="rounded-lg border border-[#E5E5E5] py-2 text-xs">{t('vocal.retry')}</button>
          <button type="button" className="rounded-lg border border-[#E5E5E5] py-2 text-xs">{t('vocal.save')}</button>
          <button type="button" className="rounded-lg bg-[#FF1F8E] text-white py-2 text-xs" onClick={() => onNavigate('community')}>
            {t('vocal.share')}
          </button>
        </div>
      </div>
    </div>
  );
}

function ScoreCard({ label, value }) {
  return (
    <div className="rounded-lg border border-[#E5E5E5] bg-[#F5F5F7] p-2">
      <p className="text-[10px] text-[#888888]">{label}</p>
      <p className="text-xl font-bold text-[#111111]">{value}</p>
    </div>
  );
}
