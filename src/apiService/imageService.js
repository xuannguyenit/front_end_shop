import * as request from '~/utils/http';

import { getToken, isAdmin } from '~/apiService/authenticationService';
export const getImages = async (type) => {
    try {
        const res = await request.get('/product/image/', {
            params: {
                type: 'less',
            },
        });
        return res.result;
    } catch (error) {
        console.log(error);
    }
};
export const uploadImage = async (file) => {
    if (!isAdmin()) {
        alert('Bạn không có quyền thực hiện việc này');
        return;
    }

    const token = getToken();
    if (!token) {
        alert('Bạn không có quyền thực hiện việc này');
        return;
    }

    const formData = new FormData();
    formData.append('file', file); // Thêm file vào formData

    try {
        const response = await request.post('/product/image/upload-file', formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data', // Thiết lập header cho upload file
            },
        });

        // Kiểm tra và lấy thông tin từ phản hồi API
        if (response && response.id) {
            console.log(response);
            return response; // Trả về toàn bộ đối tượng nếu API trả về id (thành công)
        } else {
            console.log('Phản hồi không chứa id hoặc không đúng định dạng', response);
            return null;
        }
    } catch (error) {
        console.log('Lỗi khi tải ảnh lên: ', error);
    }
};
