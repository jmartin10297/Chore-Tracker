const manageButton = document.getElementById("manageButton");
const manageMenu = document.getElementById("manageMenu");

if (manageButton && manageMenu) {
    manageButton.addEventListener("click", function () {
        manageMenu.classList.toggle("show");
    });
}

const manageChoresButton = document.getElementById("manageChoresButton");

if (manageChoresButton) {
    manageChoresButton.addEventListener("click", function () {
        window.location.href = "masterTaskList.html";
    });
}

const homeButton = document.getElementById("homeButton");

if (homeButton) {
    homeButton.addEventListener("click", function () {
        window.location.href = "index.html";
    });
}