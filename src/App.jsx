import { useState, useEffect } from 'react'
import Unity, { UnityContext } from 'react-unity-webgl'
import './App.css'

// 백엔드 URL (환경 변수 또는 기본값)
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

// Unity WebGL 빌드 파일 경로 설정
const unityContext = new UnityContext({
  loaderUrl: `${BACKEND_URL}/api/unity/Build.loader.js`,
  dataUrl: `${BACKEND_URL}/api/unity/Build.data`,
  frameworkUrl: `${BACKEND_URL}/api/unity/Build.framework.js`,
  codeUrl: `${BACKEND_URL}/api/unity/Build.wasm`,
})

function App() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)

  useEffect(() => {
    unityContext.on('loaded', () => {
      setIsLoaded(true)
    })

    unityContext.on('progress', (progression) => {
      setLoadingProgress(progression)
    })

    return () => {
      unityContext.removeAllEventListeners()
    }
  }, [])

  return (
    <div className="app-container">
      {!isLoaded && (
        <div className="loading-overlay">
          <div className="loading-content">
            <h2>게임 로딩 중...</h2>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${loadingProgress * 100}%` }}
              />
            </div>
            <p>{Math.round(loadingProgress * 100)}%</p>
          </div>
        </div>
      )}
      <Unity
        unityContext={unityContext}
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
