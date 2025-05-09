let countDown = document.querySelector(".count span");
let bulletsContainer = document.querySelector(".bullets");
let questionArea = document.querySelector(".questionArea");
let answerArea = document.querySelector(".answer-area");
let previousButton = document.querySelector(".buttons .previous");
let nextButton = document.querySelector(".buttons .next");
let submitButton = document.querySelector(".buttons .submit");
let Timer = document.querySelector(".Timer");
let flag = document.querySelector(".flag");
let category = document.querySelector(".category");

let currentIndex = 0;
let rightAnswers = 0;
let countDownInterval = 0;
let questionsObj = []; // make global
submitButton.disabled = true;
// ________________ Prevent Back & Reload Button ________________
(() => {
    const DISABLE_DURATION = 180000; // 3 minutes
    const STORAGE_KEY = 'navigationDisableEndTime';

    let navDisabled = false;
    let timeoutId;

    const now = () => new Date().getTime();

    function disableLinks() {
        document.querySelectorAll('a').forEach(link => {
            link.classList.add('disabled');
            link.addEventListener('click', preventDefaultAction, true);
        });
    }

    function enableLinks() {
        document.querySelectorAll('a').forEach(link => {
            link.classList.remove('disabled');
            link.removeEventListener('click', preventDefaultAction, true);
        });
    }

    function preventDefaultAction(e) {
        e.preventDefault();
    }

    function disableNavigationButtons() {
        history.pushState(null, document.title, location.href);
        window.addEventListener('popstate', blockNavigation);
        window.addEventListener('keydown', blockReloadKeys, true);
    }

    function enableNavigationButtons() {
        window.removeEventListener('popstate', blockNavigation);
        window.removeEventListener('keydown', blockReloadKeys, true);
    }

    function blockNavigation(event) {
        if (navDisabled) {
            history.pushState(null, document.title, location.href);
        }
    }

    function blockReloadKeys(e) {
        if (!navDisabled) return;

        const key = e.key;

        if (
            key === 'F5' ||
            (e.ctrlKey && (key === 'r' || key === 'R')) ||
            (e.ctrlKey && (key === 'ArrowLeft' || key === 'ArrowRight')) ||
            (e.metaKey && (key === 'r' || key === 'R'))
        ) {
            e.preventDefault();
            e.stopPropagation();
        }
    }

    function endDisablePeriod() {
        navDisabled = false;
        enableLinks();
        enableNavigationButtons();
        console.log("✅ Navigation re-enabled");
        localStorage.removeItem(STORAGE_KEY);
    }

    function startDisablePeriod(remainingMs) {
        navDisabled = true;
        disableLinks();
        disableNavigationButtons();
        console.log("⛔ Navigation disabled for", remainingMs / 1000, "seconds");

        timeoutId = setTimeout(() => {
            endDisablePeriod();
        }, remainingMs);
    }

    function initDisable() {
        const storedEndTime = localStorage.getItem(STORAGE_KEY);
        const currentTime = now();

        if (storedEndTime) {
            const disableEndTime = parseInt(storedEndTime, 180);
            if (disableEndTime > currentTime) {
                const remaining = disableEndTime - currentTime;
                startDisablePeriod(remaining);
                return;
            } else {
                localStorage.removeItem(STORAGE_KEY);
            }
        }

        const newDisableEndTime = currentTime + DISABLE_DURATION;
        localStorage.setItem(STORAGE_KEY, newDisableEndTime.toString());
        startDisablePeriod(DISABLE_DURATION);
    }

    window.addEventListener('load', initDisable);
})();
// __________________ End _________________
// __________________ question Area _________________
async function getQuestions() {
    try {
        Object.keys(sessionStorage).forEach(key => {
            if (key.startsWith("answer_") || key === "result" || key === "total") {
                sessionStorage.removeItem(key);
            }
        }); // Clear session data on start

        let selectedExamType = localStorage.getItem("selectedExamType");
        let fileName;
        category.textContent += selectedExamType;

        switch (selectedExamType) {
            case "HTML":
                fileName = "../JSON/htmlQuestions.json";
                break;
            case "CSS":
                fileName = "../JSON/cssQuestions.json";
                break;
            case "JS":
                fileName = "../JSON/JsQuestions.json";
                break;
            default:
                console.error("No valid exam type found!");
                return;
        }

        const response = await fetch(fileName);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        questionsObj = await response.json();
        
        // Shuffle questionsObj array
        shuffleArray(questionsObj);

        let questionCount = questionsObj.length;

        createBullets(questionCount);
        addQuestionData(questionsObj[currentIndex], questionCount);
        countDownTimer(180);

        nextButton.onclick = () => {
            let rightAnswer = questionsObj[currentIndex].right_answer;

            checkAnswer(rightAnswer, questionCount);
            currentIndex++;

            questionArea.innerHTML = "";
            answerArea.innerHTML = "";

            addQuestionData(questionsObj[currentIndex], questionCount);
            handleBullets();

            showResults(questionCount);

            previousButton.disabled = currentIndex === 0;
            nextButton.disabled = currentIndex === questionCount - 1;
        };

        previousButton.disabled = currentIndex === 0;

        previousButton.onclick = () => {
            let rightAnswer = questionsObj[currentIndex].right_answer;

            checkAnswer(rightAnswer, questionCount);
            currentIndex--;

            questionArea.innerHTML = "";
            answerArea.innerHTML = "";

            addQuestionData(questionsObj[currentIndex], questionCount);
            handleBullets();

            previousButton.disabled = currentIndex === 0;
            nextButton.disabled = currentIndex === questionCount - 1;

            showResults(questionCount);
        };

    } catch (error) {
        window.location.href = "404.html";
        console.error("Failed to load questions:", error);
    }
}

