// @ts-nocheck
import { useEffect, useMemo, useState } from 'react';

export function useAudioAnalysis(active = false) {
  const [pitchSeries, setPitchSeries] = useState([]);
  const [pitchScore, setPitchScore] = useState(72);
  const [rhythmScore, setRhythmScore] = useState(69);
  const [liveScore, setLiveScore] = useState(70);

  useEffect(() => {
    if (!active) return undefined;
    const timer = setInterval(() => {
      const hz = 200 + Math.random() * 400;
      setPitchSeries((prev) => [...prev.slice(-39), { idx: prev.length + 1, hz }]);
      setPitchScore((prev) => Math.max(50, Math.min(100, prev + (Math.random() - 0.4) * 6)));
      setRhythmScore((prev) => Math.max(50, Math.min(100, prev + (Math.random() - 0.45) * 5)));
      setLiveScore((prev) => Math.max(55, Math.min(100, prev + (Math.random() - 0.4) * 4)));
    }, 600);
    return () => clearInterval(timer);
  }, [active]);

  const summary = useMemo(
    () => ({
      total: Math.round((pitchScore + rhythmScore + liveScore) / 3),
      pitch: Math.round(pitchScore),
      rhythm: Math.round(rhythmScore),
      voice: Math.round((pitchScore + 8 + Math.random() * 4) / 1),
      emotion: Math.round((rhythmScore + 10 + Math.random() * 4) / 1),
    }),
    [pitchScore, rhythmScore, liveScore]
  );

  return { pitchSeries, pitchScore: Math.round(pitchScore), rhythmScore: Math.round(rhythmScore), liveScore: Math.round(liveScore), summary };
}
