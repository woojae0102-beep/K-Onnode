# K-Onnode (ONNODE) — Full Reconstruction Prompt

> 이 문서는 현재 K-Onnode 프로젝트를 **처음부터 다시 구축**할 수 있도록 작성된 최종 사양 프롬프트입니다.
> AI 코딩 에이전트(Claude/Cursor/Copilot 등)에 통째로 붙여넣으면 동일한 앱을 재현할 수 있습니다.

---

## 0. 당신(에이전트)의 역할

당신은 시니어 풀스택 React 엔지니어입니다. 아래 사양에 따라 **"ONNODE (K-Onnode)"** 라는 이름의 K-POP AI 트레이닝 PWA를 Vite + React + Firebase + Vercel 서버리스 스택으로 구현합니다. 본인의 재량으로 세부 구현 결정을 내릴 수 있지만, 아래 명시된 기능/구조/데이터 흐름은 **반드시** 지켜야 합니다.

---

## 1. 프로젝트 아이덴티티

| 항목 | 값 |
|---|---|
| 프로덕트명 | **ONNODE** / 별칭 **K-Onnode** |
| 태그라인 | Next-Gen K-Culture Platform — AI K-POP Dance / Vocal / Korean Coaching |
| 타겟 사용자 | K-POP 아이돌 지망생, K-POP 팬(댄스 커버/보컬/한국어 학습), 일반 트레이닝 사용자 |
| 주요 가치 | "카메라 + 마이크 하나로 AI가 실시간 댄스·보컬·한국어 발음 코칭" |
| 배포 형태 | **PWA** (홈 화면 설치형 웹앱) + Vercel 호스팅 |
| 한국어/영어/일본어/중국어(간체)/태국어/베트남어/스페인어/프랑스어 | **8개 언어** 지원 |
| 시그니처 컬러 | Pink `#FF1F8E` / `#FF1493` → Violet `#7C3AED` 그래디언트 |
| 뉴트럴 팔레트 | `#111111` (본문), `#666666` (보조), `#F5F5F7` (배경), `#E5E5E5` (경계선), `#FFFFFF` |
| 다크 테마(서브) | `#0f172a` (slate-950), `#1e1b4b` |

---

## 2. 기술 스택 (고정)

### 런타임

- **Node.js** 18+
- **브라우저**: Chrome/Edge/Safari/Firefox 최신, **HTTPS 필수** (카메라/마이크)

### 의존성 (정확히 이 구성으로)

```json
{
  "dependencies": {
    "@mediapipe/tasks-vision": "^0.10.34",   // 포즈/핸드 감지
    "firebase": "^11.10.0",                    // Firestore + Auth
    "i18next": "^26.0.4",
    "react-i18next": "^17.0.2",
    "lucide-react": "^0.468.0",                // 아이콘
    "qrcode.react": "^4.2.0",                  // 세션 공유 QR
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "recharts": "^3.8.1",                      // 성장 그래프
    "zustand": "^5.0.12"                       // 글로벌 상태
  },
  "devDependencies": {
    "@vitejs/plugin-basic-ssl": "^2.3.0",
    "@vitejs/plugin-react": "^4.3.4",
    "@vite-pwa/assets-generator": "latest",
    "vite-plugin-pwa": "latest",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.16",
    "tailwindcss-animate": "^1.0.7",
    "vite": "^6.0.3"
  }
}
```

### 스타일

- **Tailwind CSS** + 부분적으로 **인라인 style** (뷰어 스펙/디자인 토큰 모방용).
- CSS 변수: `--color-background-primary`, `--color-background-secondary`, `--color-text-primary/secondary/tertiary`, `--color-border-secondary`. 기본값은 라이트 테마(위 뉴트럴 팔레트).

### 외부 API

- **Firebase Firestore**: 실시간 세션 동기화, WebRTC 시그널링
- **Firebase Auth (익명 인증)**: 세션별 유저 식별
- **Google Gemini API** (`generativelanguage.googleapis.com`, 모델 `gemini-1.5-flash`): AI 코치 대화
- **YouTube Data API v3**: 트렌딩/챌린지 수집 (서버리스 함수에서만)
- **Spotify Web API (Client Credentials)**: K-POP 플레이리스트 (서버리스 함수에서만)
- **MediaPipe Holistic Landmarker** (CDN 모델, GPU→CPU 폴백): 포즈+손 감지
- **Web Speech API** (`SpeechRecognition` / `webkitSpeechRecognition`): 한국어 음성 인식

---

## 3. 프로젝트 파일 트리 (정확히 재현)

