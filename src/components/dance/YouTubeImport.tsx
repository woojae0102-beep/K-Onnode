// @ts-nocheck
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

function toEmbed(url) {
  if (!url) return '';
  const match = url.match(/(?:v=|youtu\.be\/)([\w-]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : '';
}

export default function YouTubeImport({ onLoad }) {
  const { t } = useTranslation();
  const [url, setUrl] = useState('');
  return (
    <div className="flex gap-2">
      <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder={t('dance.youtubePlaceholder')} className="flex-1 rounded-xl border border-[#E5E5E5] px-3 py-2 text-sm" />
      <button type="button" onClick={() => onLoad(toEmbed(url))} className="rounded-xl px-4 py-2 bg-[#111111] text-white text-sm font-semibold">
        {t('dance.load')}
      </button>
    </div>
  );
}
