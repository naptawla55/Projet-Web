
class Pacman {
    constructor(x ,y ,width ,height, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.direction = DIRECTION_RIGHT;
        this.nextDirection = this.direction;
        this.currentFrame = 1;
        this.frameCount = 7;
        
        setInterval(() => {
            this.changeAnimation();
        }, 100);

    }

    moveProcess() {
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

    changeDirectionIfPossible() {
        // fontion qui change la direction si il n'y a pas de collision
        if(this.direction == DIRECTION_RIGHT || this.direction == DIRECTION_LEFT) {
            if(this.nextDirection == DIRECTION_UP || this.nextDirection == DIRECTION_BOTTOM) {
                if(this.checkCollision()) {
                    this.direction = this.nextDirection;
                }
            }
        }
    }
    
    changeAnimation() {
        this.currentFrame = this.currentFrame == this.frameCount ? 1 : this.currentFrame + 1;
    }
    

    draw() {
        canvasContext.save();
        canvasContext.translate(this.x + oneBlockSize/ 2, this.y + oneBlockSize/ 2);
        canvasContext.rotate(this.direction * 90 * Math.PI / 180);
        canvasContext.translate(-(this.x + oneBlockSize/ 2), -(this.y + oneBlockSize/ 2));
        canvasContext.drawImage(pacmanFrames, (this.currentFrame - 1) * oneBlockSize, 0, oneBlockSize, oneBlockSize, this.x, this.y, this.width, this.height);
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