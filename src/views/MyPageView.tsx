// @ts-nocheck
import React, { useMemo, useState } from 'react';
import { ChevronRight, Play, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import GrowthGraph from '../components/mypage/GrowthGraph';
import GoalProgressCard from '../components/mypage/GoalProgressCard';
import SavedVideosGrid from '../components/mypage/SavedVideosGrid';

const tracks = ['dance', 'vocal', 'korean'];

export default function MyPageView({ onNavigate, lastTrainingView }) {
  const { t } = useTranslation();
  const [trackFilter, setTrackFilter] = useState('dance');
  const [feedbackPage, setFeedbackPage] = useState(1);
  const [videoModal, setVideoModal] = useState(null);

  const graphData = useMemo(
    () => Array.from({ length: 30 }).map((_, idx) => ({ day: `${idx + 1}`, score: Math.max(45, Math.min(98, 60 + Math.sin(idx / 4) * 20 + Math.random() * 8)) })),
    []
  );
  const feedbackItems = Array.from({ length: 20 }).map((_, idx) => ({
    id: idx + 1,
    date: `2026-04-${String((idx % 28) + 1).padStart(2, '0')}`,
    score: 68 + ((idx * 3) % 28),
    summary: t('mypage.feedbackSummary'),
  }));
  const videos = Array.from({ length: 6 }).map((_, idx) => ({
    id: `v-${idx}`,
    title: `video-${idx}`,
    duration: `00:${(idx + 2) * 7}`,
    track: tracks[idx % 3],
    thumbnail: `https://picsum.photos/seed/onnode-${idx}/420/280`,
  }));
  const goals = [
    { id: 1, title: t('mypage.goalWeekly'), progress: '3/5', percent: 60 },
    { id: 2, title: t('mypage.goalVocal'), progress: '2/4', percent: 50 },
    { id: 3, title: t('mypage.goalKorean'), progress: '8/10', percent: 80 },
  ];

  return (
    <div className="h-full overflow-y-auto p-6 bg-[#F5F5F7] space-y-6">
      <header className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-[#111111]">{t('views.mypage')}</h2>
        <button type="button" className="w-10 h-10 rounded-xl border border-[#E5E5E5] bg-white grid place-items-center" onClick={() => onNavigate('settings')}>
          <Settings size={16} />
        </button>
      </header>

      <section className="rounded-xl border border-[#E5E5E5] bg-white p-4 space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#FF1F8E18] text-[#FF1F8E] font-bold grid place-items-center">ON</div>
          <div>
            <p className="text-lg font-semibold text-[#111111]">{t('mypage.nickname')}</p>
            <p className="text-xs text-[#888888]">{t('mypage.joinedAt')}</p>
            <div className="flex gap-2 mt-2">
              {tracks.map((track) => (
                <span key={track} className="text-[10px] px-2 py-1 rounded-full bg-[#F5F5F7] border border-[#E5E5E5]">
                  {t(`settings.track.${track}`)}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-[#111111]">{t('mypage.levelText')}</p>
          <div className="h-2 rounded-full bg-[#F5F5F7] mt-2 overflow-hidden">
            <div className="h-full bg-[#FF1F8E]" style={{ width: '62%' }} />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-[#E5E5E5] bg-white p-4 space-y-3">
        <p className="text-lg font-semibold text-[#111111]">{t('mypage.today')}</p>
        <div className="grid grid-cols-2 gap-2">
          {[t('mypage.sessions'), t('mypage.totalTime'), t('mypage.avgScore'), t('mypage.streak')].map((label, idx) => (
            <div key={label} className="rounded-lg border border-[#E5E5E5] bg-[#F5F5F7] p-3">
              <p className="text-[11px] text-[#888888]">{label}</p>
              <p className="text-xl font-black text-[#111111]">{[3, '47m', 84, '9d'][idx]}</p>
            </div>
          ))}
        </div>
        <button type="button" className="rounded-lg bg-[#FF1F8E] text-white px-4 py-2 text-sm font-semibold flex items-center gap-1" onClick={() => onNavigate(lastTrainingView)}>
          {t('mypage.startPractice')} <ChevronRight size={14} />
        </button>
      </section>

      <section className="rounded-xl border border-[#E5E5E5] bg-white p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-lg font-semibold text-[#111111]">{t('mypage.growth')}</p>
          <div className="flex gap-2">
            {tracks.map((track) => (
              <button
                key={track}
                type="button"
                onClick={() => setTrackFilter(track)}
                className={`text-xs rounded-full px-2 py-1 border ${trackFilter === track ? 'border-[#FF1F8E] text-[#FF1F8E]' : 'border-[#E5E5E5] text-[#888888]'}`}
              >
                {t(`settings.track.${track}`)}
              </button>
            ))}
          </div>
        </div>
        <GrowthGraph data={graphData} />
      </section>

      <section className="rounded-xl border border-[#E5E5E5] bg-white p-4 space-y-2">
        <p className="text-lg font-semibold text-[#111111]">{t('mypage.feedbackHistory')}</p>
        {feedbackItems.slice(0, feedbackPage * 10).map((item) => (
          <button key={item.id} type="button" className="w-full rounded-lg border border-[#E5E5E5] p-3 text-left flex items-center justify-between">
            <div>
              <p className="text-xs text-[#888888]">{item.date}</p>
              <p className="text-sm text-[#111111]">{item.summary}</p>
            </div>
            <div className="text-right">
              <span className="text-xs px-2 py-1 rounded-full bg-[#FF1F8E18] text-[#FF1F8E]">{item.score}</span>
              <ChevronRight size={14} className="mt-1 ml-auto text-[#888888]" />
            </div>
          </button>
        ))}
        {feedbackPage * 10 < feedbackItems.length ? (
          <button type="button" className="text-sm text-[#FF1F8E] font-semibold" onClick={() => setFeedbackPage((p) => p + 1)}>
            {t('common.more')}
          </button>
        ) : null}
      </section>

      <section className="rounded-xl border border-[#E5E5E5] bg-white p-4 space-y-2">
        <p className="text-lg font-semibold text-[#111111]">{t('mypage.savedVideos')}</p>
        <SavedVideosGrid
          videos={videos}
          onOpen={(video) => setVideoModal(video)}
          onMenu={() => window.alert(t('mypage.videoMenu'))}
        />
      </section>

      <section className="rounded-xl border border-[#E5E5E5] bg-white p-4 space-y-2">
        <p className="text-lg font-semibold text-[#111111]">{t('mypage.goalProgress')}</p>
        {goals.map((goal) => (
          <GoalProgressCard key={goal.id} goal={goal} />
        ))}
        <button type="button" className="rounded-lg border border-dashed border-[#E5E5E5] py-2 text-sm text-[#888888] w-full">
          + {t('mypage.addGoal')}
        </button>
      </section>

      {videoModal ? (
        <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center p-6" onClick={() => setVideoModal(null)}>
          <div className="max-w-2xl w-full rounded-2xl bg-white p-4" onClick={(e) => e.stopPropagation()}>
            <p className="text-sm font-semibold mb-2">{videoModal.title}</p>
            <div className="h-80 bg-black rounded-xl grid place-items-center text-white">
              <Play />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
