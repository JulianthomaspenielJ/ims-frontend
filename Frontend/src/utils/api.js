// API utility functions
const API_BASE_URL = 'http://127.0.0.1:8000';

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};


// Health check API
export const checkHealth = async () => {
  return apiRequest('/health');
};

// Get all data API (if using singleendpointapi)
export const getAllData = async () => {
  return apiRequest('/all-data');
};

// Individual endpoint APIs (if using completeapi)
export const getForecasts = async () => {
  return apiRequest('/forecasts');
};

export const getDailyCost = async () => {
  return apiRequest('/daily-cost');
};

export const getMonthlyCost = async () => {
  return apiRequest('/monthly-cost');
};

export const getServiceStatus = async () => {
  return apiRequest('/service-status');
};

export const getTagCompliance = async () => {
  return apiRequest('/tag-compliance');
};

export default {
  checkHealth,
  getAllData,
  getForecasts,
  getDailyCost,
  getMonthlyCost,
  getServiceStatus,
  getTagCompliance,
};
