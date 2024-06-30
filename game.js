let canvas, ctx;
let player, obstacles;
let gameSpeed;
let lanes = 3;


let laneWidth;
let playerLane;


function startGame() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    adjustCanvasSize(); 
    gameSpeed = 3;
    laneWidth = canvas.width / lanes;
    playerLane = Math.floor(lanes / 2); 

    player = new Player();
    obstacles = [];

   
    updateGame();
}


function adjustCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    laneWidth = canvas.width / lanes;
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
    };
}


function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    
    player.update();
    player.draw();

    
    if (Math.random() < 0.01) {
        obstacles.push(new Obstacle());
    }

    
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].update();
        obstacles[i].draw();

        
        if (obstacles[i].y > canvas.height) {
            obstacles.splice(i, 1);
            i--;
        }
    }

   
    requestAnimationFrame(updateGame);
}


document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowLeft' || event.key === 'Left') {
        player.move('left');
    } else if (event.key === 'ArrowRight' || event.key === 'Right') {
        player.move('right');
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
