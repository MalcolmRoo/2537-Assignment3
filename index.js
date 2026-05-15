var easyButton = document.getElementById("easyDiff");
var medButton = document.getElementById("medDiff");
var hardButton = document.getElementById("hardDiff");

var startButton = document.getElementById("startButton");
var resetButton = document.getElementById("resetButton");
var powerUpButton = document.getElementById("powerUpButton");
var themeToggle = document.getElementById("themeToggleButton");

const easy = 4;
const medium = 6;
const hard = 8;

let moves = 0;
let difficulty = easy;
let currentScore = 0;
let count;
let timer;
let powerUpUsed = false;

let firstCard = null;
let secondCard = null;
let lockBoard = false;

function setup() {
    $(".card").off("click");
    $(".card").on("click", function () {
        if (lockBoard || $(this).hasClass("flip")) return;
        $(this).toggleClass("flip");
        if (!firstCard) {
            firstCard = $(this);
            return;
        }
        secondCard = $(this);
        lockBoard = true;
        checkForMatch();
    });
}

function checkForMatch() {
    let img1 = firstCard.find(".front_face").attr("src");
    let img2 = secondCard.find(".front_face").attr("src");

    if (img1 === img2) {
        // Match found
        firstCard.off("click");
        secondCard.off("click");
        moves++;
        currentScore++;
        updateUI();
        resetBoard();
    } else {
        // No match
        setTimeout(() => {
            firstCard.toggleClass("flip");
            secondCard.toggleClass("flip");
            moves++
            updateUI();
            resetBoard();  
        }, 1000);
    }
}

function resetBoard() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
}

async function difficultySelection(difficulty) {
    const gameArea = document.getElementById("game_grid");
    gameArea.innerHTML = ""; 
    gameArea.className = ""; 
    score = 0;
    setBanner(difficulty);

    for (let i = 0; i < difficulty; i++) {
        var randID = Math.floor(Math.random() * (1000)) + 1;
        var cardHTML = `
            <div class="card">
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${randID}.png" class="front_face" alt="pokemon">
                <img src="back.webp" class="back_face" alt="back">
            </div>
        `;
        gameArea.insertAdjacentHTML('beforeend', cardHTML);
        gameArea.insertAdjacentHTML('beforeend', cardHTML);
    }

    if (difficulty == easy) gameArea.className = "easy";
    else if (difficulty == medium) gameArea.className = "med";
    else if (difficulty == hard) gameArea.className = "hard";

    let cards = $(".card");
    cards.each(function() {
        let pos = Math.floor(Math.random() * cards.length);
        $(this).css("order", pos);
    });
}

function updateUI(){
  var score = document.getElementById("score");
  if(difficulty == easy) score.textContent = `Easy: ${currentScore}/${difficulty} \t Moves: ${moves} \t Timer: ${count}`;
  else if(difficulty == medium) score.textContent = `Medium: ${currentScore}/${difficulty} \t Moves: ${moves} \t Timer: ${count}`;
  else if(difficulty == hard) score.textContent = `Hard: ${currentScore}/${difficulty} \t Moves: ${moves} \t Timer: ${count}`;
}

function setBanner(difficulty){
  currentScore = 0;
  moves = 0;
  count = 30;
  powerUpUsed = false;

   powerUpButton.disabled = false;
  $(powerUpButton).removeClass("btn-secondary").addClass("btn-warning");

   var score = document.getElementById("score");
  if(difficulty == easy) score.textContent = `Easy: ${currentScore}/${difficulty} | Moves: ${moves} | Timer: ${count}`;
  else if(difficulty == medium) score.textContent = `Medium: ${currentScore}/${difficulty} | Moves: ${moves} | Timer: ${count}`;
  else if(difficulty == hard) score.textContent = `Hard: ${currentScore}/${difficulty} | Moves: ${moves} | Timer: ${count}`;
}

startButton.addEventListener("click", () => {
    setup();
    if(!timer){
        timer = setInterval(function() {
        if(currentScore == difficulty){
            clearInterval(timer);
            document.getElementById("messageText").textContent = "🎉 YOU WIN! 🎉";
            document.getElementById("messageText").className = "fw-bold mb-4 text-success";
            document.getElementById("gameAlert").style.display = "block";
        }
        count--;
        updateUI();
        if (count <= 0) {
            clearInterval(timer);
            lockBoard = true;
            document.getElementById("messageText").textContent = "💥 YOU LOSE... 💥";
            document.getElementById("messageText").className = "fw-bold mb-4 text-danger";
            document.getElementById("gameAlert").style.display = "block";
        }
        }, 1000);
    }
});

resetButton.addEventListener("click", () => {
   clearInterval(timer);
   timer = null;
   count = 30;
   updateUI();
   resetBoard();
   difficultySelection(difficulty);
});

powerUpButton.addEventListener("click", () => {
    if(timer && !powerUpUsed){
        powerUpUsed = true;
        lockBoard = true;

        powerUpButton.disabled = true;
        $(powerUpButton).removeClass("btn-warning").addClass("btn-secondary");

        const cardList = document.querySelectorAll('.card');
        const cardArray = [...cardList];

        for(let i = 0; i < cardArray.length; i++){ 
            if(!$(cardArray[i]).hasClass("flip")){
                $(cardArray[i]).addClass("flip");
                
                setTimeout(() => {
                    $(cardArray[i]).removeClass("flip"); 
                    if (i === cardArray.length - 1) {
                        lockBoard = false; 
                    }
                }, 1000);
            }
        }
    }
});

themeToggle.addEventListener("click", () => {
    const htmlElement = document.documentElement;
    const currentTheme = htmlElement.getAttribute("data-bs-theme");
    
    if (currentTheme === "dark") {
        htmlElement.setAttribute("data-bs-theme", "light");
        themeToggle.textContent = "🌙 Dark Mode";
        themeToggle.className = "btn btn-outline-secondary mx-2";
    } else {
        htmlElement.setAttribute("data-bs-theme", "dark");
        themeToggle.textContent = "☀️ Light Mode";
        themeToggle.className = "btn btn-outline-light mx-2";
    }
});

easyButton.addEventListener("click", () => {
  difficultySelection(easy);
  difficulty = easy;
});
medButton.addEventListener("click", () => {
  difficultySelection(medium);
  difficulty = medium;
});
hardButton.addEventListener("click", () => {
  difficultySelection(hard);
  difficulty = hard;
});


$(document).ready(() => difficultySelection(difficulty));
