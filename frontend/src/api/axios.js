import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((req) => {
  const auth = JSON.parse(localStorage.getItem("auth"));
  if (auth?.token) {
    req.headers.Authorization = `Bearer ${auth.token}`;
  }
  return req;
});

export default API;
