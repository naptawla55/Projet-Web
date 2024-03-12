const gamesBoardContainer = document.querySelector('#gamesboard-container')
const optionContainer = document.querySelector('.option-container')
const flipButton = document.querySelector('#flip-button')
const startButton = document.querySelector('#start-button')
const resetButton = document.querySelector('#reset-button')
const hitSound = new Audio('sounds/hit.mp3');
const missSound = new Audio('sounds/miss.mp3');
const hitPlayerSound = new Audio('sounds/hit_player.mp3');
const looseSound = new Audio('sounds/lose.mp3');
const winSound = new Audio('sounds/win.mp3');

let angle = 0
function flip () {
    const optionShips = Array.from(optionContainer.children)
    if (angle === 0) {
        angle = 90
    } else {
        angle = 0
    }
    optionShips.forEach(optionShip => optionShip.style.transform = 'rotate(' + angle + 'deg)')
}

flipButton.addEventListener('click', flip)

// crearing boards
const width = 10

function createBoard (color, user) {
    const gameBoardContainer = document.createElement('div')
    gameBoardContainer.classList.add('game-board')
    gameBoardContainer.style.backgroundColor = color
    gameBoardContainer.id = user

    for (let i = 0; i < width * width; i++) {
        const block = document.createElement('div')
        block.classList.add('block')
        block.id = i
        gameBoardContainer.appendChild(block)
    }
   
    gamesBoardContainer.appendChild(gameBoardContainer)
}

createBoard('lightblue', 'player')
createBoard('pink', 'computer')

// ships
class Ship {
    constructor (name, length) {
        this.name = name
        this.length = length
        this.direction = 0
        this.position = []
    }
}

const destroyer = new Ship('destroyer', 2)
const submarine = new Ship('submarine', 3)
const cruiser = new Ship('cruiser', 3)
const battleship = new Ship('battleship', 4)
const carrier = new Ship('carrier', 5)

const ships = [destroyer, submarine, cruiser, battleship, carrier]
let notDropped

let computerPlacedShips = [];

function addShipPiece (user, ship, startId, randomPlacement = false) {
    const allBoardBlocks = Array.from(document.querySelectorAll(`#${user} div`));
    let isHorizontal = user === 'player' ? angle === 0 : Math.random() < 0.5;
    let randomStart = Math.floor(Math.random() * width * width);

    let startIndex = randomPlacement ? randomStart : startId;

    const ValidStart = (start, isHorizontal, length) => {
        let shipBlocks = [];
        for (let i = 0; i < length; i++) {
            let block;
            if (isHorizontal) {
                if (start % width + i >= width) return false; // Check if ship goes outside the board horizontally
                block = allBoardBlocks[start + i];
            } else {
                if (start + i * width >= width * width) return false; // Check if ship goes outside the board vertically
                block = allBoardBlocks[start + i * width];
            }
            shipBlocks.push(block);
        }
        // Check if any of the blocks are already taken
        return shipBlocks.every(block => !block.classList.contains('taken'));
    };

    while (!ValidStart(startIndex, isHorizontal, ship.length)) {
        startIndex = Math.floor(Math.random() * width * width);
        isHorizontal = Math.random() < 0.5;
    }

    let shipBlocks = [];

    for(let i = 0; i < ship.length; i++) {
        if (isHorizontal) {
            shipBlocks.push(allBoardBlocks[startIndex + i]);
        } else {
            shipBlocks.push(allBoardBlocks[startIndex + i * width]);
        }
    }

    shipBlocks.forEach(shipBlock => {
        shipBlock.classList.add(ship.name, 'taken');
    });

    if (user === 'computer') {
        computerPlacedShips.push(ship);
    }
}


// drag and drop
let draggedShip
const optionShips = Array.from(optionContainer.children)
// Setting up Event Listeners
optionShips.forEach(optionShip => optionShip.addEventListener('dragstart', dragStart));
// current player turn
let currentPlayer = 'player'

