const gamesBoardContainer = document.querySelector('#gamesboard-container')
const optionContainer = document.querySelector('.option-container')
const flipButton = document.querySelector('#flip-button')

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
}

ships.forEach(ship => addShipPiece('computer', ship, null, true)); // Place the computer's ships randomly

// drag and drop
let draggedShip
const optionShips = Array.from(optionContainer.children)
// Setting up Event Listeners
optionShips.forEach(optionShip => optionShip.addEventListener('dragstart', dragStart));

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

    // Add a highlight to the blocks where the ship will be placed
    for (let i = 0; i < shipLength; i++) {
        const blockId = isHorizontal ? startId + i : startId + i * width;
        if (blockId < playerBlocks.length) {
            playerBlocks[blockId].classList.add('highlight');
        }
    }
}

function dragLeave (e) {
    const data = e.dataTransfer.getData('text/plain');
    if (!data) return; // If the dataTransfer data is empty, return
    const { shipName, shipLength, isHorizontal } = JSON.parse(data); // Get the dataTransfer data
    const startId = parseInt(e.target.id); // Convert the id to a number
    const playerBlocks = Array.from(document.querySelectorAll('#player .block')); // Get all blocks on the player's board

    // Remove the highlight from the blocks where the ship will be placed
    for (let i = 0; i < shipLength; i++) {
        const blockId = isHorizontal ? startId + i : startId + i * width;
        if (blockId < playerBlocks.length) {
            playerBlocks[blockId].classList.remove('highlight');
        }
    }
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
}

function highlightArea( startIndex, ship) {
    const playerBlocks = Array.from(document.querySelectorAll('#player .block'));
    const isHorizontal = angle === 0;
    const { shipBlocks, ValidStart, notTaken } = checkValidStart(startIndex, isHorizontal, ship.length, playerBlocks);
}