// @ts-nocheck
import { useEffect, useState } from 'react';

export function usePoseDetection(active = false) {
  const [score, setScore] = useState(78);
  const [issue, setIssue] = useState('왼팔 각도 -15도 조정 필요');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!active) return undefined;
    const issues = ['왼팔 각도 -15도 조정 필요', '어깨 라인을 조금 더 수평으로 유지', '박자 시작 타이밍을 반박 빠르게', '무릎 굽힘을 조금 더 깊게'];
    const timer = setInterval(() => {
      setScore((prev) => {
        const next = Math.max(45, Math.min(99, prev + (Math.random() - 0.45) * 7));
        setHistory((h) => [...h.slice(-40), Math.round(next)]);
        return next;
      });
      setIssue(issues[Math.floor(Math.random() * issues.length)]);
    }, 900);
    return () => clearInterval(timer);
  }, [active]);

  return {
    score: Math.round(score),
    issue,
    history,
    summary: {
      totalScore: Math.round(score),
      bestMoment: '00:43',
      needs: '어깨 라인 · 코어 고정',
    },
  };
}
