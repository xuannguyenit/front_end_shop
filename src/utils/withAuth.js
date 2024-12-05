// src/hocs/withAuth.js
import { Navigate } from 'react-router-dom';

function withAuth(Component, requiredRole = null) {
    return function (props) {
        const token = localStorage.getItem('token');

        if (!token) {
            return <Navigate to="/login" />;
        }

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const userRole = payload.scope;

            // Nếu có yêu cầu về vai trò, kiểm tra vai trò
            if (requiredRole && userRole !== requiredRole) {
                return <Navigate to="/" />;
            }

            // Nếu hợp lệ, render component
            return <Component {...props} />;
        } catch (error) {
            console.error('Error decoding token:', error);
            return <Navigate to="/login" />;
        }
    };
}

export default withAuth;
