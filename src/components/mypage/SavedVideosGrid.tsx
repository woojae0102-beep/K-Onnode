// @ts-nocheck
import React from 'react';
import { Music, Mic, Globe } from 'lucide-react';

const iconMap = { dance: Music, vocal: Mic, korean: Globe };

export default function SavedVideosGrid({ videos, onOpen, onMenu }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {videos.map((video) => {
        const Icon = iconMap[video.track] || Music;
        return (
          <button
            key={video.id}
            type="button"
            className="relative rounded-xl overflow-hidden border border-[#E5E5E5]"
            onClick={() => onOpen(video)}
            onContextMenu={(e) => {
              e.preventDefault();
              onMenu(video);
            }}
          >
            <img src={video.thumbnail} alt={video.title} className="w-full h-28 object-cover" />
            <span className="absolute top-2 right-2 text-[10px] px-2 py-1 rounded-full bg-black/70 text-white">{video.duration}</span>
            <span className="absolute left-2 bottom-2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center">
              <Icon size={14} />
            </span>
          </button>
        );
      })}
    </div>
  );
}