// Shuffle function to randomize the questions
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
}

getQuestions();


function createBullets(num) {
    countDown.innerHTML = num;

    for (let i = 0; i < num; i++) {
        let thBullets = document.createElement("span");
        thBullets.innerHTML = i + 1;
        thBullets.dataset.index = i;

        if (i === 0) {
            thBullets.className = 'on';
        }

        thBullets.addEventListener("click", function () {
            if (i === currentIndex) return;

            currentIndex = i;
            questionArea.innerHTML = "";
            answerArea.innerHTML = "";

            addQuestionData(questionsObj[currentIndex], questionsObj.length);
            handleBullets();

            previousButton.disabled = currentIndex === 0;
            nextButton.disabled = currentIndex === questionsObj.length - 1;
        });

        bulletsContainer.appendChild(thBullets);
    }
}

function addQuestionData(obj, count) {
    if (currentIndex < count) {
        let questionTittle = document.createElement('h3');
        let questionNumber = document.createTextNode(currentIndex + 1 + '- ');
        let questionText = document.createTextNode(obj.question);
        questionTittle.appendChild(questionNumber);
        questionTittle.appendChild(questionText);
        questionArea.appendChild(questionTittle);

        for (let i = 1; i <= 4; i++) {
            let mainDiv = document.createElement("div");
            mainDiv.className = "answer";

            let radioInput = document.createElement("input");
            radioInput.type = 'radio';
            radioInput.name = 'question';
            radioInput.id = `answer_${i}`;
            radioInput.dataset.answer = obj[`answer_${i}`];

            // Load saved answer from sessionStorage
            let savedAnswer = sessionStorage.getItem(`answer_${currentIndex}`);
            if (savedAnswer && savedAnswer === obj[`answer_${i}`]) {
                radioInput.checked = true;
            }

            let label = document.createElement('label');
            label.htmlFor = `answer_${i}`;
            let labelText = document.createTextNode(obj[`answer_${i}`]);
            label.appendChild(labelText);

            mainDiv.appendChild(radioInput);
            mainDiv.appendChild(label);
            answerArea.appendChild(mainDiv);

            // Add event listener to save the answer
            radioInput.addEventListener("change", () => {
                sessionStorage.setItem(`answer_${currentIndex}`, radioInput.dataset.answer);
            });
        }
    }
}