```
K-Onnode/
├─ api/                                   # Vercel Serverless Functions (CommonJS)
│  ├─ discover.js                         # GET /api/discover?track=all&limit=20
│  ├─ cron/
│  │  └─ update-trending.js               # 매주 월요일 00:00 UTC cron
│  └─ _lib/
│     └─ trending.js                      # YouTube/Spotify 수집 로직 공유
├─ public/
│  ├─ icons/                              # PWA 아이콘 (64/192/512/maskable/apple/favicon)
│  │  └─ source.svg                       # 로고 원본 (핑크→바이올렛 "KO")
│  └─ idol-choreo-skeleton.json           # 기준 안무 스켈레톤 시퀀스 (사용처: 댄스 기준 자세)
├─ src/
│  ├─ main.jsx                            # 앱 엔트리
│  ├─ App.jsx                             # 레거시 3뷰 허브(HubView/MobileController/Desktop) + 신규 Layout 위임
│  ├─ TrainingApp.jsx                     # 레거시: 데스크톱/모바일 역할 분리 트레이닝 허브
│  ├─ i18n.ts                             # i18next 초기화 (8개 로케일)
│  ├─ index.css                           # Tailwind 진입점 + 글로벌 스타일
│  ├─ danceAnalysis.js                    # 레거시 댄스 분석 유틸
│  ├─ locales/
│  │  ├─ ko.json en.json ja.json zh.json th.json vi.json es.json fr.json
│  ├─ store/
│  │  ├─ settingsSlice.ts                 # 사용자 설정 (zustand)
│  │  └─ languageStore.ts                 # 현재 언어 (zustand + localStorage)
│  ├─ services/
│  │  └─ settingsApi.ts                   # 설정 저장/불러오기 래퍼
│  ├─ hooks/
│  │  ├─ usePoseDetection.ts              # MediaPipe Holistic + 관절 각도 → 점수
│  │  ├─ useAudioAnalysis.ts              # Web Audio + AutoCorrelation 피치 → 점수
│  │  ├─ useKoreanSpeechCoach.ts          # SpeechRecognition + Levenshtein → 발음 점수
│  │  ├─ useWebRtcSession.js              # Firestore 시그널링 기반 P2P WebRTC
│  │  ├─ useRealtimeChat.ts               # 커뮤니티 DM/그룹 목업 hook
│  │  ├─ useSettings.ts                   # settingsSlice + localStorage 동기화
│  │  └─ useActiveView.tsx                # 현재 뷰 추적
│  ├─ training/
│  │  └─ trainingPitch.js                 # autocorrelation detectPitchHzAutocorr 등
│  ├─ components/
│  │  ├─ Layout.tsx                       # TopNav + LeftPanel + Main + TabBar
│  │  ├─ DanceFeedbackHUD.jsx             # 레거시 HUD
│  │  ├─ DanceReviewPanel.jsx             # 분석 후 리뷰 패널
│  │  ├─ layout/
│  │  │  ├─ TopNavBar.tsx                 # 상단 48px 바 (로고/알림/설정)
│  │  │  ├─ LeftPanel.tsx                 # 240px 좌측 내비 (Home/Discover/Chat/AICoach 각 서브메뉴)
│  │  │  ├─ TabBar.tsx                    # 상단 탭(데스크톱)/하단 탭바(모바일)
│  │  │  ├─ MenuRow.tsx                   # 좌측 패널 메뉴 row + SectionTitle
│  │  │  └─ ConversationRow.tsx           # 채팅 리스트 row
│  │  ├─ dance/
│  │  │  ├─ DifficultySlider.tsx          # 1~5 난이도
│  │  │  ├─ MirrorModeToggle.tsx          # 거울 모드
│  │  │  ├─ PoseFeedbackOverlay.tsx       # 실시간 점수/피드백/메트릭 카드
│  │  │  └─ YouTubeImport.tsx             # 유튜브 URL → iframe embed
│  │  ├─ vocal/
│  │  │  ├─ LyricsDisplay.tsx             # 라인별 가사 + 라인 점수
│  │  │  ├─ LiveScore.tsx                 # 실시간 종합 점수
│  │  │  ├─ PitchGraph.tsx                # 시간축 피치 그래프
│  │  │  ├─ PitchMeter.tsx                # 목표음 대비 ±cent 미터
│  │  │  └─ WaveformVisualizer.tsx        # 48바 파형
│  │  ├─ korean/
│  │  │  ├─ PronunciationMode.tsx         # 발음 연습 (기준문장 읽기)
│  │  │  ├─ FollowAlongMode.tsx           # 문장 따라말하기 라인별 점수
│  │  │  ├─ CorrectionMode.tsx            # AI 교정 모드 (틀린 부분 하이라이트)
│  │  │  └─ LyricsVocabMode.tsx           # 가사 학습 + 어휘 인식
│  │  ├─ report/
│  │  │  ├─ ReportCard.tsx                # 일간/주간/월간 카드
│  │  │  ├─ DetailScoreCard.tsx           # 하위 점수 분해
│  │  │  ├─ ScoreGauge.tsx                # 반원 점수 게이지
│  │  │  ├─ TimelineSection.tsx           # 오늘 연습 타임라인
│  │  │  ├─ RecommendedContent.tsx        # 관련 추천 영상/음원
│  │  │  └─ RecommendedRoutine.tsx        # AI 추천 루틴 버튼
│  │  ├─ community/
│  │  │  ├─ ChatList.tsx, ChatWindow.tsx, MessageBubble.tsx, NewChatModal.tsx, AttachmentPicker.tsx
│  │  ├─ mypage/
│  │  │  ├─ GrowthGraph.tsx               # recharts LineChart
│  │  │  ├─ GoalProgressCard.tsx          # 목표 진행률
│  │  │  └─ SavedVideosGrid.tsx
│  │  ├─ settings/
│  │  │  ├─ SettingsSection.tsx, SettingsItem.tsx
│  │  │  ├─ LanguageSelector.tsx          # 8개 언어 드롭다운
│  │  │  ├─ SNSConnectItem.tsx            # TikTok/Instagram/YouTube/Twitter 연결
│  │  │  └─ SubscriptionCard.tsx          # 요금제 카드
│  │  └─ notifications/
│  │     └─ AINotificationBubble.tsx
│  ├─ screens/
│  │  └─ SettingsScreen.tsx               # 설정 전체 화면 (레거시 App.jsx 경로용)
│  ├─ mocks/
│  │  ├─ discoverMocks.ts                 # API 실패 시 폴백 목업
│  │  └─ reportMocks.ts
│  └─ views/                              # 라우팅 가능한 상위 페이지
│     ├─ HomeView.tsx                     # 홈 대시보드
│     ├─ AICoachView.tsx                  # AI 코치 (채팅 + 기능 실행 + 리포트)
│     ├─ DanceTrainingView.tsx            # 댄스 연습 (카메라 + 포즈)
│     ├─ VocalTrainingView.tsx            # 보컬 연습 (마이크 + 피치)
│     ├─ KoreanAIView.tsx                 # 한국어 AI (4모드 사이드바)
│     ├─ MyPageView.tsx, GrowthGraphView.tsx, GoalsView.tsx, SavedVideosView.tsx, FeedbackHistoryView.tsx
│     ├─ DiscoverView.tsx (레거시), TrendingView.tsx, PopularDanceView.tsx, PopularSongsView.tsx, KoreanContentView.tsx, ChallengesView.tsx
│     ├─ CommunityView.tsx (레거시), ChatWindowView.tsx
│     ├─ NotificationsView.tsx, SettingsView.tsx
│     ├─ WeaknessView.tsx, RoutineView.tsx, CoachingView.tsx   # AI 코치 서브뷰
│     ├─ ReportListView.tsx, ReportDetailView.tsx
│     └─ PlaceholderView.tsx
├─ index.html                              # PWA meta + apple-touch + OG
├─ vite.config.js                          # React + basicSsl + VitePWA (Workbox 런타임 캐싱)
├─ vercel.json                             # crons: /api/cron/update-trending (0 0 * * 1)
├─ netlify.toml                            # (선택, 백업 배포용 SPA 설정)
├─ .vercelignore, .gitignore
├─ pwa-assets.config.js                    # @vite-pwa/assets-generator
└─ package.json
```

---

## 4. 아키텍처 개요

### 4-1. 전체 구조

