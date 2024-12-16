// authenticationService.js
import * as request from '~/utils/http';

// Hàm login
export const login = async (username, password) => {
    try {
        const res = await request.post('/identity/auth/login', { username, password });
        return res.result;
    } catch (error) {
        console.error('Error during login:', error.message);
        throw new Error('Login failed');
    }
};

// Hàm kiểm tra xem token còn hiệu lực hay không (optional)
export const isTokenExpired = (expiryTime) => {
    const currentTime = new Date().getTime();
    return currentTime > expiryTime;
};
// phương thức đăng ký tài khoản
export const register = async (username, password, email, firstName, lastName, dob, city) => {
    try {
        const res = await request.post('/identity/users/registration', {
            username,
            password,
            email,
            firstName,
            lastName,
            dob,
            city,
        });
        return res.result;
    } catch (error) {
        console.error('Error during registration:', error.message);
        throw new Error('Registration failed');
    }
};
export const createAdmin = async (username, password, email, firstName, lastName, dob, city) => {
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
            '/identity/users/create/admin',
            {
                username,
                password,
                email,
                firstName,
                lastName,
                dob,
                city,
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

// Hàm lấy token từ localStorage
// Hàm lấy token từ localStorage
export const getToken = () => {
    const token = localStorage.getItem('token');
    const expiryTime = localStorage.getItem('expiryTime');

    if (token && expiryTime && !isTokenExpired(expiryTime)) {
        return token;
    } else {
        console.warn('Token has expired or does not exist.');
        localStorage.removeItem('token');
        localStorage.removeItem('expiryTime');
    }
    return null;
};

// // Hàm kiểm tra xem user có vai trò ROLE_ADMIN không
// export const isAdmin = () => {
//     const role = getUserRole();
//     return role === 'ROLE_ADMIN'; // Kiểm tra xem role có phải là 'ROLE_ADMIN' hay không
// };
// hàm kiểm tra xem user đã đăng nhập hay chưa
export const isLogin = () => {
    const token = getToken(); // Lấy token từ localStorage
    return token !== null;
};
// // Hàm giải mã vai trò người dùng từ token
// export const getUserRole = () => {
//     const token = getToken();
//     if (token) {
//         try {
//             const payload = JSON.parse(atob(token.split('.')[1])); // Giải mã payload của token
//             return payload.scope || payload.role; // Lấy role từ payload, tùy vào cấu trúc của token
//         } catch (error) {
//             console.error('Error decoding token:', error);
//         }
//     }
//     return null;
// };
// Hàm lấy scope từ token
export const getUserRole = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        // Giải mã payload của token
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.scope; // Trả về scope (có thể là chuỗi nhiều vai trò)
    } catch (error) {
        console.error('Error decoding token:', error);
        return null; // Trả về null nếu có lỗi
    }
};

// Hàm kiểm tra xem user có vai trò ROLE_ADMIN không
export const isAdmin = () => {
    const role = getUserRole();
    // Kiểm tra xem scope có chứa 'ROLE_ADMIN' không
    return role && role.includes('ROLE_ADMIN');
};
