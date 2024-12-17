import axios from 'axios';

const request = axios.create({
    baseURL: 'http://localhost:8888/api/v1/',
});
export const get = async (path, options = {}) => {
    const response = await request.get(path, options);
    return response.data;
};

// Phương thức POST
export const post = async (path, data = {}, options = {}) => {
    try {
        const response = await request.post(path, data, options);
        return response.data;
    } catch (error) {
        handleError(error); // Xử lý lỗi nếu có
        throw error;
    }
};

export const put = async (path, data = {}, options = {}) => {
    try {
        const response = await request.put(path, data, options);
        return response.data;
    } catch (error) {
        handleError(error); // Xử lý lỗi nếu có
        throw error;
    }
};

export const del = async (path, options = {}) => {
    try {
        const response = await request.delete(path, options);
        return response.data;
    } catch (error) {
        handleError(error); // Xử lý lỗi nếu có
        throw error;
    }
};

export const shortDele = async (path, options = {}) => {
    try {
        const response = await request.patch(path, options);
        return response.data;
    } catch (error) {
        handleError(error); // Xử lý lỗi nếu có
        throw error;
    }
};

// // Hàm xử lý lỗi chung
const handleError = (error) => {
    if (error.response) {
        // Lỗi từ server (mã lỗi 4xx hoặc 5xx)
        console.error(`API Error: ${error.response.status} - ${error.response.statusText}`);
        console.error('Response data:', error.response.data); // In chi tiết lỗi của server
    } else if (error.request) {
        // Lỗi không nhận được phản hồi từ server
        console.error('No response received from API:', error.request);
    } else {
        // Lỗi trong quá trình cấu hình request
        console.error('Error configuring the request:', error.message);
    }
};

export default request;
