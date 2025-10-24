# Unity WebGL Game - Web Application

Unity로 제작한 게임을 WebGL로 빌드하여 웹에서 플레이할 수 있는 애플리케이션입니다.
slither.io처럼 웹페이지 접속 시 바로 게임이 실행됩니다.

## 기술 스택

### 프론트엔드
- React 18
- Vite
- react-unity-webgl

### 백엔드
- FastAPI
- Uvicorn
- Python 3.8+

## 프로젝트 구조

```
born-to-be-jungle-web-client/
├── backend/                    # FastAPI 백엔드
│   ├── main.py                # FastAPI 메인 서버
│   ├── requirements.txt       # Python 의존성
│   └── unity-build/           # Unity WebGL 빌드 파일 위치
├── src/                       # React 소스 코드
│   ├── App.jsx               # 메인 앱 컴포넌트
│   ├── App.css               # 앱 스타일
│   ├── main.jsx              # React 엔트리 포인트
│   └── index.css             # 글로벌 스타일
├── index.html                # HTML 템플릿
├── package.json              # Node.js 의존성
└── vite.config.js            # Vite 설정
```

## 설치 및 실행

### 1. 환경 변수 설정

**프론트엔드:**
```bash
# .env.example을 복사하여 .env 파일 생성
cp .env.example .env

# .env 파일 수정 (필요시)
# VITE_BACKEND_URL=http://localhost:8000
```

**백엔드:**
```bash
# backend/.env.example을 복사하여 backend/.env 파일 생성
cp backend/.env.example backend/.env

# backend/.env 파일 수정 (필요시)
# ALLOWED_ORIGINS=http://localhost:3000
```

### 2. 프론트엔드 설정 (이것만 하면됨!!!!!)

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:3000)
npm run dev

# 프로덕션 빌드
npm run build
```

### 3. 백엔드 설정

```bash
# backend 폴더로 이동
cd backend

# Python 가상환경 생성 (선택사항)
python -m venv venv

# 가상환경 활성화
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# 의존성 설치
pip install -r requirements.txt

# FastAPI 서버 실행 (http://localhost:8000)
python main.py

# 또는 uvicorn으로 직접 실행
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 4. Unity WebGL 빌드 파일 업로드

Unity에서 WebGL로 빌드한 후 다음 파일들을 `backend/unity-build/` 폴더에 복사하세요:

- `Build.loader.js`
- `Build.data`
- `Build.framework.js`
- `Build.wasm`

**Unity 빌드 설정:**
1. Unity Editor에서 File > Build Settings
2. Platform을 "WebGL"로 선택
3. Build 버튼 클릭하여 빌드
4. 빌드 폴더의 `Build/` 디렉토리 내 파일들을 `backend/unity-build/`로 복사

## API 엔드포인트

### GET /
서버 상태 확인

### GET /api/health
헬스 체크

### GET /api/unity/{file_path}
Unity WebGL 빌드 파일 제공

## 개발 시 주의사항

### CORS 설정
개발 환경에서는 프론트엔드(localhost:3000)와 백엔드(localhost:8000)가 분리되어 있어 CORS가 설정되어 있습니다.

### Unity WebGL 빌드 파일명
기본적으로 `Build.loader.js`, `Build.data`, `Build.framework.js`, `Build.wasm` 파일명을 사용합니다.
다른 파일명을 사용하는 경우 `src/App.jsx`의 `UnityContext` 설정을 수정하세요.

```javascript
const unityContext = new UnityContext({
  loaderUrl: '/api/unity/YourBuildName.loader.js',
  dataUrl: '/api/unity/YourBuildName.data',
  frameworkUrl: '/api/unity/YourBuildName.framework.js',
  codeUrl: '/api/unity/YourBuildName.wasm',
})
```

## 프로덕션 배포

### 방법 1: 정적 파일 서빙 (권장)

1. 프론트엔드 빌드
```bash
npm run build
```

2. FastAPI에서 빌드된 프론트엔드 제공하도록 수정
```python
# backend/main.py에 추가
app.mount("/", StaticFiles(directory="../dist", html=True), name="static")
```

3. FastAPI만 실행
```bash
cd backend
python main.py
```

### 방법 2: 별도 서버 (백엔드 repo 분리 시)

**백엔드 배포:**
1. `backend/` 폴더를 별도 repo로 이동
2. AWS, GCP, Azure 등에 배포
3. 배포된 백엔드 URL 기록 (예: `https://api.your-game.com`)

**프론트엔드 배포:**
1. `.env` 파일에 백엔드 URL 설정
```bash
VITE_BACKEND_URL=https://api.your-game.com
```
2. Vercel, Netlify 등에 배포
3. 환경 변수 `VITE_BACKEND_URL`을 배포 플랫폼에서 설정

**백엔드 CORS 설정:**
`backend/.env`에 프론트엔드 도메인 추가
```bash
ALLOWED_ORIGINS=https://your-game.com,https://www.your-game.com
```

## 라이센스

MIT

## 문제 해결

### Unity 게임이 로드되지 않는 경우
1. 백엔드 서버가 실행 중인지 확인 (http://localhost:8000)
2. Unity 빌드 파일이 `backend/unity-build/`에 있는지 확인
3. 브라우저 개발자 도구에서 네트워크 탭 확인
4. CORS 오류가 있는지 콘솔 확인

### 빌드 파일이 크다고 경고가 뜨는 경우
Unity 빌드 설정에서:
- Compression Format: Gzip 또는 Brotli 사용
- Code Optimization: Size 선택
- Managed Stripping Level: High 선택
