import React from 'react'
import { SURVEY_RESOURCE_URL } from '../../service/constants'

interface ApiStatusIndicatorProps {
  className?: string
}

export const ApiStatusIndicator: React.FC<ApiStatusIndicatorProps> = ({ className = "" }) => {
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  const isUsingLocal = SURVEY_RESOURCE_URL.includes('localhost')
  const forceProduction = localStorage.getItem('FORCE_PRODUCTION')

  if (!isLocalhost) {
    return null // Don't show in production
  }

  return (
    <div className={`fixed top-4 right-4 z-50 ${className}`}>
      <div className={`px-3 py-2 rounded-lg shadow-lg text-sm font-medium ${
        isUsingLocal 
          ? 'bg-green-100 border border-green-300 text-green-800' 
          : 'bg-blue-100 border border-blue-300 text-blue-800'
      }`}>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isUsingLocal ? 'bg-green-500' : 'bg-blue-500'}`}></span>
          <span className="font-bold">
            {isUsingLocal ? '🏠 LOCAL' : '🌐 PRODUCTION'}
          </span>
        </div>
        <div className="text-xs mt-1 opacity-75">
          {isUsingLocal ? 'localhost:7076' : 'api-sehab.angeronacloud.com.br'}
        </div>
        {forceProduction && (
          <div className="text-xs text-orange-600 mt-1">
            (Forçado)
          </div>
        )}
      </div>
    </div>
  )
}

export default ApiStatusIndicator 