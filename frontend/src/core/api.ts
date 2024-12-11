import axios, { AxiosError } from "axios";
import { ValidationError } from "next/dist/compiled/amphtml-validator";

export const api = axios.create({
  baseURL: "//localhost:3001",
});

export const handleValidationError = (error: AxiosError<ValidationError>) => {
  const data = error?.response?.data;
  if (data && data.message) {
    const errors: Record<string, string[]> = {};
    data.message.forEach((message: string) => {
      const messageSplit = message.split(" ");
      const [field, ...errorMessage] = messageSplit;
      errors[field] ??= [];
      errors[field] = [...errors[field], errorMessage.join(" ")];
    });

    return Promise.reject(errors);
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
