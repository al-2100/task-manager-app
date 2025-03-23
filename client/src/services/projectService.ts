import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/projects`;

export const createProject = (projectData: any) => {
  return axios.post(API_URL, projectData, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
};

export const getProjects = () => {
  return axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
};

export const getProjectById = (id: any) => {
  return axios.get(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
};

export const updateProject = (id: any, projectData: any) => {
  return axios.put(`${API_URL}/${id}`, projectData, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
};

export const deleteProject = (id: any) => {
  return axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
};
