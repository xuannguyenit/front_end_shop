import React, { useState } from 'react';
import styles from './AddImage.module.scss';
import classNames from 'classnames/bind';
import * as imageService from '~/apiService/imageService';

const cx = classNames.bind(styles);

function AddImage() {
    const [selectedFile, setSelectedFile] = useState(null); // Lưu trữ file đã chọn
    const [uploading, setUploading] = useState(false); // Trạng thái upload
    const [error, setError] = useState(null); // Lỗi (nếu có)
    const [success, setSuccess] = useState(null); // Thông báo thành công

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
        setError(null); // Xóa lỗi khi người dùng chọn lại file
    };

    const handleUpload = async (e) => {
        e.preventDefault();

        if (!selectedFile) {
            setError('Vui lòng chọn ảnh để tải lên');
            return;
        }

        setUploading(true); // Bắt đầu quá trình upload
        setError(null); // Reset lỗi cũ

        try {
            const result = await imageService.uploadImage(selectedFile); // Gọi API upload ảnh
            if (result) {
                setSuccess(`Ảnh đã được tải lên thành công với ID: ${result.id}`); // Hiển thị ID ảnh
            } else {
                setError('Đã xảy ra lỗi khi tải ảnh lên');
            }
            console.log(result);
        } catch (err) {
            console.log(err);
            setError('Đã xảy ra lỗi, vui lòng thử lại sau');
        } finally {
            setUploading(false); // Kết thúc quá trình upload
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('titile_component')}>Upload ảnh</div>
            <div className={cx('form_upload')}>
                <form onSubmit={handleUpload}>
                    <input type="file" accept="image/*" onChange={handleFileChange} className={cx('input-file')} />
                    <button type="submit" disabled={uploading} className={cx('upload-button')}>
                        {uploading ? 'Đang tải...' : 'Tải lên'}
                    </button>
                </form>
                {error && <div className={cx('error')}>{error}</div>}
                {success && <div className={cx('success')}>{success}</div>}
            </div>
        </div>
    );
}

export default AddImage;
