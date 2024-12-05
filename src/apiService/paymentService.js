import * as request from '~/utils/http';
import { getToken, isLogin } from '~/apiService/authenticationService';

export const getPayment = async (total) => {
    if (!isLogin()) {
        alert('Bạn cần đăng nhập để thực hiện chức năng này');
        return false;
    }

    const token = getToken();
    if (!token) {
        alert('Bạn cần đăng nhập để thực hiện hành động này.');
        return false;
    }
    try {
        const response = await request.get(`/order/payment/create_payment/${total}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log(response);
        return response;
    } catch (error) {
        console.error(' có lỗi xảy ra khi thực hiện: ', error);
    }
};
export const checkout = async (orderId) => {
    if (!isLogin()) {
        alert('Bạn cần đăng nhập để thực hiện chức năng này');
        return false;
    }

    const token = getToken();
    if (!token) {
        alert('Bạn cần đăng nhập để thực hiện hành động này.');
        return false;
    }
    try {
        const response = await request.get(`/order/payment/create/${orderId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log(response);
        return response;
    } catch (error) {
        console.error(' có lỗi xảy ra khi thực hiện: ', error);
    }
};
export const updateOder = async (id) => {
    if (!isLogin()) {
        alert('Bạn cần đăng nhập để thực hiện chức năng này');
        return false;
    }

    const token = getToken();
    if (!token) {
        alert('Bạn cần đăng nhập để thực hiện hành động này.');
        return false;
    }
    try {
        const response = await request.put(`/order/orders/update/status/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log('order up date: ', response);
        return response;
    } catch (error) {
        console.error(' có lỗi xảy ra khi thực hiện: ', error);
    }
};
