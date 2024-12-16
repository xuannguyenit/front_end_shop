// // src/hocs/withAdminAuth.js
// import { Navigate } from 'react-router-dom';

// function withAdminAuth(Component) {
//     return function (props) {
//         // Lấy token từ localStorage
//         const token = localStorage.getItem('token');

//         if (!token) {
//             return <Navigate to="/" />; // Điều hướng về trang client nếu không có token
//         }

//         try {
//             // Giải mã phần payload của token để lấy role
//             const payload = JSON.parse(atob(token.split('.')[1]));
//             const userRole = payload.scope;

//             // Kiểm tra nếu vai trò không phải ROLE_ADMIN
//             if (userRole !== 'ROLE_ADMIN') {
//                 return <Navigate to="/" />; // Điều hướng về trang client nếu không phải ADMIN
//             }

//             // Nếu hợp lệ, hiển thị trang admin
//             return <Component {...props} />;
//         } catch (error) {
//             console.error('Error decoding token:', error);
//             return <Navigate to="/" />; // Điều hướng về trang client nếu có lỗi
//         }
//     };
// }

// export default withAdminAuth;

import { Navigate } from 'react-router-dom';

function withAdminAuth(Component) {
    return function (props) {
        // Lấy token từ localStorage
        const token = localStorage.getItem('token');

        if (!token) {
            return <Navigate to="/" />; // Điều hướng về trang client nếu không có token
        }

        try {
            // Giải mã phần payload của token để lấy role
            const payload = JSON.parse(atob(token.split('.')[1]));
            const userScope = payload.scope; // Chú ý rằng scope là một chuỗi có thể có nhiều vai trò

            // Kiểm tra xem scope có chứa 'ROLE_ADMIN' không
            if (!userScope.includes('ROLE_ADMIN')) {
                return <Navigate to="/" />; // Điều hướng về trang client nếu không có ROLE_ADMIN
            }

            // Nếu hợp lệ, hiển thị trang admin
            return <Component {...props} />;
        } catch (error) {
            console.error('Error decoding token:', error);
            return <Navigate to="/" />; // Điều hướng về trang client nếu có lỗi
        }
    };
}

export default withAdminAuth;
