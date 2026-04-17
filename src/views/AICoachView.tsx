// @ts-nocheck
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Send, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import DanceTrainingView from './DanceTrainingView';
import VocalTrainingView from './VocalTrainingView';
import PronunciationMode from '../components/korean/PronunciationMode';
import FollowAlongMode from '../components/korean/FollowAlongMode';
import CorrectionMode from '../components/korean/CorrectionMode';
import LyricsVocabMode from '../components/korean/LyricsVocabMode';

const QUICK_COMMANDS = [
  { id: 'dance', label: '/댄스' },
  { id: 'vocal', label: '/보컬' },
  { id: 'korean-pronunciation', label: '/한국어 발음연습' },
  { id: 'korean-follow', label: '/한국어 따라말하기' },
  { id: 'korean-correction', label: '/한국어 ai교정' },
  { id: 'korean-lyrics', label: '/한국어 가사학습' },
  { id: 'report', label: '/오늘 리포트 보여줘' },
  { id: 'trend', label: '/최근 추이 보여줘' },
  { id: 'growth', label: '/성장 리포트 보여줘' },
];

const MODE_REPLY = {
  dance: '댄스 연습을 실행합니다. 카메라를 켜고 자세/동작 피드백을 확인해보세요.',
  vocal: '보컬 연습을 실행합니다. 마이크를 켜고 실시간 음정 피드백을 확인해보세요.',
  'korean-pronunciation': '한국어 발음 연습 모드를 실행합니다. 문장을 말하면 실시간 발음 피드백이 나옵니다.',
  'korean-follow': '문장 따라 말하기 모드를 실행합니다. 라인별로 녹음해서 점수를 확인해보세요.',
  'korean-correction': 'AI 발음 교정 모드를 실행합니다. 말한 문장을 기준으로 교정 피드백을 제공합니다.',
  'korean-lyrics': '가사 기반 학습 모드를 실행합니다. 어휘 인식과 문장 일치 점수를 실시간으로 확인하세요.',
  none: '채팅 모드로 복귀했습니다. "댄스", "보컬", "한국어 발음연습"처럼 입력하면 기능을 다시 열 수 있어요.',
};
const STORAGE_KEY = 'onnode_growth_sessions_v1';

function createMessage(role, text, extra = {}) {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    role,
    text,
    timestamp: Date.now(),
    ...extra,
  };
}

function detectReportTarget(text) {
  if (text.includes('댄스') || text.includes('춤')) return 'dance';
  if (text.includes('보컬') || text.includes('노래') || text.includes('음정')) return 'vocal';
  if (text.includes('한국어') || text.includes('발음') || text.includes('가사')) return 'korean';
  return 'all';
}

function getLatestKoreanReport(koreanReports) {
  const latest = Object.values(koreanReports || {})
    .filter((item) => item?.updatedAt)
    .sort((a, b) => Number(b.updatedAt || 0) - Number(a.updatedAt || 0))[0];
  return latest || null;
}

function extractScoreFromPayload(domain, payload) {
  if (!payload) return null;
  if (domain === 'dance') return Number(payload.score ?? payload.summary?.totalScore ?? 0);
  if (domain === 'vocal') return Number(payload.liveScore ?? payload.summary?.total ?? 0);
  if (domain.startsWith('korean-')) return Number(payload.metrics?.overall ?? payload.overall ?? 0);
  return null;
}

function summarizeTrend(name, historyItems) {
  const valid = (historyItems || []).filter((item) => Number.isFinite(item?.score));
  if (valid.length < 2) return `${name}: 최근 추이 데이터를 더 수집하면 변화량을 보여드릴 수 있어요.`;
  const first = valid[0];
  const latest = valid[valid.length - 1];
  const avg = Math.round(valid.reduce((acc, cur) => acc + cur.score, 0) / valid.length);
  const min = Math.min(...valid.map((v) => v.score));
  const max = Math.max(...valid.map((v) => v.score));
  const delta = Math.round(latest.score - first.score);
  const direction = delta >= 0 ? '상승' : '하락';
  return `${name}: 최근 ${valid.length}회 ${first.score} -> ${latest.score} (${direction} ${Math.abs(delta)}) · 평균 ${avg} · 최고 ${max} · 최저 ${min}`;
}

