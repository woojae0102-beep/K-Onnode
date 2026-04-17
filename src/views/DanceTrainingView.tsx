// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DifficultySlider from '../components/dance/DifficultySlider';
import MirrorModeToggle from '../components/dance/MirrorModeToggle';
import PoseFeedbackOverlay from '../components/dance/PoseFeedbackOverlay';
import YouTubeImport from '../components/dance/YouTubeImport';
import { usePoseDetection } from '../hooks/usePoseDetection';

export default function DanceTrainingView({ onNavigate }) {
  const { t } = useTranslation();
  const [videoUrl, setVideoUrl] = useState('');
  const [rate, setRate] = useState(1.0);
  const [mirror, setMirror] = useState(false);
  const [difficulty, setDifficulty] = useState(3);
  const { score, issue, summary } = usePoseDetection(true);

  useEffect(() => {
    fetch('/api/dance/set-difficulty', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ difficulty }),
    }).catch(() => {});
  }, [difficulty]);

  return (
    <div className="min-h-full p-4 md:p-6 bg-[#F5F5F7]">
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <div className="xl:col-span-3 rounded-xl border border-[#E5E5E5] bg-white p-4 space-y-3">
          <YouTubeImport onLoad={setVideoUrl} />
          <div className="rounded-xl overflow-hidden border border-[#E5E5E5] bg-black h-[260px] md:h-[360px]">
            {videoUrl ? (
              <iframe
                title="dance-video"
                src={`${videoUrl}?autoplay=1&playsinline=1`}
                className="w-full h-full"
                style={{ transform: mirror ? 'scaleX(-1)' : 'none' }}
                allow="autoplay; encrypted-media"
              />
            ) : (
              <div className="h-full grid place-items-center text-white text-sm">{t('dance.emptyVideo')}</div>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <p className="text-xs text-[#888888]">{t('dance.speed')}</p>
              <div className="flex gap-2">
                {[0.25, 0.5, 0.75, 1.0].map((item) => (
                  <button key={item} type="button" className={`rounded-lg px-2 py-1 text-xs border ${rate === item ? 'border-[#FF1F8E] text-[#FF1F8E]' : 'border-[#E5E5E5] text-[#888888]'}`} onClick={() => setRate(item)}>
                    {item}x
                  </button>
                ))}
              </div>
            </div>
            <MirrorModeToggle value={mirror} onChange={setMirror} />
            <DifficultySlider value={difficulty} onChange={setDifficulty} />
          </div>
        </div>

        <div className="xl:col-span-2 space-y-3">
          <div className="rounded-xl border border-[#E5E5E5] bg-black h-56 md:h-64 relative overflow-hidden">
            <div className="absolute inset-0 opacity-80 bg-[radial-gradient(circle_at_center,#FF1F8E55,transparent_60%)]" />
            <div className="absolute inset-0 grid place-items-center text-white text-sm">{t('dance.cameraLive')}</div>
          </div>
          <PoseFeedbackOverlay score={score} issue={issue} summary={summary} onShareCommunity={() => onNavigate('community')} />
        </div>
      </div>
    </div>
  );
}
