// Lấy các phần tử HTML cần thiết từ DOM
const prevBtn = document.querySelector("#prev"); // Nút "Previous" để chuyển slide trước
const nextBtn = document.querySelector("#next"); // Nút "Next" để chuyển slide sau
const slideshow = document.querySelector(".slideshow"); // Container chính chứa toàn bộ slideshow
const slides = Array.from(document.querySelectorAll(".slide-item")); // Mảng chứa tất cả slide items
const track = document.querySelector(".track"); // Track chứa tất cả slides và di chuyển

// Tạo bản sao (clone) của slide đầu và cuối để tạo hiệu ứng lặp vô hạn
const firstSlide = slides[0].cloneNode(true); // Clone slide đầu tiên
const lastSlide = slides.at(-1).cloneNode(true); // Clone slide cuối cùng

// Hằng số định nghĩa hướng di chuyển slideshow
const NEXT = 1; // Giá trị để di chuyển tới slide tiếp theo
const PREV = -1; // Giá trị để di chuyển về slide trước đó

const originLength = slides.length; // Lưu số lượng slide gốc (không bao gồm clone)

// Thêm các slide clone vào mảng slides để tạo cấu trúc: [clone_cuối, slide1, slide2, ..., slideN, clone_đầu]
slides.unshift(lastSlide); // Thêm clone slide cuối vào đầu mảng
slides.push(firstSlide); // Thêm clone slide đầu vào cuối mảng

// Thêm các slide clone vào DOM
track.append(firstSlide); // Thêm clone slide đầu vào cuối track
track.prepend(lastSlide); // Thêm clone slide cuối vào đầu track

let currentIndex = 1; // Vị trí hiện tại của slide (bắt đầu từ slide đầu tiên thật, không phải clone)
let canControl = true; // Cờ kiểm soát có cho phép chuyển slide hay không (tránh spam click)

/**
 * Đặt vị trí của track slideshow bằng cách di chuyển theo trục X
 * @param {boolean} instant - True nếu chuyển ngay lập tức (không transition), false nếu có transition
 */
function setPosition(instant = false) {
    if (!instant) {
        // Vô hiệu hóa điều khiển trong khi transition đang chạy (tránh conflict)
        canControl = false;
    }

    // Thiết lập transition: bỏ qua nếu instant = true, có transition 0.5s nếu false
    track.style.transition = instant ? "none" : "ease 0.5s";

    // Di chuyển track theo phương thức translate, mỗi slide chiếm 100% width
    // Công thức: currentIndex * 100 * -1 (âm để di chuyển ngược chiều)
    track.style.translate = `${currentIndex * 100 * -1}%`;
}

/**
 * Tính toán và chuyển đến vị trí slide mới
 * @param {number} step - Hướng di chuyển (1 = next, -1 = previous)
 */
function calNewIndex(step) {
    // Tính toán index mới sử dụng modulo để tạo vòng lặp vô hạn
    currentIndex = (currentIndex + step + slides.length) % slides.length;

    // Lắng nghe sự kiện kết thúc transition để xử lý logic chuyển đổi
    track.ontransitionend = () => {
        // Nếu đang ở slide clone cuối (sau slide thật cuối cùng)
        if (currentIndex > originLength) {
            currentIndex = currentIndex - originLength; // Nhảy về slide thật đầu tiên
            setPosition(true); // Chuyển ngay lập tức không có transition
        }

        // Nếu đang ở slide clone đầu (trước slide thật đầu tiên)
        if (currentIndex === 0) {
            currentIndex = originLength; // Nhảy về slide thật cuối cùng
            setPosition(true); // Chuyển ngay lập tức không có transition
        }

        // Cho phép người dùng điều khiển slideshow trở lại
        canControl = true;
    };

    // Thực hiện di chuyển slide với transition
    setPosition();
}

let autoPlayId; // Biến lưu ID của interval timer để có thể clear sau này

/**
 * Bật chế độ tự động chuyển slide
 */
function startAutoPlay() {
    autoPlayId = setInterval(() => {
        calNewIndex(NEXT); // Tự động chuyển tới slide tiếp theo
    }, 3000); // Chu kỳ 3000ms = 3 giây
}

/**
 * Tắt chế độ tự động chuyển slide
 */
function stopAutoPlay() {
    clearInterval(autoPlayId); // Clear interval để dừng auto play
}

/**
 * Reset lại timer auto play - dừng timer cũ và bắt đầu timer mới
 * Mục đích: Khi user click manual, reset lại chu kỳ 3s để tránh slide chuyển liền sau click
 * Nếu không reset, auto play có thể chuyển slide ngay sau khi user vừa click (vì timer có thể sắp hết 3s)
 */
function resetAutoPlay() {
    stopAutoPlay(); // Dừng timer hiện tại
    startAutoPlay(); // Bắt đầu timer mới từ đầu (đếm lại từ 0s)
}

// Khởi động chế độ auto play khi trang load
startAutoPlay();

// Khởi tạo vị trí ban đầu của slideshow
setPosition(true);

// Xử lý sự kiện click nút "Previous"
prevBtn.addEventListener("click", (e) => {
    if (!canControl) return; // Thoát nếu đang trong quá trình transition (tránh spam click)
    resetAutoPlay(); // Reset timer auto play để tránh conflict với user action
    calNewIndex(PREV); // Gọi hàm chuyển về slide trước
});

// Xử lý sự kiện click nút "Next"
nextBtn.addEventListener("click", (e) => {
    if (!canControl) return; // Thoát nếu đang trong quá trình transition (tránh spam click)
    resetAutoPlay(); // Reset timer auto play để tránh conflict với user action
    calNewIndex(NEXT); // Gọi hàm chuyển tới slide tiếp theo
});

// Tạm dừng auto play khi người dùng hover vào slideshow (để họ có thể xem thoải mái)
slideshow.addEventListener("mouseenter", () => {
    stopAutoPlay();
});

// Tiếp tục auto play khi người dùng rời chuột khỏi slideshow
slideshow.addEventListener("mouseleave", () => {
    startAutoPlay();
});

/* 
GIẢI THÍCH CẤU TRÚC SLIDESHOW:

Slide gốc ban đầu: [1, 2, 3]
Sau khi thêm clone: [3(clone), 1, 2, 3, 1(clone)]
Index tương ứng:    [0,        1, 2, 3, 4]

- Clone slide cuối (3) được đặt ở vị trí index 0
- Các slide thật được đặt từ index 1 đến 3  
- Clone slide đầu (1) được đặt ở vị trí index 4

KHI CHUYỂN SLIDE:
- Từ slide thật cuối (index 3) sang next -> chuyển đến clone đầu (index 4)
- Khi transition xong, nhảy ngay lập tức (không transition) về slide thật đầu (index 1)
- Từ slide thật đầu (index 1) sang prev -> chuyển đến clone cuối (index 0)  
- Khi transition xong, nhảy ngay lập tức về slide thật cuối (index 3)

Điều này tạo ra hiệu ứng lặp vô hạn mượt mà cho người dùng.
*/
