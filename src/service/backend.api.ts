import axios from "axios"

const productionApiUrl = "https://habitech-0wh8.onrender.com"
const configuredApiUrl = import.meta.env.VITE_API_BASE_URL
const backendBaseUrl = (configuredApiUrl || (import.meta.env.PROD ? productionApiUrl : "")).replace(/\/+$/, "")

export const isBackendApiConfigured = backendBaseUrl.length > 0

export const backendApi = axios.create({
  baseURL: backendBaseUrl,
  headers: { "Content-Type": "application/json" },
  timeout: 15_000,
})
