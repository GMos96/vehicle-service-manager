import axios from "axios";
import { CreateUserDTO } from "@/app/register/types";
import { handleValidationError } from "@/core/api";

export async function registerUser(formData: CreateUserDTO) {
  return axios
    .post("//localhost:3001/users/register", formData)
    .then((response) => response.data, handleValidationError);
}
