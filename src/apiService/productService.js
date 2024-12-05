import * as request from '~/utils/http';
import { getToken, isAdmin } from '~/apiService/authenticationService';
export const getProductById = async (productId) => {
    try {
        const res = await request.get(`/product/prod/${productId}`);
        return res.result;
    } catch (error) {
        console.error('Error fetching product by ID:', error.message);
    }
};
export const removeProduct = async (productId) => {
    if (!isAdmin()) {
        alert('Bạn không có quyền thực hiện hành động này.');
        return false;
    }

    const token = getToken();
    if (!token) {
        alert('Bạn cần đăng nhập để thực hiện hành động này.');
        return false;
    }

    try {
        // Gọi API xóa sản phẩm
        const response = await request.del(`/product/prod/delete/${productId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response && response.code === 1000) {
            alert('Xóa sản phẩm thành công!');
            return true;
        } else {
            alert('Lỗi xóa sản phẩm: ' + (response.message || 'Có lỗi xảy ra.'));
            return false;
        }
    } catch (error) {
        console.error('Lỗi khi xóa sản phẩm:', error);
        alert('Đã xảy ra lỗi khi xóa sản phẩm. Vui lòng thử lại!');
        return false;
    }
};

export const getProductByCategoryId = async (categoryId, page = 1, size = 10) => {
    try {
        const res = await request.get(`/product/prod/category/${categoryId}`, {
            params: {
                page: page,
                size: size,
            },
        });
        return res.result;
    } catch (error) {
        console.error('Error fetching products by category ID:', error.message);
    }
};
export const getProduct = async (type) => {
    try {
        const res = await request.get('/product/prod/', {
            params: {
                type: 'less',
            },
        });
        return res.result;
    } catch (error) {
        console.log(error);
    }
};

export const getProductSale = async (type, page, size) => {
    try {
        const res = await request.get('/product/prod/productsale/get', {
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

export const getAllProduct = async (type, page, size) => {
    try {
        const res = await request.get('/product/prod/getallproduct', {
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
// thêm mới sản phẩm
export const addProduct = async (
    name,
    description,
    shortDescription,
    price,
    quantity,
    categoryId,
    brandId,
    imageIds,
    discountCodeId,
) => {
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
            '/product/prod/create',
            {
                name,
                description,
                shortDescription,
                price,
                quantity,
                categoryId,
                brandId,
                imageIds,
                discountCodeId,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );
        return res.result;
    } catch (error) {
        console.error('Error during registration:', error.message);
        throw new Error('Registration failed');
    }
};
// sửa sản phâm
// Sửa sản phẩm
export const updateProduct = async (
    productId,
    name,
    description,
    shortDescription,
    price,
    quantity,
    categoryId,
    brandId,
    imageIds,
    discountCodeId,
) => {
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
        const res = await request.put(
            `/product/prod/update/${productId}`,
            {
                name,
                description,
                shortDescription,
                price,
                quantity,
                categoryId,
                brandId,
                imageIds,
                discountCodeId,
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