function switchTurn() {
    currentPlayer = currentPlayer === 'player' ? 'computer' : 'player'; // Switch the turn to the other player
    document.getElementById('turn-display').textContent = currentPlayer; // Display whose turn it is

    if (currentPlayer === 'computer') {
        // If it's the computer's turn, place a ship for the computer
        const ship = ships.find(ship => !computerPlacedShips.includes(ship)); // Find a ship that hasn't been placed yet
       
    }
}

// Correct target for dragover and drop event listeners
const playerBlocks = Array.from(document.querySelectorAll('#player .block'));
playerBlocks.forEach(block => {
    block.addEventListener('dragover', dragOver);
    block.addEventListener('dragenter', dragEnter);
    block.addEventListener('dragleave', dragLeave);
    block.addEventListener('drop', dropShip);
});


// Correct dragStart function
function dragStart (e) {
    notDropped = false;
    draggedShip = e.target; // Set draggedShip to the ship element that is being dragged
    const shipName = draggedShip.className.split(' ')[1]; // Get the ship's name from the class name
    e.dataTransfer.setData('text/plain', shipName); // Set the dataTransfer data to the ship's name
    console.log(e.target);
}

function dragEnter (e) {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');
    if (!data) return; // If the dataTransfer data is empty, return
    const { shipName, shipLength, isHorizontal } = JSON.parse(data); // Get the dataTransfer data
    const startId = parseInt(e.target.id); // Convert the id to a number
    const playerBlocks = Array.from(document.querySelectorAll('#player .block')); // Get all blocks on the player's board
}

function dragLeave (e) {
    const data = e.dataTransfer.getData('text/plain');
    if (!data) return; // If the dataTransfer data is empty, return
    const { shipName, shipLength, isHorizontal } = JSON.parse(data); // Get the dataTransfer data
    const startId = parseInt(e.target.id); // Convert the id to a number
    const playerBlocks = Array.from(document.querySelectorAll('#player .block')); // Get all blocks on the player's board
}

function dragOver (e) {
    e.preventDefault()
}

function dropShip (e) {
    e.preventDefault();
    const startId = parseInt(e.target.id); // Convert the id to a number
    const shipName = e.dataTransfer.getData('text/plain'); // Get the dataTransfer data
    const ship = ships.find(ship => ship.name === shipName); // Find the ship based on the dataTransfer data
    if (ship) {
        addShipPiece('player', ship, startId); // Place the player's ship where it is dropped
        if (!notDropped) {
            draggedShip.remove();
        }
    }

    // Place a ship for the computer
    const computerShip = ships.find(ship => !computerPlacedShips.includes(ship)); // Find a ship that hasn't been placed yet
    if (computerShip) {
        addShipPiece('computer', computerShip, null, true); // Place the ship randomly on the computer's board
    }

    switchTurn(); // Switch the turn to the other player
}

let isGameOver = false;

//start game
function startGame() {
    if (computerPlacedShips.length === 5) {
        isGameOver = false;
        startButton.style.display = 'none';
        optionContainer.style.display = 'none';
        gamesBoardContainer.style.display = 'grid';
        document.getElementById('turn-display').textContent = currentPlayer;

        // Add event listeners to the blocks on the computer's board
        const computerBlocks = Array.from(document.querySelectorAll('#computer .block'));
        computerBlocks.forEach(block => {
            block.addEventListener('click', playerAttack);
        });

        // If it's the computer's turn, make the computer attack
        if (currentPlayer === 'computer') {
            computerAttack();
        }
    } else {
        alert('Please place all the ships')
    }
}

//reset game
function resetGame() {
    location.reload();
}

startButton.addEventListener('click', startGame)
resetButton.addEventListener('click', resetGame)


