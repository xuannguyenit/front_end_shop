import * as request from '~/utils/http';
import { getToken, isAdmin } from '~/apiService/authenticationService';
// có phân trang
export const getAllCategory = async (type) => {
    try {
        const res = await request.get('product/category/listcate/get', {
            params: {
                type: 'less',
            },
        });
        return res.result;
    } catch (error) {
        console.log(error);
    }
};
// Hàm lấy tất cả các category không phân trang
export const getAllCate = async (type = 'less') => {
    try {
        const res = await request.get('/product/category/', {
            params: {
                type, // Loại, mặc định là 'less'
            },
        });
        return res.result;
    } catch (error) {
        console.log('Lỗi khi lấy danh mục:', error);
    }
};
export const createCategory = async (name, imageIds) => {
    if (!isAdmin()) {
        alert('You do not have permission to perform this action.');
        return;
    }

    const token = getToken();
    if (!token) {
        alert('You need to be logged in to perform this action.');
        return;
    }

    try {
        const res = await request.post(
            `/product/category/create`,
            {
                name,
                imageIds,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );
        return res.result;
    } catch (error) {
        console.error('Error updating product:', error.message);
    }
};
// thay đổi thông tin danh mục
export const updateCategory = async (id, body) => {
    if (!isAdmin()) {
        alert('You do not have permission to perform this action.');
        return;
    }

    const token = getToken();
    if (!token) {
        alert('You need to be logged in to perform this action.');
        return;
    }

    try {
        const res = await request.put(`/product/category/update/${id}`, body, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.result;
    } catch (error) {
        console.error('Error updating category:', error.message);
        throw error;
    }
};
export const getCategoryById = async (id) => {
    if (!isAdmin()) {
        alert('You do not have permission to perform this action.');
        return;
    }

    const token = getToken();
    if (!token) {
        alert('You need to be logged in to perform this action.');
        return;
    }
    try {
        const res = await request.get(`/product/category/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.result;
    } catch (error) {
        console.error('error get category', error.message);
    }
};

export const softDeleteCategory = async (id) => {
    if (!isAdmin()) {
        alert('You do not have permission to perform this action.');

        return;
    }

    const token = getToken();
    if (!token) {
        alert('You need to be logged in to perform this action.');
        return;
    }
    try {
        const res = await request.shortDele(`/product/category/shortdelete/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log('api trả về: ', res);
        return res.result;
    } catch (error) {
        console.error('error delete brand', error.message);
    }
};
