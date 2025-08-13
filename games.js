document.addEventListener('DOMContentLoaded', () => {
    // --- Loader ---
    const loader = document.getElementById('loader');
    const loaderText = document.getElementById('loader-text');
    const progress = document.getElementById('progress');
    const messages = ["Loading games...", "Initializing physics...", "Spawning enemies...", "Ready to play!"];
    let msgIndex = 0;
    let progressValue = 0;

    const loaderInterval = setInterval(() => {
        progressValue += Math.random() * 15;
        if (progressValue > 100) progressValue = 100;
        progress.style.width = progressValue + '%';

        if (progressValue > (msgIndex + 1) * 25) {
            msgIndex++;
            loaderText.textContent = messages[msgIndex] || "Ready!";
        }
        
        if (progressValue >= 100) {
            clearInterval(loaderInterval);
            setTimeout(() => {
                loader.style.transition = 'opacity 0.5s';
                loader.style.opacity = '0';
                setTimeout(() => loader.style.display = 'none', 500);
            }, 500);
        }
    }, 200);

    // --- Theme Toggle ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const applyTheme = (theme) => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
    };
    const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    applyTheme(savedTheme);
    themeToggleBtn.addEventListener('click', () => {
        const isDark = !document.documentElement.classList.contains('dark');
        applyTheme(isDark ? 'dark' : 'light');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    // --- Snake Game ---
    const snakeGame = document.getElementById('snake-game');
    const snakeHead = document.getElementById('snake-head');
    const snakeScoreEl = document.getElementById('snake-score');
    const snakeHighScoreEl = document.getElementById('snake-high-score');
    const startSnakeBtn = document.getElementById('start-snake');
    const upBtn = document.getElementById('up-btn');
    const downBtn = document.getElementById('down-btn');
    const leftBtn = document.getElementById('left-btn');
    const rightBtn = document.getElementById('right-btn');
    
    let snakeScore = 0;
    let isSnakeGameRunning = false;
    let snakeGameInterval;
    let snakeHighScore = localStorage.getItem('snakeHighScore') || 0;
    
    // Display initial high score
    snakeHighScoreEl.textContent = snakeHighScore;
    
    // Game variables
    let snake = [{x: 10, y: 10}]; // Snake body parts
    let food = {x: 15, y: 15};
    let direction = 'right';
    let nextDirection = 'right';
    const gridSize = 20;
    const gameSpeed = 150;
    
    function createFood() {
        const maxX = Math.floor(snakeGame.clientWidth / gridSize);
        const maxY = Math.floor(snakeGame.clientHeight / gridSize);
        
        let newFood;
        do {
            newFood = {
                x: Math.floor(Math.random() * maxX),
                y: Math.floor(Math.random() * maxY)
            };
        } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
        
        food = newFood;
        updateFoodDisplay();
    }
    
    function updateFoodDisplay() {
        // Remove existing food
        const existingFood = snakeGame.querySelector('.food');
        if (existingFood) existingFood.remove();
        
        // Create new food
        const foodElement = document.createElement('div');
        foodElement.className = 'food';
        foodElement.style.left = food.x * gridSize + 'px';
        foodElement.style.top = food.y * gridSize + 'px';
        snakeGame.appendChild(foodElement);
    }
    
    function updateSnakeDisplay() {
        // Remove existing snake body parts
        snakeGame.querySelectorAll('.snake-body').forEach(el => el.remove());
        
        // Update snake head position
        snakeHead.style.left = snake[0].x * gridSize + 'px';
        snakeHead.style.top = snake[0].y * gridSize + 'px';
        
        // Create snake body parts
        for (let i = 1; i < snake.length; i++) {
            const bodyPart = document.createElement('div');
            bodyPart.className = 'snake-body';
            bodyPart.style.left = snake[i].x * gridSize + 'px';
            bodyPart.style.top = snake[i].y * gridSize + 'px';
            snakeGame.appendChild(bodyPart);
        }
    }
    
    function moveSnake() {
        direction = nextDirection;
        
        // Calculate new head position
        const head = {...snake[0]};
        switch (direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }
        
        // Check wall collision
        const maxX = Math.floor(snakeGame.clientWidth / gridSize);
        const maxY = Math.floor(snakeGame.clientHeight / gridSize);
        
        if (head.x < 0 || head.x >= maxX || head.y < 0 || head.y >= maxY) {
            gameOverSnake();
            return;
        }
        
        // Check self collision
        if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            gameOverSnake();
            return;
        }
        
        // Add new head
        snake.unshift(head);
        
        // Check food collision
        if (head.x === food.x && head.y === food.y) {
            snakeScore += 10;
            snakeScoreEl.textContent = snakeScore;
            createFood();
        } else {
            // Remove tail if no food eaten
            snake.pop();
        }
        
        updateSnakeDisplay();
    }
    
    function gameOverSnake() {
        isSnakeGameRunning = false;
        clearInterval(snakeGameInterval);
        
        // Update high score
        if (snakeScore > snakeHighScore) {
            snakeHighScore = snakeScore;
            localStorage.setItem('snakeHighScore', snakeHighScore);
            snakeHighScoreEl.textContent = snakeHighScore;
        }
        
        // Show game over screen
        const gameOverScreen = document.createElement('div');
        gameOverScreen.className = 'game-over';
        gameOverScreen.innerHTML = `
            <h3>Game Over!</h3>
            <p>Score: ${snakeScore}</p>
            <p>High Score: ${snakeHighScore}</p>
            <button onclick="restartSnakeGame()">Play Again</button>
        `;
        snakeGame.appendChild(gameOverScreen);
    }
    
    function restartSnakeGame() {
        // Remove game over screen
        const gameOverScreen = snakeGame.querySelector('.game-over');
        if (gameOverScreen) gameOverScreen.remove();
        
        // Reset game state
        snakeScore = 0;
        snake = [{x: 10, y: 10}];
        direction = 'right';
        nextDirection = 'right';
        isSnakeGameRunning = true;
        
        // Reset score display
        snakeScoreEl.textContent = '0';
        
        // Create initial food
        createFood();
        updateSnakeDisplay();
        
        // Start game loop
        snakeGameInterval = setInterval(moveSnake, gameSpeed);
    }
    
    function startSnakeGame() {
        if (isSnakeGameRunning) return;
        restartSnakeGame();
    }
    
    // Event listeners
    startSnakeBtn.addEventListener('click', startSnakeGame);
    
    // Button controls
    upBtn.addEventListener('click', () => {
        if (direction !== 'down') nextDirection = 'up';
    });
    downBtn.addEventListener('click', () => {
        if (direction !== 'up') nextDirection = 'down';
    });
    leftBtn.addEventListener('click', () => {
        if (direction !== 'right') nextDirection = 'left';
    });
    rightBtn.addEventListener('click', () => {
        if (direction !== 'left') nextDirection = 'right';
    });
    
    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        if (!isSnakeGameRunning) return;
        
        switch (e.key) {
            case 'ArrowUp':
                e.preventDefault();
                if (direction !== 'down') nextDirection = 'up';
                break;
            case 'ArrowDown':
                e.preventDefault();
                if (direction !== 'up') nextDirection = 'down';
                break;
            case 'ArrowLeft':
                e.preventDefault();
                if (direction !== 'right') nextDirection = 'left';
                break;
            case 'ArrowRight':
                e.preventDefault();
                if (direction !== 'left') nextDirection = 'right';
                break;
        }
    });
    
    // Make restart function globally accessible
    window.restartSnakeGame = restartSnakeGame;

    // --- Phaser Arcade Platformer with Virtual Joystick ---
    const phaserContainer = document.getElementById('phaser-container');
    if (phaserContainer && window.Phaser) {
        const config = {
            type: Phaser.AUTO,
            width: phaserContainer.clientWidth,
            height: phaserContainer.clientHeight,
            parent: 'phaser-container',
            physics: {
                default: 'arcade',
                arcade: { gravity: { y: 900 }, debug: false }
            },
            backgroundColor: '#000000',
            scene: { preload, create, update }
        };

        let player, cursors, platforms, stars, bombs, scoreText, groundWidth;
        let leftHeld = false, rightHeld = false, jumpHeld = false;
        let score = 0, gameOver = false;

        const game = new Phaser.Game(config);

        function preload() {
            this.load.image('sky', 'https://labs.phaser.io/assets/skies/sky.png');
            this.load.image('ground', 'https://labs.phaser.io/assets/sprites/platform.png');
            this.load.spritesheet('dude', 'https://labs.phaser.io/assets/sprites/dude.png', { frameWidth: 32, frameHeight: 48 });
            this.load.image('star', 'https://labs.phaser.io/assets/sprites/star.png');
            this.load.image('bomb', 'https://labs.phaser.io/assets/sprites/bomb.png');
        }

        function create() {
            const w = this.sys.game.config.width;
            const h = this.sys.game.config.height;
            this.add.image(w/2, h/2, 'sky').setDisplaySize(w, h);

            platforms = this.physics.add.staticGroup();
            // Ground spanning width
            groundWidth = w;
            const ground = platforms.create(w/2, h-16, 'ground').setScale(w/400, 1).refreshBody();

            // Some ledges
            platforms.create(w*0.25, h*0.7, 'ground');
            platforms.create(w*0.75, h*0.55, 'ground');
            platforms.create(w*0.5, h*0.4, 'ground');

            player = this.physics.add.sprite(80, h-100, 'dude');
            player.setBounce(0.1);
            player.setCollideWorldBounds(true);
            this.physics.world.setBounds(0, 0, w, h);
            this.physics.add.collider(player, platforms);

            this.anims.create({ key: 'left', frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }), frameRate: 10, repeat: -1 });
            this.anims.create({ key: 'turn', frames: [{ key: 'dude', frame: 4 }], frameRate: 20 });
            this.anims.create({ key: 'right', frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }), frameRate: 10, repeat: -1 });

            cursors = this.input.keyboard.createCursorKeys();

            // Stars to collect
            stars = this.physics.add.group({ key: 'star', repeat: 11, setXY: { x: 12, y: 0, stepX: (w-24)/12 } });
            stars.children.iterate((child) => child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.4)));
            this.physics.add.collider(stars, platforms);

            bombs = this.physics.add.group();
            this.physics.add.collider(bombs, platforms);
            this.physics.add.collider(player, bombs, hitBomb, null, this);
            this.physics.add.overlap(player, stars, collectStar, null, this);

            score = 0;
            scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '16px', color: '#ffffff' });

            // Resize handling
            window.addEventListener('resize', () => {
                const newW = phaserContainer.clientWidth;
                const newH = phaserContainer.clientHeight;
                game.scale.resize(newW, newH);
            });

            // Virtual joystick wiring
            initVirtualJoystick(({ x, y, isActive }) => {
                leftHeld = isActive && x < -0.2;
                rightHeld = isActive && x > 0.2;
            });
            initJumpButton(() => {
                if (gameOver) { this.scene.restart(); gameOver = false; score = 0; return; }
                jumpHeld = true; setTimeout(() => jumpHeld = false, 120);
            });

            function collectStar(playerObj, star) {
                star.disableBody(true, true);
                score += 10;
                scoreText.setText('Score: ' + score);
                if (stars.countActive(true) === 0) {
                    stars.children.iterate(function(child) {
                        child.enableBody(true, child.x, 0, true, true);
                    });
                    const x = (player.x < w / 2) ? Phaser.Math.Between(w/2, w - 30) : Phaser.Math.Between(30, w/2);
                    const bomb = bombs.create(x, 16, 'bomb');
                    bomb.setBounce(1);
                    bomb.setCollideWorldBounds(true);
                    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
                }
            }

            function hitBomb(playerObj, bomb) {
                this.physics.pause();
                player.setTint(0xff0000);
                player.anims.play('turn');
                gameOver = true;
            }
        }

        function update() {
            if (gameOver) return;
            const onGround = player.body.blocked.down || player.body.touching.down;
            const left = cursors.left.isDown || leftHeld;
            const right = cursors.right.isDown || rightHeld;
            const wantJump = Phaser.Input.Keyboard.JustDown(cursors.up) || cursors.space?.isDown || jumpHeld;

            if (left) {
                player.setVelocityX(-220);
                player.anims.play('left', true);
            } else if (right) {
                player.setVelocityX(220);
                player.anims.play('right', true);
            } else {
                player.setVelocityX(0);
                player.anims.play('turn');
            }

            if (wantJump && onGround) {
                player.setVelocityY(-420);
            }
        }
    }

    // Virtual Joystick implementation
    function initVirtualJoystick(onMove) {
        const base = document.getElementById('virtual-joystick');
        const knob = document.getElementById('virtual-joystick-knob');
        if (!base || !knob) return;

        const rect = () => base.getBoundingClientRect();
        let activeId = null;

        function handleStart(clientX, clientY, id) {
            activeId = id;
            update(clientX, clientY);
        }
        function handleMove(clientX, clientY) { update(clientX, clientY); }
        function handleEnd() {
            activeId = null;
            knob.style.transform = 'translate(-50%, -50%)';
            onMove && onMove({ x: 0, y: 0, isActive: false });
        }
        function update(clientX, clientY) {
            const r = rect();
            const cx = r.left + r.width/2;
            const cy = r.top + r.height/2;
            let dx = clientX - cx;
            let dy = clientY - cy;
            const max = r.width/2 - 10;
            const dist = Math.min(Math.hypot(dx, dy), max);
            const angle = Math.atan2(dy, dx);
            const nx = Math.cos(angle) * dist;
            const ny = Math.sin(angle) * dist;
            knob.style.transform = `translate(calc(-50% + ${nx}px), calc(-50% + ${ny}px))`;
            const normX = nx / max;
            const normY = ny / max;
            onMove && onMove({ x: normX, y: normY, isActive: true });
        }

        base.addEventListener('pointerdown', (e) => {
            base.setPointerCapture(e.pointerId);
            handleStart(e.clientX, e.clientY, e.pointerId);
        });
        base.addEventListener('pointermove', (e) => {
            if (activeId === e.pointerId) handleMove(e.clientX, e.clientY);
        });
        base.addEventListener('pointerup', (e) => { if (activeId === e.pointerId) handleEnd(); });
        base.addEventListener('pointercancel', (e) => { if (activeId === e.pointerId) handleEnd(); });
        base.addEventListener('lostpointercapture', handleEnd);
    }

    function initJumpButton(onJump) {
        const btn = document.getElementById('arcade-jump');
        if (!btn) return;
        const fire = () => onJump && onJump();
        btn.addEventListener('click', fire);
        btn.addEventListener('pointerdown', (e) => { e.preventDefault(); fire(); });
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' || e.code === 'ArrowUp') fire();
        });
    }
});
