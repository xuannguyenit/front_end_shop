import * as request from '~/utils/http';
import { getToken, isAdmin } from '~/apiService/authenticationService';

// get toàn bộ user
export const getAllUser = async (id) => {
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
        const res = await request.get(`/identity/users`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.result;
    } catch (error) {
        console.error('error get brand', error.message);
    }
};
