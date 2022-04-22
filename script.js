//Constant variables
const nextClueWaitTime = 1000;
let time = 10;
const countdownEl = document.getElementById("countdown");
const triesEl = document.getElementById("tries");

//Global variables

var pattern = [];
var progress = 0;
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5;
var rate = 1.0;
var guessCounter = 0;
var clueHoldTime = 1000;
var cluePauseTime = 333;
var timerFunction;
var numberOfTries = 3;

function startCountdown() {
  time = 10;
  timerFunction = setInterval(countdownTimer, 1000);
}

function countdownTimer() {
  countdownEl.innerHTML = "Time left: " + time;
  time--;
  time = time < 0 ? loseGame() : time;
}

function startGame() {
  //initialize game variables
  numberOfTries = 3;
  triesEl.innerHTML = "Number of tries left: " + numberOfTries;
  progress = 0;
  gamePlaying = true;
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  generateRandomClue();
  showModal();
}

function stopGame() {
  gamePlaying = false;
  time = 10;
  countdownEl.innerHTML = "Time left: " + time;
  clearInterval(timerFunction);
  numberOfTries = 3;
  triesEl.innerHTML = "Number of tries left: " + numberOfTries;
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
}

// Sound Synthesis Functions
const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2,
  5: 523.2,
};
function playTone(btn, len) {
  /*o.frequency.value = freqMap[btn];
  g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
  context.resume();
  tonePlaying = true;
  setTimeout(function () {
    stopTone();
  }, len);
  */
  context.resume();
  var audio = document.getElementById("audio" + btn);
  audio.playbackRate = rate;
  audio.play();
  setTimeout(stopTone, len, btn);
}
function startTone(btn) {
  if (!tonePlaying) {
    context.resume();
    /*o.frequency.value = freqMap[btn];
    g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
    */
    var audio = document.getElementById("audio" + btn);
    audio.playbackRate = rate;
    audio.play();
    tonePlaying = true;
  }
}
function stopTone(btn) {
  //g.gain.setTargetAtTime(0, context.currentTime + 0.05, 0.025);
  var audio = document.getElementById("audio" + btn);
  audio.pause();
  audio.currentTime = 0;
  tonePlaying = false;
}

// Page Initialization
// Init Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();
var o = context.createOscillator();
var g = context.createGain();
g.connect(context.destination);
g.gain.setValueAtTime(0, context.currentTime);
o.connect(g);
o.start(0);

function lightButton(btn) {
  document.getElementById("button" + btn).classList.add("lit");
}

function clearButton(btn) {
  document.getElementById("button" + btn).classList.remove("lit");
}

function playSingleClue(btn) {
  if (gamePlaying) {
    lightButton(btn);
    playTone(btn, clueHoldTime);
    setTimeout(clearButton, clueHoldTime, btn);
  }
}

function playClueSequence() {
  clearInterval(timerFunction);
  guessCounter = 0;
  let delay = nextClueWaitTime; //set delay to initial wait time
  for (let i = 0; i <= progress; i++) {
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms");
    setTimeout(playSingleClue, delay, pattern[i]);
    delay += clueHoldTime;
    delay += cluePauseTime;
  }
  time = 10;
  countdownEl.innerHTML = "Time left: " + time;
  setTimeout(startCountdown, delay - 1200);
}

function loseGame() {
  stopGame();
  alert("Game over. You lost.");
  time = 10;
  countdownEl.innerHTML = "Time left: " + time;
  numberOfTries = 3;
  triesEl.innerHTML = "Number of tries left: " + numberOfTries;
}

function winGame() {
  stopGame();
  time = 10;
  countdownEl.innerHTML = "Time left: " + time;
  numberOfTries = 3;
  triesEl.innerHTML = "Number of tries left: " + numberOfTries;
  alert("Congratulations! You won!");
}

function guess(btn) {
  console.log("user guess: " + btn);
  if (!gamePlaying) {
    return;
  }
  if (pattern[guessCounter] == btn) {
    //Guess was correct
    if (guessCounter == progress) {
      if (progress == pattern.length - 1) {
        var audio = document.getElementById("audio6");
        audio.playbackRate = rate;
        audio.play();
        winGame();
      } else {
        progress++;
        playClueSequence();
      }
    } else {
      guessCounter++;
    }
  } else {
    numberOfTries--;
    triesEl.innerHTML = "Number of tries left: " + numberOfTries;
  }
  if(numberOfTries == 0){
      loseGame();
    }
}

function showModal() {
  document.getElementById("modal_container").classList.add("show");
}

function hideModal() {
  document.getElementById("modal_container").classList.remove("show");
}

function difficultySelector(choice, newtime) {
  clueHoldTime = 1000 - choice;
  cluePauseTime = 333 - newtime;
  hideModal();
  playClueSequence();
}

function generateRandomClue() {
  for (let i = 0; i < 6; i++) {
    let randomInt = Math.floor(Math.random() * 5 + 1);
    pattern[i] = randomInt;
    console.log("added " + pattern[i] + " to array");
  }
}
