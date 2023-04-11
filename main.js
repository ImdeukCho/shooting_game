//캔버스 세팅
let canvas;
let ctx;
canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 700;
document.body.appendChild(canvas);

let backgroundImage, spaceshipImage, bulletImage, enemyImage, gameOverImage;
let gameOver = false; // true이면 게임 종료, false이면 게임 진행
let score = 0;

//  우주선 좌표
let spaceshipX = canvas.width / 2 - 32;
let spaceshipY = canvas.height - 64;

// 총알 함수
let bulletList = []; // 총알들을 저장하는 리스트
function Bullet() {
  this.x = 0;
  this.y = 0;
  this.init = function () {
    this.x = spaceshipX + 16;
    this.y = spaceshipY;
    this.alive = true; // true면 살아있는 총알, false면 죽은 총알
    bulletList.push(this);
  };

  // 총알 발사
  this.update = function () {
    this.y -= 7;
  };

  // 총알.y <= 적군.y And
  // 총알.x >= 적군.x and
  // 총알.x <= 적군.x + 적군의 넓이
  this.checkHit = function () {
    for (let i = 0; i < enemyList.length; i++) {
      if (
        this.y <= enemyList[i].y &&
        this.x >= enemyList[i].x &&
        this.x <= enemyList[i].x + 64
      ) {
        // 총알이 죽게됨, 적군의 우주선이 없어짐, 점수획득
        score++;
        this.alive = false; // 죽은 총알
        enemyList.splice(i, 1); // i번째 우주선 하나를 짤라냄
      }
    }
  };
}

// 적군 우주선
let enemyList = [];
function Enemy() {
  this.x = 0;
  this.y = 0;
  this.init = function () {
    this.x = generateRandomValue(0, canvas.width - 64);
    this.y = 0;

    enemyList.push(this);
  };

  // 적군 내려옴
  this.update = function () {
    this.y += 3; // 적군의 속도 조절

    if (this.y >= canvas.height - 64) {
      gameOver = true;
      console.log("gameover");
    }
  };
}

function generateRandomValue(min, max) {
  let randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomNum;
}

function loadImage() {
  backgroundImage = new Image();
  backgroundImage.src = "images/background.jpg";

  spaceshipImage = new Image();
  spaceshipImage.src = "images/spaceship.png";

  bulletImage = new Image();
  bulletImage.src = "images/bullet.png";

  enemyImage = new Image();
  enemyImage.src = "images/enemy.png";

  gameOverImage = new Image();
  gameOverImage.src = "images/gameover.png";
}

let keysDown = {};
function setupkeyboardListener() {
  document.addEventListener("keydown", function (event) {
    // console.log("무슨 키가 눌렸어?",event.keyCode);
    keysDown[event.keyCode] = true;
    // console.log("키다운객체에 들어간 값은?", keysDown);
  });
  document.addEventListener("keyup", function () {
    delete keysDown[event.keyCode];
    // console.log("버튼 클릭후", keysDown);

    if (event.keyCode == 32) {
      createBullet(); // 총알 생성
    }
  });
}

function createBullet() {
  // console.log("총알 생성");
  let b = new Bullet(); // 총알 하나 생성
  b.init();
  // console.log("새로운 총알 리스트", bulletList);
}

function createEnemy() {
  const interval = setInterval(function () {
    let e = new Enemy();
    e.init();
  }, 1000);
}

function update() {
  if (39 in keysDown) {
    spaceshipX += 5; // 우주선의 속도
  } // right
  if (37 in keysDown) {
    spaceshipX -= 5; // 우주선의 속도
  } // reft

  // 우주선의 좌표값이 무한대로 업데이트가 되는거 limit
  // reft limit
  if (spaceshipX <= 0) {
    spaceshipX = 0;
  }
  // right limit
  if (spaceshipX >= canvas.width - 64) {
    spaceshipX = canvas.width - 64;
  }

  // 우주선 위아래 이동
  // up
  if (38 in keysDown) {
    spaceshipY -= 5;
  }
  // down
  if (40 in keysDown) {
    spaceshipY += 5;
  }

  // up limit
  if (spaceshipY <= 0) {
    spaceshipY = 0;
  }
  // down limit
  if (spaceshipY >= canvas.height - 64) {
    spaceshipY = canvas.height - 64;
  }

  // 총알의 y좌표 업데이트하는 함수 호출
  for (let i = 0; i < bulletList.length; i++) {
    if (bulletList[i].alive) {
      bulletList[i].update();
      bulletList[i].checkHit();
    }
  }

  // 적군의 y좌표 업데이트하는 함수 호출
  for (let i = 0; i < enemyList.length; i++) {
    enemyList[i].update();
  }
}

function render() {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(spaceshipImage, spaceshipX, spaceshipY);
  ctx.fillText(`Score: ${score}`, 20, 20);
  ctx.fillStyle = "White";
  ctx.font = "20px Arial";

  for (let i = 0; i < bulletList.length; i++) {
    if (bulletList[i].alive) {
      ctx.drawImage(bulletImage, bulletList[i].x, bulletList[i].y);
    }
  }

  for (let i = 0; i < enemyList.length; i++) {
    ctx.drawImage(enemyImage, enemyList[i].x, enemyList[i].y);
  }
}

function main() {
  if (!gameOver) {
    update(); // 좌표값을 업데이트하고
    render(); // 그려주고
    // console.log("animation calls main function");
    requestAnimationFrame(main);
  } else {
    ctx.drawImage(gameOverImage, 10, 100, 380, 380); // 위치x,y,높이,넓이
  }
}

loadImage();
setupkeyboardListener();
createEnemy();
main();

// 방향키를 누르면
// 우주선의 xy좌표가 바뀌고
// 다시 render 그려준다

// 총알 만들기
// 1. 스페이스바를 누르면 총알 발사
// 2. 총알이 발사 = 총알의 y값이 --, 총알의 x값은? 스페이슬 누른 순간의 우전선의 x좌표
// 3. 발사된 총알들은 총알 배열에 저장을 한다.
// 4. 총알들은 x,y 좌표값이 있어야 한다.
// 5. 총알 배열을 가지고 render 그려준다.

// 적군 만들기
// 1. x,y, init, update
// 2. 적군은 위치가 랜덤하다.
// 3. 적군은 밑으로 내려온다.
// 4. 1초마다 하나씩 적군이 나온다.
// 5. 적군의 우주선이 바닥에 닿으면 게임 오버.
// 6. 적군과 총알이 만나면 우주선이 사라진다. 1점 획득
