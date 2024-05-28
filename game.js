document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    const player = {
        width: 50,
        height: 20,
        x: canvas.width / 2 - 25,
        y: canvas.height - 30,
        speed: 7,
        dx: 0
    };

    const objects = [];
    const objectWidth = 20;
    const objectHeight = 20;
    const objectSpeed = 2;
    let score = 0;
    let gameOver = false;

    function drawPlayer() {
        ctx.fillStyle = 'blue';
        ctx.fillRect(player.x, player.y, player.width, player.height);
    }

    function drawObject(object) {
        ctx.fillStyle = 'red';
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
            }

            if (
                objects[i].y + objectHeight > player.y &&
                objects[i].x < player.x + player.width &&
                objects[i].x + objectWidth > player.x
            ) {
                objects.splice(i, 1);
                score++;
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

    setInterval(createObject, 1000);
    update();
});
