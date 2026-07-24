import axios from "axios";
import { LoginDTO } from "@/app/login/types";
import { handleValidationError } from "@/core/api";

export async function login(formData: LoginDTO) {
  return axios
    .post("/api/auth/login", formData)
    .then((response) => response.data, handleValidationError);
}
