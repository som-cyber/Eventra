const EVENTRA_QUIZ_QUESTIONS = [
    {
        prompt: 'How do you like spending a free weekend?',
        answers: [
            { text: 'Taking a road less travelled', type: 'Explorer', crowd: 'large' },
            { text: 'Making something with my hands', type: 'Creative Soul', crowd: 'small' },
            { text: 'Meeting people and trading ideas', type: 'Networker', crowd: 'large' },
            { text: 'Finding a great live set after dark', type: 'Night Owl', crowd: 'large' },
            { text: 'Following a fascinating new subject', type: 'Knowledge Seeker', crowd: 'small' }
        ]
    },
    {
        prompt: 'Which experience would you choose first?',
        answers: [
            { text: 'An outdoor challenge in a new place', type: 'Explorer' },
            { text: 'An exhibition full of unexpected details', type: 'Creative Soul' },
            { text: 'A room buzzing with ambitious people', type: 'Networker' },
            { text: 'Music, candlelight, and a late finish', type: 'Night Owl' },
            { text: 'A hands-on session led by an expert', type: 'Knowledge Seeker' }
        ]
    },
    {
        prompt: 'What kind of gathering feels right?',
        answers: [
            { text: 'A lively crowd with room to wander', type: 'Explorer', crowd: 'large' },
            { text: 'A close-knit group that sparks ideas', type: 'Creative Soul', crowd: 'small' },
            { text: 'A big room full of new connections', type: 'Networker', crowd: 'large' },
            { text: 'A packed venue with electric energy', type: 'Night Owl', crowd: 'large' },
            { text: 'A smaller group where everyone can ask', type: 'Knowledge Seeker', crowd: 'small' }
        ]
    },
    {
        prompt: 'What feels comfortable for a memorable outing?',
        answers: [
            { text: 'Up to ₹1,000', type: 'Explorer', budgetMax: 1000 },
            { text: 'Up to ₹1,200', type: 'Creative Soul', budgetMax: 1200 },
            { text: 'Up to ₹1,500', type: 'Networker', budgetMax: 1500 },
            { text: 'Up to ₹1,500 for the right night', type: 'Night Owl', budgetMax: 1500 },
            { text: 'Up to ₹1,500 for something I’ll learn from', type: 'Knowledge Seeker', budgetMax: 1500 }
        ]
    },
    {
        prompt: 'What do you hope to take home?',
        answers: [
            { text: 'A story I didn’t expect to tell', type: 'Explorer' },
            { text: 'A spark of inspiration', type: 'Creative Soul' },
            { text: 'A connection worth keeping', type: 'Networker' },
            { text: 'A feeling that stays with me', type: 'Night Owl' },
            { text: 'An idea I can put to work', type: 'Knowledge Seeker' }
        ]
    }
];

