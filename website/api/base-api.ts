import axios from 'axios';
import { API_CONFIG } from './config';

export const api = axios.create({
  baseURL: API_CONFIG.baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});
