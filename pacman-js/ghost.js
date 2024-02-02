
class Ghost {
    constructor(x ,y ,width ,height, speed, imageX, imageY, imageWidth, imageHeight, range) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.imageX = imageX;  
        this.imageY = imageY;   
        this.imageWidth = imageWidth;   
        this.imageHeight = imageHeight;
        this.range = range;
        this.direction = DIRECTION_RIGHT;
        this.nextDirection = this.direction;
        this.currentFrame = 1;
        this.frameCount = 7;
        this.randomTragetIndex = parseInt(Math.random() * randomTargetsForGhosts.length);
        setInterval(() => {
            this.changeRandomDirection()
        }, 10000);
        
    }

    changeRandomDirection() {
        this.randomTragetIndex += 1;
        this.randomTragetIndex = this.randomTragetIndex % 4;
    }

    moveProcess() {
        if(this.isInRangeOfPacman()) {
            this.target = pacman;
        } else {
            this.target = randomTargetsForGhosts[this.randomTragetIndex]
        }
        this.changeDirectionIfPossible();
        this.moveForwards()
        if(this.checkCollision()) {
            this.moveBackwards();
        }
    }

    eat() {

    }

    moveForwards() {
        switch(this.direction) {
            case DIRECTION_RIGHT:
                this.x += this.speed
                break;
            case DIRECTION_UP:
                this.y -= this.speed
                break;
            case DIRECTION_LEFT:
                this.x -= this.speed
                break;
            case DIRECTION_BOTTOM:
                this.y += this.speed
                break;
        }
    }

    moveBackwards() {
        switch(this.direction) {
            case DIRECTION_RIGHT:
                this.x -= this.speed
                break; 
            case DIRECTION_UP:
                this.y += this.speed
                break;
            case DIRECTION_LEFT:
                this.x += this.speed
                break;
            case DIRECTION_BOTTOM:
                this.y -= this.speed
                break;
        }
    }


    checkCollision () {
        if(
            map[this.getMapY()][this.getMapX()] == 1 ||
            map[this.getMapYRightSide()][this.getMapX()] == 1 ||
            map[this.getMapY()][this.getMapXRightSide()] == 1 || 
            map[this.getMapYRightSide()][this.getMapXRightSide()] == 1
        ) {
           return true; 
        }
        return false;
    }

    checkGhostCollision () {

    }

    isInRangeOfPacman() {
        let xDistance = Math.abs(pacman.getMapX() - this.getMapX());
        let yDistance = Math.abs(pacman.getMapY() - this.getMapY());
        if (
            Math.sqrt(xDistance * xDistance + yDistance * yDistance) <= this.range) {
            return true;
        }
        return false;
    }

    changeDirectionIfPossible() {
        // fontion qui change la direction si il n'y a pas de collision
        
        let tempDirection = this.direction;
        this.direction = this.calculateDirection(
            map,
            parseInt(this.target.x / oneBlockSize),
            parseInt(this.target.y / oneBlockSize),
        );

        if (typeof this.direction == 'undefined') {
            this.direction = tempDirection;
            return;
        }
        
        this.moveForwards();
        if(this.checkCollision()) {
            this.moveBackwards();
            this.direction = tempDirection;
        } else {
            this.moveBackwards();
        }
    }

    calculateDirection (map, targetX, targetY) {
        // fonction qui calcule la direction à prendre pour aller vers la cible
        let mp = [];
        for(let i = 0; i < map.length; i++) {
            mp[i] = [i].slice();
        }
        // on met les murs dans la matrice mp pour ne pas les prendre en compte
        let queue = [
            {
                x: this.getMapX(),
                y: this.getMapY(),
                rightX: this.getMapXRightSide(),
                rightY: this.getMapYRightSide(),
                moves: []
            },
        ];
        // on parcourt la queue tant qu'elle n'est pas vide et on ajoute les voisins dans la queue 
        while(queue.length > 0) {
            let current = queue.shift();
            // si on est arrivé à la cible on retourne la première direction
            if(current.x == targetX && current.y == targetY) {
                return current.moves[0];
            } else {
                // sinon on marque la case comme visitée et on ajoute les voisins dans la queue
                mp[current.y][current.x] = 1;
                let neighbours = this.addNeighbors(current, mp);
                for (let i = 0; i < neighbours.length; i++) {
                    queue.push(neighbours[i]);
                }
            }
        }
        return this.direction;
    }

    addNeighbors(poped, mp) {
        // fonction qui ajoute les voisins dans la queue
        let queue = [];
        let numOfRows = mp.length;
        let numOfColumns = mp[0].length;
        // si on peut aller à gauche et que la case à gauche n'est pas un mur
        if (
            poped.x - 1 >= 0 &&
            poped.x - 1 < numOfRows &&
            mp[poped.y][poped.x - 1] != 1
        ) {
            let tempMoves = poped.moves.slice();
            tempMoves.push(DIRECTION_LEFT);
            queue.push({ x: poped.x - 1, y: poped.y, moves: tempMoves });
        }
        // si on peut aller à droite et que la case à droite n'est pas un mur
        if (
            poped.x + 1 >= 0 &&
            poped.x + 1 < numOfRows &&
            mp[poped.y][poped.x + 1] != 1
        ) {
            let tempMoves = poped.moves.slice();
            tempMoves.push(DIRECTION_RIGHT);
            queue.push({ x: poped.x + 1, y: poped.y, moves: tempMoves });
        }
        // si on peut aller en haut et que la case en haut n'est pas un mur
        if (
            poped.y - 1 >= 0 &&
            poped.y - 1 < numOfColumns &&
            mp[poped.y - 1][poped.x] != 1
        ) {
            let tempMoves = poped.moves.slice();
            tempMoves.push(DIRECTION_UP);
            queue.push({ x: poped.x, y: poped.y - 1, moves: tempMoves });
        }
        // si on peut aller en bas et que la case en bas n'est pas un mur
        if (
            poped.y + 1 >= 0 &&
            poped.y + 1 < numOfColumns &&
            mp[poped.y + 1][poped.x] != 1
        ) {
            let tempMoves = poped.moves.slice();
            tempMoves.push(DIRECTION_BOTTOM);
            queue.push({ x: poped.x, y: poped.y + 1, moves: tempMoves });
        }
        return queue;
    }

    
    
    
    changeAnimation() {
        this.currentFrame = this.currentFrame == this.frameCount ? 1 : this.currentFrame + 1;
    }
    

    draw() {
        canvasContext.save();
        canvasContext.drawImage(ghostFrames, this.imageX, this.imageY, this.imageWidth, this.imageHeight, this.x, this.y, this.width, this.height);
        canvasContext.restore();
    } 

    getMapX() {
        return parseInt(this.x / oneBlockSize);
    }

    getMapY() {
        return parseInt(this.y / oneBlockSize);
    }

    getMapXRightSide() {
        return parseInt((this.x + 0.99 * oneBlockSize) / oneBlockSize);
    }
    
    getMapYRightSide() {
        return parseInt((this.y + 0.99 * oneBlockSize) / oneBlockSize);
    }
}