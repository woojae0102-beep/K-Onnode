// @ts-nocheck
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function NewChatModal({ open, onClose, onCreate }) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [type, setType] = useState('dm');
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-5 w-full max-w-sm space-y-4" onClick={(e) => e.stopPropagation()}>
        <p className="font-semibold text-[#111111]">{t('community.newChat')}</p>
        <div className="grid grid-cols-2 gap-2">
          {['dm', 'group'].map((item) => (
            <button key={item} type="button" className={`rounded-lg border py-2 text-sm ${type === item ? 'border-[#FF1F8E] text-[#FF1F8E]' : 'border-[#E5E5E5] text-[#888888]'}`} onClick={() => setType(item)}>
              {t(`community.tabs.${item}`)}
            </button>
          ))}
        </div>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t('community.newChatPlaceholder')} className="w-full rounded-xl border border-[#E5E5E5] px-3 py-2 text-sm" />
        <button
          type="button"
          className="w-full rounded-xl bg-[#FF1F8E] text-white py-2 text-sm font-semibold"
          onClick={() => {
            if (!name.trim()) return;
            onCreate(name.trim(), type);
            setName('');
            setType('dm');
            onClose();
          }}
        >
          {t('community.create')}
        </button>
      </div>
    </div>
  );
}
