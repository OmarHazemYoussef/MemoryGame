const images = [
    '1.png', '2.png', '3.png', '4.png',
    '5.png', '6.png', '7.png', '8.png'
];
const gameBoard = document.getElementById('gameBoard');
const resetButton = document.getElementById('resetButton');
const message = document.getElementById('message');

let cards = [];
let flippedCards = [];
let matchedCards = [];
let timer;
let messageTimer;

function initGame() {
    message.textContent = '';
    gameBoard.innerHTML = '';
    cards = [];
    flippedCards = [];
    matchedCards = [];
    clearTimeout(timer);
    clearTimeout(messageTimer);

    // Create card pairs
    images.forEach(image => {
        cards.push({ image, id: generateId() });
        cards.push({ image, id: generateId() });
    });

    // Shuffle cards
    cards.sort(() => Math.random() - 0.5);

    // Create card elements
    cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.id = card.id;

        const frontFace = document.createElement('img');
        frontFace.src = card.image;
        frontFace.classList.add('front');

        const backFace = document.createElement('img');
        backFace.src = 'back.png'; // Image for the back of the card
        backFace.classList.add('back');

        cardElement.appendChild(frontFace);
        cardElement.appendChild(backFace);
        cardElement.addEventListener('click', () => flipCard(cardElement));

        gameBoard.appendChild(cardElement);
    });
}

function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

function flipCard(cardElement) {
    if (flippedCards.length === 2 || cardElement.classList.contains('flipped')) {
        return;
    }

    cardElement.classList.add('flipped');
    flippedCards.push(cardElement);

    if (flippedCards.length === 1) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            if (flippedCards.length === 1) {
                flipBack(flippedCards[0]);
                flippedCards = [];
                displayMessage('You lost!');
            }
        }, 5000);
    }

    if (flippedCards.length === 2) {
        clearTimeout(timer);
        checkMatch();
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;

    if (card1.dataset.id !== card2.dataset.id && getCardImage(card1) === getCardImage(card2)) {
        matchedCards.push(card1, card2);
        flippedCards = [];

        // Remove matched cards from the board
        setTimeout(() => {
            card1.style.visibility = 'hidden';
            card2.style.visibility = 'hidden';
        }, 500);

        if (matchedCards.length === cards.length) {
            displayMessage('You win!');
        }
    } else {
        setTimeout(() => {
            flipBack(card1);
            flipBack(card2);
            flippedCards = [];
            displayMessage('You lost!');
        }, 1000);
    }
}

function getCardImage(cardElement) {
    return cardElement.querySelector('.front').src;
}

function flipBack(cardElement) {
    cardElement.classList.remove('flipped');
}

function displayMessage(text) {
    message.textContent = text;
    messageTimer = setTimeout(() => {
        message.textContent = '';
    }, 4000);
}

resetButton.addEventListener('click', initGame);

initGame();