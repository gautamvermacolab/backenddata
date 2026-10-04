// src/services/api.js
const API_BASE = (
  import.meta.env.VITE_API_URL || "https://backenddata-c711.onrender.com"
).replace(/\/+$/, "");

export default API_BASE;
export { API_BASE };