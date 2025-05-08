let countDown = document.querySelector(".count span");
let bulletsContainer = document.querySelector(".bullets");
let questionArea = document.querySelector(".questionArea");
let answerArea = document.querySelector(".answer-area");
let previousButton = document.querySelector(".buttons .previous");
let nextButton = document.querySelector(".buttons .next");
let submitButton = document.querySelector(".buttons .submit");
let Timer = document.querySelector(".Timer");
let flag = document.querySelector(".flag");
let category=document.querySelector(".category");

let currentIndex = 0;
let rightAnswers = 0;
let countDownInterval = 0;
let questionsObj = []; // make global
submitButton.disabled=true;
async function getQuestions() {
    try {
        sessionStorage.clear(); // Clear session data on start

        let selectedExamType = localStorage.getItem("selectedExamType");
        let fileName;
        category.textContent+= selectedExamType;

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
        console.error("Failed to load questions:", error);
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

            // ✅ Load saved answer from sessionStorage
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
        }
    }
}

function checkAnswer(rAnswer, count) {
    let answers = document.getElementsByName("question");
    let theChoosenAnswer;

    for (let i = 0; i < answers.length; i++) {
        if (answers[i].checked) {
            theChoosenAnswer = answers[i].dataset.answer;

            // ✅ Save answer to sessionStorage
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
        // تحقق إذا كان المستخدم قد أجاب على السؤال الحالي
        let savedAnswer = sessionStorage.getItem(`answer_${i}`);
        if (!savedAnswer) {
            allAnswered = false;
            nextButton.disabled = false;
            // إذا لم يكن هناك إجابة، انتقل مباشرة للسؤال غير المجاب عليه
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
        submitButton.disabled=false;

        submitButton.onclick = () => {
            // تحقق من الإجابات قبل الانتقال
            let rightAnswer = questionsObj[currentIndex].right_answer;
            checkAnswer(rightAnswer, questionsObj.length); // حفظ الإجابة الأخيرة
        
            // التحقق من الإجابات
            if (checkAllAnswers()) {
                // إذا كانت جميع الأسئلة قد تم الإجابة عليها
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
                window.location.href = "result.html"; // الانتقال إلى صفحة النتيجة
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
    let minutes = Math.floor(duration / 60);
    let seconds = duration % 60;

    Timer.innerHTML = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    Timer.style.color = duration <= 30 ? "red" : "#333";

    countDownInterval = setInterval(function () {
        duration--;

        minutes = Math.floor(duration / 60);
        seconds = duration % 60;

        Timer.innerHTML = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;


        if (duration <= 30) {
            Timer.style.color = "red";
        } else {
            Timer.style.color = "#333";
            Timer.style.animation = "none";
        }

        if (duration <= 0) {
            clearInterval(countDownInterval);
            console.log('time is out');
            nextButton.disabled = true;
            submitButton.click();
        }
    }, 1000);
}


