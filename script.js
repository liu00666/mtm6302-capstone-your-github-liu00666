document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.getElementById("start-quiz");
    const difficultySelect = document.getElementById("difficulty");
    const quizContainer = document.getElementById("quiz-container");
    const questionText = document.getElementById("question-text");
    const optionsDiv = document.getElementById("options");

    startButton.addEventListener("click", async () => {
        const difficulty = difficultySelect.value;
        await fetchQuestion(difficulty);
    });

    async function fetchQuestion(difficulty) {
        const url = `https://opentdb.com/api.php?amount=1&difficulty=${difficulty}&category=18&type=multiple`; 
        // Category 18 = "Science: Computers" (includes JavaScript questions)

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
});