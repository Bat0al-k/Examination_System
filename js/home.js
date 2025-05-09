const arrowBtn = document.getElementsByClassName("arrow-btn")[0];
const btnGroup = document.getElementById("btn-group");
const question = document.getElementById("motivateMg");
const loaderOverlay = document.getElementById("loaderOverlay");
const examType = document.getElementsByClassName("examType");
const warningMsg = document.getElementById("warningMsg");
const userName=document.querySelector(".userName");
const nameUser=localStorage.getItem("User name");
userName.textContent+= nameUser;
let clickCount = 0;
let selectedExamType = null; 

window.onload = function () {
    localStorage.removeItem("selectedExamType");
};

// _____________ choose exam type _____________
for (let i = 0; i < examType.length; i++) {
    examType[i].addEventListener("click", () => {
        selectedExamType = examType[i].getAttribute("data-type");
        localStorage.setItem("selectedExamType", selectedExamType);

// __________ select exam type _____________
        for (let j = 0; j < examType.length; j++) {
            examType[j].classList.remove("selected");
        }
        examType[i].classList.add("selected");
        warningMsg.classList.add("hidden");
    });
}

arrowBtn.addEventListener("click", () => {
    selectedExamType = localStorage.getItem("selectedExamType");
    if (!selectedExamType) {
        warningMsg.classList.remove("hidden");
        return;
    }
    clickCount++;
    if (clickCount === 1) {
        btnGroup.classList.add("hidden");
        question.innerHTML = `take a deep breath, don’t worry it’s gonna be okay ˆᴗˆ`;
    } else if (clickCount === 2) {
        loaderOverlay.style.display = "flex";
        setTimeout(() => {
            loaderOverlay.classList.add("hidden");
            window.location.href = `../HTML/qestionpage.html?type=${selectedExamType}`;
        }, 2500);
    }
});

