import axios from 'axios';
const API = 'http://localhost:8080/api/teacher';

export const getAllTeachers = () => axios.get(API);
export const getTeacherById = (id) => axios.get(`${API}/${id}`);
export const createTeacher = (data) => axios.post(API, data);
export const updateTeacher = (id, data) => axios.put(`${API}/${id}`, data);
export const deleteTeacher = (id) => axios.delete(`${API}/${id}`);
