document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.getElementById("start-quiz");
    const difficultySelect = document.getElementById("difficulty");
    const quizContainer = document.getElementById("quiz-container");
    const questionText = document.getElementById("question-text");
    const optionsDiv = document.getElementById("options");
    const quizForm = document.getElementById("quiz-form");
    const resultContainer = document.getElementById("result-container");
    const resultMessage = document.getElementById("result-message");
    const correctCountDisplay = document.getElementById("correct-count");
    const totalCountDisplay = document.getElementById("total-count");
    const playAgainButton = document.getElementById("play-again");
    const resetScoreButton = document.getElementById("reset-score");

    let correctCount = localStorage.getItem("correctCount") || 0;
    let totalCount = localStorage.getItem("totalCount") || 0;

    correctCountDisplay.textContent = correctCount;
    totalCountDisplay.textContent = totalCount;

    startButton.addEventListener("click", async () => {
        const difficulty = difficultySelect.value;
        await fetchQuestion(difficulty);
    });

    async function fetchQuestion(difficulty) {
        const url = `https://opentdb.com/api.php?amount=1&difficulty=${difficulty}&category=18&type=multiple`; 
       

        try {
            const response = await fetch(url);
            const data = await response.json();
            const question = data.results[0];

            displayQuestion(question);
        } catch (error) {
            console.error("Error fetching question:", error);
        }
    }

    function displayQuestion(question) {
        quizContainer.classList.remove("hidden");
        questionText.innerHTML = question.question;
        questionText.setAttribute("data-correct", question.correct_answer);
        optionsDiv.innerHTML = "";

        let answers = [...question.incorrect_answers, question.correct_answer];
        answers = answers.sort(() => Math.random() - 0.5);

        answers.forEach(answer => {
            const label = document.createElement("label");
            label.innerHTML = `
                <input type="radio" name="answer" value="${answer}"> ${answer}
            `;
            optionsDiv.appendChild(label);
            optionsDiv.appendChild(document.createElement("br"));
        });
    }

    quizForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const selectedAnswer = document.querySelector('input[name="answer"]:checked');

        if (!selectedAnswer) {
            alert("Please select an answer!");
            return;
        }

        const correctAnswer = questionText.getAttribute("data-correct");
        const userAnswer = selectedAnswer.value;

        if (userAnswer === correctAnswer) {
            correctCount++;
            resultMessage.textContent = "Correct!";
        } else {
            resultMessage.textContent = `Incorrect! The correct answer was: ${correctAnswer}`;
        }

        totalCount++;

        localStorage.setItem("correctCount", correctCount);
        localStorage.setItem("totalCount", totalCount);

        correctCountDisplay.textContent = correctCount;
        totalCountDisplay.textContent = totalCount;

        quizContainer.classList.add("hidden");
        resultContainer.classList.remove("hidden");
    });

    playAgainButton.addEventListener("click", () => {
        resultContainer.classList.add("hidden");
        document.getElementById("difficulty-selection").classList.remove("hidden");
    });

    resetScoreButton.addEventListener("click", () => {
        localStorage.setItem("correctCount", 0);
        localStorage.setItem("totalCount", 0);
        correctCountDisplay.textContent = 0;
        totalCountDisplay.textContent = 0;
    });
});
