const musicPlayer = {
    // Hằng số để xác định hướng chuyển bài
    DIRECTION_NEXT: 1,
    DIRECTION_PREVIOUS: -1,

    // Thời gian tối thiểu (giây) để xem như đã nghe bài - nếu nhấn prev sau thời gian này sẽ về đầu bài thay vì lùi bài
    MIN_TIME_TO_RESTART: 2,

    // Lấy các phần tử DOM cần thiết
    playlistElement: document.querySelector(".playlist"),
    songTitleElement: document.querySelector(".song-title"),
    audioElement: document.querySelector("#audio"),
    playPauseButton: document.querySelector(".btn-toggle-play"),
    playIcon: document.querySelector("#play-icon"),
    previousButton: document.querySelector(".btn-prev"),
    nextButton: document.querySelector(".btn-next"),
    progressSlider: document.querySelector("#progress"),
    repeatButton: document.querySelector(".btn-repeat"),
    cdElement: document.querySelector(".cd"),

    // Bài tập trên lớp:
    // 1. Nhấn next chuyển bài tiếp theo
    // 2. Nhấn prev lùi lại 1 bài
    // 3. Bài cuối next -> về bài đầu, bài đầu prev -> tới bài cuối

    // Cờ để kiểm tra có đang kéo thanh tiến trình không (tránh xung đột khi user kéo)
    isUserSeekingProgress: false,

    // Lưu trạng thái repeat từ localStorage để giữ lại khi refresh trang
    isRepeatMode: localStorage.getItem("isRepeat") === "true",

    // Mảng chứa danh sách các bài hát
    songList: [
        {
            id: 1,
            name: "Kho Báu (with Rhymastic)",
            path: "./musics/Kho Báu (with Rhymastic).mp3",
            artist: "Nguyễn A",
        },
        {
            id: 2,
            name: "NÉT",
            path: "./musics/NÉT.mp3",
            artist: "Nguyễn B",
        },
        {
            id: 3,
            name: "Yêu Em Dài Lâu - Yêu 5",
            path: "./musics/Yêu Em Dài Lâu - Yêu 5.mp3",
            artist: "Nguyễn C",
        },
    ],

    // Chỉ số của bài hát hiện tại trong mảng songList
    currentSongIndex: 0,

    // Lấy thông tin bài hát hiện tại
    getCurrentSong() {
        return this.songList[this.currentSongIndex];
    },

    // Step 1: Tải thông tin bài hát hiện tại lên giao diện
    loadCurrentSong() {
        // Lấy thông tin bài hát hiện tại
        const currentSong = this.getCurrentSong();

        // Cập nhật tên bài hát lên tiêu đề
        this.songTitleElement.textContent = currentSong.name;

        // Đặt đường dẫn file nhạc cho thẻ audio
        this.audioElement.src = currentSong.path;
    },

    // Step 3: Xử lý chuyển bài (tiến/lùi)
    changeSong(direction) {
        // Tính chỉ số bài hát mới bằng công thức modulo để tạo vòng lặp vô hạn
        // Ví dụ: nếu đang ở bài cuối và next -> về bài đầu
        this.currentSongIndex =
            (this.currentSongIndex + direction + this.songList.length) %
            this.songList.length;

        // Tải lại thông tin bài hát mới
        this.loadCurrentSong();

        // Cập nhật giao diện playlist để highlight bài đang phát
        this.renderPlaylist();

        // Tự động phát bài hát mới
        this.audioElement.play();
    },

    // === CÁC PHƯƠNG THỨC XỬ LÝ SỰ KIỆN ===

    // Xử lý nút play/pause
    handlePlayPauseClick() {
        // Kiểm tra trạng thái audio: nếu đang dừng thì phát, đang phát thì dừng
        if (this.audioElement.paused) {
            this.audioElement.play();
        } else {
            this.audioElement.pause();
        }
    },

    // Xử lý khi audio bắt đầu phát
    handleAudioPlay() {
        this.playIcon.classList.remove("fa-play");
        this.playIcon.classList.add("fa-pause");

        // Thêm class và chạy animation quay đĩa CD
        this.cdElement.classList.add("playing");
        this.cdElement.style.animationPlayState = "running";
    },

    // Xử lý khi audio dừng phát
    handleAudioPause() {
        this.playIcon.classList.remove("fa-pause");
        this.playIcon.classList.add("fa-play");

        // Tạm dừng animation quay đĩa CD
        this.cdElement.style.animationPlayState = "paused";
    },

    // Xử lý nút next (chuyển bài tiếp theo)
    handleNextClick() {
        this.changeSong(this.DIRECTION_NEXT);
    },

    // Xử lý nút previous (lùi bài hoặc về đầu bài)
    handlePreviousClick() {
        // Nếu đã phát hơn MIN_TIME_TO_RESTART giây thì về đầu bài, chưa đến thời gian đó thì lùi bài
        if (this.audioElement.currentTime > this.MIN_TIME_TO_RESTART) {
            this.audioElement.currentTime = 0; // Về đầu bài hiện tại
        } else {
            this.changeSong(this.DIRECTION_PREVIOUS); // Lùi về bài trước
        }
    },

    // Cập nhật thanh tiến trình theo thời gian phát nhạc
    handleTimeUpdate() {
        const { duration, currentTime } = this.audioElement;

        // Chỉ cập nhật khi có duration và user không đang kéo thanh progress
        if (!duration || this.isUserSeekingProgress) return;

        // Tính phần trăm tiến trình và cập nhật thanh slider
        this.progressSlider.value = Math.round((currentTime / duration) * 100);
    },

    // Khi user bắt đầu kéo thanh tiến trình
    handleProgressMouseDown() {
        this.isUserSeekingProgress = true; // Tạm dừng cập nhật tự động
    },

    // Khi user thả chuột sau khi kéo thanh tiến trình
    handleProgressMouseUp(event) {
        this.isUserSeekingProgress = false; // Cho phép cập nhật tự động trở lại

        // Lấy vị trí mới của thanh slider
        const newProgressPercent = event.target.value;

        // Tính thời gian tương ứng và cập nhật vào audio
        const newTimePosition =
            (newProgressPercent / 100) * this.audioElement.duration;
        this.audioElement.currentTime = newTimePosition;
    },

    // Xử lý khi bài hát kết thúc
    handleAudioEnded() {
        if (this.isRepeatMode) {
            // Nếu bật repeat thì phát lại bài hiện tại
            this.audioElement.play();
        } else {
            // Không repeat thì chuyển sang bài tiếp theo
            this.changeSong(this.DIRECTION_NEXT);
        }
    },

    // Xử lý nút repeat (lặp lại bài hát)
    handleRepeatClick() {
        // Đổi trạng thái repeat
        this.isRepeatMode = !this.isRepeatMode;

        // Cập nhật class active để thay đổi màu sắc nút
        this.repeatButton.classList.toggle("active", this.isRepeatMode);

        // Lưu trạng thái vào localStorage để giữ lại khi refresh
        localStorage.setItem("isRepeat", this.isRepeatMode);
    },

    // === ĐĂNG KÝ CÁC SỰ KIỆN ===

    setupEventListeners() {
        // Nhóm sự kiện điều khiển phát/dừng
        this.playPauseButton.addEventListener("click", () =>
            this.handlePlayPauseClick()
        );
        this.audioElement.addEventListener("play", () =>
            this.handleAudioPlay()
        );
        this.audioElement.addEventListener("pause", () =>
            this.handleAudioPause()
        );

        // Nhóm sự kiện chuyển bài
        this.nextButton.addEventListener("click", () => this.handleNextClick());
        this.previousButton.addEventListener("click", () =>
            this.handlePreviousClick()
        );
        this.audioElement.addEventListener("ended", () =>
            this.handleAudioEnded()
        );

        // Nhóm sự kiện thanh tiến trình
        this.audioElement.addEventListener("timeupdate", () =>
            this.handleTimeUpdate()
        );
        this.progressSlider.addEventListener("mousedown", () =>
            this.handleProgressMouseDown()
        );
        this.progressSlider.addEventListener("mouseup", (event) =>
            this.handleProgressMouseUp(event)
        );

        // Sự kiện chế độ repeat
        this.repeatButton.addEventListener("click", () =>
            this.handleRepeatClick()
        );
    },

    // Khởi tạo music player
    initialize() {
        // Step 2: Tải bài hát đầu tiên khi khởi động
        this.loadCurrentSong();

        // Đăng ký tất cả event listeners
        this.setupEventListeners();

        // Hiển thị danh sách bài hát lần đầu
        this.renderPlaylist();

        // Cập nhật trạng thái ban đầu của nút repeat dựa trên localStorage
        this.repeatButton.classList.toggle("active", this.isRepeatMode);
    },

    // Hiển thị danh sách bài hát ra giao diện
    renderPlaylist() {
        // Tạo HTML cho từng bài hát trong danh sách
        const playlistHTML = this.songList
            .map((song, index) => {
                return `
                <div class="song ${
                    this.currentSongIndex === index ? "active" : ""
                }">
                    <div
                        class="thumb"
                        style="
                            background-image: url('https://i.ytimg.com/vi/jTLhQf5KJSc/maxresdefault.jpg');
                        "
                    ></div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.artist}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `;
            })
            .join(""); // Nối tất cả HTML thành một chuỗi

        // Cập nhật nội dung playlist
        this.playlistElement.innerHTML = playlistHTML;
    },
};

// Khởi động music player khi trang web load xong
musicPlayer.initialize();
