import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const API = axios.create({
  baseURL:
  process.env.NODE_ENV === "production"
  ? "https://blogprojectbe.onrender.com/api"
  : "http://localhost:5000/api",
  withCredentials: true,
});

API.interceptors.request.use((req) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user?.token) {
    req.headers.Authorization = `Bearer ${user.token}`;
  }
   return req;
});

export default API;