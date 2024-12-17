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
// thống kê doanh thu theo ngày trong tháng
export const getDailyRevenueForMonth = async (month, year) => {
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
        const response = await request.get('/order/orders/get/revenue/day', {
            params: {
                month: month,
                year: year,
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.result;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            alert('Bạn không đủ quyền truy cập. Vui lòng đăng nhập lại.');
        } else if (error.response && error.response.status === 400) {
            console.error('Lỗi 400: Yêu cầu không hợp lệ.');
        } else {
            console.error('Đã xảy ra lỗi:', error);
        }
    }
};
// thông kê tổng doanh thu
export const getTotalRevenu = async () => {
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
        const response = await request.get('/order/orders/get/revenue', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log(response.result);
        return response.result;
    } catch (error) {
        return <p>Bạn không có quyền truy cập</p>;
    }
};
// thống kê số lượng đơn hàng
export const getTotalCountOrder = async () => {
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
        const response = await request.get('/order/orders/get/count/order', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log(response.result);
        return response.result;
    } catch (error) {
        return <p>Không tải được dữ liệu</p>;
    }
};
