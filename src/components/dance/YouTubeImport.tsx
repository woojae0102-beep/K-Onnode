// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

function toEmbed(url) {
  if (!url) return '';
  const idMatch = url.match(/(?:v=|youtu\.be\/|\/embed\/|shorts\/)([\w-]{11})/);
  if (!idMatch) return '';
  const videoId = idMatch[1];

  let listId = '';
  try {
    const parsed = new URL(url);
    listId = parsed.searchParams.get('list') || '';
  } catch {
    const listMatch = url.match(/[?&]list=([\w-]+)/);
    listId = listMatch ? listMatch[1] : '';
  }

  const base = `https://www.youtube.com/embed/${videoId}`;
  return listId ? `${base}?list=${listId}` : base;
}

export default function YouTubeImport({ onLoad, initialUrl = '' }) {
  const { t } = useTranslation();
  const [url, setUrl] = useState(initialUrl);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialUrl) setUrl(initialUrl);
  }, [initialUrl]);

  const handleLoad = () => {
    const embed = toEmbed(url);
    if (!embed) {
      setError('올바른 유튜브 URL을 입력해주세요.');
      return;
    }
    setError('');
    onLoad(embed);
  };

  return (
    <div className="space-y-1">
      <div className="flex gap-2">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleLoad();
          }}
          placeholder={t('dance.youtubePlaceholder')}
          className="flex-1 rounded-xl border border-[#E5E5E5] px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={handleLoad}
          className="rounded-xl px-4 py-2 bg-[#111111] text-white text-sm font-semibold"
        >
          {t('dance.load')}
        </button>
      </div>
      {error ? <p className="text-xs text-rose-500 px-1">{error}</p> : null}
    </div>
  );
}
