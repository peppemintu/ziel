import axios from 'axios';
const API = 'http://localhost:8080/api/student-group';

export const getAllStudentGroups = () => axios.get(API);
export const getStudentGroupById = (id) => axios.get(`${API}/${id}`);
export const createStudentGroup = (data) => axios.post(API, data);
export const updateStudentGroup = (id, data) => axios.put(`${API}/${id}`, data);
export const deleteStudentGroup = (id) => axios.delete(`${API}/${id}`);
