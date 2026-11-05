import './App.css'
import LoginPage from './app/login/LoginPage'
import Header from './components/navigation/Header'
import ContentController from './app/strucuture/structure'
import ThemeEditor from './components/theme-editor'
import { Outlet } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { DEMO_AUTH_TOKEN } from './service/demo.api'
import { isBackendApiConfigured } from './service/backend.api'
import { startDemoRecordSync } from './service/demo-record-sync'
import { getDemoUser } from './lib/demo-form-records'

function App() {
  const [isLoginDone, setIsLoginDone] = useState(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
    const authToken = localStorage.getItem('authToken')
    if (isBackendApiConfigured) {
      return isAuthenticated
        && Boolean(authToken)
        && Boolean(localStorage.getItem('userEmail'))
    }
    if (isAuthenticated && !authToken) {
      localStorage.setItem('authToken', DEMO_AUTH_TOKEN)
    }
    return isAuthenticated
  });

  const [showThemeEditor, setShowThemeEditor] = useState(false);

  useEffect(() => {
    if (isLoginDone) {
      localStorage.setItem('isAuthenticated', 'true');
    } else {
      localStorage.removeItem('isAuthenticated');
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'H') {
        setShowThemeEditor(prev => !prev);
      }
    };
    const handleLogout = () => setIsLoginDone(false);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('habitech-logout', handleLogout);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('habitech-logout', handleLogout);
    };
  }, [isLoginDone]);

  useEffect(() => {
    if (!isLoginDone || !isBackendApiConfigured) return

    const user = getDemoUser()
    const token = localStorage.getItem('authToken')
    const expiresAt = Date.parse(localStorage.getItem('authTokenExpiresAt') ?? '')
    if (!user || !token) return
    if (token !== DEMO_AUTH_TOKEN && expiresAt <= Date.now()) return

    return startDemoRecordSync(user, token)
  }, [isLoginDone])

  return (
    <div className="relative flex h-screen flex-col bg-background">
      {!isLoginDone ? (
        <LoginPage setIsLoginDone={setIsLoginDone} />
      ) : (
        <>
          <Header />
          <ContentController>
            <Outlet />
          </ContentController>
        </>
      )}

      {showThemeEditor && (
        <div className="fixed top-4 right-4 z-50 w-126 max-h-[90vh] overflow-auto">
          <ThemeEditor />
        </div>
      )}
    </div>
  )
}

export default App
