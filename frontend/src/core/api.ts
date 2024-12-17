import axios, { AxiosError } from "axios";
import { ValidationResponse } from "@/types/validation-error";

export const api = axios.create({
  baseURL: "//localhost:3001",
});

export const handleValidationError = (
  error: AxiosError<ValidationResponse>,
) => {
  const data = error?.response?.data;
  if (data && data.message) {
    return Promise.reject(data.message);
  }

  return Promise.reject(error);
};

api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("vsm-token");
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.status === 401) {
      location.href = "/login";
    }

    return Promise.reject(error);
  },
);
