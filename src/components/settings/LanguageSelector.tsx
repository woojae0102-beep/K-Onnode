import React from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const options = [
  { value: 'ko', label: '한국어', flag: '🇰🇷', enabled: true },
  { value: 'en', label: 'English', flag: '🇺🇸', enabled: true },
  { value: 'ja', label: '日本語', flag: '🇯🇵', enabled: true },
  { value: 'zh', label: '中文', flag: '🇨🇳', enabled: false },
  { value: 'es', label: 'Español', flag: '🇪🇸', enabled: false },
  { value: 'fr', label: 'Français', flag: '🇫🇷', enabled: false },
  { value: 'vi', label: 'Tiếng Việt', flag: '🇻🇳', enabled: false },
  { value: 'th', label: 'ไทย', flag: '🇹🇭', enabled: false },
];

export default function LanguageSelector({ value, onChange, open, onOpen, onClose }) {
  const { t } = useTranslation();
  const current = options.find((item) => item.value === value) || options[0];

  return (
    <>
      <button
        type="button"
        onClick={onOpen}
        className="w-full rounded-xl border border-[#E5E5E5] px-3 py-2 bg-white text-sm font-semibold flex items-center justify-between"
      >
        <span>
          {current.flag} {current.label}
        </span>
        <ChevronDown size={14} className="text-slate-500" />
      </button>

      {open ? (
        <div className="fixed inset-0 z-40 bg-black/30 flex items-end" onClick={onClose}>
          <div className="w-full rounded-t-3xl bg-white p-5 space-y-2 max-h-[70vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <p className="text-[11px] uppercase tracking-[0.08em] text-[#AAAAAA] font-medium">{t('settings.language.title')}</p>
            {options.map((option) => {
              const active = value === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    if (!option.enabled) return;
                    onChange(option.value);
                    onClose();
                  }}
                  className={`w-full rounded-xl border px-3 py-3 text-sm flex items-center justify-between ${
                    active ? 'border-[#FF1F8E] bg-pink-50 text-[#FF1F8E]' : 'border-[#E5E5E5] text-[#111111]'
                  } ${option.enabled ? '' : 'opacity-60 cursor-not-allowed'}`}
                >
                  <span>
                    {option.flag} {option.label}
                  </span>
                  <span className="flex items-center gap-2">
                    {!option.enabled ? <span className="text-[10px] px-2 py-1 rounded-full bg-slate-100 text-slate-500">{t('settings.language.comingSoon')}</span> : null}
                    {active ? <Check size={14} /> : null}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </>
  );
}
