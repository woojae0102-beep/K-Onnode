// @ts-nocheck
import React from 'react';
import { useTranslation } from 'react-i18next';

const labelMap = ['beginner', 'elementary', 'intermediate', 'advanced', 'pro'];

export default function DifficultySlider({ value, onChange }) {
  const { t } = useTranslation();
  return (
    <div className="space-y-1">
      <p className="text-xs text-[#888888]">{t('dance.difficulty')}</p>
      <input type="range" min={1} max={5} value={value} onChange={(e) => onChange(Number(e.target.value))} />
      <p className="text-xs text-[#111111]">{t(`dance.levels.${labelMap[value - 1]}`)}</p>
    </div>
  );
}