document.addEventListener('DOMContentLoaded', () => {
    const quiz = document.getElementById('personalityQuiz');
    const content = document.getElementById('quizContent');
    const nextButton = document.getElementById('quizNext');
    const backButton = document.getElementById('quizBack');
    const progressBar = document.getElementById('quizProgressBar');
    const progressLabel = document.getElementById('quizProgressLabel');
    const progress = document.getElementById('quizProgress');
    const result = document.getElementById('quizResult');
    const actions = document.getElementById('quizActions');
    if (!quiz || !content || !nextButton || !backButton || !result) return;

    let answers = [];
    let questionIndex = 0;
    const savedResult = getEventraQuizResult();

    function showQuestion() {
        const question = EVENTRA_QUIZ_QUESTIONS[questionIndex];
        content.classList.remove('quiz-enter');
        content.innerHTML = `
            <span class="quiz-kicker">A moment to imagine</span>
            <h3 class="quiz-question">${question.prompt}</h3>
            <div class="quiz-answer-list">
                ${question.answers.map((answer, index) => `
                    <label class="quiz-answer${answers[questionIndex] === index ? ' is-selected' : ''}">
                        <input type="radio" name="quizAnswer" value="${index}" ${answers[questionIndex] === index ? 'checked' : ''}>
                        <span class="quiz-answer-mark" aria-hidden="true"></span>
                        <span>${answer.text}</span>
                    </label>
                `).join('')}
            </div>
        `;
        content.querySelectorAll('input[name="quizAnswer"]').forEach(input => {
            input.addEventListener('change', () => {
                answers[questionIndex] = Number(input.value);
                content.querySelectorAll('.quiz-answer').forEach(answer => answer.classList.remove('is-selected'));
                input.closest('.quiz-answer').classList.add('is-selected');
                nextButton.disabled = false;
            });
        });
        nextButton.disabled = !Number.isInteger(answers[questionIndex]);
        nextButton.textContent = questionIndex === EVENTRA_QUIZ_QUESTIONS.length - 1 ? 'Reveal My Result' : 'Continue';
        backButton.hidden = questionIndex === 0;
        progress.hidden = false;
        actions.hidden = false;
        result.hidden = true;
        progressLabel.textContent = `Question ${questionIndex + 1} of ${EVENTRA_QUIZ_QUESTIONS.length}`;
        progressBar.style.width = `${(questionIndex + 1) / EVENTRA_QUIZ_QUESTIONS.length * 100}%`;
        requestAnimationFrame(() => content.classList.add('quiz-enter'));
    }

    function finishQuiz() {
        const tally = Object.fromEntries(Object.keys(EVENTRA_PERSONALITIES).map(type => [type, 0]));
        let budgetMax = null;
        let crowdPreference = null;

        answers.forEach((answerIndex, index) => {
            const answer = EVENTRA_QUIZ_QUESTIONS[index].answers[answerIndex];
            tally[answer.type] += 1;
            if (Number.isFinite(answer.budgetMax)) budgetMax = answer.budgetMax;
            if (answer.crowd) crowdPreference = answer.crowd;
        });

        const type = Object.keys(tally).reduce((winner, candidate) =>
            tally[candidate] > tally[winner] ? candidate : winner
        );
        const quizResult = { type, answers: [...answers], completedAt: new Date().toISOString() };
        const preferences = { budgetMax, crowdPreference };
        if (!writeEventraStorage(EVENTRA_STORAGE_KEYS.quiz, quizResult) ||
            !writeEventraStorage(EVENTRA_STORAGE_KEYS.preferences, preferences)) {
            nextButton.disabled = false;
            return;
        }

        progress.hidden = true;
        actions.hidden = true;
        content.innerHTML = '';
        result.hidden = false;
        const matches = getEventRecommendations({ personality: type, limit: 3 });
        result.innerHTML = `
            <span class="quiz-result-mark" aria-hidden="true">✦</span>
            <span class="eyebrow">Your experience personality</span>
            <h3>${type}</h3>
            <p>${EVENTRA_PERSONALITIES[type].description}</p>
            <div class="events-grid recommendation-grid quiz-recommendations"></div>
            <button class="btn btn-secondary quiz-retake" type="button">Retake the quiz</button>
        `;
        renderEventRecommendations(result.querySelector('.quiz-recommendations'), matches);
        result.querySelector('.quiz-retake').addEventListener('click', () => {
            answers = [];
            questionIndex = 0;
            localStorage.removeItem(EVENTRA_STORAGE_KEYS.quiz);
            localStorage.removeItem(EVENTRA_STORAGE_KEYS.preferences);
            progress.hidden = false;
            actions.hidden = false;
            refreshCompatibilityScores();
            showQuestion();
        });
        refreshCompatibilityScores();
    }

    nextButton.addEventListener('click', () => {
        if (!Number.isInteger(answers[questionIndex])) return;
        if (questionIndex === EVENTRA_QUIZ_QUESTIONS.length - 1) finishQuiz();
        else {
            questionIndex += 1;
            showQuestion();
        }
    });
    backButton.addEventListener('click', () => {
        if (questionIndex === 0) return;
        questionIndex -= 1;
        showQuestion();
    });

    if (savedResult) {
        answers = savedResult.answers || [];
        questionIndex = 0;
        finishQuiz();
    } else {
        showQuestion();
    }
});
