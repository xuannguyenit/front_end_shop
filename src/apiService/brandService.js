import * as request from '~/utils/http';
import { getToken, isAdmin } from '~/apiService/authenticationService';
import { useNavigate } from 'react-router-dom';
export const getBrand = async (type) => {
    try {
        const res = await request.get('/product/brands/', {
            params: {
                type: 'less',
            },
        });
        return res.result;
    } catch (error) {
        console.log(error);
    }
};
export const getAllBrand = async (type, page, size) => {
    try {
        const res = await request.get('/product/brands/listbrand/get', {
            params: {
                type: 'less',
                page: page,
                size: size,
            },
        });
        return res.result;
    } catch (error) {
        console.log(error);
    }
};
export const createBrand = async (name, imageIds) => {
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
            `/product/brands/create`,
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

export const updateBrand = async (id, body) => {
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
        const res = await request.put(`/product/brands/update/${id}`, body, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.result;
    } catch (error) {
        console.error('Error updating brand:', error.message);
    }
};
export const getBrandById = async (id) => {
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
        const res = await request.get(`/product/brands/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.result;
    } catch (error) {
        console.error('error get brand', error.message);
    }
};

export const deleBrand = async (id) => {
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
        const res = await request.del(`/product/brands/delete/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.result;
    } catch (error) {
        console.error('error get brand', error.message);
    }
};

export const softDeleteBrand = async (id) => {
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
        const res = await request.shortDele(`/product/brands/shortdelete/${id}`, {
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
