
const canvas = document.getElementById("canvas");
const canvasContext = canvas.getContext("2d");
const pacmanFrames = document.getElementById("animation")
const ghostFrames = document.getElementById("ghost");
const eatSound = new Audio('assets/pacman_chomp.wav');
const deathSound = new Audio('assets/pacman_death.wav');
const startSound = new Audio('assets/pacman_beginning.wav');
const victorySound = new Audio('assets/victory.mp3');


let createRect = (x, y, width, height, color) => {
    canvasContext.fillStyle = color;
    canvasContext.fillRect(x, y, width, height);
};
let fps = 30;
let oneBlockSize = 30;
let wallColor = "#342DCA";
let wallSpaceWidth = oneBlockSize / 1.5;
let WallOffset = (oneBlockSize - wallSpaceWidth) / 2;
let wallInnerColor = "black"
let ghosts = [];
let ghostCount = 4;
let score = 0;

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

let map1 = [
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
    [1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1],
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

let currentMap = 'map1';  // This variable will keep track of which map is currently active
let map = map1;

let map_miage = [
    [1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1],
    [1, 2, 2, 1, 1, 1, 1, 1, 2, 2, 1, 2, 2, 1, 1, 1, 1, 1, 2, 2, 1],
    [1, 2, 2, 1, 2, 1, 2, 1, 2, 2, 1, 2, 2, 1, 0, 0, 0, 1, 2, 2, 1],
    [1, 3, 2, 1, 2, 1, 2, 1, 2, 2, 1, 2, 2, 1, 1, 1, 1, 1, 2, 3, 1],
    [1, 2, 2, 1, 2, 1, 2, 1, 2, 2, 1, 2, 2, 1, 2, 2, 2, 1, 2, 2, 1],
    [1, 2, 2, 1, 2, 1, 2, 1, 2, 2, 1, 2, 2, 1, 2, 2, 2, 1, 2, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 2, 1, 2, 1, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 3, 1],
    [1, 3, 2, 2, 1, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 1, 2, 2, 2, 1],
    [1, 1, 2, 2, 1, 2, 1, 2, 1, 2, 2, 2, 2, 2, 1, 2, 1, 2, 2, 1, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

// Store the initial state of the maps
let initialMap1 = JSON.parse(JSON.stringify(map1));
let initialMap_miage = JSON.parse(JSON.stringify(map_miage));

function cloneMap(originalMap) {
    let newMap = [];
    for(let i = 0; i < originalMap.length; i++) {
        newMap[i] = [...originalMap[i]];
    }
    return newMap;
}

document.getElementById("switchMapButton").addEventListener("click", () => {
    console.log("Switch Map button clicked");
    console.log("Current map: " + currentMap);

    // Switch the map
    if(currentMap === 'map1') {
        map = cloneMap(map_miage);
        currentMap = 'map_miage';
    } else {
        map = cloneMap(map1);
        currentMap = 'map1';
    }

    // Reset the game state
    restartGame();

    // Reset the score
    score = 0;

    console.log("New map: " + currentMap);

    // Draw the new map
    draw();
});

let randomTargetsForGhosts = [
    { x: 1 * oneBlockSize, y: 1 * oneBlockSize },
    { x: 1 * oneBlockSize, y: (map.length -2) * oneBlockSize },
    { x: (map[0].length - 2) * oneBlockSize, y: oneBlockSize },
    { x: (map[0].length - 2) * oneBlockSize, y: (map.length -2) * oneBlockSize },
];



let gameLoop = () => {
    update()
    // Clear the screen
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    draw()
};

let update = () => {
    pacman.moveProcess();
    for(let i = 0 ; i < ghosts.length ; i++) {
        ghosts[i].moveProcess();
        ghosts[i].eat(pacman);
    }

    // Check for victory condition
    let hasPallets = false;
    for(let i = 0 ; i < map.length ; i++) {
        for(let j = 0 ; j < map[0].length ; j++) {
            if(map[i][j] == 2 || map[i][j] == 3) {
                hasPallets = true;
                break;
            }
        }
        if(hasPallets) break;
    }

    if(!hasPallets) {
        // Victory condition met
        console.log('Victory! All pallets have been eaten.');
        clearInterval(gameInterval); // Stop the game loop
        victorySound.play(); // Play victory sound
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
                            score += 5; // Increase score by 5 for power pellet
                        } else {
                            score += 1; // Increase score by 1 for regular food
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
    canvasContext.fillStyle = "red";
    canvasContext.font = "30px verdana";
    canvasContext.fillText("Score: " + score, 0, oneBlockSize * map.length + 20);
};

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

    // Check for victory condition
    let hasPallets = false;
    for(let i = 0 ; i < map.length ; i++) {
        for(let j = 0 ; j < map[0].length ; j++) {
            if(map[i][j] == 2 || map[i][j] == 3) {
                hasPallets = true;
                break;
            }
        }
        if(hasPallets) break;
    }

    if(!hasPallets) {
        // Victory condition met
        canvasContext.fillStyle = "green";
        canvasContext.font = "50px verdana";
        canvasContext.textAlign = "center";
        canvasContext.fillText("You won!", canvas.width / 2, canvas.height / 2);
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
    // Reset the score
    score = 0;
    createNewpacman(); // Reset pacman
    createGhosts(); // Reset ghosts
    respawnPallets(); // Respawn pellets
    map1 = JSON.parse(JSON.stringify(initialMap1));
    map_miage = JSON.parse(JSON.stringify(initialMap_miage));
    gameInterval = setInterval(gameLoop, 1000 / fps); // Start the game loop again
};

let respawnPallets = () => {
    let initialMap;
    if (currentMap === 'map1') {
        initialMap = cloneMap(initialMap1);
    } else {
        initialMap = cloneMap(initialMap_miage);
    }

    for(let i = 0 ; i < map.length ; i++) {
        for(let j = 0 ; j < map[0].length ; j++) {
            if(initialMap[i][j] == 2 || initialMap[i][j] == 3) {
                map[i][j] = initialMap[i][j];  // Use the initial state to respawn the pallets
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