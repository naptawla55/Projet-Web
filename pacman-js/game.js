
const canvas = document.getElementById("canvas");
const canvasContext = canvas.getContext("2d");
const pacmanFrames = document.getElementById("animation")
const ghostFrames = document.getElementById("ghost");
const eatSound = new Audio('assets/pacman_chomp.wav');
const deathSound = new Audio('assets/pacman_death.wav');
const startSound = new Audio('assets/pacman_beginning.wav');


let createRect = (x, y, width, height, color) => {
    canvasContext.fillStyle = color;
    canvasContext.fillRect(x, y, width, height);
};
let fps = 30;
let oneBlockSize = 20;
let wallColor = "#342DCA";
let wallSpaceWidth = oneBlockSize / 1.5;
let WallOffset = (oneBlockSize - wallSpaceWidth) / 2;
let wallInnerColor = "black"
let ghosts = [];
let ghostCount = 4;
 
// direction constants for pacman
const DIRECTION_RIGHT = 4;
const DIRECTION_UP = 3;
const DIRECTION_LEFT = 2;
const DIRECTION_BOTTOM = 1;




let ghostLocations = [
    { x: 0, y: 0 },
    { x: 176, y: 0 },
    { x: 0, y: 121 },
    { x: 176, y: 121 },
];

let map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 3, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 3, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 3, 1],
    [1, 3, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1],
    [1, 1, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 1, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];
let initialMap = JSON.parse(JSON.stringify(map));

let randomTargetsForGhosts = [
    { x: 1 * oneBlockSize, y: 1 * oneBlockSize },
    { x: 1 * oneBlockSize, y: (map.length -2) * oneBlockSize },
    { x: (map[0].length - 2) * oneBlockSize, y: oneBlockSize },
    { x: (map[0].length - 2) * oneBlockSize, y: (map.length -2) * oneBlockSize },
];

let gameLoop = () => {
    update()
    draw()
};

let update = () => {
    pacman.moveProcess();
    for(let i = 0 ; i < ghosts.length ; i++) {
        ghosts[i].moveProcess();
        ghosts[i].eat(pacman);
    }
};



let drawFood = () => {
    for( let i = 0 ; i < map.length ; i++) {
        for( let j = 0 ; j < map[0].length; j++) {
            if(map[i][j] == 2) {
                //then it's a food
                createRect(j * oneBlockSize + oneBlockSize / 2.5,
                           i * oneBlockSize + oneBlockSize / 2.5,
                           oneBlockSize / 4,
                           oneBlockSize / 4,
                           "white" );
            }
        }
    }
}



let drawBiggestFood = () => {
    for( let i = 0 ; i < map.length ; i++) {
        for( let j = 0 ; j < map[0].length; j++) {
            if(map[i][j] == 3) {
                //then it's biggest food
                createRect(j * oneBlockSize + oneBlockSize / 5,
                           i * oneBlockSize + oneBlockSize / 5,
                           oneBlockSize / 1.75,
                           oneBlockSize / 1.75,
                           "orange" );
            }
        }
    }
}
  

let powerMode = false;
let powerModeTimer = null;

let eatfood = () => {
    for( let i = 0 ; i < map.length ; i++) {
        for( let j = 0 ; j < map[0].length; j++) {
            if(map[i][j] == 2 || map[i][j] == 3) {
                //then it's a food
                if(pacman.x + pacman.width / 2 > j * oneBlockSize &&
                    pacman.x + pacman.width / 2 < j * oneBlockSize + oneBlockSize &&
                    pacman.y + pacman.height / 2 > i * oneBlockSize &&
                    pacman.y + pacman.height / 2 < i * oneBlockSize + oneBlockSize) {
                        if(map[i][j] == 3) { // If it's a power pellet
                            powerMode = true; // Set powerMode to true
                            console.log('Pacman ate a power pellet. powerMode is now ' + powerMode);
                            // Set powerMode back to false after 10 seconds
                            clearTimeout(powerModeTimer);
                            powerModeTimer = setTimeout(() => {
                                powerMode = false;
                                console.log('Power mode ended.');
                            }, 10000);
                        }
                        map[i][j] = 0;
                        eatSound.play(); // Play the sound
                }
            }
        }
    }
}

let createScore = () => {
    canvasContext.textAlign = "start";
    canvasContext.textBaseline = "alphabetic";
    let score = 238;  // to improve
    for( let i = 0 ; i < map.length ; i++) {
        for( let j = 0 ; j < map[0].length; j++) {
            // reguler food is worth 1 point and biggest food is worth 5 points
            if(map[i][j] == 2) {
                score -= 1;
            } else if(map[i][j] == 3) {
                score -= 5;
            }
        }
    }
    canvasContext.fillStyle = "red";
    canvasContext.font = "30px verdana";
    canvasContext.fillText("Score: " + score, 0, oneBlockSize * map.length + 20);
}

