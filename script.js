function Ball(x, y, width, parentElem, color) {
	this.x = x;
	this.y = y;
	this.width = this.height = width;
	this.element = null;
	this.color = color;
	this.speed = getRandomInt(1, 6);
	this.dx = getRandomInt(-1, 2) * this.speed;
	this.dy = getRandomInt(-1, 2) * this.speed;
	this.parentElement = parentElem;

	this.init = function () {
		this.element = document.createElement('div');
		this.element.className = 'ball';
		this.element.style.position = 'absolute';
		this.parentElement.appendChild(this.element);
		return this;
	}
	this.move = function () {
		this.x += this.dx;
		this.y += this.dy;
	}
	this.draw = function () {
		this.element.style.width = this.element.style.height = this.width + 'px';
		this.element.style.borderRadius = '50%';
		this.element.style.background = this.color;
		this.element.style.top = this.y + 'px';
		this.element.style.left = this.x + 'px';
	}
	this.setPosition = function (x, y) {
		this.x = x;
		this.y = y;
	}
}
var GAME_FRAME_RATE = 20;

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomColor() {
	var red = getRandomInt(0, 255);
	var green = getRandomInt(0, 255);
	var blue = getRandomInt(0, 255);
	return 'rgb(' + red + ',' + green + ',' + blue + ')';
}

function borderCollision(ball) {
	if (ball.x >= 800 - ball.width) {
		ball.x = 800 - ball.width;
		ball.dx *= -1;
		ball.color = getRandomColor();
	} else if (ball.x <= 0) {
		ball.x = 0;
		ball.dx *= -1;
		ball.color = getRandomColor();
	}

	if (ball.y >= 500 - ball.width) {
		ball.y = 500 - ball.width;
		ball.dy *= -1;
		ball.color = getRandomColor();
	} else if (ball.y <= 0) {
		ball.y = 0;
		ball.dy *= -1;
		ball.color = getRandomColor();
	}
}

function isOverlap(firstBall, secondBall) {
	// console.log('Overlap!!!!');
	if (firstBall.x + firstBall.width > secondBall.x && firstBall.x < secondBall.x + secondBall.width && firstBall.y + firstBall.width > secondBall.y && firstBall.y < secondBall.y + secondBall.width) {
		return true;
	} else {
		return false;
	}
}

function fixOverlap(firstBall, secondBall) {
	var dist, notOverlapped, overlapped;
	var dx = (firstBall.x + firstBall.width / 2) - (secondBall.x + secondBall.width / 2);
	var dy = (firstBall.y + firstBall.width / 2) - (secondBall.y + secondBall.width / 2);
	dist = Math.sqrt(dx * dx + dy * dy);
	notOverlapped = dist - secondBall.width / 2;
	overlapped = firstBall.width / 2 - notOverlapped;
	if (firstBall.x < secondBall.x) {
		firstBall.x = firstBall.x - overlapped / 2;
		secondBall.x = secondBall.x + overlapped / 2;
	} else {
		firstBall.x = firstBall.x + overlapped / 2;
		secondBall.x = secondBall.x - overlapped / 2;
	}
	if (firstBall.y < secondBall.y) {
		firstBall.y = firstBall.y - overlapped / 2;
		secondBall.y = secondBall.y + overlapped / 2;
	} else {
		firstBall.y = firstBall.y + overlapped / 2;
		secondBall.y = secondBall.y - overlapped / 2;
	}
}

function isCollision(ball1, ball2) {
	var ball1Radius = ball1.width / 2;
	var ball2Radius = ball2.width / 2;
	var ball1CenterX = ball1.x + ball1Radius;
	var ball1CenterY = ball1.y + ball1Radius;
	var ball2CenterX = ball2.x + ball2Radius;
	var ball2CenterY = ball2.y + ball2Radius;
	var dx = ball1CenterX - ball2CenterX;
	var dy = ball1CenterY - ball2CenterY;
	var distance = Math.sqrt(dx * dx + dy * dy);
	// console.log('Distance: '+distance);
	return distance - ball1Radius - ball2Radius <= 0.0000001;
}

function ballCollision(ball1, ball2) {
	if (isCollision(ball1, ball2)) {
		var tempX, tempY;
		tempX = ball1.dx;
		tempY = ball1.dy;
		ball1.dx = ball2.dx;
		ball1.dy = ball2.dy;
		ball2.dx = tempX;
		ball2.dy = tempY;
		ball1.color = getRandomColor();
		ball2.color = getRandomColor();
		fixOverlap(ball1, ball2);
	}
}

function Game(parentElement) {
	var balls = [];
	var ballCount = 50;
	this.parentElement = parentElement;
	this.init = function () {
		// console.log('init', this.parentElement);
		for (var i = 0; i < ballCount; i++) {
			var width = getRandomInt(6, 51);
			// console.log('Width: ' + width);
			var positionX = getRandomInt(0, 800 - width);
			var positionY = getRandomInt(0, 500 - width);
			var newBall = new Ball(positionX, positionY, width, this.parentElement, getRandomColor());
			if (balls.length != 0) {
				for (var x = 0; x < balls.length; x++) {
					var existingBall = balls[x];
					if (isOverlap(newBall, existingBall)) {
						width = getRandomInt(6, 51);
						// width = getRandomInt(100, 200);
						// console.log('Width: ' + width);
						positionX = getRandomInt(0, 800 - width);
						positionY = getRandomInt(0, 600 - width);
						newBall = new Ball(positionX, positionY, width, this.parentElement, getRandomColor());
						x = -1;
					}
				}
				newBall.init();
				newBall.setPosition(positionX, positionY);
				newBall.draw();
				balls.push(newBall);
			} else {
				newBall.init();
				newBall.setPosition(positionX, positionY);
				newBall.draw();
				balls.push(newBall);
			}
		}
		this.parentElement.addEventListener('click', function (e) {
			if (e.target.className === 'ball') {
				parentElement.removeChild(e.target);
				var index = -1;
				for (var k = 0; k < balls.length; k++) {
					if (balls[k].element === e.target) {
						index = k;
					}
				}
				if (index > -1) {
					balls.splice(index, 1);
				}
				// console.log(balls);
			}
		})
		setInterval(this.start.bind(this), GAME_FRAME_RATE);
	}
	this.start = function () {
		balls.forEach(function (ball, index) {
			ball.draw();
			ball.move();
			borderCollision(ball);
			balls.forEach(function (ballAnother, indexAnother) {
				if (index === indexAnother) {
					return;
				}
				ballCollision(ball, ballAnother);
			});
		})
	}
}
new Game(app).init();
// console.log('Total balls: '+wrapper.childElementCount);