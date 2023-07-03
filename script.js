// Variable declaration
var cells;
var randomNum;
var selectionStartTime;
var totalResponseTime = 0;
var selectedCount = 0;
var correctCount = 0; // Track the number of correct selections
var timerInterval;
var gameStarted = false; // Track the game state
var speechInProgress = false; // Track the speech synthesis state
var speechSpoken = false; // Track whether the speech has been spoken

// Function to update the content of random table cells
function updateCellContent() {
  var randomCellIndex = Math.floor(Math.random() * cells.length);
  var randomContent = Math.floor(Math.random() * 10);
  var randomColor = getRandomColor();

  // Increase the probability of the required number appearing
  var requiredNumberProbability = Math.random();
  if (requiredNumberProbability < 0.4) {
    randomContent = randomNum;
  }

  cells[randomCellIndex].textContent = randomContent;
  cells[randomCellIndex].style.backgroundColor = randomColor;
}

// Function to generate a random interval
function randomInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to calculate the average response time and accuracy
function calculateAverageResponseTime() {
  var averageResponseTime = totalResponseTime / selectedCount;
  var accuracyPercentage = (correctCount / selectedCount) * 100 || 0;

  var averageResponseTimeSeconds = Math.floor(averageResponseTime / 1000);
  var averageResponseTimeMilliseconds = averageResponseTime % 1000;
  if (
    isNaN(averageResponseTimeSeconds) &&
    isNaN(averageResponseTimeMilliseconds)
  ) {
    averageResponseTimeSeconds = 0;
    averageResponseTimeMilliseconds = 0;
  }
  var formattedAverageResponseTime =
    averageResponseTimeSeconds +
    " seconds " +
    averageResponseTimeMilliseconds.toFixed(1);

  var p = document.getElementById("averageResponseTime");
  p.textContent =
    "Average Response Time: " + formattedAverageResponseTime + " milliseconds";

  var accuracyP = document.getElementById("accuracy");
  accuracyP.textContent = "Accuracy: " + accuracyPercentage.toFixed(2) + "%";
}

// Function to remove click event listeners from table cells
function removeCellClickListeners() {
  for (var i = 0; i < cells.length; i++) {
    cells[i].removeEventListener("click", handleCellClick);
  }
}

// Function to handle a click on a table cell
function handleCellClick(event) {
  var selectedNum = parseInt(event.target.textContent);
  if (isNaN(selectedNum) || selectedNum < 0 || selectedNum > 9) {
    alert("Invalid number! Please try again.");
    return;
  }
  var p = document.getElementById("responseTime");
  if (selectedNum === randomNum) {
    var responseTime = Date.now() - selectionStartTime;
    totalResponseTime += responseTime;
    selectedCount++;
    correctCount++;

    var responseTimeSeconds = Math.floor(responseTime / 1000);
    var responseTimeMilliseconds = responseTime % 1000;
    p.textContent =
      "Response Time: " +
      responseTimeSeconds +
      " seconds " +
      responseTimeMilliseconds +
      " milliseconds";

    // Change the value in the selected cell
    event.target.textContent = Math.floor(Math.random() * 10);

    // Update the selection start time for the next correct number
    selectionStartTime = Date.now();
  } else {
    p.textContent = "Wrong number! Try again.";
    selectedCount++;
  }
}

// Function to speak the desired number
function speakNumber(number) {
  var speech = new SpeechSynthesisUtterance(number);
  speech.volume = 1; // Set the volume (0 to 1)
  speech.rate = 1; // Set the speaking rate (0.1 to 10)
  speech.pitch = 0; // Set the pitch (0 to 2)
  speech.lang = "en-US"; // Set the language

  speechInProgress = true; // Set the speech synthesis state

  speech.onend = function () {
    speechInProgress = false; // Reset the speech synthesis state
  };

  speechSynthesis.speak(speech);
}

// Function to start the game
function startGame() {
  var startButton = document.getElementById("start");
  var timerDisplay = document.getElementById("timer");

  if (gameStarted) {
    // Stop the game
    startButton.textContent = "Start"; // Change the button text to "Start"
    clearInterval(timerInterval);
    calculateAverageResponseTime();
    removeCellClickListeners();
    gameStarted = false; // Reset the game state
    return;
  }
  gameStarted = true;
  startButton.textContent = "Stop"; // Change the button text to "Stop"

  // Generate a random number between 0 and 9
  randomNum = Math.floor(Math.random() * 10);
  var p = document.getElementById("number");
  p.textContent = "Click on the number " + randomNum;
  speakNumber("Select the number " + randomNum);
  timerDisplay.textContent = "Ready...";
  speechSpoken = true; // Set the speech as spoken
  startRandomCellUpdates();

  var readyTime = 5; // Ready time in seconds
  timerDisplay.textContent = "Ready: " + readyTime;
  var readyInterval = setInterval(function () {
    readyTime--;
    timerDisplay.textContent = "Ready: " + readyTime;
    if (readyTime <= 0) {
      clearInterval(readyInterval);
      timerDisplay.textContent = "Time left: 5 seconds";

      for (var i = 0; i < cells.length; i++) {
        cells[i].addEventListener("click", handleCellClick);
      }

      selectionStartTime = Date.now();
      var timerDuration = 5; // 5 seconds

      timerInterval = setInterval(function () {
        timerDuration--;
        timerDisplay.textContent = "Time left: " + timerDuration + " seconds";
        if (timerDuration <= 0) {
          clearInterval(timerInterval);
          calculateAverageResponseTime();
          removeCellClickListeners();
          startButton.textContent = "Start"; // Change the button text to "Start"
          gameStarted = false; // Reset the game state
        }
      }, 1000);

      gameStarted = true; // Set the game state to started
      speechSpoken = false; // Reset the speech spoken flag
    }
  }, 1000); // Countdown interval of 1 second
}

// Function to start updating random cell content
function startRandomCellUpdates() {
  updateCellContent(); // Update immediately

  setInterval(function () {
    updateCellContent();
  }, randomInterval(200, 600)); // Random interval between 200ms and 600ms
}

// Function to generate a random color
function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Event listener for the start button click
window.addEventListener("DOMContentLoaded", function () {
  cells = document.getElementsByTagName("td");
  var startButton = document.getElementById("start");

  startButton.addEventListener("click", startGame);
});
