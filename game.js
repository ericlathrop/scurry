var canvas = document.getElementById('game');
var context = canvas.getContext("2d");

var lastTimestamp = -1;
function mainLoop(timestamp) {
	if (lastTimestamp === -1) {
		lastTimestamp = timestamp;
	}
	var timeDiff = timestamp - lastTimestamp;
	lastTimestamp = timestamp;

	simulation(timeDiff);
	draw();

	window.requestAnimationFrame(mainLoop);
}
window.requestAnimationFrame(mainLoop);

var player = { x: 50, y: 50, width: 50, height: 50, xaccel: 70, yaccel: 0 };

function getRandomArbitrary(min, max) {
	return Math.random() * (max - min) + min;
}

var buildings = [];

function moveBuildings(elapsedSec) {
	for (var i in buildings) {
		var building = buildings[i];
		building.x -= elapsedSec * player.xaccel;
	}
	// delete invisible buildings off the left edge
	while (buildings.length > 0 && buildings[0].x + buildings[0].width < 0) {
		buildings.shift();
	}
	// add new buildings on the right edge
	while (buildings.length == 0 || buildings[buildings.length - 1].x + buildings[buildings.length - 1].width < canvas.width) {
		var x = 0;
		if (buildings.length > 0) {
			var last = buildings[buildings.length - 1];
			x = last.x + last.width + getRandomArbitrary(x + 100, x + 400);
		}
		buildings.push({ x: x, y: getRandomArbitrary(200, 400), width: getRandomArbitrary(300, 700) });
	}
}

moveBuildings(0);
player.y = buildings[0].y - player.height;

function simulation(timeDiffMillis) {
	//var fps = 1000 / timeDiffMillis;
	var elapsedSec = timeDiffMillis / 100;

	moveBuildings(elapsedSec);

	if (keys["left"]) {
		player.x -= elapsedSec * 70;
	}
	if (keys["right"]) {
		player.x += elapsedSec * 70;
	}
	var gravityAccel = 50;
	player.yaccel += elapsedSec * gravityAccel;
	player.y += elapsedSec * player.yaccel;

	if (player.y > canvas.height) {
		player.xaccel = 0;
	}

	var onGround = false;
	for (var i in buildings) {
		var building = buildings[i];
		if (player.x + player.width > building.x && player.x < building.x + building.width) {
			if (player.y + player.height > building.y) {
				player.y = building.y - player.height;
				player.yaccel = 0;
				onGround = true;
			}
		}

	}

	if (keys["space"] && onGround) {
		player.yaccel = -150;
	}

}

function draw() {
	context.fillStyle = "#87ceeb";
	context.fillRect(0, 0, canvas.width, canvas.height);

	context.fillStyle = "#00ff00";
	context.fillRect(0, 450, canvas.width, 30);

	for (var i in buildings) {
		var building = buildings[i];
		context.fillStyle = "#666666";
		context.fillRect(building.x, building.y, building.width, canvas.height - building.y);
	}

	context.fillStyle = "#ff0000";
	context.fillRect(player.x, player.y, player.width, player.height);
}

var keys = {};
var keyMap = { 
	32: "space",
	37: "left", 
	38: "up",
	39: "right",
	40: "down"
};
for (var kc in keyMap) {
	keys[keyMap[kc]] = false;
}
window.onkeydown = function(event) {
	// console.log("keydown " + event.keyCode);
	if (keyMap.hasOwnProperty(event.keyCode)) {
		keys[keyMap[event.keyCode]] = true;
	}
}
window.onkeyup = function(event) {
	// console.log("keyup " + event.keyCode);
	if (keyMap.hasOwnProperty(event.keyCode)) {
		keys[keyMap[event.keyCode]] = false;
	}
}
