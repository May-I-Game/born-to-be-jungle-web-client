import { useState, useEffect, useMemo } from 'react'
import { Unity, useUnityContext } from 'react-unity-webgl'
import './App.css'

// 백엔드 URL (환경 변수 또는 기본값)
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function App() {
  const { unityProvider, loadingProgression, isLoaded } = useUnityContext({
    loaderUrl: `${BACKEND_URL}/api/unity/Build/unity-build.loader.js`,
    dataUrl: `${BACKEND_URL}/api/unity/Build/unity-build.data`,
    frameworkUrl: `${BACKEND_URL}/api/unity/Build/unity-build.framework.js`,
    codeUrl: `${BACKEND_URL}/api/unity/Build/unity-build.wasm`,
  })

  return (
    <div className="app-container">
      {!isLoaded && (
        <div className="loading-overlay">
          <div className="loading-content">
            <h2>게임 로딩 중...</h2>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${loadingProgression * 100}%` }}
              />
            </div>
            <p>{Math.round(loadingProgression * 100)}%</p>
          </div>
        </div>
      )}
      <Unity
        unityProvider={unityProvider}
        style={{
          width: '100%',
          height: '100%',
          visibility: isLoaded ? 'visible' : 'hidden'
        }}
      />
    </div>
  )
}

export default App
