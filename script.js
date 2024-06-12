const delen = document.getElementById('deal');
const pas = document.getElementById('fold');
const dealer = document.getElementById('dealer');
const player = document.getElementById('player');
const playerScoreField = document.getElementById('playerScoreveld');
const dealerScoreField = document.getElementById('dealerScoreveld');
const dealerCardsElement = document.getElementById('dealerCards');
const playerCardsElement = document.getElementById('playerCards');
const winOrLose = document.getElementById('status');
const newGame = document.getElementById('reload');

delen.addEventListener("click", deal);
pas.addEventListener("click", pass);
newGame.addEventListener("click", () => {
    location.reload();
});

window.onload = function() {
    dealer.style.display = "none";
    player.style.display = "none";
    pas.style.display = "none";
    newGame.style.display = "none";
};

const cards = ["2", "3", "4", "5", "6", "8", "9", "10", "11", "12", "13", "14"];
const suits = ["hearts", "spades", "diamonds", "clubs"];

let dealerCards = [];
let playerCards = [];
let deckOfCards = [];

function createDeck(){
    deckOfCards = [];
    for(i = 0; i < 4; i++){
        for(j = 0; j < 12; j++){
            deckOfCards.push({denominator: cards[j], suit: suits[i]})
        }
    }
}

function deal(){    
    createDeck();  
    for (i = 0; i < 2; i++) {
        dealerCards.push(draw())
        playerCards.push(draw())
    } 
    updateDisplay();
    displayInitialCards();
    checkBlackjack();
}

function draw(){
    const randomCard = Math.floor(Math.random() * deckOfCards.length);
    pickedCard = deckOfCards.splice(randomCard, 1)[0];
    return pickedCard;   
}

function displayInitialCards(){
    const imageNode = document.createElement("img");
    imageNode.src = "./afbeeldingen/back.png";
    dealerCardsElement.appendChild(imageNode);
    updateCards(playerCards, playerCardsElement, false);
    updateCards(dealerCards, dealerCardsElement, true);
    playerScoreField.innerHTML = calcScore(playerCards);
}

function updateDisplay(){
    delen.innerHTML = "Hit"
    delen.removeEventListener("click", deal)
    delen.addEventListener("click", hit)
    dealer.style.display = "block";
    player.style.display = "block";
    pas.style.display = "inline";
}
function checkBlackjack(){
    if (calcScore(playerCards) >= 21){
        calcFinalScore();
        }   
}

function hit(){
    playerCards.push(draw());
    updateCards(playerCards, playerCardsElement, false);
    playerScoreField.innerHTML = calcScore(playerCards);
    checkBlackjack();
}

function updateCards(cards, element, keepFirst) {
    if (keepFirst) {
        while (element.children.length > 1) {
            element.removeChild(element.lastChild);
        }
        cards.forEach((card, index) => {
            if (index === 0) return;
            const cardName = `${card.suit}${card.denominator}`;
            const cardNode = document.createElement("img");
            cardNode.src = `./afbeeldingen/${cardName}.svg`;
            element.appendChild(cardNode);
        });
    } else {
    element.innerHTML = '';
    cards.forEach(card => {
        const cardName = `${card.suit}${card.denominator}`;
        const cardNode = document.createElement("img");
        cardNode.src = `./afbeeldingen/${cardName}.svg`;
        element.appendChild(cardNode);
    });}
}

function pass() {
    calcScore(dealerCards) <= 16 ? dealerHit() : calcFinalScore();
    if (calcScore(dealerCards) === 16 && calcScore(playerCards) === 16) {
        calcFinalScore();
    }
}

function dealerHit(){
    dealerCards.push(draw());
    calcScore(dealerCards);
    pass();
}

function calcScore(cards) {
    let score = 0;
    let aceCount = 0;
    
    cards.forEach(card => {
        if (card.denominator === "11" || card.denominator === "12" || card.denominator === "13") {
            score += 10;
        } else if (card.denominator === "14") {
            aceCount++;
            score += 11;
        } else {
            score += Number(card.denominator);
        }
    });

    while (score > 21 && aceCount > 0) {
        score -= 10;
        aceCount--;
    }

    return score;
}

function calcFinalScore() {
    updateCards(dealerCards, dealerCardsElement, false);
    dealerScoreField.innerHTML = calcScore(dealerCards);

    if (calcScore(playerCards) > 21) {
        loser();
        return;
    }

    if (calcScore(dealerCards) > 21 || calcScore(playerCards) === 21 || calcScore(dealerCards) < calcScore(playerCards)) {
        winner();
        return;
    }

    if (calcScore(dealerCards) > calcScore(playerCards)) {
        loser();
        return;
    }

    drawGame();
}

function updateGameStatus(message, displayDealButton = false, displayPassButton = false, displayNewGameButton = true) {
    winOrLose.innerHTML = message;
    delen.style.display = displayDealButton ? "inline" : "none";
    pas.style.display = displayPassButton ? "inline" : "none";
    newGame.style.display = displayNewGameButton ? "inline" : "none";
}

function winner() {
    updateGameStatus("Congratulations, you win!", false, false);
}

function loser() {
    updateGameStatus("You lost! Try again?", false, false);
}

function drawGame() {
    updateGameStatus("There are no winners!", false, false);
}
