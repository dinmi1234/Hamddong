const player = document.getElementById('player');
const gameContainer = document.getElementById('game-container');
const scoreDisplay = document.getElementById('score');
let score = 0;
const initialDungSpeed = 5; // 초기 똥 속도
const maxDungSpeed = initialDungSpeed * 5; // 최대 똥 속도 (초기 속도의 5배)
const initialDungCount = 1; // 초기 똥 개수
const maxDungCount = 30; // 최대 똥 개수
let dungSpeed = initialDungSpeed;
let dungCount = initialDungCount;
let dungIntervalTime = 1000; // 초기 똥 생성 간격
const maxScore = 500; // 만점
let dungInterval;
const playerSpeed = 10;

// 플레이어 초기 위치 설정
let playerPosition = window.innerWidth / 2;

// 플레이어의 위치를 좌우로 이동시키는 함수
document.addEventListener('keydown', function(event) {
    const key = event.key;

    if (key === 'ArrowLeft' && playerPosition > 0) {
        playerPosition -= playerSpeed;
        player.style.left = playerPosition + 'px';
    }
    if (key === 'ArrowRight' && playerPosition < window.innerWidth - 50) {
        playerPosition += playerSpeed;
        player.style.left = playerPosition + 'px';
    }
});

// 똥을 생성하는 함수
function createDung() {
    // 현재 화면에 있는 똥의 개수를 확인
    const currentDungCount = document.getElementsByClassName('dung').length;

    // 똥의 개수가 최대치에 도달하지 않은 경우에만 생성
    if (currentDungCount < maxDungCount) {
        for (let i = 0; i < dungCount; i++) {
            if (currentDungCount + i >= maxDungCount) break; // 최대치 넘지 않도록 체크

            const dung = document.createElement('div');
            dung.classList.add('dung');

            // 첫 번째 똥은 플레이어 위치로, 나머지는 랜덤 위치로 떨어짐
            if (i === 0) {
                dung.style.left = playerPosition + 'px';
            } else {
                dung.style.left = Math.random() * (window.innerWidth - 30) + 'px';
            }

            gameContainer.appendChild(dung);

            let dungFallInterval = setInterval(function() {
                const dungRect = dung.getBoundingClientRect();
                const playerRect = player.getBoundingClientRect();

                // 똥과 플레이어의 충돌 감지
                if (dungRect.bottom >= playerRect.top && 
                    dungRect.left < playerRect.right && 
                    dungRect.right > playerRect.left) {
                    clearInterval(dungFallInterval);
                    clearInterval(dungInterval);
                    alert('Game Over! Your score is: ' + score);
                    window.location.reload();
                }

                // 똥이 화면 하단에 도달한 경우 점수 증가
                if (dungRect.top > window.innerHeight) {
                    clearInterval(dungFallInterval);
                    dung.remove();
                    score++;
                    scoreDisplay.textContent = 'Score: ' + score;

                    // 점수가 100점 단위로 올라갈 때마다 초기 상태로 복귀
                    if (score % 100 === 0) {
                        dungCount = initialDungCount;
                        dungSpeed = initialDungSpeed;
                        dungIntervalTime = 1000;
                        clearInterval(dungInterval); // 기존 인터벌 클리어
                        dungInterval = setInterval(createDung, dungIntervalTime); // 새 인터벌로 시작
                    }

                    // 스코어에 따라 똥 속도와 생성 간격 조절
                    if (score % 10 === 0) {
                        if (dungSpeed < maxDungSpeed) {
                            dungSpeed += 1; // 속도 증가 (최대 5배까지)
                        }
                        dungCount = Math.min(dungCount + 2, maxDungCount); // 똥 개수 증가 (최대 30개까지)
                        dungIntervalTime = Math.max(dungIntervalTime - 100, 100); // 똥 생성 간격 단축
                        clearInterval(dungInterval); // 기존 인터벌 클리어
                        dungInterval = setInterval(createDung, dungIntervalTime); // 새 인터벌로 시작
                    }

                    // 만점 도달 시 게임 종료
                    if (score >= maxScore) {
                        clearInterval(dungFallInterval);
                        clearInterval(dungInterval);
                        alert('CONGLATURATION! You reached the maximum score!');
                        window.location.reload();
                    }
                } else {
                    dung.style.top = dungRect.top + dungSpeed + 'px';
                }
            }, 20);
        }
    }
}

// 게임 시작 함수
function startGame() {
    dungInterval = setInterval(createDung, dungIntervalTime);
}

// 마우스 클릭 시 추가 똥 생성
gameContainer.addEventListener('click', function() {
    createDung();
});

startGame();
