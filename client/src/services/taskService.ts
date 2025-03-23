import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/projects`;

export const createTask = (projectId: any, taskData: any) => {
  const processedData = processDateFields(taskData);
  
  return axios.post(`${API_URL}/${projectId}/tasks`, processedData, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
};

// Helper function to process date fields
const processDateFields = (data: any) => {
  const processedData = { ...data };
  
  // Convert empty strings to null for date fields
  if (processedData.startDate === "") {
    processedData.startDate = null;
  } 
  // Convert YYYY-MM-DD to ISO-8601 format (YYYY-MM-DDT00:00:00Z)
  else if (processedData.startDate && !processedData.startDate.includes('T')) {
    processedData.startDate = `${processedData.startDate}T00:00:00Z`;
  }
  
  if (processedData.dueDate === "") {
    processedData.dueDate = null;
  }
  // Convert YYYY-MM-DD to ISO-8601 format (YYYY-MM-DDT00:00:00Z)
  else if (processedData.dueDate && !processedData.dueDate.includes('T')) {
    processedData.dueDate = `${processedData.dueDate}T00:00:00Z`;
  }
  
  return processedData;
};

export const getTasks = (projectId: any) => {
  return axios.get(`${API_URL}/${projectId}/tasks`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
};

export const getTaskById = (projectId: any, taskId: any) => {
  return axios.get(`${API_URL}/${projectId}/tasks/${taskId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
};

export const updateTask = (projectId: any, taskId: any, taskData: any) => {
  // Process date fields before sending to the server
  const processedData = processDateFields(taskData);
  
  return axios.put(`${API_URL}/${projectId}/tasks/${taskId}`, processedData, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
};

export const deleteTask = (projectId: any, taskId: any) => {
  return axios.delete(`${API_URL}/${projectId}/tasks/${taskId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
};
