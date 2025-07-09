const gameContainer = document.getElementById('game-container');
const player = document.getElementById('player');
const scoreDisplay = document.getElementById('score');
const gameOverMessage = document.getElementById('game-over-message');
const restartButton = document.getElementById('restart-button');

let score = 0;
let playerX = gameContainer.offsetWidth / 2 - player.offsetWidth / 2;
let playerY = gameContainer.offsetHeight - player.offsetHeight - 20;
const playerSpeed = 10; // キーボード操作時の移動速度
let appleFallSpeed = 2; // リンゴの初期落下速度
let maxApples = 1; // 画面上の最大リンゴ数
let gameInterval;
let appleGenerationInterval;
let isGameOver = false;

// プレイヤーの初期位置設定
player.style.left = playerX + 'px';
player.style.top = playerY + 'px';

// ゲーム開始/リスタート処理
function startGame() {
    score = 0;
    appleFallSpeed = 2;
    maxApples = 1;
    isGameOver = false;
    scoreDisplay.textContent = 'スコア: 0';
    gameOverMessage.classList.add('hidden');
    restartButton.classList.add('hidden');
    
    // 既存のリンゴをすべて削除
    document.querySelectorAll('.apple').forEach(apple => apple.remove());

    // ゲームループとリンゴ生成を開始
    gameInterval = setInterval(gameLoop, 20); // 20msごとに更新
    appleGenerationInterval = setInterval(generateApple, 1500); // 初期リンゴ生成間隔
}

// リンゴの生成
function generateApple() {
    if (isGameOver) return;
    
    const currentApples = document.querySelectorAll('.apple').length;
    if (currentApples < maxApples) {
        const apple = document.createElement('div');
        apple.classList.add('apple');
        apple.style.left = Math.random() * (gameContainer.offsetWidth - 30) + 'px';
        apple.style.top = '-30px'; // 画面外から開始
        gameContainer.appendChild(apple);
    }
}

// ゲームループ
function gameLoop() {
    if (isGameOver) return;

    // リンゴの落下と衝突判定
    document.querySelectorAll('.apple').forEach(apple => {
        let appleTop = parseFloat(apple.style.top);
        apple.style.top = appleTop + appleFallSpeed + 'px';

        // 画面下部に到達したら削除してスコア加算
        if (appleTop > gameContainer.offsetHeight) {
            apple.remove();
            score++;
            scoreDisplay.textContent = 'スコア: ' + score;
            updateDifficulty();
        }

        // プレイヤーとリンゴの衝突判定
        if (
            appleTop + apple.offsetHeight >= playerY &&
            appleTop <= playerY + player.offsetHeight &&
            parseFloat(apple.style.left) + apple.offsetWidth >= playerX &&
            parseFloat(apple.style.left) <= playerX + player.offsetWidth
        ) {
            endGame();
        }
    });
}

// 難易度調整
function updateDifficulty() {
    if (score % 1 === 0 && score > 0) { // スコアが1上がるたび
        appleFallSpeed *= 1.05;
        maxApples = Math.ceil(maxApples * 1.05); // リンゴの個数を増やす
        // リンゴ生成間隔も調整する（速くする）
        clearInterval(appleGenerationInterval);
        appleGenerationInterval = setInterval(generateApple, Math.max(500, 1500 / (appleFallSpeed / 2))); // 最低500ms
    }
}

// ゲームオーバー処理
function endGame() {
    isGameOver = true;
    clearInterval(gameInterval);
    clearInterval(appleGenerationInterval);
    gameOverMessage.textContent = 'こんな簡単なこともできないの？';
    gameOverMessage.classList.remove('hidden');
    restartButton.classList.remove('hidden');
}

// キーボード操作
document.addEventListener('keydown', (e) => {
    if (isGameOver) return;
    if (e.key === 'ArrowLeft' || e.key === 'a') {
        playerX = Math.max(0, playerX - playerSpeed);
    } else if (e.key === 'ArrowRight' || e.key === 'd') {
        playerX = Math.min(gameContainer.offsetWidth - player.offsetWidth, playerX + playerSpeed);
    }
    player.style.left = playerX + 'px';
});

// スマートフォンでのドラッグ操作
let isDragging = false;
let touchStartX;
let playerStartX;

player.addEventListener('touchstart', (e) => {
    if (isGameOver) return;
    isDragging = true;
    touchStartX = e.touches[0].clientX;
    playerStartX = playerX;
    player.style.cursor = 'grabbing';
});

document.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const touchCurrentX = e.touches[0].clientX;
    const deltaX = touchCurrentX - touchStartX;
    playerX = Math.max(0, Math.min(gameContainer.offsetWidth - player.offsetWidth, playerStartX + deltaX));
    player.style.left = playerX + 'px';
});

document.addEventListener('touchend', () => {
    isDragging = false;
    player.style.cursor = 'grab';
});

// PCでのマウスドラッグ操作
player.addEventListener('mousedown', (e) => {
    if (isGameOver) return;
    isDragging = true;
    touchStartX = e.clientX;
    playerStartX = playerX;
    player.style.cursor = 'grabbing';
});

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const mouseCurrentX = e.clientX;
    const deltaX = mouseCurrentX - touchStartX;
    playerX = Math.max(0, Math.min(gameContainer.offsetWidth - player.offsetWidth, playerStartX + deltaX));
    player.style.left = playerX + 'px';
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    player.style.cursor = 'grab';
});

// リスタートボタンのイベントリスナー
restartButton.addEventListener('click', startGame);

// ゲーム開始
startGame();
