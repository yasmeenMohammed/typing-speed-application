// Array of random sentences for the typing test
const sentences = [
    "The quick brown fox jumps over the lazy dog",
    "A journey of a thousand miles begins with a single step",
    "She sells seashells by the seashore",
    "To be or not to be, that is the question",
    "The sun sets slowly behind the mountain",
    "All that glitters is not gold",
    "A fox fled from danger",
    "The rain in Spain stays mainly in the plain"
];

// Elements from the HTML
const sampleTextElement = document.getElementById('sample-text');
const typingArea = document.getElementById('typing-area');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const resultDiv = document.getElementById('result');
const timerElement = document.getElementById('timer');
const historyList = document.getElementById('history-list');

let startTime, endTime;
let currentSentence;
let lastSentenceIndex = -1;
let timerInterval;
let testHistory = [];

// Function to pick a random sentence, avoiding the last one
function setRandomSentence() {
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * sentences.length);
    } while (randomIndex === lastSentenceIndex && sentences.length > 1);
    lastSentenceIndex = randomIndex;
    currentSentence = sentences[randomIndex];
    sampleTextElement.innerHTML = currentSentence;
}

// Function to update character highlighting
function updateHighlighting(typedText) {
    let highlighted = '';
    for (let i = 0; i < currentSentence.length; i++) {
        if (i < typedText.length) {
            if (typedText[i] === currentSentence[i]) {
                highlighted += `<span class="correct">${currentSentence[i]}</span>`;
            } else {
                highlighted += `<span class="incorrect">${currentSentence[i]}</span>`;
            }
        } else {
            highlighted += currentSentence[i];
        }
    }
    sampleTextElement.innerHTML = highlighted;
}

// Function to start the live timer
function startTimer() {
    startTime = new Date();
    timerInterval = setInterval(() => {
        const currentTime = new Date();
        const timeElapsed = (currentTime - startTime) / 1000;
        timerElement.textContent = `${timeElapsed.toFixed(2)}s`;
    }, 100);
}

// Function to stop the timer
function stopTimer() {
    clearInterval(timerInterval);
}

// Function to save test result to history (max 3)
function saveTestResult(wpm, accuracy, timeTaken) {
    testHistory.unshift(`Speed: ${wpm} WPM | Accuracy: ${accuracy}% | Time: ${timeTaken.toFixed(2)}s`);
    if (testHistory.length > 3) testHistory.pop();
    historyList.innerHTML = '';
    testHistory.forEach(result => {
        const li = document.createElement('li');
        li.textContent = result;
        historyList.appendChild(li);
    });
}

// Set initial sentence when page loads
setRandomSentence();

// Handle Enter key for Start and Reset
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent Enter key from adding a newline

        if (startBtn.style.display !== 'none') {
            startBtn.click(); // Simulate start
        } else if (resetBtn.style.display !== 'none' && typingArea.disabled) {
            resetBtn.click(); // Simulate reset
        }
    }
});

// Start button click handler
startBtn.addEventListener('click', () => {
    typingArea.disabled = false;
    typingArea.focus();
    startBtn.style.display = 'none';
    resetBtn.style.display = 'inline-block';
    typingArea.value = '';
    resultDiv.textContent = '';
    timerElement.textContent = '0.00s';
    setRandomSentence();
    startTimer();
});

// Typing area input handler
typingArea.addEventListener('input', () => {
    let typedText = typingArea.value.replace(/\n/g, ''); // Remove Enter key if typed
    typingArea.value = typedText;
    updateHighlighting(typedText);

    if (typedText === currentSentence) {
        endTime = new Date();
        const timeTaken = (endTime - startTime) / 1000;
        const wordCount = currentSentence.split(' ').length;
        const wpm = Math.round((wordCount / timeTaken) * 60);
        
        let errors = 0;
        for (let i = 0; i < currentSentence.length; i++) {
            if (typedText[i] !== currentSentence[i]) errors++;
        }
        const accuracy = Math.round(((currentSentence.length - errors) / currentSentence.length) * 100);
        
        resultDiv.textContent = `Speed: ${wpm} WPM | Accuracy: ${accuracy}% | Time: ${timeTaken.toFixed(2)}s`;
        saveTestResult(wpm, accuracy, timeTaken);
        typingArea.disabled = true;
        stopTimer();
    }
});

// Reset button click handler
resetBtn.addEventListener('click', () => {
    typingArea.disabled = true;
    typingArea.value = '';
    startBtn.style.display = 'inline-block';
    resetBtn.style.display = 'none';
    resultDiv.textContent = '';
    timerElement.textContent = '0.00s';
    setRandomSentence();
    stopTimer();
});