function dayKey(ts) {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function round1(num) {
  return Math.round(num * 10) / 10;
}

function average(list) {
  if (!list.length) return null;
  return list.reduce((acc, n) => acc + n, 0) / list.length;
}

function loadPersistedSessions() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => Number.isFinite(item?.at) && Number.isFinite(item?.score) && item?.domain);
  } catch {
    return [];
  }
}

function targetScoreByDomain(target) {
  if (target === 'dance') return 80;
  if (target === 'vocal') return 80;
  if (target === 'korean') return 78;
  return 80;
}

function buildRecommendedRoutines(target, latestReports, growthSummary) {
  const defaultFeatureForTarget = target === 'dance' ? 'dance' : target === 'vocal' ? 'vocal' : 'korean-pronunciation';
  const routines = [];
  const dance = latestReports?.dance;
  const vocal = latestReports?.vocal;
  const korean = getLatestKoreanReport(latestReports?.korean || {});

  if (target === 'all' || target === 'dance') {
    const needs = dance?.summary?.needs || '';
    if (needs.includes('팔 각도')) routines.push({ label: '댄스 8분: 팔 라인 고정 드릴(좌/우 각 2분) + 전신 루틴 4분', feature: 'dance' });
    else if (needs.includes('좌우 대칭')) routines.push({ label: '댄스 8분: 거울 모드에서 좌우 대칭 체크 루틴(4세트)', feature: 'dance' });
    else routines.push({ label: '댄스 8분: 현재 안무 2구간 반복 + 동작 크기 10% 확장', feature: 'dance' });
  }
  if (target === 'all' || target === 'vocal') {
    const fb = String(vocal?.pitchFeedback || '');
    if (fb.includes('높')) routines.push({ label: '보컬 7분: 목표음보다 반음 낮게 시작 후 슬라이드 업(롱톤 6회)', feature: 'vocal' });
    else if (fb.includes('낮')) routines.push({ label: '보컬 7분: 복식호흡 1분 + 목표음 직상행 롱톤 6회', feature: 'vocal' });
    else routines.push({ label: '보컬 7분: 목표 MIDI 고정 롱톤 4회 + 3음계 연결 4세트', feature: 'vocal' });
  }
  if (target === 'all' || target === 'korean') {
    const kScore = Number(korean?.metrics?.overall ?? korean?.overall ?? 0);
    if (kScore && kScore < 70) routines.push({ label: '한국어 8분: 기준 문장 4개를 2회씩 천천히 낭독(정확도 우선)', feature: 'korean-pronunciation' });
    else routines.push({ label: '한국어 8분: 문장 따라 말하기 4라인 + AI 교정 모드로 즉시 수정', feature: 'korean-follow' });
  }
  if ((growthSummary?.vsYesterday ?? 0) < 0) routines.push({ label: '회복 루틴 5분: 가장 점수 낮은 모드 1개만 집중해 짧게 재연습', feature: target === 'all' ? 'dance' : defaultFeatureForTarget });
  if ((growthSummary?.vsLastWeek ?? 0) >= 3) routines.push({ label: '상향 루틴 5분: 현재 난이도 유지 + 속도만 10% 상향', feature: target === 'all' ? 'vocal' : defaultFeatureForTarget });
  return routines.slice(0, 4);
}

function savePersistedSessions(sessions) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions.slice(-1000)));
  } catch {}
}

