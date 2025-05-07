const backHomeBtn = document.getElementById("backHomeBtn");
backHomeBtn.addEventListener("click", function() {
    const loaderOverlay = document.getElementById("loaderOverlay");
    loaderOverlay.style.display = "flex";
    setTimeout(() => {
        loaderOverlay.classList.add("hidden");
        window.location.href = "../HTML/home.html";
    }, 2500);
});

const correct = sessionStorage.getItem("result");
    const total = sessionStorage.getItem("total");

    if (correct !== null && total !== null) {
      document.getElementById("resultText").textContent =
        `You got ${correct} out of ${total} correct.`;
    } else {
      document.getElementById("resultText").textContent =
        "No result available.";
    }