```
┌───────────────────── 사용자 브라우저 (PWA) ─────────────────────┐
│                                                                  │
│  main.jsx → App.jsx                                              │
│    ├─ viewMode = 'desktop' → <Layout>   (신규 UI, 메인 경로)   │
│    ├─ viewMode = 'mobile'  → <MobileController>                 │
│    └─ viewMode = 'hub'     → <HubView>  (데스크톱/모바일 분기) │
│                                                                  │
│  <Layout>                                                        │
│    ├─ <TopNavBar/>        (48px, 로고 · 알림 · 설정)            │
│    ├─ <LeftPanel/>        (240px, Home/Discover/Chat/AICoach)   │
│    ├─ <main>              (mainView 기반 뷰 렌더)               │
│    └─ <TabBar layout="bottom"/>  (모바일 전용 하단 탭)          │
│                                                                  │
│  Zustand stores:                                                 │
│    useSettingsStore   (settingsSlice.ts)                         │
│    useLanguageStore   (languageStore.ts) + localStorage         │
│                                                                  │
│  Hooks (기능 단위):                                              │
│    usePoseDetection / useAudioAnalysis / useKoreanSpeechCoach   │
│    useWebRtcSession / useRealtimeChat / useSettings             │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
          │                              │                   │
          │ HTTPS/WSS                    │ REST              │ CDN
          ▼                              ▼                   ▼
┌─────────────────────┐   ┌───────────────────────┐   ┌──────────────┐
│ Firebase            │   │ Vercel Serverless     │   │ MediaPipe    │
│  - Firestore        │   │  /api/discover        │   │  WASM + Task │
│  - Auth (Anon)      │   │  /api/cron/update-... │   │  (jsdelivr)  │
└─────────────────────┘   └───────┬───────────────┘   └──────────────┘
                                  │
                         ┌────────┴────────┐
                         ▼                 ▼
                 ┌───────────────┐   ┌────────────┐
                 │ YouTube Data  │   │  Spotify   │
                 │ API v3        │   │  Web API   │
                 └───────────────┘   └────────────┘

추가 클라이언트 → 외부 직접 호출:
  Gemini API (generativelanguage.googleapis.com)
  → 브라우저에서 직접 호출 (VITE_GEMINI_API_KEY 사용)
```

### 4-2. 데이터 흐름

**실시간 연습 기록 수집**:

```
[Dance/Vocal/Korean View]
    ↓ onReportUpdate(domain, payload)
[AICoachView] useState reports + reportHistory + persistedSessions
    ↓ 3초 이상 또는 3점 이상 변화 시 push
    ↓ localStorage['onnode_growth_sessions_v1']에 저장
[리포트 카드 빌더] buildReportCard()
    ↓ 일간/주간/월간 요약 + 추세 + 성장 분석 + 추천 루틴
[Gemini 프롬프트 컨텍스트]
    ↓ requestGeminiCoachReply()
[AI 응답 메시지]
```

**세션 동기화 (레거시 P2P 모드)**:

```
[데스크톱 App.jsx]
  createSession() → doc('artifacts/{appId}/public/data/sessions/{sessionId}')
    초기 데이터: {status, activeTraining, theme, metrics, vocal, korean}
    onSnapshot(sessionRef) → setSessionData
    <HubView> QRCodeSVG(URL + ?session=ID)
[모바일 scan URL] → ?session=XYZ
  onAuthStateChanged → setSessionId(URL param)
  <MobileController> updateDoc() 으로 sessionDoc 업데이트
[WebRTC] useWebRtcSession({role: 'laptop' or 'mobile'})
  → Firestore 'webrtc/signaling' + 'webrtcIce' 서브컬렉션으로 SDP/ICE 교환
  → P2P RTCPeerConnection 통해 video track 전송
```

---

## 5. 언어/디자인 토큰

### 5-1. i18n 8개 언어 (전부 필수)

- **기본**: 브라우저 언어 감지 → `ko/en/ja/zh/th/vi/es/fr` 중 매칭, 아니면 `ko`
- **LocalStorage 키**: `onnode-language`
- **전환 방식**: `useLanguageStore.setLanguage(lang)` → `i18n.changeLanguage(lang)` + localStorage 동기화
- 각 로케일 JSON은 **동일한 키 구조**를 가져야 함 (`nav.*`, `leftPanel.*`, `home.*`, `dance.*`, `vocal.*`, `korean.*`, `aicoach.*`, `settings.*`, `community.*`, `views.*`, `discoverNew.*` 등)

### 5-2. Tailwind 테마 확장

- `fontFamily.sans`: Apple 시스템 + Pretendard fallback, `fontFamily.poppins`: Poppins (제목/히어로)
- 커스텀 컬러: 기본 Tailwind + `#FF1F8E`/`#FF1493`/`#0f172a` 수동 사용
- `animate-*`: `tailwindcss-animate` 프리셋 사용

### 5-3. 디자인 원칙

| 상황 | 규칙 |
|---|---|
| 기본 UI (홈/리포트/설정/채팅) | **라이트 테마 + 얇은 경계선(`0.5px solid #E5E5E5`) + 작은 타이포(11~14px)** |
| 히어로/랜딩/트레이닝 풀스크린 | **다크 slate-950 + 두꺼운 Poppins italic 타이포 + 핑크→바이올렛 그래디언트** |
| 라운드 | 기본 8~12px, 히어로/트레이닝은 24~64px (큰 반경) |
| 그림자 | 기본 없거나 soft, 트레이닝 화면은 `shadow-2xl` + neon glow |
| 아이콘 | **lucide-react**만 사용 (크기 14/16/18/20/24/26/80) |
| 이모지 | 메뉴 아이콘에서 직접 사용 (🕺🎤🇰🇷🔥💃🎵🏆📊🎯💾📋) |

---

## 6. 핵심 기능 상세

### 6-1. Layout 시스템 (components/Layout.tsx)

**Props**: `user, db, appId, sessionData, aiMessages, aiLoading, newMessage, setNewMessage, sendMessage`

**내부 상태**:
- `activeTab`: `'home' | 'discover' | 'chat' | 'aicoach'`
- `mainView`: 현재 열린 뷰 키 (아래 표)
- `conversationId`: 현재 열린 DM
- `lastTrainingView`: `'dance'|'vocal'|'korean'|'aicoach'` 중 마지막 트레이닝 뷰 기억
- `newChatOpen`: NewChatModal 열림 여부

**탭 ↔ 뷰 매핑 (중요, 이대로 구현)**:

```ts
TAB_TO_DEFAULT_VIEW = {
  home: 'home', discover: 'trending', chat: 'chat', aicoach: 'aicoach'
}
VIEW_TO_TAB = {
  home, mypage, growth, goals, 'saved-videos', 'feedback-history', dance, vocal, korean → 'home',
  trending, 'popular-dance', 'popular-songs', 'korean-content', challenges → 'discover',
  chat → 'chat',
  aicoach, weakness, routine, coaching → 'aicoach'
}
TRAINING_VIEWS = ['dance', 'vocal', 'korean', 'aicoach']
```

**조립**:
```
<div h-screen w-screen flex flex-col bg-#F5F5F7>
  <TopNavBar onOpenNotifications onOpenSettings />       // 48px fixed
  <div flex flex-1 min-h-0 pt-48>
    <LeftPanel ... />                                    // 240px hidden md:flex
    <main flex-1 overflow-y-auto>{renderMainContent()}</main>
  </div>
  <div className="md:hidden"><TabBar layout="bottom" /></div>
  <NewChatModal open onClose onCreate />
</div>
```

