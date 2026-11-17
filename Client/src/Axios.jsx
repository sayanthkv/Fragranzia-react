import axios from "axios";

const rawBaseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const BASE_URL = rawBaseUrl.replace(/\/+$/, "");

if (!import.meta.env.VITE_BACKEND_URL && import.meta.env.PROD) {
  console.warn(
    "[Fragranzia] VITE_BACKEND_URL is not defined in Vercel environment variables! Falling back to http://localhost:5000. Please set VITE_BACKEND_URL in Vercel settings and trigger a Redeploy."
  );
}

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
});
