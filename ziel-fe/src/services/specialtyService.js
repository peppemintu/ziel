import axios from 'axios';
const API = 'http://localhost:8080/api/specialty';

export const getAllSpecialties = () => axios.get(API);
export const getSpecialtyById = (id) => axios.get(`${API}/${id}`);
export const createSpecialty = (data) => axios.post(API, data);
export const updateSpecialty = (id, data) => axios.put(`${API}/${id}`, data);
export const deleteSpecialty = (id) => axios.delete(`${API}/${id}`);
