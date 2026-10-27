
// const API_URL = "http://localhost:9000/api/v1";

// const API_URL = import.meta.env.VITE_API_URL;

// const API_URL =
//   import.meta.env.VITE_API_URL?.replace(/\/$/, "") ||
//   // "http://localhost:9000/api/v1";
//   "https://interior-design-backend-bh9c.onrender.com/api/v1";
  
const API_URL = (
  import.meta.env.VITE_API_URL ||
  "https://interior-design-backend-bh9c.onrender.com/api/v1"
).replace(/\/+$/, "");

export default API_URL;