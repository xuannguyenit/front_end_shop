import * as request from '~/utils/http';
import { getToken, isLogin } from '~/apiService/authenticationService';

// Thêm sản phẩm vào giỏ hàng
export const addToCart = async (productId) => {
    // Kiểm tra xem người dùng đã đăng nhập chưa
    if (!isLogin()) {
        alert('Bạn cần đăng nhập để mua hàng');
        return;
    }

    const token = getToken();
    if (!token) {
        alert('Bạn cần đăng nhập hệ thống để mua hàng');
        return;
    }

    try {
        // Gửi yêu cầu POST đến API
        const res = await request.post(
            `/order/cartitem/addtocart?productId=${productId}`, // Truyền productId qua query parameter
            {
                quantity: 1, // Chỉ cần truyền quantity trong body nếu cần
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );

        // Kiểm tra kết quả phản hồi từ API
        if (res && res.result) {
            console.log('Product added to cart:', res.result);
        } else {
            console.error('Failed to add product to cart.');
        }

        return res.result;
    } catch (error) {
        console.error('Error adding product to cart:', error.message);
        alert('An error occurred while adding the product to the cart.');
    }
};

// Hàm lấy thông tin giỏ hàng theo cartId
// cartService.js

export const getCartById = async (userId) => {
    if (!isLogin()) {
        alert('Bạn cần đăng nhập để mua hàng');
        return;
    }

    const token = getToken();
    if (!token) {
        alert('Bạn cần đăng nhập hệ thống để mua hàng');
        return;
    }
    try {
        const res = await request.get(`/order/carts/get/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return res.result;
    } catch (error) {
        console.error('Error fetching product by ID:', error.message);
    }
};
// update lại cartItem
// Hàm update lại cartItem
export const updateCart = async (cartId, quantity) => {
    // Kiểm tra xem người dùng đã đăng nhập chưa
    if (!isLogin()) {
        alert('Bạn cần đăng nhập để tiếp tục');
        return;
    }

    const token = getToken();
    if (!token) {
        alert('Bạn cần đăng nhập hệ thống để tiếp tục');
        return;
    }

    try {
        // Gửi yêu cầu PATCH đến API để cập nhật cartItem
        const res = await request.put(
            `/order/cartitem/update`,
            { cartId, quantity }, // Gửi quantity trực tiếp trong body
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );

        // Kiểm tra phản hồi từ API
        if (res && res.result) {
            console.log('Cart updated successfully:', res.result);

            return res.result;
        } else {
            console.error('Failed to update cart item.');
            alert('Không thể cập nhật giỏ hàng.');
        }
    } catch (error) {
        console.error('Error updating cart item:', error.message);
        alert('Đã xảy ra lỗi khi cập nhật giỏ hàng.');
    }
};
export const deleteCartItem = async (id) => {
    if (!isLogin()) {
        alert('Bạn cần đăng nhập để tiếp tục');
        return;
    }

    const token = getToken();
    if (!token) {
        alert('Bạn cần đăng nhập hệ thống để tiếp tục');
        return;
    }
    try {
        const response = await request.del(`/order/cartitem/${id}`, {
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
// tạo order
export const createOrder = async (fullName, email, phone, address) => {
    if (!isLogin()) {
        alert('Bạn cần đăng nhập để tiếp tục');
        return;
    }

    const token = getToken();
    if (!token) {
        alert('Bạn cần đăng nhập hệ thống để tiếp tục');
        return;
    }
    try {
        const res = await request.post(
            '/order/orders/create',
            {
                fullName,
                email,
                phone,
                address,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );
        console.log('thông tin đơn hàng ', res.result);
        return res.result;
    } catch (error) {
        console.error('Error during registration:', error.message);
        throw new Error('Registration failed');
    }
};
// lấy ra Order theo Id
export const getOrderById = async (id) => {
    if (!isLogin) {
        alert('bạn cần đăng nhập để tiếp tục');
        return;
    }
    const token = getToken();
    if (!token) {
        alert('bạn cần đăng nhập để tiếp tục');
        return;
    }
    try {
        const res = await request.get(`/order/orders/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log('order response: ', res);
        return res;
    } catch (error) {
        console.error('Error  order response:', error.message);
        throw new Error();
    }
};
// update lại trạng thái của đơn hàng sau khi thanh toán thành công
export const updateOrderStatus = async (id) => {
    if (!isLogin) {
        alert('bạn cần đăng nhập để tiếp tục');
        return;
    }
    const token = getToken();
    if (!token) {
        alert('bạn cần đăng nhập để tiếp tục');
        return;
    }
    try {
        const response = await request.put(
            `/order/orders/update/status/${id}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );
        console.log('order response: ', response);
        return response;
    } catch (error) {
        console.error('Error  order response:', error.message);
        throw new Error();
    }
};
