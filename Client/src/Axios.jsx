import axios from "axios";

const rawBaseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const BASE_URL = rawBaseUrl.replace(/\/+$/, "");

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
});
