// Biến kiểm tra có đang kéo/thả hay không
let isDragging = false;

// Biến lưu tọa độ ban đầu khi nhấn chuột
const coord = {
    x: 0,
    y: 0,
};

const dropzone = document.querySelector(".dropzone");
const drag = document.querySelector(".drag");

function checkInDropzone(x, y) {
    const left = dropzone.offsetLeft;
    const right = dropzone.offsetLeft + dropzone.offsetWidth;
    const top = dropzone.offsetTop;
    const bottom = dropzone.offsetTop + dropzone.offsetHeight;

    return x >= left && x <= right && y >= top && y <= bottom;
}

function setDragPosition(x, y, instant = true) {
    Object.assign(drag.style, {
        transition: instant ? "none" : "0.5s",
        translate: `${x}px ${y}px`,
    });
}

function getEvent(e) {
    // if (e.touches && e.touches.length) {
    //     return e.touches[0];
    // }
    // return e;
    return e.touches?.length ? e.touches[0] : e;
}

function handleMouseDown(e) {
    const event = getEvent(e);

    isDragging = true; // Bật chế độ "kéo"

    // Lưu tọa độ chuột khi nhấn
    coord.x = event.clientX;
    coord.y = event.clientY;
}

function handleMouseUp() {
    const inDropzone = checkInDropzone(lastTouch.x, lastTouch.y);

    if (inDropzone) {
        // ...
    } else {
        setDragPosition(0, 0, false);
    }

    isDragging = false; // Tắt chế độ "kéo"

    // Reset tọa độ
    coord.x = 0;
    coord.y = 0;
}

let lastTouch = {
    x: 0,
    y: 0,
};

function handleMouseMove(e) {
    // Chỉ xử lý khi trong chế độ "kéo"
    if (isDragging) {
        const event = getEvent(e);
        lastTouch.x = event.clientX;
        lastTouch.y = event.clientY;

        // Tính quãng đường di chuyển của trỏ chuột
        // quãng đường = vị trí mới - vị trí ban đầu
        const distanceX = event.clientX - coord.x;
        const distanceY = event.clientY - coord.y;

        // Áp dụng CSS để di chuyển phần tử
        // theo trỏ chuột
        setDragPosition(distanceX, distanceY);
    }
}

// Khi nhấn chuột xuống phần tử .drag
drag.addEventListener("mousedown", handleMouseDown);
drag.addEventListener("touchstart", handleMouseDown);

// // Khi nhả chuột trong document
document.addEventListener("mouseup", handleMouseUp);
document.addEventListener("touchend", handleMouseUp);

// Khi chuột di chuyển trong document
document.addEventListener("mousemove", handleMouseMove);
document.addEventListener("touchmove", handleMouseMove);
