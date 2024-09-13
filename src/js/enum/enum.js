const Enum = {
    // Giới tính
    gender: {
        male: 0, // Nam
        female: 1, // Nữ
        other: 2, // Khác
    },

    // Các mã ngôn ngữ hỗ trợ
    langCode: {
        VN: 0, // Tiếng Việt
        EN: 1, // Tiếng Anh
    },

    // Loại toast message
    toast: {
        success: 0, // Thành công
        warning: 1, // Cảnh báo
        error: 2, // Lỗi
        info: 3, // Thông báo
    },

    // Chế độ của Form
    formMode: {
        add: 0, // Thêm mới
        edit: 1, // Chỉnh sửa
    },

    // Chế độ sắp xếp
    sortType: {
        none: 0, // Không sắp xếp
        down: 1, // Giảm dần
        up: 2, // Tăng dần
    },

    // Các kiểu giá trị lọc
    filterType: {
        text: 0, // Chuỗi kí tự
        number: 1, // Số
        date: 2, // Ngày tháng
        discrete: 3, // Dữ liệu rời rạc
    },

    // Kiểu lọc của chuỗi kí tự
    detailFilterType: {
        startWith: 0, // Bắt đầu bằng
        contain: 1, // Chứa
        equal: 2, // Bằng
        small: 3, // Nhỏ hơn
        high: 4, // Lớn hơn
    },
};

export default Enum;
