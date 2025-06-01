import axios from 'axios';
const API = 'http://localhost:8080/api/discipline';

export const getAllDisciplines = () => axios.get(API);
export const getDisciplineById = (id) => axios.get(`${API}/${id}`);
export const createDiscipline = (data) => axios.post(API, data);
export const updateDiscipline = (id, data) => axios.put(`${API}/${id}`, data);
export const deleteDiscipline = (id) => axios.delete(`${API}/${id}`);
