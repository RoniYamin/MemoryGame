const startBtn = document.getElementById('startBtn');
const nameField = document.getElementById('nameField');
const pairsAmountField = document.getElementById('pairsAmountField');
const title = document.getElementById('title');

let cardsAmount = 0;
let startTime = null;
let timerId = null;
let flag = 1;
let movesCount = 0;

const colors = ["Pink", "LightCoral", "LightSalmon", "LightPink", "PaleVioletRed", "HotPink", "LightSalmon", "LightCoral", "Plum", "LavenderBlush", "MistyRose", "PeachPuff", "Bisque", "LemonChiffon", "CornSilk", "LightGoldenrodYellow", "Honeydew", "MintCream", "Azure", "AliceBlue", "Lavender", "WhiteSmoke", "OldLace", "Ivory", "GhostWhite", "Beige", "FloralWhite", "AntiqueWhite", "Linen", "BlanchedAlmond", "PaleGoldenrod"];
let currentlyRevealed = 0; // the amount of the current revealed cards
let activeCard = null;
let RevealedCardsAmount = 0;

function ImpossiblecardsAmount() 
{
        if (pairsAmountField.value > 30)
        {
            alert("the maximum cards amount is 30!");
            pairsAmountField.value = '';
            return 1;
        }
        if (pairsAmountField.value < 1)
        {
            alert("the minimum cards amount is 1!");
            pairsAmountField.value = '';
            return 1;
        }
        return 0;
}

function removeStartElements() 
{
    title.remove();
    nameField.remove();
    pairsAmountField.remove();
    startBtn.remove();

    const timer = document.querySelector('.timer');
    if (timer) {
        timer.remove();
    }
}

function setTimer() {
    const timer = document.createElement('h1');
    timer.className = 'timer';
  
    timer.innerHTML = "00 : 00";
    timer.setAttribute('class', 'timer')
    document.getElementById("containerLogIn").appendChild(timer);
    startTime = performance.now();
    timerId = requestAnimationFrame(function updateTimer() {
        if (RevealedCardsAmount != cardsAmount) {
          displayTimer(timer);
          timerId = requestAnimationFrame(updateTimer);
        } else {
          saveElapsedTime(); // Save the elapsed time when the game is completed
          resetElapsedTime(); // Reset the elapsed time
        }
      });
  }
  
  function displayTimer(timer) {
    const currentTime = performance.now();
    elapsedTime = currentTime - startTime;
  
    let minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);
  
    let m = minutes < 10 ? "0" + minutes : minutes;
    let s = seconds < 10 ? "0" + seconds : seconds;
  
    timer.innerHTML = `${m} : ${s}`;
  }

  function displayMovesCount(count) {
    const movesCounter = document.querySelector('.moves-counter');
    if (movesCounter) {
      movesCounter.textContent = `Moves: ${count}`;
      movesCounter.setAttribute('class', `moves-counter moves-${count}`);
    } else {
      const counter = document.createElement('h1');
      counter.className = `moves-counter moves-${count}`;
      counter.textContent = `Moves: ${count}`;
      document.getElementById("containerLogIn").appendChild(counter);
    }
  }  
  

function compareCards(color1, color2)
{
    movesCount++;
    displayMovesCount(movesCount);

    if(color1 === color2)
        return 1;

    else
        return 0;
}

function startOver()
{  
    const cardContainers = document.querySelectorAll('.mainContainer');
    const restart = document.createElement('button');
    const playAgainPairs = document.createElement('input');
    playAgainPairs.setAttribute("class", "pickPairs");
    document.getElementsByClassName("player-name")[0].hidden = true;
    document.getElementsByClassName("timer")[0].hidden = true;
    document.getElementsByClassName("moves-counter")[0].hidden = true;
    restart.innerHTML = "Play Again";
    document.getElementById("victory").appendChild(restart);
    restart.classList.add("restartBtn");

    playAgainPairs.type="number";
    playAgainPairs.id= "pairsNum";
    playAgainPairs.placeholder="Type amount of pairs... (30 max)";
    playAgainPairs.min='1';
    playAgainPairs.max='30';
    playAgainPairs.style.display = "initial";
    
    document.getElementById("victory").appendChild(playAgainPairs);
    document.getElementById("victory").appendChild(restart);

        playAgainPairs.value = "";



    restart.addEventListener("click", () => {

        const selectedPairs = parseInt(playAgainPairs.value);
        if (selectedPairs < 1 || selectedPairs > 30 || isNaN(selectedPairs))  {
            alert("Please enter a valid number of pairs.");
            return;
        }
        // deletes the cards
        cardContainers.forEach((container) => {
            container.remove();
            });
        
          // start a games
        startNewGame(selectedPairs);

          // Reset game variables
        activeCard = null;
        RevealedCardsAmount = 0;

          // delete play again button
          restart.remove();

          playAgainPairs.style.display = "none";
          restart.style.display = "none";
    });

}