function playerAttack(e) {
    const messageDivPlayer = document.getElementById('message-player');

    // If the game is over, return immediately
    if (isGameOver) {
        return;
    }
    const block = e.target;

    // If the block has already been hit or missed, return immediately
    if (block.classList.contains('hit') || block.classList.contains('miss')) {
        return;
    }

    const shipName = block.className.split(' ')[1]; // Get the ship's name from the class name

    if (shipName) {
        // If the block is part of a ship, mark it as hit
        block.classList.add('hit');
        hitSound.play();
        messageDivPlayer.textContent = 'Player Hit!';
        console.log('Player Hit!');

        // Check if all blocks of the ship have been hit
        const shipBlocks = Array.from(document.querySelectorAll(`#computer .${shipName}`));
        if (shipBlocks.every(block => block.classList.contains('hit'))) {
            // If all blocks of the ship have been hit, mark the ship as sunk
            const ship = ships.find(ship => ship.name === shipName);
            ship.isSunk = true;
            messageDivPlayer.textContent = 'player sunk ' + shipName + '!';
            console.log('player sunk ' + shipName + '!');

            // Check if all ships have been sunk
            if (ships.every(ship => ship.isSunk)) {
                // If all ships have been sunk, the player wins
                messageDivPlayer.textContent = 'You win!';
                winSound.play();
                console.log('You win!');
                isGameOver = true;
            }
        }
    } else {
        // If the block is not part of a ship, mark it as miss
        block.classList.add('miss');
        missSound.play();
        messageDivPlayer.textContent = 'Player miss!';
        console.log('Miss!');
    }

    // Switch the turn to the computer
    switchTurn();

    // If it's the computer's turn, make the computer attack
    if (currentPlayer === 'computer') {
        // Disable the click event listener on the computer's blocks
        const computerBlocks = Array.from(document.querySelectorAll('#computer .block'));
        computerBlocks.forEach(block => {
            block.removeEventListener('click', playerAttack);
        });

        setTimeout(() => {
            computerAttack();

            // Re-enable the click event listener on the computer's blocks
            computerBlocks.forEach(block => {
                block.addEventListener('click', playerAttack);
            });
        }, 1000); // Add a delay before the computer takes its turn
    }
}

function computerAttack() {
    const messageDivComputer = document.getElementById('message-computer');

    // If the game is over, return immediately
    if (isGameOver) {
        return;
    }
    const playerBlocks = Array.from(document.querySelectorAll('#player .block'));
    let block;
    do {
        block = playerBlocks[Math.floor(Math.random() * playerBlocks.length)];
    } while (block.classList.contains('hit') || block.classList.contains('miss')); // Keep choosing a block until we find one that hasn't been hit or missed

    const shipName = block.className.split(' ')[1]; // Get the ship's name from the class name

    if (shipName) {
        // If the block is part of a ship, mark it as hit
        block.classList.add('hit');
        hitPlayerSound.play();
        messageDivComputer.textContent = 'Computer Hit!';
        console.log('Computer hit!');

        // Check if all blocks of the ship have been hit
        const shipBlocks = Array.from(document.querySelectorAll(`#player .${shipName}`));
        if (shipBlocks.every(block => block.classList.contains('hit'))) {
            // If all blocks of the ship have been hit, mark the ship as sunk
            const ship = ships.find(ship => ship.name === shipName);
            ship.isSunk = true;
            messageDivComputer.textContent = 'Computer sunk ' + shipName + '!';
            console.log('Computer sunk ' + shipName + '!');

            // Check if all ships have been sunk
            if (ships.every(ship => ship.isSunk)) {
                // If all ships have been sunk, the computer wins
                messageDivComputer.textContent = 'Computer Wins!';
                looseSound.play();
                console.log('Computer wins!');
                isGameOver = true;
            }
        }
    } else {
        // If the block is not part of a ship, mark it as miss
        block.classList.add('miss');
        messageDivComputer.textContent = 'Computer miss!';
        console.log('Computer miss!');
    }

    // Switch the turn to the player
    switchTurn();
    // If it's the player's turn, re-enable the click event listener on the computer's blocks
    if (currentPlayer === 'player') {
        const computerBlocks = Array.from(document.querySelectorAll('#computer .block'));
        computerBlocks.forEach(block => {
            block.addEventListener('click', playerAttack);
        });
    }
}