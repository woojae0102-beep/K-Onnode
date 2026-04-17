// @ts-nocheck
import React, { useState } from 'react';
import { ActiveViewProvider, useActiveView } from '../hooks/useActiveView';
import Sidebar from './Sidebar';
import AICoachView from '../views/AICoachView';
import CommunityView from '../views/CommunityView';
import DanceTrainingView from '../views/DanceTrainingView';
import DiscoverView from '../views/DiscoverView';
import KoreanAIView from '../views/KoreanAIView';
import MyPageView from '../views/MyPageView';
import NotificationsView from '../views/NotificationsView';
import SettingsView from '../views/SettingsView';
import VocalTrainingView from '../views/VocalTrainingView';

function LayoutContent(props) {
  const { activeView, setActiveView, lastTrainingView } = useActiveView();
  const [coachActiveMode, setCoachActiveMode] = useState('chat');
  const handleCoachModeChange = (nextMode) => {
    setCoachActiveMode(nextMode);
    if (['dance', 'vocal', 'korean'].includes(nextMode)) {
      setActiveView(nextMode);
    }
  };

  const renderMainContent = () => {
    switch (activeView) {
      case 'mypage':
        return <MyPageView onNavigate={setActiveView} lastTrainingView={lastTrainingView} />;
      case 'discover':
        return <DiscoverView onNavigate={setActiveView} />;
      case 'community':
        return <CommunityView onNavigate={setActiveView} />;
      case 'dance':
        return <DanceTrainingView onNavigate={setActiveView} />;
      case 'vocal':
        return <VocalTrainingView onNavigate={setActiveView} />;
      case 'korean':
        return <KoreanAIView onNavigate={setActiveView} />;
      case 'aicoach':
        return <AICoachView onCoachModeChange={handleCoachModeChange} />;
      case 'notifications':
        return <NotificationsView onNavigate={setActiveView} />;
      case 'settings':
        return <SettingsView user={props.user} db={props.db} appId={props.appId} sessionData={props.sessionData} />;
      default:
        return <AICoachView onCoachModeChange={handleCoachModeChange} />;
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white md:h-screen md:flex-row md:overflow-hidden">
      <Sidebar activeView={activeView} onNavigate={setActiveView} coachActiveMode={coachActiveMode} />
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">{renderMainContent()}</main>
    </div>
  );
}

export default function Layout(props) {
  return (
    <ActiveViewProvider>
      <LayoutContent {...props} />
    </ActiveViewProvider>
  );
}
