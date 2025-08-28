// 1. Chức năng "Add todo"
// - Bắt event "submit" form
// - Lấy giá trị nhập vào input
// - Hiển thị "task" mới vào danh sách

// Lưu ý:
// - Sau khi "Add task" thì clear input
// - Hiển thị "Danh sách trống" khi không có task

// Lấy các phần tử cần dùng
const todoForm = document.querySelector("#todo-form");
const taskName = document.querySelector("#task-name");
const tasksList = document.querySelector("#tasks-list");

// Mảng lưu danh sách công việc
const tasks = JSON.parse(localStorage.getItem("tasks")) ?? [];

// Xử lý khi form submit
todoForm.onsubmit = (e) => {
    e.preventDefault();

    // Lấy ra công việc mới từ input
    const newTask = {
        name: taskName.value.trim(), // Loại bỏ khoảng trắng thừa (đầu & cuối chuỗi)
        isCompleted: false,
    };

    // Không thêm công việc nếu để trống
    if (!newTask.name) {
        alert("Tên công việc không được để trống!");
        return;
    }

    // Không cho phép thêm công việc trùng tên
    const existTask = tasks.find((task) => task.name === newTask.name);
    if (existTask) {
        alert(`Tên công việc "${newTask.name}" đã tồn tại!`);
        return;
    }

    // Thêm công việc mới vào danh sách "tasks"
    tasks.unshift(newTask);

    // Lưu lại
    localStorage.setItem("tasks", JSON.stringify(tasks));

    // Render tasks ra UI
    renderTasks();

    // Clear input
    taskName.value = "";
};

function escapeHTML(str) {
    const div = document.createElement("div");
    div.innerText = str; // Tự động escape HTML
    return div.innerHTML; // Lấy ra HTML
}

function renderTasks() {
    // Kiểm tra để hiển thị danh sách trống
    if (!tasks.length) {
        tasksList.innerHTML = "<li>Danh sách trống</li>";
        return; // Thoát hàm
    }

    // Có dữ liệu "tasks" thì render
    tasksList.innerHTML = "";

    tasks.forEach((task) => {
        const item = document.createElement("li");
        item.textContent = task.name;

        tasksList.appendChild(item);
    });

    // const html = tasks
    //     .map((task) => {
    //         return `<li>${escapeHTML(task.name)}</li>`;
    //     })
    //     .join("");

    // tasksList.innerHTML = html;
}

// Render lần đầu khi mới tải trang
renderTasks();
