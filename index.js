var easyButton = document.getElementById("easyDiff");
var medButton = document.getElementById("medDiff");
var hardButton = document.getElementById("hardDiff");
let difficulty = 4;
let currentScore = 0;
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
        increaseScore();
        resetBoard();
    } else {
        // No match - flip back
        setTimeout(() => {
            firstCard.toggleClass("flip");
            secondCard.toggleClass("flip");
            resetBoard();
        }, 1000);
    }
}

function resetBoard() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
}

// Fixed async function to ensure DOM updates BEFORE setting up listeners
async function difficultySelection(difficulty) {
    const gameArea = document.getElementById("game_grid");
    gameArea.innerHTML = "";
    score = 0;
    // Set class BEFORE adding cards to ensure CSS applies
    gameArea.className = ""; // clear old
    
    setBanner(difficulty);

    // Generate Cards
    for (let i = 0; i < difficulty; i++) {
        var randID = Math.floor(Math.random() * (1000)) + 1; // 1000 is safer limit
        var cardHTML = `
            <div class="card">
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${randID}.png" class="front_face" alt="pokemon">
                <img src="back.webp" class="back_face" alt="back">
            </div>
        `;
        gameArea.insertAdjacentHTML('beforeend', cardHTML);
        gameArea.insertAdjacentHTML('beforeend', cardHTML);
    }

    if (difficulty == 4) gameArea.className = "easy";
    else if (difficulty == 6) gameArea.className = "med";
    else if (difficulty == 8) gameArea.className = "hard";

    let cards = $(".card");
    cards.each(function() {
        let pos = Math.floor(Math.random() * cards.length);
        $(this).css("order", pos);
    });
    
    setup();
}

function increaseScore(){
  currentScore++;

  var score = document.getElementById("score");
  if(difficulty == 4) score.textContent = `Easy: ${currentScore}/${difficulty}`;
  else if(difficulty == 6) score.textContent = `Medium: ${currentScore}/${difficulty}`;
  else if(difficulty == 8) score.textContent = `Hard: ${currentScore}/${difficulty}`;
}

function setBanner(difficulty){
  currentScore = 0;
   var score = document.getElementById("score");
  if(difficulty == 4) score.textContent = `Easy: ${currentScore}/${difficulty}`;
  else if(difficulty == 6) score.textContent = `Medium: ${currentScore}/${difficulty}`;
  else if(difficulty == 8) score.textContent = `Hard: ${currentScore}/${difficulty}`;
}

// Initial Setup
easyButton.addEventListener("click", () => {difficultySelection(4)
  difficulty = 4;
});
medButton.addEventListener("click", () => {difficultySelection(6)
  difficulty = 6;
});
hardButton.addEventListener("click", () => {difficultySelection(8)
  difficulty = 8;
});

// Start the game
$(document).ready(() => difficultySelection(difficulty));
