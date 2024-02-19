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

function addShipPiece (ship) {
    const allBoardBlocks = document.querySelectorAll('#computer div')
    let randomBoolean = Math.random() < 0.5
    let isHorizontal = true
    let randomStart = Math.floor(Math.random() * width * width)
    console.log(randomStart)

    let shipBlocks = []

    for(let i =0; i < ship.length; i++) {
        if (isHorizontal) {
            console.log(allBoardBlocks[Number(randomStart) + i]) 
        }
    }
}

addShipPiece (destroyer)