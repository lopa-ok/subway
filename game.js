let canvas, ctx;
let player, obstacles;
let gameSpeed;
let lanes = 3; 
let score = 0;
let isGameOver = false;
let difficulty = 'medium'; 


let laneWidth;
let playerLane; 


function startGame() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    adjustCanvasSize(); 

    
    showMainMenu();
}


function showMainMenu() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

   
    ctx.fillStyle = '#000';
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('subway surfers inspired game', canvas.width / 2, canvas.height / 2 - 80);

    ctx.font = '24px Arial';
    ctx.fillText('Select Difficulty:', canvas.width / 2, canvas.height / 2 - 40);

   
    ctx.fillStyle = '#00f';
    ctx.fillRect(canvas.width / 2 - 100, canvas.height / 2, 200, 50);
    ctx.fillRect(canvas.width / 2 - 100, canvas.height / 2 + 70, 200, 50);
    ctx.fillRect(canvas.width / 2 - 100, canvas.height / 2 + 140, 200, 50);

    ctx.fillStyle = '#fff';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Easy', canvas.width / 2, canvas.height / 2 + 35);
    ctx.fillText('Medium', canvas.width / 2, canvas.height / 2 + 105);
    ctx.fillText('Hard', canvas.width / 2, canvas.height / 2 + 175);

    
    canvas.addEventListener('click', selectDifficulty);
}


function selectDifficulty(event) {
    let rect = canvas.getBoundingClientRect();
    let mouseX = event.clientX - rect.left;
    let mouseY = event.clientY - rect.top;

    
    if (mouseX >= canvas.width / 2 - 100 && mouseX <= canvas.width / 2 + 100) {
        if (mouseY >= canvas.height / 2 && mouseY <= canvas.height / 2 + 50) {
            // Easy difficulty
            difficulty = 'easy';
        } else if (mouseY >= canvas.height / 2 + 70 && mouseY <= canvas.height / 2 + 120) {
            // Medium difficulty
            difficulty = 'medium';
        } else if (mouseY >= canvas.height / 2 + 140 && mouseY <= canvas.height / 2 + 190) {
            // Hard difficulty
            difficulty = 'hard';
        }

        
        canvas.removeEventListener('click', selectDifficulty);

        
        startGameLoop();
    }
}


function startGameLoop() {
    
    switch (difficulty) {
        case 'easy':
            gameSpeed = 4; 
            break;
        case 'medium':
            gameSpeed = 5; 
            break;
        case 'hard':
            gameSpeed = 6; 
            break;
        default:
            gameSpeed = 5; 
            break;
    }

    laneWidth = canvas.width / lanes;
    playerLane = Math.floor(lanes / 2); 

    player = new Player();
    obstacles = [];

    
    score = 0;
    isGameOver = false;

    
    updateGame();
}


function adjustCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}


function Player() {
    this.width = 50;
    this.height = 50;
    this.x = laneWidth * playerLane + laneWidth / 2 - this.width / 2;
    this.y = canvas.height - this.height - 10;
    this.targetX = this.x;
    this.dx = 0;

    this.draw = function() {
        ctx.fillStyle = '#f00'; 
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };

    this.update = function() {
        if (this.x < this.targetX) {
            this.x += Math.min(this.dx, this.targetX - this.x);
        } else if (this.x > this.targetX) {
            this.x -= Math.min(this.dx, this.x - this.targetX);
        }

        
        if (this.x < 0) {
            this.x = 0;
        }
        if (this.x + this.width > canvas.width) {
            this.x = canvas.width - this.width;
        }
    };

    this.move = function(direction) {
        
        if (direction === 'left') {
            if (playerLane > 0) {
                playerLane--;
                this.targetX = laneWidth * playerLane + laneWidth / 2 - this.width / 2;
                this.dx = Math.abs(this.x - this.targetX) / 5; 
            }
        } else if (direction === 'right') {
            if (playerLane < lanes - 1) {
                playerLane++;
                this.targetX = laneWidth * playerLane + laneWidth / 2 - this.width / 2;
                this.dx = Math.abs(this.x - this.targetX) / 5; 
            }
        }
    };

    this.checkCollision = function(obstacle) {
        
        if (this.x < obstacle.x + obstacle.width &&
            this.x + this.width > obstacle.x &&
            this.y < obstacle.y + obstacle.height &&
            this.y + this.height > obstacle.y) {
            return true;
        }
        return false;
    };
}


