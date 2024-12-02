import axios from 'axios';
import { CreateUserDTO } from '@/app/register/types';

export async function registerUser(formData: CreateUserDTO) {
  return axios.post('//localhost:3001/users/register', formData).then(response => response.data);
}