- `renderMainContent()`는 `mainView` 값에 따라 22+개 뷰 중 하나를 렌더.
- `chat`일 때는 `useRealtimeChat()` 결과를 `<ChatWindowView>`에 주입.

### 6-2. 좌측 패널 (LeftPanel.tsx)

4개 탭 각각의 서브메뉴를 렌더. `MenuRow` 컴포넌트 + `SectionTitle`로 구성.

| 탭 | 섹션 | 아이템 (icon, labelKey, view) |
|---|---|---|
| `home` | My | 👤 profile→mypage, 📊 growth, 🎯 goals, 💾 savedVideos, 📋 feedbackHistory |
| `home` | Training | 🕺 dance, 🎤 vocal, 🇰🇷 korean |
| `discover` | Discover | 🔥 trending, 💃 popular-dance, 🎵 popular-songs, 🇰🇷 korean-content, 🏆 challenges |
| `aicoach` | AI Coach | 🔥 todayPick→aicoach, 📈 weakness, 📅 routine, 🎯 coaching |
| `chat` | (동적) | sub-tabs `dm`/`group` + 검색 + `+ New Chat` FAB (#FF1F8E) |

하단 `UserMiniBar`: 28px 분홍 원형 `ON` 이니셜 + `onnode_user` + 설정 톱니.

### 6-3. TopNavBar

- 48px 고정, `position: fixed`, `z-40`, 흰 배경, bottom border `#F0F0F0`.
- 좌: `#FF1F8E` 배경의 28px 원형 `O` + `ONNODE` 텍스트
- 우: `Bell`, `Settings` 아이콘 버튼 (hover 시 `#F5F5F7`)

### 6-4. TabBar

`layout="top" | "bottom"` prop으로 스타일 변경. 4개 탭(`Home/Chat/Bot/Compass`) 아이콘 + `useTranslation` labelKey `nav.home/nav.chat/nav.aicoach/nav.discover`. 활성 시 `#FF1F8E` + underline/overline.

### 6-5. HomeView (views/HomeView.tsx)

- **HeroBanner** (`#FFFFFF` 카드, `#FF1F8E44` 경계):
  - 배지 + 2줄 타이틀 (두 번째 줄 `#FF1F8E`)
  - "오늘 시작" (fill) + "트랙 선택" (outline) 버튼
  - 우측에 투명도 0.13짜리 🎤 이모지 (52px)
- **StatusSection**: 3열 그리드 — `12 Lv` 현재 레벨, `7 일` 연속, `84점` 최근 점수
- **QuickStartSection**: 3장 카드 (Dance/Vocal/Korean) — 각 고유 `bg/borderColor/icon/badgeBg/badgeColor` 사용
  - `onNavigate('dance'|'vocal'|'korean')` 호출 시 해당 뷰로 이동
  - `onStartToday` → `onNavigate('aicoach')`
  - `onScrollToQuickStart` → DOM scrollIntoView

### 6-6. AICoachView (views/AICoachView.tsx) — **가장 복잡한 핵심 뷰**

이 한 화면에서 **채팅 + 기능 실행 + 리포트** 모두 처리.

#### 레이아웃

- 상단 header 64px: 제목 + 언어 셀렉트
- 본문: `activeTab`에 따라 분기
  - `chat`: 메시지 리스트 + 코치 톤 선택 바 + 퀵커맨드 + 입력
  - `dance`|`vocal`|`korean`: 해당 기능 컴포넌트 임베드 (`renderFeatureComponent`)
  - `report`: `<ReportListView />`
- 하단 5개 탭: `chat / dance / vocal / korean / report` (한국어/중국어/일본어/태국어/베트남어/스페인어/프랑스어 각 로케일 라벨 지원)

#### 상태 (상세)

```ts
messages: Msg[]                     // role: 'user' | 'assistant', text, timestamp
inputValue: string
activeFeature: 'none' | 'dance' | 'vocal' | 'korean-pronunciation' | 'korean-follow' | 'korean-correction' | 'korean-lyrics'
activeTab: 'chat' | 'dance' | 'vocal' | 'korean' | 'report'
coachTone: 'friendly' | 'strict' | 'brief'
reportPeriod: 'daily' | 'weekly' | 'monthly'
reportDate: 'YYYY-MM-DD'
coachLoading: boolean
lastReportCard: ReportCard | null
reports: { dance, vocal, korean: { pronunciation, follow, correction, lyrics } }
reportHistory: { dance: [], vocal: [], korean: [] }  // {at, score} 최대 40개
persistedSessions: { at, domain, score }[]  // localStorage 'onnode_growth_sessions_v1' 최대 1000개
historyMetaRef: { dance, vocal, korean: { lastAt, lastScore } }
```

#### 퀵 커맨드 (입력이 `/`로 시작하면 뜨는 메뉴)

`/댄스, /보컬, /한국어 발음연습, /한국어 따라말하기, /한국어 ai교정, /한국어 가사학습, /오늘 리포트 보여줘, /최근 추이 보여줘, /성장 리포트 보여줘`

#### 인텐트 감지 `detectIntent(text)`

- 리포트/추세/성장 관련 단어 → `{type: 'report', target, period, includeTrend, includeGrowth, includeJson}`
- `/종료 등` → `{type: 'feature', feature: 'none'}`
- `댄스/춤/dance/舞蹈` → `feature: 'dance'`
- `보컬/노래/음정/vocal/sing/声乐` → `feature: 'vocal'`
- `가사` + `학습` → `korean-lyrics`
- `ai` + (`교정`|`발음교정`) → `korean-correction`
- `문장` + `따라` → `korean-follow`
- `발음` + `연습` → `korean-pronunciation`
- `/한국어`|`한국어`|`korean` → `korean-pronunciation` (기본)
- 기타 → `{type: 'chat'}`

#### 대화 처리 (`handleSubmitMessage`)

1. 인텐트 분기 → feature 실행 / report 생성 / 일반 chat
2. feature: `activeFeature` + `activeTab` 세팅 → `getModeReply(feature, lang)` 자동 assistant 메시지
3. report: `buildReportCard(target, reports, reportHistory, persistedSessions, period, date, {includeTrend, includeGrowth, language})` → assistant 메시지 + Gemini 추가 답변
4. chat: `generateCoachReply()` → Gemini 우선, 실패 시 `buildFallbackCoachReply()`

#### `buildReportCard` (매우 중요)

반환 구조:
```ts
{
  title: '오늘의 통합 리포트' | 'DANCE 연습 리포트' | ...,
  body: string[],           // 각 도메인 한 줄 요약
  periodSummary: {title, lines, stats: {sessions, average, best, worst}},
  trend: string[],          // 도메인별 최근 8개 점수 추이 텍스트
  growth: {
    title, lines,
    achievement: {targetScore, todayAchievementRate, weeklyGoalProgress},
    routines: [{label, feature}],  // 최대 4개
    summary: {todayAverage, yesterdayAverage, weeklyAverage, vsYesterday, vsLastWeek}
  } | null,
  text: string              // 챗봇 말풍선 본문
}
```

#### `buildRecommendedRoutines`

이전 리포트의 needs/feedback, 성장 지표(vsYesterday/vsLastWeek)에 따라 **한/영/중 버전** 루틴 문자열을 최대 4개 생성. 각 루틴은 `{label, feature}` — `feature` 클릭 시 `runRoutine()`에서 해당 모드 실행.

#### Gemini 호출 스펙

```ts
endpoint: https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${KEY}
body: {
  contents: [{role: 'user', parts: [{text: prompt}]}],
  generationConfig: { temperature: 0.55, topP: 0.9, maxOutputTokens: 380 }
}

prompt 구성:
  1. "당신은 ONNODE의 AI 코치입니다."
  2. toneInstruction(coachTone, lang)
  3. 규칙 (반드시 해당 언어로, 3~6문장, 수치 포함, 마지막 문장은 실행 가능한 다음 연습)
  4. 현재 코칭 데이터 JSON (buildCompactContext)
  5. 최근 리포트 카드 JSON (있으면)
  6. 최근 대화 8개 (있으면)
  7. 사용자 질문
```

#### 폴백

키 없음/오류 시 `buildFallbackCoachReply(input, reportCard, context, lang)` — 8개 언어 각각 하드코딩된 문구로 대응.

#### 샘플 데이터 생성 (개발/데모용)

`createPracticeLikeReportData()` → 21일치 dance/vocal/korean 세션 목업 생성 후 reports/history/persistedSessions 전부 덮어쓰고 localStorage에 저장. 리포트 탭으로 이동.

### 6-7. DanceTrainingView (views/DanceTrainingView.tsx)

**좌측 (3/5 폭)**: 유튜브 기준 영상
- `<YouTubeImport onLoad={setVideoUrl} />` — URL 입력 → `https://www.youtube.com/embed/{videoId}` 추출
- `<iframe src={videoUrl}?autoplay=1&playsinline=1 />` — `transform: mirror ? scaleX(-1) : none`
- 속도 슬라이더 `[0.25, 0.5, 0.75, 1.0]`
- `<MirrorModeToggle>`, `<DifficultySlider>` 1~5 (변경 시 `POST /api/dance/set-difficulty` 호출, 현재는 404 무시)

**우측 (2/5 폭)**: 유저 카메라 + 실시간 분석
- `<video ref srcObject={camera}>` + 오버레이 `<canvas ref>` (둘 다 `scale-x-[-1]` 셀카 미러)
- `startCamera()`:
  - `isSecureOrigin` 체크 (https || localhost || 127.0.0.1)
  - `getUserMedia({video: {facingMode:'user', width:720, height:1280}, audio:false})`
  - fallback `{video: true}`
  - 실패 시 에러 메시지: NotAllowedError, NotFoundError, VIDEO_ATTACH_FAILED 각각 분기
- `usePoseDetection({active, videoRef, overlayCanvasRef})`:
  - MediaPipe `HolisticLandmarker` (GPU 우선, 실패 시 CPU) — WASM 경로는 CDN `jsdelivr @0.10.34`
  - 20Hz (50ms 간격) detectForVideo → POSE + LEFT/RIGHT HAND landmarks
  - **점수 공식**:
    - `leftElbowDeg / rightElbowDeg`: `angleDeg(어깨, 팔꿈치, 손목)`
    - `leftKneeDeg / rightKneeDeg`: `angleDeg(엉덩이, 무릎, 발목)`
    - `shoulderTiltDeg, hipTiltDeg`: `lineTiltDeg`
    - `torsoLeanDeg`: 어깨 중심 ↔ 골반 중심 벡터 각도
    - `armAccuracy = (score(leftElbow,155,35) + score(rightElbow,155,35)) / 2`
    - `legAccuracy = (score(leftKnee,165,40) + score(rightKnee,165,40)) / 2`
    - `symmetry = 100 - |leftElbow - rightElbow|`
    - `postureBalance = 100 - (shoulderTilt*2.7 + hipTilt*2.2 + torsoLean*2.0)`
    - `poseConfidence = 평균 visibility (0.2 이상 필터) × 100`
    - `danceActivity`: 손목 궤적 1.8초 윈도우 이동 거리 × 4500 (클램프 100)
    - `totalScore = danceActivity*0.2 + armAccuracy*0.22 + legAccuracy*0.2 + postureBalance*0.18 + symmetry*0.1 + poseConfidence*0.1`
  - `history`: 최근 80프레임 total score
  - `bestMoment`: 베스트 점수 나온 시간 `mm:ss`
  - `feedbackList`: 임계값 기반 팁 최대 5개 (예: `왼팔 각도 ${deg}도: 팔꿈치를 더 펴서 150~170도를 목표로 맞춰보세요.`)
  - `buildIssue()`: 가장 시급한 1줄 이슈
- **오버레이**:
  - 포즈: `rgba(34, 211, 238, 0.9)` 연결선, 흰 점 radius 3.3
  - 손: `rgba(251, 191, 36, 0.9)` 선 1.8, 점 2.1
  - 보여지는 landmark 수 표시 `포즈 {n}/33 · 손 {m}/42`
- **PoseFeedbackOverlay**: 점수/이슈/summary/metrics/feedbackList + "커뮤니티에 공유" 버튼

`onReportUpdate({mode:'dance', cameraOn, isAnalyzing, score, summary, metrics, feedbackList, updatedAt})` 을 매 프레임 props로 호출 → AICoachView가 집계.

### 6-8. VocalTrainingView (views/VocalTrainingView.tsx)

- `useAudioAnalysis({active: recording, targetMidi})`:
  - `getUserMedia({audio, video:false})`
  - `AudioContext` → `AnalyserNode` (fftSize 2048)
  - 90ms 간격 루프
  - `detectPitchHzAutocorr()` (autocorrelation, YIN 비슷한 단순 구현)
  - `hzToMidiFloat`, `midiToNoteName`
  - `currentCents`: 목표 MIDI 대비 ±cents
  - `pitchScore`: stability from recent 6 hz
  - `rhythmScore`: onset interval std
  - `liveScore = (pitchScore + rhythmScore) / 2` 등 가중
  - `waveBars`: 48바 파형 시각화용
  - `tuningState`: `'on-target' | 'high' | 'low' | 'idle'`
  - `pitchFeedback`: 한국어 문장 (e.g. `"음정이 조금 낮습니다..."`)
  - `suggestedMidi`: recent 30프레임 median → 자동 목표음
- UI:
  - 4줄 가사 (`t('vocal.line1')..line4`) → `<LyricsDisplay>`
  - 5초마다 자동으로 다음 라인, 500ms마다 liveScore 누적 → 라인 종료 시 평균 → `lineScores[idx]`
  - `<PitchMeter>`: 목표 ±100cents 게이지
  - `<PitchGraph>`: 최근 피치 시계열
  - `<WaveformVisualizer>`: 48바
  - `<LiveScore>`: 종합 점수 카드
  - "시작/중지" 버튼, "자동 목표음" 토글

### 6-9. KoreanAIView (4모드)

- 좌측 200px 사이드바: Pronunciation/FollowAlong/Correction/LyricsVocab
- `useKoreanSpeechCoach({active, referenceText})`:
  - `SpeechRecognition` (`lang = 'ko-KR'`, `continuous=true`, `interimResults=true`)
  - `getUserMedia({audio})` + AnalyserNode로 볼륨
  - `transcript` + `interimTranscript`
  - `similarityScore(reference, spoken)`: `levenshteinDistance` 기반
  - `clarity`: rms volume 평균
  - `pace`: 문자/초 안정성
  - `confidence`: 최근 N회 similarity std + speechRecognition.confidence
  - `buildRealtimeFeedback()`: 3개 팁 생성
- 각 모드별 UI:
  - **Pronunciation**: 기준 문장 1개 고정, 말하면서 실시간 점수
  - **FollowAlong**: 여러 라인, 라인별 녹음 + 점수
  - **Correction**: 틀린 음절 하이라이트 + AI 교정안
  - **LyricsVocab**: 가사 단어 하이라이트 + 어휘 인식

### 6-10. DiscoverView + 서브뷰

- `fetchMockDiscover()`로 초기 상태 로드 (즉시 화면 표시)
- 마운트 시 `fetch('/api/discover?track=all&limit=20')` → 성공하면 카테고리별 데이터 교체
- 카테고리 칩(`all/trending/dance/songs/challenges/korean`)으로 섹션 필터
- 각 섹션: 가로 스크롤 카드 리스트
- Trending: 유튜브 썸네일 + 제목 + 뷰수
- Popular Dance / Songs / Challenges / Korean Content: 동일 패턴, 클릭 시 해당 서브뷰로 이동
- `lastUpdated`는 i18n 날짜 포맷으로 표시

### 6-11. MyPage + GrowthGraph + Goals + SavedVideos + FeedbackHistory

- `<GrowthGraph>`: recharts LineChart — X축 날짜, Y축 점수, 3개 라인 (dance/vocal/korean)
- `<GoalProgressCard>`: 오늘/주간 진행률, 추천 루틴 버튼
- `<SavedVideosGrid>`: 썸네일 그리드, 날짜/점수 뱃지
- FeedbackHistory: 리포트 카드 리스트 (무한 스크롤 또는 페이징)

### 6-12. Community/Chat

- `useRealtimeChat()` 목업 훅:
  - seedConversations: DM(Mina, 2 unread) + Group(ONNODE Dance Crew)
  - `sendText`, `sendMedia(type: 'image'|'video')` (setTimeout으로 업로드 시뮬레이션 20%씩)
  - `createConversation(name, type)`, `markRead`
- `<ChatWindowView>`: 헤더(상대 이름 + online 점) + 메시지 리스트 + 입력창 + `<AttachmentPicker>` (이미지/영상)
- `<MessageBubble>`: text/image/video 렌더, `sender === 'me'`는 우측 `#FF1F8E` 버블

### 6-13. Notifications / Settings

- `<NotificationsView>`: AI 알림 목록, 각 항목 클릭 → `onNavigate`로 해당 뷰
- `<SettingsScreen>` / `<SettingsView>`: `useSettingsStore` 기반
  - 프로필 (닉네임, 레벨, 아바타)
  - 트랙 활성화 체크박스
  - 코치 언어/톤/피드백 민감도
  - 코치 모드(single/multi)
  - 마이크 민감도 1~10, 노이즈 필터
  - 카메라 기본(front/back)
  - 영상 자동 저장, 보관 기간, 스토리지 사용량
  - 리포트 포맷(pdf/json)
  - 선호 언어 (useLanguageStore 연동)
  - SNS 연결 (TikTok/Instagram/YouTube/Twitter) — OAuth 플로우는 목업
  - 연습 알림 (시간/요일)
  - 구독 (free/pro/prime) — 카드는 `from-[#FF1F8E] to-violet-600` 그래디언트
- **localStorage 키**: `onnode.settings.v1`

### 6-14. 레거시 TrainingApp (데스크톱 + 모바일 분리 허브, 선택)

기존 코드에 존재. 신규 Layout 경로를 메인으로 하지만, 아래도 유지:

- `<HubView>`: "Desktop App" 버튼 + "SESSION ID" 입력 + "Mobile Sync" 버튼
- **Desktop**: `createSession()` → 5자리 세션 ID → Firestore doc 생성 → 좌측 AI 채팅 + 우측 `<SpatialSimulator>` Canvas (배경 이미지 무빙 + 핑크 점 원형 회전) + QR 코드
- **Mobile**: URL `?session=XYZ`로 진입 → `getUserMedia` → 로컬 비디오 미리보기 + 하단 탭(댄스/보컬/한국어) + 분석 버튼
- `useWebRtcSession({db, appId, sessionId, role: 'laptop'|'mobile', localStream, enabled})`:
  - Firestore 경로: `artifacts/{appId}/public/data/sessions/{sessionId}/webrtc/signaling` + `webrtcIce`
  - STUN: `stun:stun.l.google.com:19302`, `stun:stun1.l.google.com:19302`
  - TURN (optional): `VITE_WEBRTC_TURN_URLS`, `VITE_WEBRTC_TURN_USERNAME`, `VITE_WEBRTC_TURN_CREDENTIAL`
  - mobile = offerer (createOffer → addTrack localStream), laptop = answerer
  - disconnect/failed 시 3~5초 후 재연결

---

## 7. Firebase 구조

### 7-1. Auth

- **익명 인증**: `signInAnonymously(auth)` 기본, 환경변수로 `__initial_auth_token`이 들어오면 `signInWithCustomToken()` 사용
- `onAuthStateChanged`: `setUser(u)` + URL `?session=ID` 파싱 → `setSessionId`

### 7-2. Firestore 경로

```
artifacts/{appId}/public/data/sessions/{sessionId}
  - id, status, activeTraining, theme, metrics, vocal, korean, createdAt, creator, lastUpdate

artifacts/{appId}/public/data/sessions/{sessionId}/webrtc/signaling
  - offer: {type, sdp}, answer: {type, sdp}, updatedAt, resetAt

artifacts/{appId}/public/data/sessions/{sessionId}/webrtcIce/{autoId}
  - from: 'mobile' | 'laptop', candidate: JSON string, ts

artifacts/{appId}/public/data/sessions/{sessionId}/participants/{userId}
  - (예약, 참가자 목록)
```

- `appId`: `__app_id` 전역 변수 → `window.__app_id` → `VITE_APP_ID` → `'onnode-desktop-v17'` 순 폴백

### 7-3. Firebase 초기화 (App.jsx의 `readFirebaseConfig`)

1. `__firebase_config` 전역(문자열 또는 객체) 우선
2. `VITE_FIREBASE_CONFIG` (한 줄 JSON)
3. 개별 키 8개 (`VITE_FIREBASE_API_KEY` 등) — 최소 `apiKey + authDomain + projectId + appId`
4. 실패 시 `<FirebaseSetupError>` 화면

---

## 8. 서버리스 API (Vercel Functions)

### 8-1. `/api/discover` (GET)

쿼리: `?track=all|dance|songs|challenges|korean&limit=20`

로직:
1. 메모리 캐시 검사 (`CACHE_TTL_MS = 1시간`)
2. 스테일이고 `YOUTUBE_API_KEY` 또는 (`SPOTIFY_CLIENT_ID` + `SPOTIFY_CLIENT_SECRET`) 있으면 `collectTrending()` 실행
3. 응답:
```json
{
  "data": { "trending": [...], "dance": [...], "songs": [...], "challenges": [...], "korean": [] },
  "lastUpdated": "ISO-8601" | null
}
```

`collectTrending()` 내부:
- `fetchTrendingVideos(key)` — YouTube videos?chart=mostPopular&regionCode=KR&videoCategoryId=10
- `fetchPopularDance(key)` — search?q=kpop+dance+cover&order=viewCount
- `fetchPopularSongs(clientId, secret)` — Spotify Client Credentials → playlist `37i9dQZF1DX9tPFwDMOaN1` 트랙 20개
- `fetchChallenges(key)` — search?q=kpop+challenge&order=viewCount&max=6
- 각 실패는 빈 배열로 처리(전체 실패해도 응답은 200)

### 8-2. `/api/cron/update-trending`

- `vercel.json`: `{ "crons": [{ "path": "/api/cron/update-trending", "schedule": "0 0 * * 1" }] }` (매주 월요일 00:00 UTC)
- `CRON_SECRET` 환경변수 있으면 `Authorization: Bearer <secret>` 검증
- `collectTrending()` → `setCache(fresh)` → 200 OK

### 8-3. (사용처 미구현) `POST /api/dance/set-difficulty`

`DanceTrainingView`가 호출하나 서버는 아직 없음. **선택적으로** 난이도 저장 엔드포인트 구현 가능. 현재 호출 실패는 `.catch(()=>{})`로 무시.

---

## 9. PWA 설정

### 9-1. vite.config.js (필수)

```js
import { VitePWA } from 'vite-plugin-pwa';

VitePWA({
  registerType: 'autoUpdate',
  injectRegister: 'auto',
  includeAssets: ['icons/favicon.ico', 'icons/apple-touch-icon-180x180.png', 'icons/source.svg', 'idol-choreo-skeleton.json'],
  manifest: {
    id: '/',
    name: 'K-Onnode',
    short_name: 'K-Onnode',
    description: 'AI 기반 K-POP 댄스 코칭 · 실시간 자세 분석 플랫폼',
    lang: 'ko',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    display_override: ['window-controls-overlay', 'standalone', 'browser'],
    orientation: 'any',
    theme_color: '#0f172a',
    background_color: '#0f172a',
    categories: ['fitness', 'lifestyle', 'entertainment'],
    icons: [
      { src: '/icons/pwa-64x64.png', sizes: '64x64', type: 'image/png' },
      { src: '/icons/pwa-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  },
  workbox: {
    maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
    globPatterns: ['**/*.{js,css,html,wasm,json,png,svg,ico,woff,woff2}'],
    cleanupOutdatedCaches: true,
    clientsClaim: true,
    skipWaiting: true,
    navigateFallback: '/index.html',
    navigateFallbackDenylist: [/^\/api\//],
    runtimeCaching: [
      { urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i, handler: 'StaleWhileRevalidate', options: { cacheName: 'google-fonts-stylesheets' } },
      { urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i, handler: 'CacheFirst', options: { cacheName: 'google-fonts-webfonts', expiration: { maxEntries: 30, maxAgeSeconds: 31536000 } } },
      { urlPattern: /^https:\/\/i\.ytimg\.com\/.*/i, handler: 'StaleWhileRevalidate', options: { cacheName: 'youtube-thumbnails' } },
      { urlPattern: /^https:\/\/i\.scdn\.co\/.*/i, handler: 'StaleWhileRevalidate', options: { cacheName: 'spotify-images' } },
      { urlPattern: /\/api\/discover.*/i, handler: 'NetworkFirst', options: { cacheName: 'api-discover', networkTimeoutSeconds: 5 } },
      { urlPattern: /^https:\/\/firestore\.googleapis\.com\/.*/i, handler: 'NetworkOnly' },
      { urlPattern: /^https:\/\/identitytoolkit\.googleapis\.com\/.*/i, handler: 'NetworkOnly' },
      { urlPattern: /^https:\/\/generativelanguage\.googleapis\.com\/.*/i, handler: 'NetworkOnly' },
    ],
  },
  devOptions: { enabled: false },
})
```

### 9-2. index.html 메타

- `theme-color: #0f172a`, `color-scheme: dark`
- `apple-mobile-web-app-capable: yes`, `apple-mobile-web-app-status-bar-style: black-translucent`, `apple-mobile-web-app-title: K-Onnode`
- `apple-touch-icon` → `/icons/apple-touch-icon-180x180.png`
- Open Graph (title/description/image)
- `<title>K-Onnode — AI K-POP 댄스 코칭</title>`

### 9-3. 아이콘 (로고 "KO" 플레이스홀더)

`public/icons/source.svg`: 512×512, 라운드 96px, 배경 그래디언트 `#0f172a → #1e1b4b`, 텍스트 "KO" Poppins 900 italic 240px, fill `linear-gradient(#ec4899 → #7c3aed)`, glow filter (Gaussian blur stdDeviation=8).

**생성 스크립트**: `npm run generate-pwa-assets` → `@vite-pwa/assets-generator` CLI (preset `minimal2023`).

---

## 10. 환경 변수 (`.env`)

```
# Firebase (VITE_ 접두사 필수 = 프론트에 노출)
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=

# Gemini (프론트 직접 호출 — 주의: 노출됨)
VITE_GEMINI_API_KEY=
VITE_GEMINI_MODEL=gemini-1.5-flash

# (옵션) WebRTC TURN
VITE_WEBRTC_TURN_URLS=
VITE_WEBRTC_TURN_USERNAME=
VITE_WEBRTC_TURN_CREDENTIAL=

# 서버 전용 (VITE_ 없음, 서버리스 함수에서만 사용)
YOUTUBE_API_KEY=
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
CRON_SECRET=
```

---

## 11. 빌드/배포 파이프라인

### 11-1. 로컬 개발

```
npm install
npm run dev              # Vite https://localhost:5173 (basicSsl)
npm run build            # dist/ 빌드
npm run preview          # 빌드 결과 로컬 서빙
npm run generate-pwa-assets  # 아이콘 재생성
```

### 11-2. Vercel 배포

- GitHub 저장소 연결 → Vercel 자동 감지 (Framework: Vite)
- Build Command: `npm run build`, Output: `dist`
- 환경변수: 위 9개(VITE_) + 선택 4개(서버) 등록
- `vercel.json` cron 자동 활성화
- PR 시 Preview Deployment, main 푸시 시 Production

### 11-3. Firebase 설정

- Console → Authentication → Sign-in method → **Anonymous** 활성화
- Firestore 생성 + 규칙(개발용):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{db}/documents {
    match /artifacts/{appId}/public/data/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```
- Authentication → Settings → **Authorized domains**에 Vercel 도메인 추가

---

## 12. 핵심 상호 연결도 (한눈에)

| Source | Event | Target | 효과 |
|---|---|---|---|
| `DanceTrainingView` | 20Hz pose tick | `onReportUpdate('dance', payload)` | AICoach에 reports.dance + history.dance push |
| `VocalTrainingView` | 90ms pitch tick | `onReportUpdate('vocal', payload)` | reports.vocal + history.vocal |
| `KoreanAIView/*Mode` | speech end | `onReportUpdate('korean-*', payload)` | reports.korean.* + history.korean |
| `AICoachView` chat | `/댄스` 입력 | `activeFeature='dance'` | 해당 탭에서 `<DanceTrainingView>` 임베드 |
| `AICoachView` chat | `/리포트` 입력 | `buildReportCard()` → `<ReportListView>` | report 탭 이동 + Gemini 코칭 답변 |
| `LeftPanel` | 메뉴 클릭 | `onSelectView(view)` | `mainView` 교체 + `activeTab` 자동 매핑 |
| `HomeView` QuickStart | `onNavigate('dance')` | `Layout.handleSelectView` | `lastTrainingView='dance'` 업데이트 |
| `settingsSlice` | `updateSetting('preferredLanguage')` | `useLanguageStore.setLanguage` | i18n + localStorage 동기화 |
| `App.jsx` | sessionId URL param | `onSnapshot(sessionRef)` | `sessionData` 실시간 반영 |
| `MobileController` | `update({status:'analyzing'})` | Firestore | Desktop이 즉시 반영 |
| `useWebRtcSession` | offer/answer SDP 감지 | `setRemoteStream` | 노트북 Canvas에 폰 영상 표시 |
| `DiscoverView` | mount | `fetch('/api/discover')` | YouTube/Spotify 실데이터로 교체 |
| `vercel.json cron` | 매주 월요일 00시 UTC | `/api/cron/update-trending` | 서버 CACHE 갱신 |

---

## 13. 품질/테스트 요구사항

1. **타입 안전성**: TypeScript는 프로젝트 섞여 있지만(.tsx/.ts/.jsx) 대부분 `// @ts-nocheck`. 엄격 타입은 요구하지 않지만 런타임 에러는 없어야 함.
2. **카메라/마이크 사용 실패 UX**: 권한 거부/HTTPS 아님/장치 없음 각각 별도 메시지.
3. **Gemini 실패 시**: 반드시 `buildFallbackCoachReply`로 기본 코칭 제공, 절대 조용히 실패 X.
4. **모바일 반응형**: `md:` 중단점 이상에서만 LeftPanel 표시. 이하에선 하단 TabBar 사용.
5. **오프라인**: 앱 쉘은 캐시에서 로드됨. 실시간 기능(Firestore, Gemini)은 네트워크 필요 — 이때 명시적 오류 메시지.
6. **국제화**: 모든 사용자 대상 문자열은 `t(key)` 경유. 하드코딩 한국어는 피함(단 AI 프롬프트 내부 지시문은 허용).

---

## 14. 추가 구현 노트

- `SpatialSimulator` 캔버스 애니메이션: 1280×720, 배경 이미지 좌우 이동 `Math.sin(time)*35`, 60개 핑크 점 원형 회전, `status==='done'`일 때 "PERFECT" 황금 텍스트 오버레이, `isAnalyzing` 시 "AI DATA PROCESSING..." 반투명 오버레이.
- `HubView` 히어로 타이틀: `ONNODE` 120px, font-weight 900, italic, `bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent`.
- 레거시 App.jsx의 `analyzeKoreanText(ref, input)`: 문자 매칭 + 길이 비율 → accuracy/charMatch/lengthScore + 3개 tips.
- `hzToNoteName(hz)`: `midi = 69 + 12*log2(hz/440)`, `NOTE_NAMES[((midi%12)+12)%12] + octave`.
- 풀리스는 `lucide-react`의 기본 아이콘 세트로 충분.

---

## 15. 최종 체크리스트 (에이전트용)

구현 완료 판단 기준:

- [ ] `npm install && npm run build` 에러 없이 성공
- [ ] `/manifest.webmanifest`, `/sw.js`, `/icons/*` 모두 dist에 포함
- [ ] 배포 후 데스크톱 Chrome에서 메인 뷰(Home/Discover/Chat/AICoach) 정상 렌더
- [ ] AICoach 채팅창에 `/댄스` 입력 시 DanceTraining 탭으로 자동 전환
- [ ] Dance 모드에서 카메라 권한 후 포즈 랜드마크 오버레이 표시
- [ ] Vocal 모드에서 마이크 허용 후 목표음 슬라이더 이동 시 실시간 cents 반영
- [ ] Korean 4모드 각각 진입 가능 (Web Speech 없으면 그에 맞는 안내)
- [ ] Discover 페이지가 API 실패 시에도 목업으로 정상 표시
- [ ] 좌측 LeftPanel 탭 4개 전부 클릭 시 서브메뉴 전환
- [ ] Settings 변경 시 localStorage `onnode.settings.v1` 에 저장 + 재접속 시 복원
- [ ] 언어 전환 시 즉시 전체 UI 문자열 교체 (8개 모두)
- [ ] 모바일 뷰(`< md`)에서 LeftPanel 숨김, 하단 TabBar 표시
- [ ] PWA 설치 배너 (Android Chrome) / "홈 화면에 추가" (iOS Safari)로 설치 가능
- [ ] 설치 후 standalone 모드로 주소창 없이 열림

---

## 16. 산출물

```
프로젝트 루트/
├─ 위 §3 파일 트리 전체
├─ README.md (프로젝트 소개 + 실행 방법 + 환경변수 가이드)
└─ 동작하는 배포 URL (Vercel)
```

이 문서에 명시되지 않은 세부 UI 디테일(여백, 그림자 강도 등)은 **§5 디자인 원칙**을 따르세요. 명시된 기능/데이터 흐름/API 연결은 임의로 변경 금지.

---
