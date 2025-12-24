import axios from "axios";
const axiosClient = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true, // i told browser that attach cookie with it
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;
