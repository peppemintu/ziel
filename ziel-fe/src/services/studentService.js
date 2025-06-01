import axios from 'axios';
const API = 'http://localhost:8080/api/student';

export const getAllStudents = () => axios.get(API);
export const getStudentById = (id) => axios.get(`${API}/${id}`);
export const createStudent = (data) => axios.post(API, data);
export const updateStudent = (id, data) => axios.put(`${API}/${id}`, data);
export const deleteStudent = (id) => axios.delete(`${API}/${id}`);
