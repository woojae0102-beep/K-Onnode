// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const tabs = ['all', 'dance', 'vocal', 'korean', 'challenge'];

export default function DiscoverView({ onNavigate }) {
  const { t } = useTranslation();
  const [tab, setTab] = useState('all');
  const [heroIdx, setHeroIdx] = useState(0);
  const heroes = [0, 1, 2];

  useEffect(() => {
    const timer = setInterval(() => setHeroIdx((v) => (v + 1) % heroes.length), 4000);
    return () => clearInterval(timer);
  }, [heroes.length]);

  return (
    <div className="h-full overflow-y-auto p-6 bg-[#F5F5F7] space-y-6">
      <div className="sticky top-0 z-10 bg-[#F5F5F7] py-2">
        <div className="flex gap-4 border-b border-[#E5E5E5]">
          {tabs.map((item) => (
            <button key={item} type="button" className={`pb-2 text-sm ${tab === item ? 'text-[#111111] border-b-2 border-[#FF1F8E]' : 'text-[#888888]'}`} onClick={() => setTab(item)}>
              {t(`discover.tabs.${item}`)}
            </button>
          ))}
        </div>
      </div>

      <section className="overflow-x-auto">
        <div className="flex gap-3">
          {heroes.map((item) => (
            <div key={item} className={`min-w-[320px] rounded-xl p-4 text-white ${heroIdx === item ? 'bg-[#FF1F8E]' : 'bg-[#111111]'}`}>
              <p className="text-lg font-bold">{t('discover.heroTitle')}</p>
              <button type="button" className="mt-3 rounded-lg bg-white/20 px-3 py-2 text-sm" onClick={() => onNavigate('aicoach')}>
                {t('discover.practiceNow')}
              </button>
            </div>
          ))}
        </div>
      </section>

      <Row title={t('discover.popularDance')} ctaLabel={t('discover.startPractice')} onAction={() => onNavigate('dance')} itemPrefix={t('discover.rowItem')} />
      <Row title={t('discover.popularVocal')} ctaLabel={t('discover.singNow')} onAction={() => onNavigate('vocal')} itemPrefix={t('discover.rowItem')} />
      <List title={t('discover.koreanContent')} ctaLabel={t('discover.startPractice')} onAction={() => onNavigate('korean')} itemPrefix={t('discover.listItem')} />
      <Grid title={t('discover.challenges')} buttonLabel={t('discover.join')} />
      <List title={t('discover.trendingVideos')} ctaLabel={t('discover.openPlayer')} onAction={() => {}} itemPrefix={t('discover.listItem')} />
    </div>
  );
}

function Row({ title, ctaLabel, onAction, itemPrefix }) {
  return (
    <section className="space-y-2">
      <p className="text-lg font-semibold text-[#111111]">{title}</p>
      <div className="flex gap-3 overflow-x-auto">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="min-w-[220px] rounded-xl border border-[#E5E5E5] bg-white p-3">
            <div className="h-24 bg-[#F5F5F7] rounded-lg" />
            <p className="mt-2 text-sm font-semibold text-[#111111]">{itemPrefix} {idx + 1}</p>
            <button type="button" className="mt-2 rounded-lg border border-[#E5E5E5] px-3 py-1 text-xs" onClick={onAction}>
              {ctaLabel}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

function List({ title, ctaLabel, onAction, itemPrefix }) {
  return (
    <section className="space-y-2">
      <p className="text-lg font-semibold text-[#111111]">{title}</p>
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, idx) => (
          <button key={idx} type="button" className="w-full rounded-xl border border-[#E5E5E5] bg-white p-3 flex items-center justify-between text-left" onClick={onAction}>
            <span className="text-sm text-[#111111]">{itemPrefix} {idx + 1}</span>
            <span className="text-xs text-[#888888]">{ctaLabel}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function Grid({ title, buttonLabel }) {
  return (
    <section className="space-y-2">
      <p className="text-lg font-semibold text-[#111111]">{title}</p>
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="rounded-xl border border-[#E5E5E5] bg-white p-3">
            <div className="h-24 bg-[#F5F5F7] rounded-lg" />
            <button type="button" className="mt-3 w-full rounded-lg bg-[#FF1F8E] text-white py-2 text-xs">
              {buttonLabel}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
