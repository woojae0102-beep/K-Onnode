import React from 'react';
import { Check, ChevronRight, Music2, Play, Twitter, Video } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const platformStyle = {
  tiktok: {
    icon: Music2,
    bg: '#010101',
  },
  instagram: {
    icon: Video,
    gradient: 'linear-gradient(135deg, #E1306C 0%, #833AB4 100%)',
  },
  youtube: {
    icon: Play,
    bg: '#FF0000',
  },
  twitter: {
    icon: Twitter,
    bg: '#000000',
  },
};

export default function SNSConnectItem({ platform, username, connected, loading, onConnect, onDisconnect }) {
  const { t } = useTranslation();
  const style = platformStyle[platform] || platformStyle.twitter;
  const Icon = style.icon;

  const iconStyle = style.gradient
    ? { backgroundImage: style.gradient }
    : {
        backgroundColor: style.bg,
      };

  return (
    <div className="rounded-2xl border border-[#E5E5E5] px-[14px] py-[13px] bg-[#F5F5F7] flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={iconStyle}>
          <Icon size={15} />
        </div>
        <div>
          <p className="text-[15px] font-medium text-[#111111]">{t(`settings.sns.platforms.${platform}`)}</p>
          <p className="text-xs text-[#888888]">{connected ? `@${username || 'connected'}` : t('settings.sns.disconnected')}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {connected ? <Check size={14} className="text-emerald-600" /> : null}
        <button
          type="button"
          disabled={loading}
          onClick={connected ? onDisconnect : onConnect}
          className={`text-xs font-semibold px-3 py-2 rounded-lg border ${
            connected ? 'border-rose-300 text-rose-600 bg-white' : 'border-slate-300 text-slate-700 bg-white'
          }`}
        >
          {connected ? t('settings.sns.disconnect') : t('settings.sns.connect')}
        </button>
        <ChevronRight size={14} className="text-[#CCCCCC]" />
      </div>
    </div>
  );
}
