// API configuration for different environments
const API_BASE_URL = import.meta.env.PROD 
  ? '/api'  // Vercel serverless functions
  : 'http://localhost:5172';  // Local development

export default API_BASE_URL;
