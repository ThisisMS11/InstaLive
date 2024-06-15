import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_URL}`, // Replace with your base URL
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },
});

export default axiosInstance;
