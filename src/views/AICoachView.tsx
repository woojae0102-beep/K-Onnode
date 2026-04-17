// @ts-nocheck
import React, { useMemo, useState } from 'react';
import { Send, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const QUICK_COMMANDS = [
  { id: 'dance', label: '/댄스', mode: 'dance' },
  { id: 'vocal', label: '/보컬', mode: 'vocal' },
  { id: 'korean', label: '/한국어', mode: 'korean' },
];

const MODE_INTENT_KEYWORDS = {
  dance: ['댄스', '춤', '/댄스'],
  vocal: ['보컬', '노래', '/보컬'],
  korean: ['한국어', '공부', '/한국어'],
};

const MODE_REPLIES = {
  dance: '댄스 모드를 시작합니다. 카메라를 준비해주세요.',
  vocal: '보컬 모드를 시작합니다. 마이크 테스트를 진행해주세요.',
  korean: '한국어 모드를 시작합니다. 가사 따라 읽기를 시작해볼까요?',
};

function detectIntent(text) {
  const normalized = text.trim().toLowerCase();
  if (!normalized) return 'chat';
  if (MODE_INTENT_KEYWORDS.dance.some((keyword) => normalized.includes(keyword.toLowerCase()))) return 'dance';
  if (MODE_INTENT_KEYWORDS.vocal.some((keyword) => normalized.includes(keyword.toLowerCase()))) return 'vocal';
  if (MODE_INTENT_KEYWORDS.korean.some((keyword) => normalized.includes(keyword.toLowerCase()))) return 'korean';
  return 'chat';
}

function createMessage(role, text, extra = {}) {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    role,
    text,
    timestamp: Date.now(),
    ...extra,
  };
}

function DanceModeComponent() {
  return (
    <div className="rounded-2xl border border-pink-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold text-pink-500">DANCE MODE</p>
      <h3 className="mt-1 text-sm font-bold text-slate-800">웹캠 미러링 영역 (더미)</h3>
      <div className="mt-3 h-40 rounded-xl border border-dashed border-pink-300 bg-pink-50 grid place-items-center text-xs text-pink-500">
        Camera Mirror Placeholder
      </div>
    </div>
  );
}

function VocalModeComponent() {
  return (
    <div className="rounded-2xl border border-fuchsia-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold text-fuchsia-500">VOCAL MODE</p>
      <h3 className="mt-1 text-sm font-bold text-slate-800">파형 + 녹음 버튼 영역 (더미)</h3>
      <div className="mt-3 rounded-xl border border-dashed border-fuchsia-300 bg-fuchsia-50 p-4">
        <div className="h-16 rounded-lg bg-gradient-to-r from-fuchsia-200 via-white to-fuchsia-200" />
        <button type="button" className="mt-3 rounded-lg bg-fuchsia-500 px-4 py-2 text-xs font-semibold text-white">
          녹음 시작
        </button>
      </div>
    </div>
  );
}

function KoreanModeComponent() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold text-amber-500">KOREAN MODE</p>
      <h3 className="mt-1 text-sm font-bold text-slate-800">가사 + 번역 영역 (더미)</h3>
      <div className="mt-3 rounded-xl border border-dashed border-amber-300 bg-amber-50 p-4 space-y-2">
        <p className="text-sm font-medium text-slate-700">"널 따라 춤을 춰, tonight"</p>
        <p className="text-xs text-slate-500">"I dance along with you, tonight"</p>
      </div>
    </div>
  );
}

export default function AICoachView({ onCoachModeChange }) {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([
    createMessage('assistant', '안녕하세요! 댄스, 보컬, 한국어 중 원하는 모드를 입력하거나 /명령어를 사용해 주세요.'),
  ]);
  const [inputValue, setInputValue] = useState('');
  const [activeMode, setActiveMode] = useState('chat');

  const showQuickCommands = inputValue.startsWith('/');
  const activeModeComponent = useMemo(() => {
    if (activeMode === 'dance') return <DanceModeComponent />;
    if (activeMode === 'vocal') return <VocalModeComponent />;
    if (activeMode === 'korean') return <KoreanModeComponent />;
    return null;
  }, [activeMode]);

  const appendAssistantMessage = (text, nextMode = 'chat') => {
    setMessages((prev) => [...prev, createMessage('assistant', text, { mode: nextMode })]);
  };

  const handleModeSwitch = (nextMode) => {
    setActiveMode(nextMode);
    onCoachModeChange?.(nextMode);
    appendAssistantMessage(MODE_REPLIES[nextMode], nextMode);
  };

  const handleSubmitMessage = (rawText) => {
    const content = rawText.trim();
    if (!content) return;
    setMessages((prev) => [...prev, createMessage('user', content)]);
    const intent = detectIntent(content);
    if (intent !== 'chat') {
      handleModeSwitch(intent);
      setInputValue('');
      return;
    }
    appendAssistantMessage('요청을 확인했어요. 모드 전환이 필요하면 댄스/보컬/한국어 또는 /명령어를 입력해 주세요.');
    setInputValue('');
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <header className="h-16 border-b border-[#E5E5E5] px-6 flex items-center justify-between">
        <div>
          <p className="font-bold text-[#111111]">{t('views.aicoach')}</p>
          <p className="text-xs text-slate-500 mt-0.5">현재 모드: {activeMode === 'chat' ? 'chat' : activeMode}</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#F5F5F7]">
        {activeModeComponent}

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
