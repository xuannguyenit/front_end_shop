import * as request from '~/utils/http';
import { getToken, isAdmin } from '~/apiService/authenticationService';
export const getDiscountcode = async () => {
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
        const res = await request.get('/product/discount/get', {
            params: {
                type: 'less',
            },
        });
        return res.result;
    } catch (error) {
        console.log(error);
    }
};
export const addDiscount = async ({ code, discountPercentage }) => {
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
            '/product/discount/post',
            { code, discountPercentage },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );
        console.log(res.result);
        return res.result;
    } catch (error) {
        console.error('Error during discount code addition:', error.message);
        throw new Error('Discount addition failed');
    }
};

// export const addDiscount = async (code, discountPercentage) => {
//     if (!isAdmin()) {
//         alert('You do not have permission to perform this action.');
//         return;
//     }

//     const token = getToken();
//     if (!token) {
//         alert('You need to be logged in to perform this action.');
//         return;
//     }
//     try {
//         const res = await request.post('/product/distcount/post', {
//             code,
//             discountPercentage,

//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//         });
//         return res.result;
//     } catch (error) {
//         console.error('Error during registration:', error.message);
//         throw new Error('Registration failed');
//     }
// };