let drawGhosts = () => {
    for(let i = 0 ; i < ghosts.length ; i++) {
        ghosts[i].draw();
    }
}

let startgame = () => {
    // i can only start the game is i click on a "start" button
}

let draw = () => {
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    startgame();
    createRect(0,0, canvas.width, canvas.height, "black");
    //todo
    drawWalls();
    drawFood();
    drawBiggestFood();
    eatfood();
    createScore();
    pacman.draw();
    drawGhosts();
    canvasContext.fillText("Lives: " + pacman.lives, 0, oneBlockSize * map.length + 40);
    if (pacman.lives === 0) {
        canvasContext.fillStyle = "red";
        canvasContext.font = "50px verdana";
        canvasContext.textAlign = "center";
        canvasContext.fillText("Game Over", canvas.width / 2, canvas.height / 2);
        deathSound.play();
    }
};

let gameInterval = setInterval(gameLoop, 1000 / fps);

let drawWalls = () => {
    for( let i = 0 ; i < map.length ; i++) {
        for( let j = 0 ; j < map[0].length; j++) {
            if(map[i][j] == 1) {
                //then it's a wall
                createRect(j * oneBlockSize,
                           i * oneBlockSize,
                           oneBlockSize,
                           oneBlockSize,
                           wallColor );
                if( j > 0 && map[i][j - 1] == 1) {
                    //then there is a wall on the left
                    createRect(
                        j * oneBlockSize,
                        i * oneBlockSize + WallOffset,
                        wallSpaceWidth + WallOffset,
                        wallSpaceWidth,
                        wallInnerColor
                    );
                }
                if( j < map[0].length - 1 && map[i][j + 1] == 1) {
                    //then there is a wall on the right
                    createRect(
                        j * oneBlockSize + WallOffset,
                        i * oneBlockSize + WallOffset,
                        wallSpaceWidth + WallOffset,
                        wallSpaceWidth,
                        wallInnerColor
                    );   
                }
                if( i > 0 && map[i - 1][j] == 1) {
                    //then there is a wall on the top
                    createRect(
                        j * oneBlockSize + WallOffset,
                        i * oneBlockSize,
                        wallSpaceWidth,
                        wallSpaceWidth + WallOffset,
                        wallInnerColor
                    );
                }
                if( i < map[0].length - 1 && map[i + 1][j] == 1) {
                    // Then there is a wall on the bottom
                    createRect(
                        j * oneBlockSize + WallOffset,
                        i * oneBlockSize + WallOffset,
                        wallSpaceWidth,
                        wallSpaceWidth + WallOffset,
                        wallInnerColor
                    );   
                }
            }
        }
    }
};

let createNewpacman = () => {
    pacman = new Pacman(oneBlockSize, oneBlockSize, oneBlockSize, oneBlockSize, oneBlockSize / 5, 3);
    // this sunction will be called when the game starts and when pacman dies
};

// Function to restart the game
let restartGame = () => {
    clearInterval(gameInterval); // Stop the game loop
    createNewpacman(); // Reset pacman
    createGhosts(); // Reset ghosts
    respawnPallets(); // Respawn pellets
    map = JSON.parse(JSON.stringify(initialMap)); // Reset map to initial state
    gameInterval = setInterval(gameLoop, 1000 / fps); // Start the game loop again
};

let respawnPallets = () => {
    for(let i = 0 ; i < map.length ; i++) {
        for(let j = 0 ; j < map[0].length ; j++) {
            if(map[i][j] == 2 || map[i][j] == 3) {
                map[i][j] = 2;
            }
        }
    }
};

let teleportPacman = () => {
    // this function will teleport batman to the beginning of the map
    pacman.x = oneBlockSize;
    pacman.y = oneBlockSize;
};


document.getElementById("restartButton").addEventListener("click", () => {
    restartGame(); // Call restartGame function when the button is clicked
});


let createGhosts = () => {
    ghosts = [];
    for(let i = 0 ; i < 5 ; i++) {
        let newghost = new Ghost(
            9 * oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize, 
            10 * oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize, 
            oneBlockSize, 
            oneBlockSize, 
            pacman.speed/2, 
            ghostLocations[ i % 4 ].x, 
            ghostLocations[ i % 4 ].y, 
            124, 
            116, 
            6 + i
        );
        ghosts.push(newghost);
    }
};

createNewpacman();
createGhosts();
gameLoop();


window.addEventListener("keydown", (event) => {
    switch(event.keyCode) {
        case 37:
            pacman.nextDirection = DIRECTION_LEFT;
            break;
        case 38:
            pacman.nextDirection = DIRECTION_UP;
            break;
        case 39:
            pacman.nextDirection = DIRECTION_RIGHT;
            break;
        case 40:
            pacman.nextDirection = DIRECTION_BOTTOM;
            break;
    }
});