function checkAnswer(rAnswer, count) {
    let answers = document.getElementsByName("question");
    let theChoosenAnswer;

    for (let i = 0; i < answers.length; i++) {
        if (answers[i].checked) {
            theChoosenAnswer = answers[i].dataset.answer;

            // Save answer to sessionStorage
            sessionStorage.setItem(`answer_${currentIndex}`, theChoosenAnswer);
        }
    }

    if (rAnswer === theChoosenAnswer) {
        rightAnswers++;
    }
}

function handleBullets() {
    let bulletsSpans = document.querySelectorAll(".bullets span");
    bulletsSpans.forEach((span, index) => {
        if (index === currentIndex) {
            span.classList.add("on");
        }
    });
}

function checkAllAnswers() {
    let allAnswered = true;

    for (let i = 0; i < questionsObj.length; i++) {
        // Check if there is an answer saved in sessionStorage
        let savedAnswer = sessionStorage.getItem(`answer_${i}`);
        if (!savedAnswer) {
            allAnswered = false;
            nextButton.disabled = false;
            // Go to the question that has no answer
            currentIndex = i;
            questionArea.innerHTML = "";
            answerArea.innerHTML = "";
            addQuestionData(questionsObj[currentIndex], questionsObj.length);
            handleBullets();
            break;
        }
    }

    return allAnswered;
}

// (Optional) You may have countDownTimer and showResults functions below here if needed.

function showResults(count) {
    if (currentIndex === count - 1) {
        nextButton.disabled = true;
        submitButton.disabled = false;

        submitButton.onclick = () => {
            // check the last answer
            let rightAnswer = questionsObj[currentIndex].right_answer;
            checkAnswer(rightAnswer, questionsObj.length); // save the last answer

            // check answers
            if (checkAllAnswers()) {
                // if all answers are answered
                let correctCount = 0;
                for (let i = 0; i < questionsObj.length; i++) {
                    const userAnswer = sessionStorage.getItem(`answer_${i}`);
                    if (userAnswer === questionsObj[i].right_answer) {
                        correctCount++;
                    }
                }

                // حفظ النتيجة في sessionStorage
                sessionStorage.setItem("result", correctCount);
                sessionStorage.setItem("total", questionsObj.length);
                // window.location.href = "result.html"; 
                window.location.replace("result.html"); 

            }
        };
    }
}

// Flag event
flag.onclick = () => {
    let bulletsSpans = document.querySelectorAll(".bullets span");
    if (bulletsSpans[currentIndex]) {
        bulletsSpans[currentIndex].classList.toggle("flagged"); // Toggle yellow
    }
};

function countDownTimer(duration) {
    clearInterval(countDownInterval);

    const now = Date.now();

    let endTime = sessionStorage.getItem("examEndTime");

    if (!endTime) {
        endTime = now + duration * 1000; 
        sessionStorage.setItem("examEndTime", endTime);
    } else {
        endTime = parseInt(endTime, 10);
    }

    countDownInterval = setInterval(() => {
        const currentTime = Date.now();
        let remainingTime = Math.floor((endTime - currentTime) / 1000); 

        if (remainingTime <= 0) {
            clearInterval(countDownInterval);
            sessionStorage.removeItem("examEndTime");
            window.location.replace("result.html"); 
        } else {
            let minutes = Math.floor(remainingTime / 60);
            let seconds = remainingTime % 60;

            Timer.innerHTML = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            Timer.style.color = remainingTime <= 30 ? "red" : "#333";
        }
    }, 1000);
}

countDownTimer(questionsObj[currentIndex].time);
