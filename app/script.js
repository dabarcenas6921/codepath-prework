//Constant variables
const nextClueWaitTime = 1000;

//Global variables

var pattern = [];
var progress = 0;
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5;
var guessCounter = 0;
var clueHoldTime = 1000;
var cluePauseTime = 333;


function startGame(){
  //initialize game variables
  progress = 0;
  gamePlaying = true;
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  generateRandomClue()
  showModal();
}

function stopGame(){
  gamePlaying = false;
  document.getElementById("startBtn").classList.remove("hidden");
document.getElementById("stopBtn").classList.add("hidden");
}

// Sound Synthesis Functions
const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2
}
function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  context.resume()
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    context.resume()
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    context.resume()
    tonePlaying = true
  }
}
function stopTone(){
  g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
  tonePlaying = false
}

// Page Initialization
// Init Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext 
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)

function lightButton(btn){
  document.getElementById("button"+btn).classList.add("lit");
}

function clearButton(btn){
  document.getElementById("button"+btn).classList.remove("lit");
}

function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playTone(btn, clueHoldTime);
    setTimeout(clearButton, clueHoldTime, btn);
  }
}

function playClueSequence(){
  guessCounter = 0;
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i = 0; i<= progress; i++){
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue, delay, pattern[i])
    delay += clueHoldTime
    delay += cluePauseTime;
  }
}

function loseGame(){
  stopGame();
  alert("Game over. You lost.");
}

function winGame(){
  stopGame();
  alert("Congratulations! You won!")
}

function guess(btn){
  console.log("user guess: " + btn);
  if(!gamePlaying){
    return;
  }
  if(pattern[guessCounter] == btn){
    //Guess was correct
    if(guessCounter == progress){
      if(progress == pattern.length - 1){
        winGame();
      }else{
        progress++;
        playClueSequence();
      }
    }else{
      guessCounter++;
    }
  } else{
    loseGame();
  }
  
}

function showModal(){
  document.getElementById("modal_container").classList.add("show");
}

function hideModal(){
  document.getElementById("modal_container").classList.remove("show");
}

function difficultySelector(choice, newtime){
  clueHoldTime = 1000- choice;
  cluePauseTime = 333 - newtime;
  hideModal();
  playClueSequence();
}

function generateRandomClue(){
  for(let i = 0; i < 8; i++){
    let randomInt = Math.floor(Math.random() * 4 + 1);;
    pattern[i] = randomInt;
    console.log("added " + pattern[i] + " to array");
  }
}