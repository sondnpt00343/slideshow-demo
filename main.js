// // DOM events
// const h1 = document.querySelector("h1");

// // 1. Sử dụng phương thức "on+eventName"
// h1.onclick = (e) => {
//     console.log(this);
// };

// // 2. Sử dụng phương thức "addEventListener"
// h1.addEventListener("click", () => {
//     console.log(this);
// });

// const goToTop = document.querySelector(".go-to-top");

// document.addEventListener("scroll", function (e) {
// if (window.scrollY >= 300) {
//     goToTop.hidden = false;
// } else {
//     goToTop.hidden = true;
// }
// goToTop.hidden = window.scrollY < 300;

//     goToTop.classList.toggle("show", window.scrollY >= 300);
// });

// goToTop.addEventListener("click", function () {
//     window.scroll({
//         top: 0,
//         behavior: "smooth",
//     });
// });

const contextmenu = document.querySelector(".contextmenu");

contextmenu.addEventListener("click", function (e) {
    e.stopPropagation();
});

document.addEventListener("contextmenu", function (e) {
    e.preventDefault();

    contextmenu.style.top = e.clientY + "px";
    contextmenu.style.left = e.clientX + "px";

    contextmenu.classList.add("show");
});

document.addEventListener("click", function () {
    contextmenu.classList.remove("show");
});
