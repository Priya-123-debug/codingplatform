import axios from "axios";
const axiosClient = axios.create({
  baseURL: Process.env.VITE_BACKEND_URL|| "https://codingplatform-oihe.onrender.com",
  withCredentials: true, // i told browser that attach cookie with it
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;
