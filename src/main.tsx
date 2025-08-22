import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';

import App from './App.tsx'
import { initializeTheme } from './lib/theme-utils'

// Initialize theme from config
initializeTheme();

// Clear client-side caches on first load per tab if not authenticated
(function conditionalClearCachesAndForceLogin() {
	try {
		const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
		const clearedThisTab = sessionStorage.getItem('startupCacheCleared') === 'true';

		if (!isAuthenticated && !clearedThisTab) {
			// Clear storages
			localStorage.clear();
			sessionStorage.clear();
			// mark after clear
			sessionStorage.setItem('startupCacheCleared', 'true');

			// Clear CacheStorage (for any previous SW/asset caches)
			if ('caches' in window) {
				caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k)))).catch(() => {});
			}

			// Unregister any Service Workers
			if ('serviceWorker' in navigator) {
				navigator.serviceWorker.getRegistrations().then(regs => {
					regs.forEach(reg => reg.unregister().catch(() => {}));
				}).catch(() => {});
			}

			// Ensure we land on /login (without polluting history)
			try {
				if (window.location.pathname !== '/login') {
					window.history.replaceState(null, '', '/login');
				}
			} catch {}
		} else if (isAuthenticated && !clearedThisTab) {
			// Mark that we've evaluated on this tab to avoid re-clearing on navigations
			sessionStorage.setItem('startupCacheCleared', 'true');
		}
	} catch {}
})();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
