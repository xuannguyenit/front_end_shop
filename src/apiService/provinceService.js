import * as request from '~/utils/httpprovinces';

// Lấy danh sách tỉnh thành
export const getProvince = async () => {
    try {
        const response = await request.get('/api-tinhthanh/4/0.htm');

        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách tỉnh thành:', error);
    }
};

// Lấy danh sách quận huyện theo tỉnh ID
export const getdistrict = async (provinceId) => {
    // provinceId là ID của tỉnh
    try {
        const response = await request.get(`/api-tinhthanh/2/${provinceId}.htm`);

        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách quận huyện:', error);
    }
};

// Lấy danh sách xã theo quận huyện ID
export const getWard = async (districtId) => {
    // districtId là ID của quận huyện
    try {
        const response = await request.get(`/api-tinhthanh/3/${districtId}.htm`);

        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách xã phường:', error);
    }
};
