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

// display ships
/*function displayShip (ship, user) {
    const optionShip = document.createElement('div')
    optionShip.classList.add('option-ship')
    optionShip.id = ship.name
    optionShip.textContent = ship.name
    optionShip.draggable = true
    optionShip.style.width = ship.length * 30 + 'px'
    optionShip.style.backgroundColor = 'lightgrey'
    optionShip.style.transform = 'rotate(' + ship.direction + 'deg)'
    optionContainer.appendChild(optionShip)
}  */

function addShipPiece (user, ship, startId) {
    const allBoardBlocks = Array.from(document.querySelectorAll(`#${user} div`));
    let isHorizontal = user === 'player' ? angle === 0 : Math.random() < 0.5;
    let randomStart = Math.floor(Math.random() * width * width);

    let startIndex = startId ? startId : randomStart;

    const ValidStart = (start, isHorizontal, length) => {
        let shipBlocks = [];
        for (let i = 0; i < length; i++) {
            let block;
            if (isHorizontal) {
                if (start + i >= width) return false; // Check if ship goes outside the board horizontally
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

ships.forEach(ship => addShipPiece('computer', ship))

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
    e.dataTransfer.setData('text/plain', draggedShip.id); // Set the dataTransfer data to the id of the dragged element
    console.log(e.target);
}

function dragEnter (e) {
    e.preventDefault();
    e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.3)'; // Change the background color of the block when a ship is over it
}

function dragLeave (e) {
    e.target.style.backgroundColor = ''; // Reset the background color of the block when a ship leaves it
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
        addShipPiece('player', ship, startId);
        if (!notDropped) {
            draggedShip.remove();
        }
    }
}