function buildGrowthSection(target, persistedSessions, latestReports) {
  if (!persistedSessions.length) {
    return {
      title: '성장 리포트',
      lines: ['누적된 연습 기록이 아직 없습니다. 오늘 2~3회 연습하면 성장 리포트가 생성됩니다.'],
      achievement: {
        targetScore: targetScoreByDomain(target),
        todayAchievementRate: null,
        weeklyGoalProgress: null,
      },
      routines: [{ label: '추천 루틴을 계산하려면 연습 기록을 먼저 2회 이상 쌓아주세요.', feature: 'none' }],
      summary: {
        todayAverage: null,
        yesterdayAverage: null,
        weeklyAverage: null,
        vsYesterday: null,
        vsLastWeek: null,
      },
    };
  }

  const now = Date.now();
  const today = dayKey(now);
  const yesterday = dayKey(now - 24 * 60 * 60 * 1000);
  const weekAgoTs = now - 7 * 24 * 60 * 60 * 1000;

  const scoped = persistedSessions.filter((item) => (target === 'all' ? true : item.domain === target || (target === 'korean' && item.domain === 'korean')));
  const todayScores = scoped.filter((item) => dayKey(item.at) === today).map((item) => item.score);
  const yesterdayScores = scoped.filter((item) => dayKey(item.at) === yesterday).map((item) => item.score);
  const weekScores = scoped.filter((item) => item.at >= weekAgoTs && dayKey(item.at) !== today).map((item) => item.score);

  const todayAvg = average(todayScores);
  const yesterdayAvg = average(yesterdayScores);
  const weekAvg = average(weekScores);

  const vsYesterday = todayAvg != null && yesterdayAvg != null ? todayAvg - yesterdayAvg : null;
  const vsLastWeek = todayAvg != null && weekAvg != null ? todayAvg - weekAvg : null;
  const targetScore = targetScoreByDomain(target);
  const todayAchievementRate = todayAvg != null ? round1((todayAvg / targetScore) * 100) : null;

  const recent7Days = Array.from({ length: 7 }).map((_, idx) => dayKey(now - idx * 24 * 60 * 60 * 1000));
  const dailyMap = scoped.reduce((acc, item) => {
    const key = dayKey(item.at);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item.score);
    return acc;
  }, {});
  const achievedDays = recent7Days.filter((key) => {
    const avg = average(dailyMap[key] || []);
    return avg != null && avg >= targetScore;
  }).length;
  const weeklyGoalProgress = round1((achievedDays / 7) * 100);

  const lines = [];
  lines.push(`오늘 평균 점수: ${todayAvg != null ? round1(todayAvg) : '데이터 없음'}`);
  lines.push(`어제 대비: ${vsYesterday == null ? '비교 데이터 부족' : `${vsYesterday >= 0 ? '+' : ''}${round1(vsYesterday)}점`}`);
  lines.push(`지난주 평균 대비: ${vsLastWeek == null ? '비교 데이터 부족' : `${vsLastWeek >= 0 ? '+' : ''}${round1(vsLastWeek)}점`}`);
  lines.push(`목표 달성률: ${todayAchievementRate == null ? '데이터 부족' : `${todayAchievementRate}%`} (목표 ${targetScore}점 기준)`);
  lines.push(`주간 달성 진행률: ${weeklyGoalProgress}% (최근 7일 중 ${achievedDays}일 목표 달성)`);

  const latestDance = latestReports?.dance;
  const latestVocal = latestReports?.vocal;
  const latestKorean = getLatestKoreanReport(latestReports?.korean || {});

  const improveTips = [];
  if (target === 'all' || target === 'dance') {
    const needs = latestDance?.summary?.needs || '';
    if (needs) improveTips.push(`댄스 개선 포인트: ${needs}`);
  }
  if (target === 'all' || target === 'vocal') {
    const pitchText = latestVocal?.pitchFeedback || '';
    if (pitchText) improveTips.push(`보컬 개선 포인트: ${pitchText}`);
  }
  if (target === 'all' || target === 'korean') {
    const kScore = Number(latestKorean?.metrics?.overall ?? latestKorean?.overall ?? 0);
    if (kScore > 0) improveTips.push(`한국어 개선 포인트: 현재 종합 ${kScore}점, 속도보다 정확도(문장 일치)를 우선 유지해보세요.`);
  }
  if (!improveTips.length) improveTips.push('개선 포인트를 계산하려면 각 모드에서 실시간 연습 데이터를 조금 더 수집해 주세요.');

  const strongLines = [];
  if (vsYesterday != null && vsYesterday >= 2) strongLines.push('어제 대비 점수 상승이 확인됩니다. 현재 연습 루틴을 유지하세요.');
  if (vsLastWeek != null && vsLastWeek >= 2) strongLines.push('지난주 평균보다 안정적으로 향상 중입니다.');
  if (!strongLines.length) strongLines.push('성장 폭이 아직 크지 않습니다. 짧게 자주 연습하는 방식(1회 5~10분)을 추천합니다.');
  const growthSummary = {
    todayAverage: todayAvg != null ? round1(todayAvg) : null,
    yesterdayAverage: yesterdayAvg != null ? round1(yesterdayAvg) : null,
    weeklyAverage: weekAvg != null ? round1(weekAvg) : null,
    vsYesterday: vsYesterday != null ? round1(vsYesterday) : null,
    vsLastWeek: vsLastWeek != null ? round1(vsLastWeek) : null,
  };
  const routines = buildRecommendedRoutines(target, latestReports, growthSummary);

  return {
    title: '성장 리포트',
    lines: [...lines, ...strongLines, ...improveTips],
    achievement: {
      targetScore,
      todayAchievementRate,
      weeklyGoalProgress,
    },
    routines,
    summary: growthSummary,
  };
}

