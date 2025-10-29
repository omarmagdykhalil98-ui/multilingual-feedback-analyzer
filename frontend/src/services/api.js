import axios from "axios";

// --- Automatically detect where the backend is running ---
const getBaseUrl = () => {
  // 1️⃣ If environment variable is set, respect it (for production or Docker)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  const host = window.location.hostname;

  // 2️⃣ Detect GitHub Codespaces (e.g., shady-poltergeist-4jp945w67vj9cqpv7-3000.app.github.dev)
  if (host.endsWith(".app.github.dev")) {
    return `https://${host.replace("-3000", "-8000")}/api`;
  }

  // 3️⃣ Detect local Docker (when frontend and backend are in Docker)
  if (host === "localhost" || host === "127.0.0.1") {
    return "http://localhost:8000/api";
  }

  // 4️⃣ Fallback for edge cases (LAN / remote testing)
  return `${window.location.origin.replace(":3000", ":8000")}/api`;
};

const API_BASE = getBaseUrl();

console.log("🌐 Using API base:", API_BASE);

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// --- API endpoints ---
export const getFeedback = (params) => apiClient.get("/feedback", { params });
export const createFeedback = (data) => apiClient.post("/feedback", data);
export const getStats = () => apiClient.get("/stats");
export const translateText = (data) => apiClient.post("/translate", data);
export const getHealth = () => apiClient.get("/health");
export const getModelName = () => apiClient.get("/model-name");