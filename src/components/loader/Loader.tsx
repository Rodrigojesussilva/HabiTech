// Loader.tsx
import React from "react"

const Loader: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-4">
      <div className="h-6 w-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <span className="ml-3 text-blue-600 font-medium">Aguarde...</span>
    </div>
  )
}

export default Loader
 