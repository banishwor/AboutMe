document.addEventListener('DOMContentLoaded', () => {
        // --- All JS from previous version is maintained here ---
        
        // --- Fake Loading Screen ---
        const loader = document.getElementById('loader');
        const loaderText = document.getElementById('loader-text');
        const progress = document.getElementById('progress');
        const messages = ["Downloading more RAM...", "Asking Stack Overflow...", "Polishing pixels...", "Initializing awesomeness..."];
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

        // --- Feather Icons & Mobile Menu ---
        feather.replace();
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // --- Theme Toggle ---
        const themeToggleBtns = [document.getElementById('theme-toggle'), document.getElementById('theme-toggle-mobile')];
        const applyTheme = (theme) => {
            document.documentElement.classList.toggle('dark', theme === 'dark');
        };
        const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        applyTheme(savedTheme);
        themeToggleBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const isDark = !document.documentElement.classList.contains('dark');
                applyTheme(isDark ? 'dark' : 'light');
                localStorage.setItem('theme', isDark ? 'dark' : 'light');
            });
        });

        // --- Constellation Background ---
        const constellationCanvas = document.getElementById('constellation-canvas');
        const constellationCtx = constellationCanvas.getContext('2d');
        let particlesArray;

        function getParticleColor() {
            const styles = getComputedStyle(document.documentElement);
            return styles.getPropertyValue('--constellation-color').trim().replace(/'/g, '');
        }

        class Particle {
            constructor(x, y, directionX, directionY, size, color) {
                this.x = x; this.y = y; this.directionX = directionX; this.directionY = directionY; this.size = size; this.color = color;
            }
            draw() {
                constellationCtx.beginPath();
                constellationCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                constellationCtx.fillStyle = this.color;
                constellationCtx.fill();
            }
            update() {
                if (this.x > constellationCanvas.width || this.x < 0) this.directionX = -this.directionX;
                if (this.y > constellationCanvas.height || this.y < 0) this.directionY = -this.directionY;
                this.x += this.directionX; this.y += this.directionY; this.draw();
            }
        }

        function initConstellation() {
            constellationCanvas.width = window.innerWidth;
            constellationCanvas.height = window.innerHeight;
            particlesArray = [];
            let numberOfParticles = (constellationCanvas.height * constellationCanvas.width) / 9000;
            let color = getParticleColor();
            for (let i = 0; i < numberOfParticles; i++) {
                let size = (Math.random() * 2) + 1;
                let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
                let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
                let directionX = (Math.random() * .4) - .2;
                let directionY = (Math.random() * .4) - .2;
                particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
            }
        }

        function connect() {
            let color = getParticleColor();
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) +
                        ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                    if (distance < (constellationCanvas.width / 7) * (constellationCanvas.height / 7)) {
                        let opacityValue = 1 - (distance / 20000);
                        constellationCtx.strokeStyle = color.replace(/[\d\.]+\)/, opacityValue + ')');
                        constellationCtx.lineWidth = 1;
                        constellationCtx.beginPath();
                        constellationCtx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        constellationCtx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        constellationCtx.stroke();
                    }
                }
            }
        }

        function animateConstellation() {
            requestAnimationFrame(animateConstellation);
            constellationCtx.clearRect(0, 0, innerWidth, innerHeight);
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
            }
            connect();
        }

        window.addEventListener('resize', initConstellation);
        new MutationObserver(() => initConstellation()).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        initConstellation();
        animateConstellation();

        // --- Live TV Ad Showcase & Konami Code ---
        const tvScreen = document.getElementById('tv-screen');
        const ads = [
            { bg: 'linear-gradient(45deg, #6d28d9, #d946ef)', icon: 'coffee', title: 'CodeBrew Coffee', text: 'The official fuel for developers.' },
            { bg: 'linear-gradient(45deg, #059669, #a3e635)', icon: 'git-branch', title: 'Git-It-Done', text: 'The last PM tool you\'ll ever need.' },
            { bg: 'linear-gradient(45deg, #db2777, #fb923c)', icon: 'cpu', title: 'Quantum Leap Hosting', text: 'So fast, it loads before you click.' }
        ];
        let currentAdIndex = 0;
        function showAd() {
            const ad = ads[currentAdIndex];
            tvScreen.innerHTML = `<div class="fake-ad" style="background: ${ad.bg};"><i data-feather="${ad.icon}" class="w-12 h-12 mb-3"></i><h3 class="text-xl font-bold mb-1">${ad.title}</h3><p class="text-sm">${ad.text}</p></div>`;
            feather.replace();
            setTimeout(() => tvScreen.querySelector('.fake-ad').classList.add('active'), 50);
            currentAdIndex = (currentAdIndex + 1) % ads.length;
        }
        showAd();
        setInterval(showAd, 5000);

        const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
        let konamiIndex = 0;
        document.addEventListener('keydown', (e) => {
            // Prevent spacebar from scrolling while playing games
            if (['dino-game', 'code-input'].includes(document.activeElement.id) && e.key === ' ') {
                e.preventDefault();
            }
            if (e.key === konamiCode[konamiIndex]) {
                konamiIndex++;
                if (konamiIndex === konamiCode.length) {
                    document.body.classList.add('konami-active');
                    setTimeout(() => document.body.classList.remove('konami-active'), 3000);
                    konamiIndex = 0;
                }
            } else {
                konamiIndex = 0;
            }
        });
        
        // --- Matrix Terminal ---
        const terminalTextElement = document.getElementById('terminal-text');
        const terminalBody = document.getElementById('terminal-body');
        let currentCommand = '';
        let commandHistory = [];
        let historyIndex = -1;
        
        const textToType = `banishwor@portfolio:~$ ./welcome.sh\n\nHello there! I'm Banishwor, a software developer who loves building cool things for the web.\n\nbanishwor@portfolio:~$ `;
        let i = 0;
        let typingComplete = false;
        
        function typeWriter() {
            if (i < textToType.length) {
                terminalTextElement.innerHTML += textToType.charAt(i) === '\n' ? '<br>' : textToType.charAt(i);
                i++;
                setTimeout(typeWriter, Math.random() * 50 + 20);
            } else {
                typingComplete = true;
                // Add cursor after typing is complete
                terminalTextElement.innerHTML += '<span class="cursor"></span>';
            }
        }
        typeWriter();

        // Handle terminal input
        function handleCommand(command) {
            command = command.trim();
            if (!command) return;
            
            // Add to history
            commandHistory.push(command);
            historyIndex = commandHistory.length;
            
            // Process command
            let output = '';
            if (command === 'ls -l') {
                output = `total 8
drwxr-xr-x  2 banishwor banishwor 4096 Dec 15 10:30 .
drwxr-xr-x  3 banishwor banishwor 4096 Dec 15 10:30 ..
-rw-r--r--  1 banishwor banishwor  256 Dec 15 10:30 welcome.sh
-rw-r--r--  1 banishwor banishwor  512 Dec 15 10:30 portfolio.html
-rw-r--r--  1 banishwor banishwor 1024 Dec 15 10:30 projects.js
-rw-r--r--  1 banishwor banishwor  128 Dec 15 10:30 .secret
-rw-r--r--  1 banishwor banishwor  256 Dec 15 10:30 easter_egg.txt
-rw-r--r--  1 banishwor banishwor  512 Dec 15 10:30 cool_stuff.md

🎉 Easter egg found! You discovered my secret files! 🎉
There's more to explore in this portfolio...`;
            } else if (command === 'ls') {
                output = `welcome.sh  portfolio.html  projects.js  .secret  easter_egg.txt  cool_stuff.md`;
            } else if (command === 'cat .secret') {
                output = `You found the secret file! 
This portfolio is full of hidden surprises.
Try exploring more commands...`;
            } else if (command === 'cat easter_egg.txt') {
                output = `🎮 Hidden Features:
- Konami Code (↑↑↓↓←→←→BA)
- Matrix rain effect
- Interactive terminal (you're using it!)
- Dinosaur game
- Code battle arena
- Live TV ads
- And more...`;
            } else if (command === 'cat cool_stuff.md') {
                output = `# Cool Stuff I've Built

## This Portfolio
- Interactive terminal with easter eggs
- Matrix rain background
- Responsive design with dark mode
- Animated skills bars
- Mini games and interactive elements

## Other Projects
- Yek Salai Website (genealogical data)
- Android app on Amazon Appstore
- MCA research on clustering algorithms

Thanks for exploring! 🚀`;
            } else if (command === 'help') {
                output = `Available commands:
- ls: List files
- ls -l: Detailed file listing (with easter egg!)
- cat <filename>: View file contents
- help: Show this help
- clear: Clear terminal
- exit: Close terminal (just kidding, you can't escape!)`;
            } else if (command === 'clear') {
                terminalTextElement.innerHTML = '';
                return;
            } else {
                output = `bash: ${command}: command not found
Try 'help' for available commands`;
            }
            
            // Add command and output to terminal
            terminalTextElement.innerHTML += `<br><span class="text-green-400">banishwor@portfolio:~$</span> ${command}<br>${output}<br><span class="text-green-400">banishwor@portfolio:~$</span> <span class="cursor"></span>`;
        }

        // Handle keyboard input
        document.addEventListener('keydown', (e) => {
            if (!typingComplete) return;
            
            // Only handle terminal input if terminal is focused or if it's a global shortcut
            const isTerminalFocused = document.activeElement === terminalBody;
            
            if (e.key === 'Enter' && isTerminalFocused) {
                e.preventDefault();
                handleCommand(currentCommand);
                currentCommand = '';
            } else if (e.key === 'Backspace' && isTerminalFocused) {
                e.preventDefault();
                if (currentCommand.length > 0) {
                    currentCommand = currentCommand.slice(0, -1);
                    updateTerminalDisplay();
                }
            } else if (e.key === 'ArrowUp' && isTerminalFocused) {
                e.preventDefault();
                if (historyIndex > 0) {
                    historyIndex--;
                    currentCommand = commandHistory[historyIndex];
                    updateTerminalDisplay();
                }
            } else if (e.key === 'ArrowDown' && isTerminalFocused) {
                e.preventDefault();
                if (historyIndex < commandHistory.length - 1) {
                    historyIndex++;
                    currentCommand = commandHistory[historyIndex];
                } else {
                    historyIndex = commandHistory.length;
                    currentCommand = '';
                }
                updateTerminalDisplay();
            } else if (e.key.length === 1 && isTerminalFocused) {
                e.preventDefault();
                currentCommand += e.key;
                updateTerminalDisplay();
            }
        });

        // Auto-focus terminal when clicked
        terminalBody.addEventListener('click', () => {
            terminalBody.focus();
        });

        function updateTerminalDisplay() {
            // Remove the last line (current command) and add updated one
            const lines = terminalTextElement.innerHTML.split('<br>');
            lines.pop(); // Remove the last line
            terminalTextElement.innerHTML = lines.join('<br>') + '<br><span class="text-green-400">banishwor@portfolio:~$</span> ' + currentCommand + '<span class="cursor"></span>';
        }

        const matrixCanvas = document.getElementById('matrix-canvas');
        const matrixCtx = matrixCanvas.getContext('2d');
        const matrixContainer = document.getElementById('matrix-canvas-container');
        function resizeMatrix() {
            matrixCanvas.width = matrixContainer.clientWidth;
            matrixCanvas.height = matrixContainer.clientHeight;
        }
        resizeMatrix();
        
        const alphabet = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const fontSize = 16;
        const columns = matrixCanvas.width / fontSize;
        const rainDrops = Array(Math.floor(columns)).fill(1);
        const drawMatrix = () => {
            matrixCtx.fillStyle = 'rgba(30, 41, 59, 0.05)';
            matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
            matrixCtx.fillStyle = '#818cf8';
            matrixCtx.font = fontSize + 'px monospace';
            for (let i = 0; i < rainDrops.length; i++) {
                const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
                matrixCtx.fillText(text, i * fontSize, rainDrops[i] * fontSize);
                if (rainDrops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
                    rainDrops[i] = 0;
                }
                rainDrops[i]++;
            }
        };
        setInterval(drawMatrix, 40);
        window.addEventListener('resize', resizeMatrix);



        // --- Dinosaur Game ---
        const dinoGame = document.getElementById('dino-game');
        const dino = document.getElementById('dino');
        const dinoScoreEl = document.getElementById('dino-score');
        const dinoHighScoreEl = document.getElementById('dino-high-score');
        const startDinoBtn = document.getElementById('start-dino');
        const jumpBtn = document.getElementById('jump-btn');
        let dinoScore = 0;
        let isJumping = false;
        let isGameRunning = false;
        let gameSpeed = 6;
        let obstacleInterval = 2000;
        let cloudInterval = 3000;
        let dinoGameInterval;
        let obstacleTimer;
        let cloudTimer;
        let highScore = localStorage.getItem('dinoHighScore') || 0;
        
        // Display initial high score
        dinoHighScoreEl.textContent = highScore;

        function jump() {
            if (isJumping || !isGameRunning) return;
            isJumping = true;
            dino.classList.add('jump');
            dino.classList.remove('running');
            
            setTimeout(() => {
                dino.classList.remove('jump');
                dino.classList.add('running');
                isJumping = false;
            }, 600);
        }

        function createObstacle() {
            if (!isGameRunning) return;
            
            const obstacle = document.createElement('div');
            const isBird = Math.random() < 0.3 && dinoScore > 100; // Birds appear after score 100
            
            if (isBird) {
                obstacle.classList.add('obstacle', 'bird');
                obstacle.style.bottom = '120px'; // Birds fly higher
            } else {
                obstacle.classList.add('obstacle');
                obstacle.style.bottom = '50px';
            }
            
            obstacle.style.left = '100%';
            dinoGame.appendChild(obstacle);

            let obstaclePosition = dinoGame.clientWidth;
            const moveObstacle = () => {
                if (!isGameRunning) {
                    obstacle.remove();
                    return;
                }
                
                if (obstaclePosition < -50) {
                    obstacle.remove();
                    return;
                }
                
                const dinoRect = dino.getBoundingClientRect();
                const obstacleRect = obstacle.getBoundingClientRect();

                // Collision detection
                if (
                    obstacleRect.left < dinoRect.right - 10 &&
                    obstacleRect.right > dinoRect.left + 10 &&
                    obstacleRect.top < dinoRect.bottom - 10 &&
                    obstacleRect.bottom > dinoRect.top + 10
                ) {
                    gameOver();
                    return;
                }
                
                obstaclePosition -= gameSpeed;
                obstacle.style.left = obstaclePosition + 'px';
                requestAnimationFrame(moveObstacle);
            };
            moveObstacle();
        }

        function createCloud() {
            if (!isGameRunning) return;
            
            const cloud = document.createElement('div');
            cloud.classList.add('cloud');
            cloud.style.top = Math.random() * 100 + 'px';
            cloud.style.left = '100%';
            dinoGame.appendChild(cloud);

            let cloudPosition = dinoGame.clientWidth;
            const moveCloud = () => {
                if (!isGameRunning) {
                    cloud.remove();
                    return;
                }
                
                if (cloudPosition < -60) {
                    cloud.remove();
                    return;
                }
                
                cloudPosition -= gameSpeed * 0.5; // Clouds move slower
                cloud.style.left = cloudPosition + 'px';
                requestAnimationFrame(moveCloud);
            };
            moveCloud();
        }

        function updateScore() {
            if (!isGameRunning) return;
            
            dinoScore++;
            dinoScoreEl.textContent = dinoScore;
            
            // Increase game speed every 100 points
            if (dinoScore % 100 === 0) {
                gameSpeed += 0.5;
                obstacleInterval = Math.max(800, obstacleInterval - 100);
            }
            
            // Update high score
            if (dinoScore > highScore) {
                highScore = dinoScore;
                localStorage.setItem('dinoHighScore', highScore);
                dinoHighScoreEl.textContent = highScore;
            }
        }

        function gameOver() {
            isGameRunning = false;
            dino.classList.remove('running');
            
            clearInterval(dinoGameInterval);
            clearInterval(obstacleTimer);
            clearInterval(cloudTimer);
            
            // Remove all obstacles and clouds
            document.querySelectorAll('.obstacle, .cloud').forEach(el => el.remove());
            
            // Show game over screen
            const gameOverScreen = document.createElement('div');
            gameOverScreen.className = 'game-over';
            gameOverScreen.innerHTML = `
                <h3>Game Over!</h3>
                <p>Score: ${dinoScore}</p>
                <p>High Score: ${highScore}</p>
                <button onclick="restartGame()">Play Again</button>
            `;
            dinoGame.appendChild(gameOverScreen);
        }

        function restartGame() {
            // Remove game over screen
            const gameOverScreen = dinoGame.querySelector('.game-over');
            if (gameOverScreen) gameOverScreen.remove();
            
            // Reset game state
            dinoScore = 0;
            gameSpeed = 6;
            obstacleInterval = 2000;
            isGameRunning = true;
            
            // Start animations
            dino.classList.add('running');
            
            // Start game loops
            dinoGameInterval = setInterval(updateScore, 100);
            obstacleTimer = setInterval(createObstacle, obstacleInterval);
            cloudTimer = setInterval(createCloud, cloudInterval);
        }
        
        // Make restart function globally accessible
        window.restartGame = restartGame;

        function startGame() {
            if (isGameRunning) return;
            
            // Reset score display
            dinoScoreEl.textContent = '0';
            
            // Start the game
            restartGame();
        }

        // Event listeners
        startDinoBtn.addEventListener('click', startGame);
        
        // Virtual jump button
        jumpBtn.addEventListener('click', jump);
        jumpBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            jump();
        });
        
        // Global jump controls
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' || e.code === 'ArrowUp') {
                e.preventDefault();
                jump();
            }
        });
        
        // Touch/click support for mobile (on game area)
        dinoGame.addEventListener('click', jump);
        dinoGame.addEventListener('touchstart', (e) => {
            e.preventDefault();
            jump();
        });

        // --- Interactive Desktop ---
        const addressBar = document.getElementById('address-bar');
        const goBtn = document.getElementById('go-btn');
        const browserFrame = document.getElementById('browser-frame');
        const keyboardContainer = document.getElementById('keyboard');
        const suggestedSitesContainer = document.getElementById('suggested-sites');

        const keyLayout = [
            "q w e r t y u i o p",
            "a s d f g h j k l",
            "z x c v b n m . com"
        ];

        keyLayout.forEach(row => {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'keyboard-row';
            row.split(' ').forEach(key => {
                const keyEl = document.createElement('button');
                keyEl.textContent = key;
                keyEl.className = 'key';
                keyEl.addEventListener('click', () => {
                    addressBar.value += key;
                    addressBar.focus();
                });
                rowDiv.appendChild(keyEl);
            });
            keyboardContainer.appendChild(rowDiv);
        });

        function navigate() {
            let url = addressBar.value.trim();
            if (!url) return;
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                url = 'https://' + url;
            }
            browserFrame.src = url;
        }

        const suggestedSites = [
            { name: 'Google', url: 'https://www.google.com/webhp?igu=1' },
            { name: 'Wikipedia', url: 'https://www.wikipedia.org' },
            { name: 'GitHub', url: 'https://github.com' },
            { name: 'The Verge', url: 'https://www.theverge.com' }
        ];

        suggestedSites.forEach(site => {
            const siteBtn = document.createElement('button');
            siteBtn.textContent = site.name;
            siteBtn.className = 'bg-gray-200 dark:bg-slate-700 text-subtle px-3 py-1 rounded-full text-sm hover:bg-gray-300 dark:hover:bg-slate-600 transition';
            siteBtn.addEventListener('click', () => {
                addressBar.value = site.url;
                navigate();
            });
            suggestedSitesContainer.appendChild(siteBtn);
        });

        goBtn.addEventListener('click', navigate);
        addressBar.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') navigate();
        });


        // --- Animated Skills & About Me Bars ---
        const revealElements = document.querySelectorAll('.reveal-on-scroll, .skill');
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (entry.target.classList.contains('skill')) {
                        entry.target.querySelector('.skill-bar').style.width = entry.target.getAttribute('data-level') + '%';
                    } else {
                        entry.target.classList.add('visible');
                    }
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        revealElements.forEach(el => revealObserver.observe(el));
    });