function detectIntent(rawText) {
  const text = String(rawText || '').trim().toLowerCase();
  if (!text) return { type: 'chat' };

  const reportKeywords = ['리포트', '보고서', '결과', '요약', '피드백'];
  const trendKeywords = ['추이', '트렌드', '변화', '최근', '주간'];
  const growthKeywords = ['성장', '어제', '지난주', '개선', '좋아졌', '향상'];
  const jsonKeywords = ['json', '원본', '상세', '디테일', '데이터'];
  if (reportKeywords.some((k) => text.includes(k)) || trendKeywords.some((k) => text.includes(k)) || growthKeywords.some((k) => text.includes(k))) {
    return {
      type: 'report',
      target: detectReportTarget(text),
      includeTrend: true,
      includeGrowth: true,
      includeJson: jsonKeywords.some((k) => text.includes(k)) || text.includes('리포트'),
    };
  }

  if (['종료', '닫기', '그만', '홈으로', '/종료'].some((k) => text.includes(k))) return { type: 'feature', feature: 'none' };
  if (text.includes('/댄스') || text.includes('댄스') || text.includes('춤')) return { type: 'feature', feature: 'dance' };
  if (text.includes('/보컬') || text.includes('보컬') || text.includes('노래') || text.includes('음정')) return { type: 'feature', feature: 'vocal' };
  if (text.includes('가사') && text.includes('학습')) return { type: 'feature', feature: 'korean-lyrics' };
  if (text.includes('ai') && (text.includes('교정') || text.includes('발음교정'))) return { type: 'feature', feature: 'korean-correction' };
  if (text.includes('문장') && text.includes('따라')) return { type: 'feature', feature: 'korean-follow' };
  if (text.includes('발음') && text.includes('연습')) return { type: 'feature', feature: 'korean-pronunciation' };
  if (text.includes('/한국어') || text.includes('한국어')) return { type: 'feature', feature: 'korean-pronunciation' };
  return { type: 'chat' };
}

function buildReportCard(target, reports, reportHistory, persistedSessions, options = {}) {
  const includeTrend = options.includeTrend !== false;
  const includeJson = options.includeJson !== false;
  const includeGrowth = options.includeGrowth !== false;
  const lines = [];
  const trendLines = [];
  const jsonPayload = {
    generatedAt: new Date().toISOString(),
    target,
    latest: {},
    recentHistory: {},
  };

  if (target === 'all' || target === 'dance') {
    const dance = reports.dance;
    if (dance?.updatedAt) {
      lines.push(`댄스: 점수 ${dance.score ?? '—'} · 개선포인트 ${dance?.summary?.needs || '—'}`);
      jsonPayload.latest.dance = dance;
      jsonPayload.recentHistory.dance = (reportHistory.dance || []).slice(-8);
      if (includeTrend) trendLines.push(summarizeTrend('댄스', (reportHistory.dance || []).slice(-8)));
    }
  }
  if (target === 'all' || target === 'vocal') {
    const vocal = reports.vocal;
    if (vocal?.updatedAt) {
      const hz = vocal.currentHz ? `${Number(vocal.currentHz).toFixed(1)}Hz` : '미측정';
      lines.push(`보컬: 라이브 ${vocal.liveScore ?? '—'} · 현재음 ${vocal.currentNote || '-'} (${hz})`);
      jsonPayload.latest.vocal = vocal;
      jsonPayload.recentHistory.vocal = (reportHistory.vocal || []).slice(-8);
      if (includeTrend) trendLines.push(summarizeTrend('보컬', (reportHistory.vocal || []).slice(-8)));
    }
  }
  if (target === 'all' || target === 'korean') {
    const latest = getLatestKoreanReport(reports.korean);
    if (latest) {
      lines.push(`한국어: 종합 ${latest?.metrics?.overall ?? latest?.overall ?? '—'} · 인식문장 ${latest?.transcript || '없음'}`);
      jsonPayload.latest.korean = {
        latest,
        modes: reports.korean,
      };
      jsonPayload.recentHistory.korean = (reportHistory.korean || []).slice(-8);
      if (includeTrend) trendLines.push(summarizeTrend('한국어', (reportHistory.korean || []).slice(-8)));
    }
  }
  if (!lines.length) {
    return {
      title: '연습 리포트',
      body: ['아직 수집된 연습 데이터가 없습니다.', '먼저 댄스/보컬/한국어 모드를 실행하고 10초 이상 연습해 주세요.'],
      text: '아직 리포트 데이터가 없어요. 모드를 실행해서 먼저 연습 데이터를 쌓아주세요.',
      trend: [],
      growth: null,
      jsonText: '',
    };
  }
  const growth = includeGrowth ? buildGrowthSection(target, persistedSessions, reports) : null;
  return {
    title: target === 'all' ? '오늘의 통합 리포트' : `${target.toUpperCase()} 리포트`,
    body: lines,
    trend: includeTrend ? trendLines : [],
    growth,
    jsonText: includeJson
      ? JSON.stringify(
          {
            ...jsonPayload,
            growth: growth || {},
          },
          null,
          2
        )
      : '',
    text: `요청하신 ${target === 'all' ? '오늘의 통합' : target} 리포트에 성장 분석(어제/지난주 비교)까지 정리해드릴게요.`,
  };
}

