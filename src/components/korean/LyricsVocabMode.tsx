// @ts-nocheck
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function LyricsVocabMode() {
  const { t } = useTranslation();
  return (
    <div className="rounded-xl border border-[#E5E5E5] bg-white p-4 space-y-3">
      <p className="text-sm font-semibold text-[#111111]">{t('korean.vocabTitle')}</p>
      <div className="grid grid-cols-2 gap-2">
        {[
          { word: '무대', meaning: 'stage' },
          { word: '연습', meaning: 'practice' },
          { word: '발음', meaning: 'pronunciation' },
          { word: '리듬', meaning: 'rhythm' },
        ].map((item) => (
          <div key={item.word} className="rounded-lg border border-[#E5E5E5] p-3 text-sm">
            <p className="font-semibold text-[#111111]">{item.word}</p>
            <p className="text-[#888888]">{item.meaning}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
