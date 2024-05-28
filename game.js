document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    const player = {
        width: 100,
        height: 20,
        x: canvas.width / 2 - 50,
        y: canvas.height - 30,
        speed: 5,
        dx: 0
    };

    const objects = [];
    const objectWidth = 30;
    const objectHeight = 30;
    const objectSpeed = 1;
    let score = 0;
    let gameOver = false;

    // Load sounds
    const catchSound = new Audio('catch.mp3');
    const gameOverSound = new Audio('gameover.mp3');

    function drawPlayer() {
        ctx.fillStyle = '#3498db';
        ctx.fillRect(player.x, player.y, player.width, player.height);
    }

    function drawObject(object) {
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(object.x, object.y, objectWidth, objectHeight);
    }

    function updatePlayer() {
        player.x += player.dx;

        if (player.x < 0) {
            player.x = 0;
        }

        if (player.x + player.width > canvas.width) {
            player.x = canvas.width - player.width;
        }
    }

    function updateObjects() {
        for (let i = 0; i < objects.length; i++) {
            objects[i].y += objectSpeed;

            if (objects[i].y + objectHeight > canvas.height) {
                gameOver = true;
                gameOverSound.play();
            }

            if (
                objects[i].y + objectHeight > player.y &&
                objects[i].x < player.x + player.width &&
                objects[i].x + objectWidth > player.x
            ) {
                objects.splice(i, 1);
                score++;
                catchSound.play();
                i--;
            }
        }
    }

    function drawObjects() {
        objects.forEach(object => drawObject(object));
    }

    function createObject() {
        const x = Math.random() * (canvas.width - objectWidth);
        const y = 0 - objectHeight;
        objects.push({ x, y });
    }

    function drawScore() {
        ctx.fillStyle = 'black';
        ctx.font = '20px Arial';
        ctx.fillText(`Score: ${score}`, 10, 30);
    }

    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function update() {
        if (!gameOver) {
            clearCanvas();

            drawPlayer();
            drawObjects();
            drawScore();

            updatePlayer();
            updateObjects();

            requestAnimationFrame(update);
        } else {
            ctx.fillStyle = 'black';
            ctx.font = '40px Arial';
            ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);
            ctx.font = '20px Arial';
            ctx.fillText(`Final Score: ${score}`, canvas.width / 2 - 70, canvas.height / 2 + 40);
        }
    }

    function moveRight() {
        player.dx = player.speed;
    }

    function moveLeft() {
        player.dx = -player.speed;
    }

    function stopMove() {
        player.dx = 0;
    }

    // Mouse move event to control the player
    canvas.addEventListener('mousemove', (e) => {
        const canvasRect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - canvasRect.left;
        player.x = mouseX - player.width / 2;

        // Ensure the player stays within the canvas boundaries
        if (player.x < 0) {
            player.x = 0;
        }
        if (player.x + player.width > canvas.width) {
            player.x = canvas.width - player.width;
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'Right') {
            moveRight();
        } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
            moveLeft();
        }
    });

    document.addEventListener('keyup', (e) => {
        if (
            e.key === 'ArrowRight' || e.key === 'Right' ||
            e.key === 'ArrowLeft' || e.key === 'Left'
        ) {
            stopMove();
        }
    });

    setInterval(createObject, 2000); // Increased the interval to make it easier
    update();
});
