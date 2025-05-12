const backHomeBtn = document.getElementById("backHomeBtn");

backHomeBtn.addEventListener("click", function() {
    const loaderOverlay = document.getElementById("loaderOverlay");
    loaderOverlay.style.display = "flex";
    setTimeout(() => {
        loaderOverlay.classList.add("hidden");
        // window.location.href = "../HTML/home.html";
        window.location.replace("../HTML/home.html");
    }, 2500);
});

const correct = sessionStorage.getItem("result");
const total = sessionStorage.getItem("total");
const resultMsg = document.getElementById("resultMsg");
if (correct !== null && total !== null) {
  const correctNum = parseInt(correct);
  if (correctNum <= 3) {
    document.getElementsByTagName('h2')[0].textContent = "OOPS.!! You failed!";
    document.getElementById("calibrate").style.display = "none";
    document.getElementById("resultText").textContent =
    `You got ${correct} out of ${total} correct.`;
    resultMsg.textContent = "Unfortunately, you didn't pass. Try again to improve your score! 😔";
    document.getElementById('image').style.backgroundImage = "url('../images/resultFailed.jpg')";
//___________________ retry button _________________
    const retryBtn = document.createElement("button");
    retryBtn.textContent = "Retake Exam";
    retryBtn.className = "action-btn";
    retryBtn.id = "retryBtn";
    document.querySelector(".button-group").appendChild(retryBtn);
    retryBtn.addEventListener("click", function () {
      const loaderOverlay = document.getElementById("loaderOverlay");
      loaderOverlay.style.display = "flex";
      setTimeout(() => {
        loaderOverlay.classList.add("hidden");
        // window.location.href = "../HTML/qestionpage.html"; 
        window.location.replace("../HTML/qestionpage.html"); 
      }, 2500);
    });
  } else {
    document.getElementById("resultText").textContent =
      `You got ${correct} out of ${total} correct.`;
  }
} else {
  document.getElementById("box").style.margin="35vh auto";
  document.getElementById("resultText").textContent = "No result available.";
  document.getElementById('image').style.backgroundImage = "url('../images/resultFailed.jpg')";
  document.getElementsByTagName('h2')[0].textContent = "Time is out! bad luck..!";
  document.getElementById("calibrate").style.display = "none";
  resultMsg.style.display = "none";
  document.getElementById('image').style.display = "none";
}

// ______________ congratulation animation ________________
const wrapper = document.querySelector(".confetti-wrapper");
const colors = ["#f44336", "#e91e63", "#9c27b0", "#3f51b5", "#00bcd4", "#4caf50", "#ffeb3b", "#ff9800"];
const corners = [
  { top: "0%", left: "0%" },
  { top: "0%", right: "0%" },
  { bottom: "0%", left: "0%" },
  { bottom: "0%", right: "0%" }
];
for (let i = 0; i < 400; i++) {
  const confetti = document.createElement("div");
  confetti.classList.add("confetti");
  confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

  const corner = corners[Math.floor(Math.random() * corners.length)];
  Object.assign(confetti.style, corner);

  const x = (Math.random() - 0.5) * 1300 + "px";
  const y = (Math.random() - 0.5) * 1300 + "px";
  confetti.style.setProperty('--x-move', x);
  confetti.style.setProperty('--y-move', y);
  confetti.style.animationDuration =` ${2 + Math.random() * 2}s`;
  wrapper.appendChild(confetti);
}
function resetExam() {
    Object.keys(sessionStorage).forEach(key => {
        if (key.startsWith("answer_") || key === "result" || key === "total" || key === "examEndTime" || key === "examStarted") {
            sessionStorage.removeItem(key);
        }
    });
    
    sessionStorage.setItem("isNewExam", "true");
    
    currentIndex = 0;
    rightAnswers = 0;
    
    // location.reload();
}
resetExam()
sessionStorage.clear();
