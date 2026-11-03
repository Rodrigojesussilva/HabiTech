import axios from "axios"

export const DEMO_AUTH_TOKEN = "demo-token"

export const demoApi = axios.create({
  baseURL: "/mock-api",
  headers: { "Content-Type": "application/json" },
})
