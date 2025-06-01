import axios from 'axios';
const API = 'http://localhost:8080/api/user';

export const getCurrentUser = () => axios.get(`${API}/user`);
