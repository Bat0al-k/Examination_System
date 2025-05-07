// _______________ variables of dom elements _________________
const arrowBtn = document.getElementsByClassName("arrow-btn")[0];
const btnGroup = document.getElementById("btn-group");
const question = document.getElementById("motivateMg");
const loaderOverlay = document.getElementById("loaderOverlay");
const examType = document.getElementsByClassName("examType");
// ______________ change welcome box in home page _____________
let clickCount = 0; 
arrowBtn.addEventListener("click", () => {
    clickCount++;
    if (clickCount === 1) {
        btnGroup.classList.add("hidden");
        question.innerHTML = `
        take a deep breath,
        don’t worry it’s gonna be okay ˆᴗˆ
        `;
// ______________ Loader to navigation in pages _______________
    } else if (clickCount === 2) {
        
        loaderOverlay.style.display = "flex";
        setTimeout(() => {
            loaderOverlay.classList.add("hidden"); 
            window.location.href = "../HTML/qestionpage.html"; 
        }, 2500);
    }
    });
// ________________ navigation in exams pages _________________
    for (let i = 0; i < examType.length; i++) {
        examType[i].addEventListener("click", () => {
            loaderOverlay.style.display = "flex";
            setTimeout(() => {
                loaderOverlay.classList.add("hidden"); 
                window.location.href = "../HTML/qestionpage.html"; 
            }, 2500);
        });
    }