// @ts-nocheck
import React from 'react';
import { Bell, Bot, Globe, MessageCircle, Mic, Music, Settings, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const topItems = [
  { key: 'mypage', icon: User },
  { key: 'discover', icon: Globe },
  { key: 'community', icon: MessageCircle },
];

const trainingItems = [
  { key: 'dance', icon: Music },
  { key: 'vocal', icon: Mic },
  { key: 'korean', icon: Globe },
  { key: 'aicoach', icon: Bot },
];
const mobileItems = [
  { key: 'aicoach', icon: Bot },
  { key: 'dance', icon: Music },
  { key: 'vocal', icon: Mic },
  { key: 'korean', icon: Globe },
  { key: 'community', icon: MessageCircle },
];

function SidebarIcon({ item, activeView, onNavigate, coachActiveMode }) {
  const Icon = item.icon;
  const isTrainingItem = ['dance', 'vocal', 'korean'].includes(item.key);
  const active = activeView === item.key || (activeView === 'aicoach' && isTrainingItem && coachActiveMode === item.key);
  return (
    <button type="button" onClick={() => onNavigate(item.key)} className="relative group cursor-pointer flex justify-center w-full">
      <div className={`p-4 rounded-2xl transition-all duration-300 ${active ? 'bg-[#FF1F8E18] text-[#FF1F8E] shadow-sm' : 'text-slate-400 hover:text-slate-900'}`}>
        <Icon size={24} />
      </div>
      {active ? <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-[#FF1F8E] rounded-r-full" /> : null}
    </button>
  );
}

export default function Sidebar({ activeView, onNavigate, coachActiveMode = 'chat' }) {
  const { t } = useTranslation();
  return (
    <>
      <aside className="hidden w-[72px] bg-[#ebebed] md:flex flex-col items-center py-6 gap-6 border-r border-[#E5E5E5] shrink-0">
        <div className="w-10 h-10 bg-[#FF1F8E] rounded-xl flex items-center justify-center font-black italic shadow-lg text-white mb-2">O</div>

        {topItems.map((item) => (
          <SidebarIcon key={item.key} item={item} activeView={activeView} onNavigate={onNavigate} coachActiveMode={coachActiveMode} label={t(`nav.${item.key}`)} />
        ))}

        <div className="h-px w-8 bg-slate-300 mx-auto" />

        {trainingItems.map((item) => (
          <SidebarIcon key={item.key} item={item} activeView={activeView} onNavigate={onNavigate} coachActiveMode={coachActiveMode} label={t(`nav.${item.key}`)} />
        ))}

        <div className="h-px w-8 bg-slate-300 mx-auto" />
        <SidebarIcon item={{ key: 'notifications', icon: Bell }} activeView={activeView} onNavigate={onNavigate} coachActiveMode={coachActiveMode} label={t('nav.notifications')} />

        <div className="mt-auto w-full flex flex-col items-center">
          <SidebarIcon item={{ key: 'settings', icon: Settings }} activeView={activeView} onNavigate={onNavigate} coachActiveMode={coachActiveMode} label={t('nav.settings')} />
        </div>
      </aside>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-[#E5E5E5]">
        <div className="grid grid-cols-5 px-1 py-1">
          {mobileItems.map((item) => {
            const Icon = item.icon;
            const isTrainingItem = ['dance', 'vocal', 'korean'].includes(item.key);
            const active = activeView === item.key || (activeView === 'aicoach' && isTrainingItem && coachActiveMode === item.key);
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onNavigate(item.key)}
                className={`flex flex-col items-center justify-center gap-1 rounded-xl py-2 text-[10px] ${
                  active ? 'text-[#FF1F8E] bg-[#FF1F8E18]' : 'text-slate-500'
                }`}
              >
                <Icon size={18} />
                <span className="leading-none">{t(`nav.${item.key}`)}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
