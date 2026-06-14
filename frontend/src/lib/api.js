import axios from "axios";

// Empty/unset BACKEND_URL means the API is served from the same origin
// (e.g. on Vercel, where /api/* is handled by the Python serverless function).
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "";
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({ baseURL: API });

export const formatPrice = (value, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(
    Number(value || 0)
  );
