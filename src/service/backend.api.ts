import axios from "axios"

const backendBaseUrl = "/"

export const isBackendApiConfigured = true

export const backendApi = axios.create({
  baseURL: backendBaseUrl,
  headers: { "Content-Type": "application/json" },
  timeout: 15_000,
})
