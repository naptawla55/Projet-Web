
const canvas = document.getElementById("canvas");
const canvasContext = canvas.getContext("2d");
const pacmanFrames = document.getElementById("animation")
const ghostFrames = document.getElementById("ghost");

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
 
// direction constants for pacman
const DIRECTION_RIGHT = 4;
const DIRECTION_UP = 3;
const DIRECTION_LEFT = 2;
const DIRECTION_BOTTOM = 1;


let map = [
    [1, 1, 1, 1,  1, 1, 1, 1, 1 , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2,  2, 2, 2, 2, 2 , 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1,  1, 2, 1, 1, 1 , 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 1, 1,  1, 2, 1, 1, 1 , 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2,  2, 2, 2, 2, 2 , 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1,  1, 2, 1, 2, 1 , 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2,  2, 2, 1, 2, 2 , 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1,  1, 2, 1, 1, 1 , 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0,  1, 2, 1, 2, 2 , 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1,  1, 2, 1, 2, 1 , 1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [2, 2, 2, 2,  2, 2, 2, 2, 1 , 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2],
    [1, 1, 1, 1,  1, 2, 1, 2, 1 , 2, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0,  1, 2, 1, 2, 1 , 1, 1, 1, 1, 2, 1, 2, 1, 0, 0, 0, 0],
    [0, 0, 0, 0,  1, 2, 1, 2, 2 , 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1,  1, 2, 2, 2, 1 , 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1],
    [1, 2, 2, 2,  2, 2, 2, 2, 2 , 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1,  1, 2, 1, 1, 1 , 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2,  1, 2, 2, 2, 2 , 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1],
    [1, 1, 2, 2,  1, 2, 1, 2, 1 , 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 1, 1],
    [1, 2, 2, 2,  2, 2, 1, 2, 2 , 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1,  1, 1, 1, 1, 1 , 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
    [1, 2, 2, 2,  2, 2, 2, 2, 2 , 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1,  1, 1, 1, 1, 1 , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

let gameLoop = () => {
    update()
    draw()
};

let update = () => {
    pacman.moveProcess();
};

let drawFood = () => {
    for( let i = 0 ; i < map.length ; i++) {
        for( let j = 0 ; j < map[0].length; j++) {
            if(map[i][j] == 2) {
                //then it's a food
                createRect(j * oneBlockSize + oneBlockSize / 2,
                           i * oneBlockSize + oneBlockSize / 2,
                           oneBlockSize / 5,
                           oneBlockSize / 5,
                           "white" );
            }
        }
    }

}
  

let eatfood = () => {
    for( let i = 0 ; i < map.length ; i++) {
        for( let j = 0 ; j < map[0].length; j++) {
            if(map[i][j] == 2) {
                //then it's a food
                if(pacman.x + pacman.width / 2 > j * oneBlockSize &&
                    pacman.x + pacman.width / 2 < j * oneBlockSize + oneBlockSize &&
                    pacman.y + pacman.height / 2 > i * oneBlockSize &&
                    pacman.y + pacman.height / 2 < i * oneBlockSize + oneBlockSize) {
                        map[i][j] = 0;
                    }
            }
        }
    }
}

let createScore = () => {
    let score = 0;
    for( let i = 0 ; i < map.length ; i++) {
        for( let j = 0 ; j < map[0].length; j++) {
            if(map[i][j] == 0) {
                score++;
            }
        }
    }
    canvasContext.fillStyle = "white";
    canvasContext.font = "30px Arial";
    canvasContext.fillText("Score: " + score, 10, 30);
}

let draw = () => {
    createRect(0,0, canvas.width, canvas.height, "black");
    //todo
    drawWalls();
    drawFood();
    eatfood();
    createScore();
    pacman.draw();
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
                    createRect(
                        j * oneBlockSize,
                        i * oneBlockSize + WallOffset,
                        wallSpaceWidth + WallOffset,
                        wallSpaceWidth,
                        wallInnerColor
                    );
                }
                if( j < map[0].length - 1 && map[i][j + 1] == 1) {
                    createRect(
                        j * oneBlockSize + WallOffset,
                        i * oneBlockSize + WallOffset,
                        wallSpaceWidth + WallOffset,
                        wallSpaceWidth,
                        wallInnerColor
                    );   
                }
                if( i > 0 && map[i - 1][j] == 1) {
                    createRect(
                        j * oneBlockSize + WallOffset,
                        i * oneBlockSize,
                        wallSpaceWidth,
                        wallSpaceWidth + WallOffset,
                        wallInnerColor
                    );
                }
                if( i < map[0].length - 1 && map[i + 1][j] == 1) {
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
    pacman = new Pacman(oneBlockSize, oneBlockSize, oneBlockSize, oneBlockSize, oneBlockSize / 5);
    // this sunction will be called when the game starts and when pacman dies
}

createNewpacman();
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