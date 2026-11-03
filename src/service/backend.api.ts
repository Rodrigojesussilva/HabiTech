import axios from "axios"

const backendBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "") ?? ""

export const isBackendApiConfigured = backendBaseUrl.length > 0

export const backendApi = axios.create({
  baseURL: backendBaseUrl,
  headers: { "Content-Type": "application/json" },
  timeout: 15_000,
})
