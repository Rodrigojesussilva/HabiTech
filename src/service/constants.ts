// Environment Detection
const isLocalDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'

// API Configuration
export const API_CONFIG = {
  // Production URLs (Angerona Cloud)
  PRODUCTION: {
    SURVEY_RESOURCE: "https://api-sehab.develop.habitasampa.inf.br",
    SELAGEM: "https://api-sehab.develop.habitasampa.inf.br", 
    AUTH: "https://api-sehab.develop.habitasampa.inf.br",
    FILE: "https://api-sehab.develop.habitasampa.inf.br",
    USER: "https://api-sehab.develop.habitasampa.inf.br"
  },
  
  // Local Development URLs (Docker services)
  LOCAL: {
    SURVEY_RESOURCE: "http://localhost:7076",
    SELAGEM: "http://localhost:7074",
    AUTH: "http://localhost:7079", 
    FILE: "http://localhost:7072",
    USER: "http://localhost:7078"
  }
}

// Auto-detect environment or allow manual override
const USE_LOCAL_BACKEND = isLocalDevelopment && !localStorage.getItem('FORCE_PRODUCTION') && false

// Current API URLs based on environment
export const CURRENT_API = USE_LOCAL_BACKEND ? API_CONFIG.LOCAL : API_CONFIG.PRODUCTION

// Legacy constant for backward compatibility
export const API_BASE_URL = CURRENT_API.SURVEY_RESOURCE

// Individual service URLs
export const SURVEY_RESOURCE_URL = CURRENT_API.SURVEY_RESOURCE
export const SURVEY_RESOURCE_BASE_URL = `${CURRENT_API.SURVEY_RESOURCE}/survey-resource`
export const SELAGEM_URL = CURRENT_API.SELAGEM
export const AUTH_URL = CURRENT_API.AUTH
export const FILE_URL = CURRENT_API.FILE
export const USER_URL = CURRENT_API.USER

// Debug info
console.log('🔧 API Configuration:', {
  environment: USE_LOCAL_BACKEND ? 'LOCAL' : 'PRODUCTION',
  hostname: window.location.hostname,
  isLocalDevelopment,
  forceProduction: localStorage.getItem('FORCE_PRODUCTION'),
  currentAPI: CURRENT_API
})

// Helper functions to switch environments
export const switchToProduction = () => {
  localStorage.setItem('FORCE_PRODUCTION', 'true')
  console.log('🌐 Switched to PRODUCTION APIs. Refresh page to apply.')
}

export const switchToLocal = () => {
  localStorage.removeItem('FORCE_PRODUCTION')
  console.log('🏠 Switched to LOCAL APIs. Refresh page to apply.')
}

//export const API_BASE_URL = "https://api-sehab.develop.habitasampa.inf.br"

