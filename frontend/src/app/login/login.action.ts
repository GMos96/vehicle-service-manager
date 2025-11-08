import axios from "axios";
import { LoginDTO } from "@/app/login/types";

export async function login(formData: LoginDTO) {
  const response = await axios.post("/api/auth/login", formData);
  sessionStorage.setItem("vsm-token", response.data.token);
  return response.data;
}