function renderFeatureComponent(feature, onReportUpdate) {
  if (feature === 'dance') return <DanceTrainingView onNavigate={() => {}} onReportUpdate={(payload) => onReportUpdate('dance', payload)} />;
  if (feature === 'vocal') return <VocalTrainingView onNavigate={() => {}} onReportUpdate={(payload) => onReportUpdate('vocal', payload)} />;
  if (feature === 'korean-pronunciation') return <PronunciationMode onReportUpdate={(payload) => onReportUpdate('korean-pronunciation', payload)} />;
  if (feature === 'korean-follow') return <FollowAlongMode onReportUpdate={(payload) => onReportUpdate('korean-follow', payload)} />;
  if (feature === 'korean-correction') return <CorrectionMode onReportUpdate={(payload) => onReportUpdate('korean-correction', payload)} />;
  if (feature === 'korean-lyrics') return <LyricsVocabMode onReportUpdate={(payload) => onReportUpdate('korean-lyrics', payload)} />;
  return null;
}

export default function AICoachView() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([
    createMessage(
      'assistant',
      '안녕하세요! 이 화면은 채팅으로 모든 기능을 실행합니다.\n예) "댄스 연습 시작", "보컬 연습하고 싶어", "오늘 연습 리포트 보여줘"'
    ),
  ]);
  const [inputValue, setInputValue] = useState('');
  const [activeFeature, setActiveFeature] = useState('none');
  const [lastReportCard, setLastReportCard] = useState(null);
  const [reports, setReports] = useState({
    dance: null,
    vocal: null,
    korean: {
      pronunciation: null,
      follow: null,
      correction: null,
      lyrics: null,
    },
  });
  const [reportHistory, setReportHistory] = useState({
    dance: [],
    vocal: [],
    korean: [],
  });
  const [persistedSessions, setPersistedSessions] = useState(() => loadPersistedSessions());
  const historyMetaRef = useRef({
    dance: { lastAt: 0, lastScore: null },
    vocal: { lastAt: 0, lastScore: null },
    korean: { lastAt: 0, lastScore: null },
  });

  const onReportUpdate = useCallback((domain, payload) => {
    setReports((prev) => {
      const next = { ...prev };
      if (domain === 'dance') next.dance = payload;
      else if (domain === 'vocal') next.vocal = payload;
      else if (domain === 'korean-pronunciation') next.korean = { ...next.korean, pronunciation: payload };
      else if (domain === 'korean-follow') next.korean = { ...next.korean, follow: payload };
      else if (domain === 'korean-correction') next.korean = { ...next.korean, correction: payload };
      else if (domain === 'korean-lyrics') next.korean = { ...next.korean, lyrics: payload };
      return next;
    });

    const rootDomain = domain.startsWith('korean-') ? 'korean' : domain;
    const score = extractScoreFromPayload(domain, payload);
    if (!Number.isFinite(score)) return;
    const now = Date.now();
    const meta = historyMetaRef.current[rootDomain] || { lastAt: 0, lastScore: null };
    const shouldPush = now - Number(meta.lastAt || 0) > 4500 || Math.abs(score - Number(meta.lastScore ?? score)) >= 3;
    if (!shouldPush) return;
    historyMetaRef.current[rootDomain] = { lastAt: now, lastScore: score };
    setReportHistory((prev) => {
      const next = { ...prev };
      const list = [...(next[rootDomain] || []), { at: now, score: Math.round(score) }];
      next[rootDomain] = list.slice(-40);
      return next;
    });
    setPersistedSessions((prev) => {
      const next = [...prev, { at: now, domain: rootDomain, score: Math.round(score) }].slice(-1000);
      savePersistedSessions(next);
      return next;
    });
  }, []);

  const showQuickCommands = inputValue.startsWith('/');
  const featureComponent = useMemo(() => renderFeatureComponent(activeFeature, onReportUpdate), [activeFeature, onReportUpdate]);

  const handleSubmitMessage = (rawText) => {
    const content = rawText.trim();
    if (!content) return;
    setMessages((prev) => [...prev, createMessage('user', content)]);
    const intent = detectIntent(content);

    if (intent.type === 'feature') {
      setActiveFeature(intent.feature);
      const reply = MODE_REPLY[intent.feature] || MODE_REPLY.none;
      setMessages((prev) => [...prev, createMessage('assistant', reply)]);
      setInputValue('');
      return;
    }

    if (intent.type === 'report') {
      const card = buildReportCard(intent.target, reports, reportHistory, persistedSessions, {
        includeTrend: intent.includeTrend,
        includeGrowth: intent.includeGrowth,
        includeJson: intent.includeJson,
      });
      setLastReportCard(card);
      setMessages((prev) => [...prev, createMessage('assistant', card.text)]);
      setInputValue('');
      return;
    }

    setMessages((prev) => [
      ...prev,
      createMessage(
        'assistant',
        '의도를 인식했어요. 기능 실행은 "댄스/보컬/한국어 발음연습", 리포트는 "오늘 연습 리포트 보여줘"처럼 입력해 주세요.'
      ),
    ]);
    setInputValue('');
  };

  const runRoutine = (routine) => {
    const feature = routine?.feature || 'none';
    if (feature === 'none') return;
    setActiveFeature(feature);
    const baseReply = MODE_REPLY[feature] || '추천 루틴에 맞는 연습 모드를 실행합니다.';
    setMessages((prev) => [
      ...prev,
      createMessage('assistant', `추천 루틴 실행: ${routine.label}\n${baseReply}`),
    ]);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <header className="h-16 border-b border-[#E5E5E5] px-6 flex items-center justify-between">
        <div>
          <p className="font-bold text-[#111111]">{t('views.aicoach')}</p>
          <p className="text-xs text-slate-500 mt-0.5">현재 화면: 채팅 단일 UI · 활성 기능: {activeFeature === 'none' ? '없음' : activeFeature}</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#F5F5F7]">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className="w-9 h-9 bg-white border border-[#E5E5E5] rounded-xl grid place-items-center">
              <User size={16} className="text-slate-400" />
            </div>
            <div className={`max-w-[72%] ${msg.role === 'user' ? 'text-right' : ''}`}>
              <div
                className={`inline-block px-4 py-2 text-sm ${
                  msg.role === 'user'
                    ? 'bg-[#FF1F8E] text-white rounded-[16px_16px_4px_16px]'
                    : 'bg-white text-[#111111] rounded-[16px_16px_16px_4px] border border-[#E5E5E5]'
                }`}
              >
                {msg.text}
              </div>
            </div>
          </div>
        ))}

        {lastReportCard ? (
          <div className="rounded-2xl border border-[#E5E5E5] bg-white p-4 space-y-2">
            <p className="text-sm font-semibold text-[#111111]">{lastReportCard.title}</p>
            {lastReportCard.body.map((line, idx) => (
              <p key={`${idx}-${line.slice(0, 12)}`} className="text-xs text-[#666666]">- {line}</p>
            ))}
            {lastReportCard.trend?.length ? (
              <div className="rounded-lg bg-[#F7F7F8] border border-[#E5E5E5] p-2 space-y-1">
                <p className="text-xs font-semibold text-[#111111]">최근 추이</p>
                {lastReportCard.trend.map((line, idx) => (
                  <p key={`${idx}-${line.slice(0, 12)}`} className="text-[11px] text-[#666666]">- {line}</p>
                ))}
              </div>
            ) : null}
            {lastReportCard.growth ? (
              <div className="rounded-lg bg-[#F8F7FF] border border-[#E5E5E5] p-2 space-y-1">
                <p className="text-xs font-semibold text-[#111111]">성장 분석 (어제/지난주 대비)</p>
                {lastReportCard.growth.lines.map((line, idx) => (
                  <p key={`${idx}-${line.slice(0, 12)}`} className="text-[11px] text-[#666666]">- {line}</p>
                ))}
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <div className="rounded-md border border-[#E5E5E5] bg-white px-2 py-1">
                    <p className="text-[10px] text-[#888888]">목표 점수</p>
                    <p className="text-xs font-semibold text-[#111111]">{lastReportCard.growth.achievement?.targetScore ?? '—'}</p>
                  </div>
                  <div className="rounded-md border border-[#E5E5E5] bg-white px-2 py-1">
                    <p className="text-[10px] text-[#888888]">오늘 달성률</p>
                    <p className="text-xs font-semibold text-[#111111]">
                      {lastReportCard.growth.achievement?.todayAchievementRate == null
                        ? '—'
                        : `${lastReportCard.growth.achievement.todayAchievementRate}%`}
                    </p>
                  </div>
                  <div className="rounded-md border border-[#E5E5E5] bg-white px-2 py-1">
                    <p className="text-[10px] text-[#888888]">주간 진행률</p>
                    <p className="text-xs font-semibold text-[#111111]">
                      {lastReportCard.growth.achievement?.weeklyGoalProgress == null
                        ? '—'
                        : `${lastReportCard.growth.achievement.weeklyGoalProgress}%`}
                    </p>
                  </div>
                </div>
                {lastReportCard.growth.routines?.length ? (
                  <div className="rounded-md border border-[#E5E5E5] bg-white p-2 mt-2 space-y-1">
                    <p className="text-[11px] font-semibold text-[#111111]">추천 루틴 / 연습 추천</p>
                    {lastReportCard.growth.routines.map((routine, idx) => (
                      <div key={`${idx}-${routine.label.slice(0, 12)}`} className="flex items-start gap-2">
                        <p className="flex-1 text-[11px] text-[#666666]">- {routine.label}</p>
                        {routine.feature !== 'none' ? (
                          <button
                            type="button"
                            onClick={() => runRoutine(routine)}
                            className="shrink-0 rounded-md border border-[#FF1F8E] px-2 py-0.5 text-[10px] text-[#FF1F8E] hover:bg-[#FF1F8E12]"
                          >
                            실행
                          </button>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}
            {lastReportCard.jsonText ? (
              <details className="rounded-lg border border-[#E5E5E5] bg-[#FCFCFD] p-2">
                <summary className="cursor-pointer text-xs font-semibold text-[#111111]">상세 JSON 리포트</summary>
                <pre className="mt-2 text-[10px] leading-4 text-[#555555] overflow-x-auto">{lastReportCard.jsonText}</pre>
              </details>
            ) : null}
          </div>
        ) : null}

        {featureComponent ? (
          <div className="rounded-2xl border border-[#E5E5E5] bg-white overflow-hidden">
            <div className="px-4 py-2 border-b border-[#E5E5E5] bg-[#FAFAFA] text-xs text-[#666666]">
              채팅으로 실행된 기능: {activeFeature}
            </div>
            <div className="max-h-[70vh] overflow-y-auto">{featureComponent}</div>
          </div>
        ) : null}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmitMessage(inputValue);
        }}
        className="p-4 border-t border-[#E5E5E5] bg-white"
      >
        <div className="relative">
          {showQuickCommands && (
            <div className="absolute left-0 right-0 bottom-[56px] rounded-xl border border-[#E5E5E5] bg-white shadow-lg p-2 z-20">
              {QUICK_COMMANDS.map((command) => (
                <button
                  key={command.id}
                  type="button"
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-pink-50 hover:text-pink-500 transition"
                  onClick={() => handleSubmitMessage(command.label)}
                >
                  {command.label}
                </button>
              ))}
            </div>
          )}
          <div className="rounded-2xl border border-[#E5E5E5] px-3 py-2 flex items-center gap-2">
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={t('aicoach.placeholder')}
              className="flex-1 text-sm outline-none bg-transparent"
            />
            <button type="submit" className="w-9 h-9 rounded-xl bg-[#FF1F8E] text-white grid place-items-center">
              <Send size={16} />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
