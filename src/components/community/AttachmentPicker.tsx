// @ts-nocheck
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function AttachmentPicker({ open, onClose, onPick }) {
  const { t } = useTranslation();
  if (!open) return null;
  return (
    <div className="absolute bottom-16 left-0 z-20 bg-white border border-[#E5E5E5] rounded-xl p-2 shadow-xl w-44">
      {['image', 'video', 'camera'].map((type) => (
        <button
          key={type}
          type="button"
          className="w-full text-left text-sm px-3 py-2 rounded-lg hover:bg-[#F5F5F7]"
          onClick={() => {
            onPick(type === 'camera' ? 'image' : type);
            onClose();
          }}
        >
          {t(`community.attach.${type}`)}
        </button>
      ))}
    </div>
  );
}
