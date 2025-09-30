// API configuration for different environments
const API_BASE_URL =
    import.meta.env.PROD ?
    '/api' // Vercel serverless functions (relative path)
    :
    'http://localhost:3000'; // Local development

// Fallback to relative path if the full URL doesn't work
const FALLBACK_API_URL = '/api';

export default API_BASE_URL;
export { FALLBACK_API_URL };