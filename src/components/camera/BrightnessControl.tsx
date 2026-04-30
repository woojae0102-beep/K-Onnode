// 카메라 명암(밝기/대비/채도) 조절 패널
// useCameraWithFilter 훅의 filter / setFilter / resetFilter 와 연결해서 사용
import React from 'react';
import type { CameraFilter } from '../../hooks/useCameraWithFilter';

interface BrightnessControlProps {
  filter: CameraFilter;
  onChange: (next: CameraFilter) => void;
  onReset: () => void;
  visible: boolean;
}

interface SliderConfig {
  key: keyof CameraFilter;
  label: string;
  min: number;
  max: number;
  step: number;
  leftHint: string;
  rightHint: string;
}

const SLIDERS: SliderConfig[] = [
  { key: 'brightness', label: '밝기', min: 0.2, max: 2.5, step: 0.05, leftHint: '어둡', rightHint: '밝음' },
  { key: 'contrast', label: '대비', min: 0.2, max: 2.5, step: 0.05, leftHint: '낮음', rightHint: '높음' },
  { key: 'saturation', label: '채도', min: 0.0, max: 2.5, step: 0.05, leftHint: '흑백', rightHint: '선명' },
];

const PRESETS: Array<{ label: string; values: CameraFilter }> = [
  { label: '기본', values: { brightness: 1.0, contrast: 1.0, saturation: 1.0 } },
  { label: '밝게', values: { brightness: 1.4, contrast: 1.1, saturation: 1.1 } },
  { label: '드라마틱', values: { brightness: 0.9, contrast: 1.6, saturation: 1.3 } },
  { label: '흑백', values: { brightness: 1.0, contrast: 1.2, saturation: 0.0 } },
  { label: '따뜻하게', values: { brightness: 1.1, contrast: 1.0, saturation: 1.4 } },
];

export default function BrightnessControl({ filter, onChange, onReset, visible }: BrightnessControlProps) {
  if (!visible) return null;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 80,
        left: 8,
        right: 8,
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        borderRadius: 12,
        padding: 14,
        zIndex: 30,
        color: '#fff',
        boxShadow: '0 8px 28px rgba(0,0,0,0.45)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={{ fontSize: 13, fontWeight: 600 }}>카메라 조절</span>
        <button
          type="button"
          onClick={onReset}
          style={{
            color: '#FF1F8E',
            background: 'transparent',
            border: 'none',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
            padding: '4px 6px',
          }}
        >
          초기화
        </button>
      </div>

      {SLIDERS.map((slider) => {
        const value = filter[slider.key];
        const ratio = (value - slider.min) / (slider.max - slider.min);
        return (
          <div key={slider.key} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ color: '#ccc', fontSize: 12 }}>{slider.label}</span>
              <span style={{ color: '#fff', fontSize: 12, fontWeight: 600 }}>{value.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 10, color: '#666', minWidth: 20 }}>{slider.leftHint}</span>
              <input
                type="range"
                min={slider.min}
                max={slider.max}
                step={slider.step}
                value={value}
                onChange={(e) =>
                  onChange({
                    ...filter,
                    [slider.key]: parseFloat(e.target.value),
                  })
                }
                style={{
                  flex: 1,
                  accentColor: '#FF1F8E',
                  height: 4,
                  cursor: 'pointer',
                }}
              />
              <span style={{ fontSize: 10, color: '#ccc', minWidth: 24, textAlign: 'right' }}>{slider.rightHint}</span>
            </div>
            <div
              style={{
                marginTop: 4,
                height: 2,
                background: '#333',
                borderRadius: 1,
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: `${Math.max(0, Math.min(100, ratio * 100))}%`,
                  height: '100%',
                  background: '#FF1F8E',
                  borderRadius: 1,
                }}
              />
            </div>
          </div>
        );
      })}

      <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
        {PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => onChange(preset.values)}
            style={{
              flex: '1 1 60px',
              padding: '6px 4px',
              background: '#222',
              border: '1px solid #444',
              borderRadius: 6,
              color: '#ddd',
              fontSize: 11,
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
}