function Obstacle() {
    this.width = 50; 
    this.height = 50; 
    this.lane = Math.floor(Math.random() * lanes);
    this.x = laneWidth * this.lane + laneWidth / 2 - this.width / 2;
    this.y = -this.height;
    this.color = '#0f0';

    this.draw = function() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };

    this.update = function() {
        this.y += gameSpeed;

        
        if (player.checkCollision(this)) {
            gameOver();
        }
    };
}


function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    
    player.update();
    player.draw();

    
    if (Math.random() < 0.01 && obstacles.length < lanes) {
        let laneOccupied = obstacles.map(obstacle => obstacle.lane);
        let freeLanes = Array.from({ length: lanes }, (_, i) => i).filter(lane => !laneOccupied.includes(lane));
        let laneIndex = Math.floor(Math.random() * freeLanes.length);
        let newObstacle = new Obstacle();
        newObstacle.lane = freeLanes[laneIndex];
        newObstacle.x = laneWidth * newObstacle.lane + laneWidth / 2 - newObstacle.width / 2;
        obstacles.push(newObstacle);
    }

   
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].update();
        obstacles[i].draw();

        
        if (obstacles[i].y > canvas.height) {
            obstacles.splice(i, 1);
            i--;
        }
    }


    ctx.fillStyle = '#000';
    ctx.font = '24px Arial';
    ctx.textAlign = 'left'; 
    ctx.fillText('Score: ' + score, 10, 30); 
    
    if (!isGameOver) {
        score++;
    }

   
    if (!isGameOver) {
        requestAnimationFrame(updateGame);
    }
}


function gameOver() {
    isGameOver = true;

    // Clear obstacles array
    obstacles = [];

   
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#000';
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 40);

    ctx.font = '24px Arial';
    ctx.fillText('Score: ' + score, canvas.width / 2, canvas.height / 2);


    ctx.fillStyle = '#00f';
    ctx.fillRect(canvas.width / 2 - 100, canvas.height / 2 + 50, 200, 50);
    ctx.fillStyle = '#fff';
    ctx.fillText('Main Menu', canvas.width / 2, canvas.height / 2 + 85);

   
    ctx.fillStyle = '#f00';
    ctx.fillRect(canvas.width / 2 - 100, canvas.height / 2 + 120, 200, 50);
    ctx.fillStyle = '#fff';
    ctx.fillText('Restart', canvas.width / 2, canvas.height / 2 + 155);

   
    canvas.addEventListener('click', handleGameOverClick);
}



function handleGameOverClick(event) {
    let rect = canvas.getBoundingClientRect();
    let mouseX = event.clientX - rect.left;
    let mouseY = event.clientY - rect.top;

   
    if (mouseX >= canvas.width / 2 - 100 && mouseX <= canvas.width / 2 + 100 &&
        mouseY >= canvas.height / 2 + 50 && mouseY <= canvas.height / 2 + 100) {
        canvas.removeEventListener('click', handleGameOverClick);
        showMainMenu();
    }


    if (mouseX >= canvas.width / 2 - 100 && mouseX <= canvas.width / 2 + 100 &&
        mouseY >= canvas.height / 2 + 120 && mouseY <= canvas.height / 2 + 170) {
        canvas.removeEventListener('click', handleGameOverClick);
        startGameLoop();
    }
}


document.addEventListener('keydown', function(event) {
    if (!isGameOver) {
        if (event.key === 'ArrowLeft' || event.key === 'Left') {
            player.move('left');
        } else if (event.key === 'ArrowRight' || event.key === 'Right') {
            player.move('right');
        }
    }
});

document.addEventListener('keyup', function(event) {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight' ||
        event.key === 'Left' || event.key === 'Right') {
        player.dx = 0;
    }
});


window.addEventListener('resize', function() {
    adjustCanvasSize();
});


window.onload = function() {
    startGame();
};
