document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // Nếu đang ở trang login và đã đăng nhập, chuyển hướng đến dashboard
    if (isLoggedIn === 'true' && window.location.pathname.includes('login.html')) {
        window.location.href = 'dashboard.html';
    }
    // Nếu đang ở trang nội dung khóa học và chưa đăng nhập, chuyển hướng về login
    else if (isLoggedIn !== 'true' && (window.location.pathname.includes('khoahoc_ungdungcanva.html') || window.location.pathname.includes('khoahoc_ungdung_ai_truyentranh.html') || window.location.pathname.includes('dashboard.html'))) {
        window.location.href = 'login.html';
    }
    // Nếu đang ở trang khóa học cụ thể, kiểm tra quyền truy cập
    else if (isLoggedIn === 'true' && (window.location.pathname.includes('khoahoc_ungdungcanva.html') || window.location.pathname.includes('khoahoc_ungdung_ai_truyentranh.html'))) {
        const courseId = window.location.pathname.split('/').pop().replace('.html', '');
        if (!currentUser || !currentUser.courses || !currentUser.courses.includes(courseId)) {
            alert('Bạn không có quyền truy cập khóa học này.');
            window.location.href = 'dashboard.html'; // Chuyển hướng về dashboard nếu không có quyền
        }
    }
});

async function loginUser() {
    const usernameInput = document.getElementById('usernameInput');
    const passwordInput = document.getElementById('passwordInput');
    const errorMessage = document.getElementById('errorMessage');

    const username = usernameInput.value;
    const password = passwordInput.value;

    try {
        const response = await fetch('users.json');
        const users = await response.json();

        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            errorMessage.style.display = 'none';
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUser', JSON.stringify(user)); // Lưu thông tin người dùng
            window.location.href = 'dashboard.html'; // Chuyển hướng đến trang tổng quan khóa học
        } else {
            errorMessage.style.display = 'block';
        }
    } catch (error) {
        console.error('Lỗi khi tải dữ liệu người dùng:', error);
        errorMessage.textContent = 'Đã xảy ra lỗi. Vui lòng thử lại sau.';
        errorMessage.style.display = 'block';
    }
}

function logoutUser() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}
