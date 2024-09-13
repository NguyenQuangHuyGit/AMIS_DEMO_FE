const Resource = {
    // Tiếng Việt
    VN: {
        standFor: "Tiếng Việt",
        title: {
            employee: "Nhân viên | AMIS Kế toán",
            import: "Nhập khẩu | AMIS Kế toán",
            login: "Đăng nhập | AMIS Kế toán",
            notFound: "Trang 404 | AMIS Kế toán",
            systemError: "Trang 500 | AMIS Kế toán",
        },
        lang: {
            VN: "Tiếng Việt",
            EN: "Tiếng Anh",
        },
        page: {
            customer: {
                title: "Khách hàng",
            },
            employee: {
                title: "Nhân viên",
            },
            notFound: {
                title: "Oops! Không tìm thấy trang",
                description:
                    "Đường dẫn đang truy cập đã bị thay đổi hoặc không tồn tại.",
            },
            systemError: {
                title: "Lỗi hệ thống",
                description:
                    "Không thể kết nỗi đến máy chủ. Vui lòng liên hệ MISA để được hỗ trợ.",
            },
            header: "Kế toán",
            noRecordNotify: "Không có bản ghi nào phù hợp.",
            selectedRecord: "Đã chọn",
            total: "Tổng",
            pageSize: "Số bản ghi/trang",
            record: "bản ghi",
        },
        menuAcc: {
            changePassword: "Đổi mật khẩu",
            settingAccount: "Thiết lập tài khoản",
            settingSecurity: "Thiết lập bảo mật",
            license: "Giấy phép & thanh toán",
            introduce: "Giới thiệu tích điểm",
            language: "Ngôn ngữ:",
            logout: "Đăng xuất",
        },

        menuColumn: {
            title: "Tùy chỉnh cột",
        },

        menuFilter: {
            title: "Bộ lọc",
        },

        // PascalCase để khớp với các trường API trả về
        table: {
            customer: {
                code: "Mã khách hàng",
            },
            employee: {
                EmployeeCode: "Mã nhân viên",
                PositionName: "Chức danh",
                DepartmentName: "Tên đơn vị",
            },
            Address: "Địa chỉ",
            FullName: "Họ và tên",
            Gender: "Giới tính",
            DateOfBirth: "Ngày sinh",
            Email: "Email",
            CompanyName: "Công ty",
            PhoneNumber: "Số điện thoại",
            Debit: "Dư nợ",
            IdentityNumber: "Số CMND",
            IdentityDate: "Ngày cấp",
            IdentityPlace: "Nơi cấp",
            BankAccount: "Số tài khoản",
            BankName: "Tên ngân hàng",
            BankBranch: "Chi nhánh TK ngân hàng",
            Action: "Chức năng",
            Status: "Tình trạng",
        },
        nav: {
            setting: "Cài đặt",
            dashboard: "Trang chủ",
            customer: "Khách hàng",
            employee: "Nhân viên",
            analys: "Thống kê",
            shortNav: "Thu gọn",
            backGeneral: "Quay lại trang chủ",
        },
        entity: {
            customer: "khách hàng",
            employee: "nhân viên",
        },
        textfield: {
            placeholder: {
                search: "Tìm kiếm theo mã, tên nhân viên",
                filter: "Nhập giá trị",
                searchOnly: "Tìm kiếm",
            },
            defaultString: "Chọn điều kiện",
        },
        button: {
            add: "Thêm mới",
            ok: "Đồng ý",
            cancel: "Hủy",
            no: "Không",
            yes: "Xác nhận",
            deleteAll: "Xóa tất cả",
            cancelSelect: "Bỏ chọn",
            saveAndAddForm: "Cất và Thêm",
            saveForm: "Cất",
            help: "Giúp",
            back: "Quay lại",
            continue: "Tiếp tục",
            begin: "Thực hiện",
            close: "Đóng",
            login: "Đăng nhập",
            forgotPass: "Quên mật khẩu?",
            otherLoginMethod: "Hoặc đăng nhập với",
            getNewCode: "Lấy mã mới",
            apply: "Áp dụng",
            cancelFilter: "Bỏ lọc",
            save: "Lưu",
            getDefault: "Lấy lại mặc định",
        },
        gender: {
            male: "Nam",
            female: "Nữ",
            other: "Khác",
        },
        validateErrorMessage: {
            required: function (label) {
                return `${label} không được để trống.`;
            },
            min: function (label, min) {
                return `${label} phải chưa ít nhất ${min} ký tự.`;
            },
            max: function (label, max) {
                return `${label} chỉ được chứa tối đa ${max} ký tự.`;
            },
            email: "Email không đúng định dạng.",
            department: "Phòng ban không hợp lệ.",
            position: "Vị trí không hợp lệ.",
            loginFail: "Tên đăng nhập hoặc mật khẩu không đúng",
            digit: function (label) {
                return `${label} chỉ được bao gồm các chữ số`;
            },
            code: {
                prefix: function (label, prefix) {
                    return `${label} phải bắt đầu bằng tiền tố "${prefix}"`;
                },
                suffixes: function (label) {
                    return `${label} phải có hậu tố là các chữ số`;
                },
            },
            date: function (label) {
                return `${label} không được lớn hơn ngày hiện tại`;
            },
        },
        form: {
            title: {
                customer: {
                    add: "Thêm khách hàng",
                    edit: "Thông tin khách hàng",
                },
                employee: {
                    add: "Thêm nhân viên",
                    edit: "Thông tin nhân viên",
                },
                filter: "Điều kiện lọc",
            },
            label: {
                customer: {
                    customerCode: "Mã khách hàng",
                    customerGroup: "Nhóm khách hàng",
                },
                employee: {
                    employeeCode: "Mã nhân viên",
                    department: "Đơn vị",
                    position: "Vị trí",
                    departmentName: "Đơn vị",
                    positionName: "Vị trí",
                },
                fullName: "Họ và tên",
                dateOfBirth: "Ngày sinh",
                gender: "Giới tính",
                phoneNumber: "Số điện thoại",
                landlineTelephone: "Điện thoại cố định",
                identityNumber: "CMTND",
                identityDate: "Ngày cấp",
                email: "Email",
                identityPlace: "Nơi cấp",
                company: "Công ty",
                address: "Địa chỉ",
                debit: "Số tiền nợ (VND)",
                bankAccount: "Tài khoản ngân hàng",
                bankName: "Tên ngân hàng",
                bankBranch: "Chi nhánh",
                userName: "Số điện thoại/email",
                password: "Mật khẩu",
            },
            config: {
                title: "Tùy chỉnh file Excel",
                actionRequest:
                    "Bạn có muốn độ rộng cột trong file Excel tự động căn chỉnh không?",
                notity: "Thao tác này có thể khiến việc lấy file mất thêm thời gian",
                markAsCheckLabel: "Lưu lại và không hỏi nữa",
            },
        },
        tooltip: {
            inValidComboboxValue: "Dữ liệu không tồn tại trong hệ thống.",
            identityNumber: "Căn cước công dân / Chứng minh thư nhân dân.",
            refreshBtn: "Tải lại dữ liệu.",
            importExBtn: "Xuất ra excel file",
            editBtn: "Chỉnh sửa",
            deleteBtn: "Xóa",
            optionBtn: "Khác",
            helpBtn: "Trợ giúp",
            closeBtnWithShortKey: "Đóng(ESC)",
            nextPage: "Trang sau",
            prevPage: "Trang trước",
            settingColumn: "Tùy chỉnh cột",
            pinColumn: "Ghim cột",
            dragColumn: "Kéo thả cột",
            export: "Xuất khẩu",
            filterBtn: "Bộ lọc",
            closeBtn: "Đóng",
        },
        radioButton: {
            male: "Nam",
            female: "Nữ",
            other: "Khác",
        },
        dialog: {
            title: {
                confirmDelete: "Xác nhận xóa",
                confirmSave: "Xác nhận cất",
                confirmSaveAndAdd: "Xác nhận cất và thêm",
                confirmCancel: "Đóng và không lưu?",
                inputError: "Dữ liệu không hợp lệ",
                systemError: "Lỗi hệ thống",
                networkError: "Không có kết nối",
                fileMissing: "Chưa có file",
                importError: "Nhập khẩu thất bại",
                fileError: "Lỗi file dữ liệu",
                noDataExport: "Không có dữ liệu",
            },
            description: {
                confirmDeleteAll:
                    "Bạn có chắc chắn muốn xóa các bản ghi đã chọn không?",
                confirmSave: function (entity) {
                    return `Bạn có chắc chắn muốn cất thông tin ${entity} không?`;
                },
                confirmSaveAndAdd: function (entity) {
                    return `Bạn có chắc chắn muốn cất thông tin ${entity} không?`;
                },
                confirmDelete: function (entity, code) {
                    return `Bạn có chắc chắn muốn xóa ${entity} có mã <strong>${code}</strong> không?`;
                },
                duplidateError: function (error) {
                    return `${error}. Bạn có muốn lấy mã mới không?`;
                },
                confirmCancel: "Dữ liệu đã bị thay đổi, bạn có muốn cất không?",
                systemError:
                    "Đã có lỗi xảy ra với ứng dụng. Vui lòng thử lại sau ít phút",
                networkError:
                    "Vui lòng kiểm tra lại đường truyền mạng của thiết bị",
                fileMissing: "Vui lòng chọn file nhập khẩu trước khi tiếp tục",
                noValidData: "Không có bản ghi nào hợp lệ để nhập khẩu",
                fileError:
                    "File chứa dữ liệu nhập khẩu xảy ra lỗi. Vui lòng thực hiện lại các bước nhâp khẩu",
                noDataExport: "Hay chọn các bản ghi muốn xuất khẩu trước",
                noErrorDataDownload: "Không có dòng nào gặp lỗi nhập liệu",
                fileChangeError:
                    "Nếu bạn vừa thay đổi file, hãy tải lại lên hệ thống",
            },
        },
        toast: {
            saveSuccess: function (entity) {
                return `Sửa thành công thông tin ${entity}.`;
            },
            addSuccess: function (entity) {
                return `Thêm thành công thông tin ${entity}.`;
            },
            deleteSuccess: function (entity) {
                return `Xóa thành công thông tin ${entity}.`;
            },
            funcWarning: "Chức năng chưa hoàn thiện.",
            expiredAccessLogin:
                "Đã hết phiên đăng nhập. Vui lòng đăng nhập lại.",
            fileError: "File dữ liệu nhập khẩu bị lỗi.",
            downloadBegin: "File của bạn đang được tải xuống.",
            dragPinWarnning: "Hãy bỏ ghim cột này trước.",
            saveColumnSuccess: "Lưu thành công.",
            maxPinColumnWarn: "Không thể ghim hơn 3 cột cùng lúc.",
        },
        dropDropOption: {
            startWith: "Bắt đầu",
            contain: "Chứa",
            equal: "Bằng",
            small: "Nhỏ hơn",
            high: "Lớn hơn",
        },
        menuContext: {
            edit: "Sửa",
            delete: "Xóa",
            copy: "Nhân bản",
            stopUsing: "Ngưng sử dụng",
            importExcel: "Nhập từ file Excel",
            exportAllExcel: "Xuất tất cả các bản ghi",
            exportSelectedExcel: "Xuất các bản ghi đã chọn",
        },
        import: {
            stepInfo: {
                first: "Bước 1: Chọn tệp nguồn",
                second: "Bước 2: Kiểm tra dữ liệu",
                third: "Bước 3: Kết quả nhập khẩu",
            },
            aside: {
                first: "Chọn tệp nguồn",
                second: "Kiểm tra dữ liệu",
                third: "Kết quả nhập khẩu",
            },
            main: {
                first: {
                    labelForInput: "Chọn",
                    notice: "Chọn dữ liệu nhân viên đã chuẩn bị để nhập khẩu vào phần mềm",
                    example:
                        "Chưa có tệp mẫu để chuẩn bị dữ liệu? Tải tệp excel mẫu mà phần mềm cung cấp để chuẩn bị dữ liệu nhập khẩu",
                    downloadHere: "Tại đây",
                },
                second: {
                    notificationError:
                        "Tải về tệp tin chứa các dòng nhập khẩu không thành công",
                    downloadHere: "tại đây.",
                    validRow: "dòng hợp lệ.",
                    inValidRow: "dòng không hợp lệ.",
                    validStatus: "Hợp lệ",
                },
                third: {
                    title: "Kết quả nhập khẩu",
                    notificationSuccess:
                        "Tải về tệp tin chứa kết quả nhập khẩu thành công",
                    downloadHere: "tại đây.",
                    doneResult: "Số dòng nhập khẩu thành công: ",
                    falseResult: "Số dòng nhập khẩu không thành công: ",
                },
            },
        },
    },

    // Tiếng Anh
    EN: {
        standFor: "English",
        title: {
            employee: "Employee | AMIS Kế toán",
            import: "Import | AMIS Kế toán",
            login: "Sign In | AMIS Kế toán",
            notFound: "404 Page | AMIS Kế toán",
            systemError: "500 Page | AMIS Kế toán",
        },
        lang: {
            VN: "Vietnamese",
            EN: "English",
        },
        page: {
            customer: {
                title: "Customer",
            },
            employee: {
                title: "Employee",
            },
            notFound: {
                title: "Oops! Page not found",
                description:
                    "The path being accessed has been changed or does not exist.",
            },
            systemError: {
                title: "System error",
                description:
                    "Unable to connect to the server. Please contact MISA for support.",
            },
            noRecordNotify: "There are no matching records.",
            selectedRecord: "Selected",
            total: "Total",
            pageSize: "Number of records/page",
            record: "record",
            header: "Accountant",
        },
        menuAcc: {
            changePassword: "Change password",
            settingAccount: "Account settings",
            settingSecurity: "Security settings",
            license: "Licensing & Payment",
            introduce: "Introducing point accumulation",
            language: "Language:",
            logout: "Log out",
        },

        menuColumn: {
            title: "Customize columns",
        },

        menuFilter: {
            title: "Filter",
        },

        // PascalCase để khớp với các trường API trả về
        table: {
            customer: {
                code: "Customer code",
            },
            employee: {
                EmployeeCode: "Employee number",
                PositionName: "Position",
                DepartmentName: "Department",
            },
            CustomerCode: "Customer code",
            FullName: "Fullname",
            Gender: "Gender",
            DateOfBirth: "Date of birth",
            Email: "Email",
            CompanyName: "Company",
            PhoneNumber: "Phone number",
            Debit: "Debit amount",
            Address: "Address",
            IdentityNumber: "ID number",
            IdentityDate: "Issuance date",
            IdentityPlace: "Issuance place",
            BankAccount: "Bank account",
            BankName: "Bank name",
            BankBranch: "Bank account branch",
            Action: "Action",
            Status: "Status",
        },
        nav: {
            setting: "Setting",
            dashboard: "Dashboard",
            employee: "Employee",
            customer: "Customer",
            analys: "Statistical",
            shortNav: "Collapse",
            backGeneral: "Go back to the main page",
        },
        entity: {
            customer: "customer",
            employee: "employee",
        },
        textfield: {
            placeholder: {
                search: "Search by code, employee name",
                filter: "Enter value",
                searchOnly: "Search",
            },
            defaultString: "Select condition",
        },
        button: {
            add: "Create new",
            ok: "Got It",
            cancel: "Cancel",
            yes: "Yes",
            no: "No",
            deleteAll: "Delete All",
            cancelSelect: "Unchecked",
            saveAndAddForm: "Save and Add",
            saveForm: "Save",
            help: "Help",
            back: "Come back",
            continue: "Continue",
            close: "Close",
            begin: "Perform",
            login: "Sign In",
            forgotPass: "Forgot Password?",
            otherLoginMethod: "Or Sign In with",
            getNewCode: "Get new code",
            apply: "Apply",
            cancelFilter: "Unfilter",
            save: "Save",
            getDefault: "Restore defaults",
        },
        gender: {
            male: "Male",
            female: "Female",
            other: "Other",
        },
        validateErrorMessage: {
            required: function (label) {
                return `${label} is required`;
            },
            min: function (label, min) {
                return `${label} must have at least ${min} characters`;
            },
            max: function (label, max) {
                return `${label} has a maximum ${max} characters`;
            },
            email: "Email invalid",
            department: "Invalid department",
            position: "Invalid position",
            loginFail: "Username or password is incorrect",
            digit: function (label) {
                return `${label} must include only digits`;
            },
            code: {
                prefix: function (label, prefix) {
                    return `${label} must begin with a prefix "${prefix}"`;
                },
                suffixes: function (label) {
                    return `${label} must be suffixed with digits`;
                },
            },
            date: function (label) {
                return `${label} cannot be greater than the current date`;
            },
        },
        form: {
            title: {
                customer: {
                    add: "Create New Customer",
                    edit: "Edit Customer Information",
                },
                employee: {
                    add: "Create New Employee",
                    edit: "Edit Employee Information",
                },
                filter: "Filteration condition",
            },
            label: {
                customer: {
                    customerCode: "Customer code",
                    customerGroup: "Customer group",
                },
                employee: {
                    employeeCode: "Employee code",
                    department: "Department",
                    position: "Postion",
                    departmentName: "Department",
                    positionName: "Postion",
                },
                fullName: "Fullname",
                dateOfBirth: "Date of birth",
                gender: "Gender",
                phoneNumber: "Phone number",
                landlineTelephone: "Landline telephone",
                identityNumber: "ID Number",
                email: "Email",
                identityPlace: "Place of issuance",
                identityDate: "Issuance date",
                company: "Company",
                address: "Address",
                debit: "Debit amount (VND)",
                bankAccount: "Bank account",
                bankName: "Bank name",
                bankBranch: "Bank account branch",
                userName: "Phone number/email",
                password: "Password",
            },
            config: {
                title: "Customize Excel files",
                actionRequest:
                    "Do you want the column widths in Excel files to automatically align?",
                notity: "This operation may cause retrieving files to take more time",
                markAsCheckLabel: "Save it and don't ask again",
            },
        },
        tooltip: {
            inValidComboboxValue: "The data does not exist in the system.",
            identityNumber: "Citizen identification card.",
            refreshBtn: "Refresh data.",
            importExBtn: "Export to excel file",
            editBtn: "Edit",
            deleteBtn: "Delete",
            optionBtn: "More",
            helpBtn: "Help",
            closeBtnWithShortKey: "Close(ESC)",
            nextPage: "Next page",
            prevPage: "Previous page",
            settingColumn: "Customize columns",
            pinColumn: "Pin the column",
            dragColumn: "Drag and drop",
            export: "Export",
            filterBtn: "Filter",
            closeBtn: "Close",
        },
        radioButton: {
            male: "Male",
            female: "Female",
            other: "Other",
        },
        dialog: {
            title: {
                confirmDelete: "Confirm delete",
                confirmSave: "Confirm save information",
                confirmSaveAndAdd: "Confirm add information",
                confirmCancel: "Confirm cancel",
                inputError: "Invalid data",
                systemError: "System error",
                networkError: "Network error",
                fileMissing: "No files",
                importError: "Import failed",
                fileError: "Data file error",
                noDataExport: "No selected data",
            },
            description: {
                confirmDeleteAll:
                    "Are you sure you want to delete the selected records?",
                confirmSave: function (entity) {
                    return `Are you sure you want to save the ${entity} information?`;
                },
                confirmSaveAndAdd: function (entity) {
                    return `Are you sure you want to add the ${entity} information?`;
                },
                confirmDelete: function (entity, code) {
                    return `Are you sure you want to delete the ${entity} whose code is <strong>${code}</strong>?`;
                },
                duplidateError: function (error) {
                    return `${error}. Do you want to get a new code?`;
                },
                confirmCancel:
                    "The data has been modified, are you sure you want to cancel?",
                systemError:
                    "Something went wrong with the application. Please try again in a few minutes.",
                networkError: "Please check your device's network connection",
                fileMissing: "Please select the import file before continuing",
                noValidData: "There are no valid records for import",
                fileError:
                    "The file containing imported data has an error. Please repeat the import steps",
                noDataExport:
                    "Please select the records you want to export first",
                noErrorDataDownload: "There are no rows with input errors",
                fileChangeError:
                    "If you have just changed the file, please re-upload it to the system",
            },
        },
        toast: {
            saveSuccess: function (entity) {
                return `Successfully saved ${entity} information.`;
            },
            addSuccess: function (entity) {
                return `Successfully added ${entity} information.`;
            },
            deleteSuccess: function (entity) {
                return `Successfully deleted ${entity} information.`;
            },
            funcWarning: "Incomplete functionality.",
            expiredAccessLogin:
                "Login session has expired. Please log in again.",
            fileError: "The imported data file is corrupted.",
            downloadBegin: "Your file is being downloaded.",
            dragPinWarnning: "Unpin this column first.",
            saveColumnSuccess: "Saved successfully.",
            maxPinColumnWarn:
                "More than 3 columns cannot be pinned at the same time.",
        },
        dropDropOption: {
            startWith: "Start with",
            contain: "Contain",
            equal: "Equal",
            small: "Smaller",
            high: "Higher",
        },
        menuContext: {
            edit: "Edit",
            delete: "Delete",
            copy: "Copy",
            stopUsing: "Stop using",
            importExcel: "Import from Excel file",
            exportAllExcel: "Export all records",
            exportSelectedExcel: "Export selected records",
        },
        import: {
            stepInfo: {
                first: "Step 1: Select the source file",
                second: "Step 2: Validate the data",
                third: "Step 3: Import results",
            },
            aside: {
                first: "Select the source file",
                second: "Validate the data",
                third: "Import results",
            },
            main: {
                first: {
                    labelForInput: "Choose",
                    notice: "Select prepared employee data to import into the software",
                    example:
                        "Don't have a sample file to prepare your data? Download the sample excel file that the software provides to prepare import data",
                    downloadHere: "Here",
                },
                second: {
                    notificationError:
                        "Downloading the file containing the imported rows failed",
                    downloadHere: "here.",
                    validRow: "valid row.",
                    inValidRow: "invalid row.",
                    validStatus: "Valid",
                },
                third: {
                    title: "Import results",
                    notificationSuccess:
                        "Download the file containing the import success results",
                    downloadHere: "here.",
                    doneResult: "Number of lines imported successfully: ",
                    falseResult: "Number of failed import lines: ",
                },
            },
        },
    },
};

export default Resource;
