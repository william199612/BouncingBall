const c = document.getElementById('myCanvas');
const canvasHeight = c.height;
const canvasWidth = c.width;
const ctx = c.getContext('2d');

// set circle params
let circleX = 160;
let circleY = 60;
let radius = 20;
let xSpeed = 15;
let ySpeed = 15;

// set floor bar params
let floorX = 400;
let floorY = 500;
let floorLength = 200;
let floorHeight = 5;

// set brick params
let brickArray = [];
let count = 0;

// get random 10-fold int btwn 100 - 500
function getRandomTenFold(min, max) {
  return min + Math.floor(Math.random() * (max - min));
}

// set brick class
class Brick {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    brickArray.push(this);
    this.visible = true;
  }

  drawBrick() {
    ctx.fillStyle = 'lightgreen';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  touchBall(ballX, ballY) {
    return (
      ballX >= this.x - radius &&
      ballX <= this.x + this.width + radius &&
      ballY <= this.y + this.height + radius &&
      ballY >= this.y - radius
    );
  }
}

// initial brick
// let brick1 = new Brick(100, 100);
for (let i = 0; i < 10; i++) {
  new Brick(
    getRandomTenFold(0, 950),
    getRandomTenFold(0, 550)
  );
}

// set mouse eventListener
c.addEventListener('mousemove', (e) => {
  // console.log(e); -> e.clientX (mouse X-axis)
  floorX = e.clientX;
});

function drawCircle() {
  // check brick touch
  brickArray.forEach((brick) => {
    if (
      brick.visible == true &&
      brick.touchBall(circleX, circleY)
    ) {
      // total touch count
      count++;

      // brick visible
      brick.visible = false;

      // change x, y speed and delete from array
      // touch from bottom
      if (circleY >= brick.y + brick.height) {
        ySpeed *= -1;
      }
      // touch from top
      else if (circleY <= brick.y) {
        ySpeed *= -1;
      }
      // touch from left
      else if (circleX <= brick.x) {
        xSpeed *= -1;
      }
      // touch from right
      else if (circleX >= brick.x + brick.height) {
        xSpeed *= -1;
      }

      // brickArray.splice(index, 1);
      // if (brickArray.length == 0) {
      //   alert('Game Over...');
      //   clearInterval(game);
      // }
      if (count == 10) {
        alert('Game Over...');
        clearInterval(game);
      }
    }
  });

  // check floor touch
  if (
    circleX + radius >= floorX &&
    circleY - radius <= floorX + floorLength &&
    circleY + radius >= floorY &&
    circleY - radius <= floorY
  ) {
    if (ySpeed > 0) {
      circleY -= 40;
    } else {
      circleY += 40;
    }
    ySpeed *= -1;
  }

  // check wall touch
  // right wall
  if (circleX + radius >= canvasWidth) {
    xSpeed *= -1;
  }
  // left wall
  if (circleX <= radius) {
    xSpeed *= -1;
  }
  // bottom wall
  if (circleY + radius >= canvasHeight) {
    ySpeed *= -1;
  }
  // top wall
  if (circleY <= radius) {
    ySpeed *= -1;
  }

  // update circle location
  circleX += xSpeed;
  circleY += ySpeed;

  // draw black background
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // draw all bricks if visible
  brickArray.forEach((brick) => {
    if (brick.visible == true) {
      brick.drawBrick();
    }
  });

  // draw floor bar
  ctx.fillStyle = 'orange';
  ctx.fillRect(floorX, floorY, floorLength, floorHeight);

  // draw circle
  ctx.beginPath();
  // x, y, radius, startAngle, endAngle
  ctx.arc(circleX, circleY, radius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fillStyle = 'yellow';
  ctx.fill();
}

let game = setInterval(drawCircle, 25);
