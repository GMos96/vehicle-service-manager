import axios from 'axios';
import { LoginDTO } from '@/app/login/types';

export async function login(formData: LoginDTO) {
  const response = await axios.post('//localhost:3001/auth/login', formData);
  sessionStorage.setItem('vsm-token', response.data.accessToken);
  return response.data;
}