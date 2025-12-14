// API Test utility untuk debugging certificate endpoint
import api from '../api/axios';

export const testCertificateAPI = async (certificateId) => {
    console.log('Testing Certificate API...');
    console.log('Base URL:', api.defaults.baseURL);
    console.log('Certificate ID:', certificateId);
    
    try {
        // Test basic API connection
        console.log('1. Testing basic API connection...');
        const healthResponse = await api.get('/health');
        console.log('Health check:', healthResponse.data);
        
        // Test certificate endpoint
        console.log('2. Testing certificate endpoint...');
        const certificateResponse = await api.get(`/certificates/${certificateId}/view`);
        console.log('Certificate response:', certificateResponse.data);
        
        return {
            success: true,
            data: certificateResponse.data
        };
    } catch (error) {
        console.error('API Test Error:', error);
        
        if (error.response) {
            console.error('Response Status:', error.response.status);
            console.error('Response Data:', error.response.data);
            console.error('Response Headers:', error.response.headers);
        } else if (error.request) {
            console.error('No Response Received:', error.request);
        } else {
            console.error('Request Setup Error:', error.message);
        }
        
        return {
            success: false,
            error: error
        };
    }
};

export const checkBackendConnection = async () => {
    try {
        const response = await fetch('http://localhost:8000/api/health');
        const data = await response.json();
        console.log('Backend connection test:', data);
        return response.ok;
    } catch (error) {
        console.error('Backend connection failed:', error);
        return false;
    }
};