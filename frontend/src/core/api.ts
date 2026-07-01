import axios, { AxiosError } from "axios";
import { ValidationResponse } from "@/types/validation-error";
import { toaster } from "@/components/ui/toaster";

export const api = axios.create({
  baseURL: "/api",
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
      toaster.create({
        type: "warning",
        title: "Session expired",
        description: "Please log in again.",
      });
      // Give the toast a moment to render before the redirect tears down the page.
      setTimeout(() => {
        location.href = "/login";
      }, 1500);
    }

    return Promise.reject(error);
  },
);