function createEachCard(color, totalCards)
{
    const mainContainer = document.createElement('div');
    mainContainer.setAttribute('class', 'mainContainer');
  
    const theCard = document.createElement('div');
    theCard.setAttribute('class', 'theCard');
  
    const theFront = document.createElement('div');
    theFront.setAttribute('class', 'theFront');
  
    const theBack = document.createElement('div');
    theBack.setAttribute('class', 'theBack');
    theCard.setAttribute('data-color', color);

    theCard.setAttribute('data-value', 0); // Set the hidden value as a data attribute

  
    theCard.appendChild(theFront);
    theCard.appendChild(theBack);
  
    mainContainer.appendChild(theCard);
    document.body.appendChild(mainContainer);
    document.getElementById('card-container').appendChild(mainContainer);
  
    theCard.addEventListener('click', function () {
      if (!activeCard && theCard.getAttribute('data-value') == 0)
        {
        currentlyRevealed++;
        theCard.style.backgroundColor = color;
        theCard.classList.toggle('flipped');
        activeCard = theCard;
        return;
      }
  
      if (currentlyRevealed == 1 && activeCard != theCard && theCard.getAttribute('data-value') == 0) {
        theCard.style.backgroundColor = color;
        theCard.classList.toggle('flipped');
        currentlyRevealed++;
      }
  
      if (currentlyRevealed == 2) 
      {
        currentlyRevealed = 0;
        const result = compareCards(theCard.style.backgroundColor, activeCard.style.backgroundColor);
        if (result) 
        {
            theCard.setAttribute('data-value', 1);
            activeCard.setAttribute('data-value', 1);
            activeCard = null;
            RevealedCardsAmount+=2;

            if(RevealedCardsAmount === cardsAmount)
            {
                Victory();
                startOver();
            }
        } 
        
        else {
          setTimeout(() => {
            theCard.classList.toggle('flipped');
            activeCard.classList.toggle('flipped');
            activeCard = null; 
          }, 1000);
        }
      }
    });
  }
  

function createCards(totalCards, amount)
{
    const arrayOfRandomColors=[];
    for(let i = 0 ; i < amount; i++)
    {
        const randomIndex = Math.floor(Math.random() * colors.length);
        const color = colors[randomIndex];

        arrayOfRandomColors.push(color);
        arrayOfRandomColors.push(color);
        colors.splice(randomIndex, 1);
    }
    for(let i = 0 ; i < totalCards; i++)
    {
        const randomIndex = Math.floor(Math.random() * (arrayOfRandomColors.length));
        const color = arrayOfRandomColors[randomIndex];

        arrayOfRandomColors.splice(randomIndex, 1)
        createEachCard(color, totalCards);
    }
}
function startFreshGame() 
{ 
    if(ImpossiblecardsAmount())
    return;            
    if((nameField.value).length === 0){
        alert("You must write a username to play the game!");
        return;
    }

    let pairsAmount = pairsAmountField.value;
    const player = document.createElement('h1');
    player.className = 'players-name';

    player.textContent = "name: " + nameField.value;
    player.setAttribute('class', 'player-name');
    document.getElementById("containerLogIn").appendChild(player);

    removeStartElements();
    setTimer();
    movesCount = 0;
    displayMovesCount(movesCount);

    const amount = parseInt(pairsAmountField.value);
    const totalCards = amount * 2;
    cardsAmount= totalCards;
    createCards(totalCards, amount);
}

function startNewGame(amount) 
{
    const totalCards = amount * 2;
    cardsAmount = totalCards;
    createCards(totalCards, amount);
    removeStartElements();
    setTimer();
    movesCount=0;
    displayMovesCount(movesCount);
    document.getElementsByClassName("player-name")[0].hidden = false;
    document.getElementsByClassName("timer")[0].hidden = false;
    document.getElementsByClassName("moves-counter")[0].hidden = false;
    const victoryMessage = document.querySelector('.VmessageContainer');
  if (victoryMessage) {
    victoryMessage.remove();
  }
}

startBtn.addEventListener('click', startFreshGame);

function getElapsedTime() 
{
    const minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);
  
    let m = minutes < 10 ? "0" + minutes : minutes;
    let s = seconds < 10 ? "0" + seconds : seconds;

    if(m ==0 && s == 0)
        return `${m} : ${s} seconds`;

    if(m >= s)
        return `${m} : ${s} minutes`;

        return `${m} : ${s} seconds`;
}
  
  function resetElapsedTime() {
    elapsedTime = 0;
}

function Victory()
{
    const VmessageContainer = document.createElement('div');
    VmessageContainer.textContent = "Victory"
    VmessageContainer.setAttribute('class', 'VmessageContainer');
    const message = document.createElement('div');
    message.textContent = "Congratulaitions, You won! It took you: " + getElapsedTime() + ", and your score is: " + movesCount+ " moves";
    message.setAttribute('class', 'victoryMessage');

    VmessageContainer.appendChild(message);
    document.getElementById("victory").appendChild(VmessageContainer);
}