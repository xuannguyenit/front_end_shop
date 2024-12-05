import * as request from '~/utils/http';
import { getToken, isLogin, isAdmin } from '~/apiService/authenticationService';

// lấy ra danh sách các đơn hàng của người dùng
export const getAllOrderByUserId = async () => {
    if (!isLogin()) {
        alert('Bạn cần đăng nhập hệ thống');
        return;
    }

    const token = getToken();
    if (!token) {
        alert('Bạn cần đăng nhập hệ thống');
        return;
    }

    try {
        const response = await request.get('/order/orders/allorder/user/get', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log(response);
        return response.result;
    } catch (error) {}
};

// lấy ra danh sách tất cả đơn hàng

export const getAllOrder = async () => {
    if (!isAdmin()) {
        alert('Bạn không đủ quyền truy cập');
        return;
    }
    const token = getToken();
    if (!token) {
        alert('Bạn không có quyền truy cập');
        return;
    }
    try {
        const respone = await request.get('/order/orders/all/order/get', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log('dữ liệu trả về: ', respone);
        return respone.result;
    } catch (error) {
        console.log('lỗi xảy ra: ', error);
    }
};
