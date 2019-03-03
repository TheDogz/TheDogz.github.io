var time = 0;
var flagsLeft = userBombTotal;
var incTimer, gridHeight, gridWidth, userBombTotal, gridType;
var firstClick = true;
var unopenedSquare = "<img src='uncovered.png' alt='?' height='30px'";
var openedSquare = [
	"<img src='s0.png' alt='0' height='30px'>", "<img src='s1.png' alt='1' height='30px'>", "<img src='s2.png' alt='2' height='30px'>", 
	"<img src='s3.png' alt='3' height='30px'>", "<img src='s4.png' alt='4' height='30px'>", "<img src='s5.png' alt='5' height='30px'>", 
	"<img src='s6.png' alt='6' height='30px'>", "<img src='s7.png' alt='7' height='30px'>", "<img src='s8.png' alt='8' height='30px'>"
]
var bombSquare = "<img src='boom.png' alt='B' height='30px'>";
var flagSquare = "<img src='flagged.png' alt='&Delta;' height='30px'";
var valueArray = [];
var bestTimes = {
	easy: 359999.9,
	med: 359999.9,
	hard: 359999.9
}

if (JSON.parse(localStorage.getItem("minesweeperSaveTimes")) !== null) {loadTimes();}
startSpecificGame(30, 16, 99, 'hard');

function saveTimes() {
	var save = {
		e: bestTimes.easy,
		m: bestTimes.med,
		h: bestTimes.hard,
	}
	localStorage.setItem("minesweeperSaveTimes",JSON.stringify(save));
}

function loadTimes() {
	var savegame = JSON.parse(localStorage.getItem("minesweeperSaveTimes"));
	if (typeof savegame.e !== "undefined") bestTimes.easy = savegame.e;
	if (typeof savegame.m !== "undefined") bestTimes.med = savegame.m;
	if (typeof savegame.h !== "undefined") bestTimes.hard = savegame.h;
	
	document.getElementById('beginnerBest').innerHTML = convertTime(bestTimes.easy);
	document.getElementById('intermediateBest').innerHTML = convertTime(bestTimes.med);
	document.getElementById('expertBest').innerHTML = convertTime(bestTimes.hard);
}

function resetTimes() {
	if (confirm("Erase? This can't be undone.")) {
		localStorage.removeItem("minesweeperSaveTimes")
		bestTimes.easy = 359999.9;
		bestTimes.med = 359999.9;
		bestTimes.hard = 359999.9;
		saveTimes();
		document.getElementById('beginnerBest').innerHTML = convertTime(bestTimes.easy);
		document.getElementById('intermediateBest').innerHTML = convertTime(bestTimes.med);
		document.getElementById('expertBest').innerHTML = convertTime(bestTimes.hard);
	}
}

function startGame() {
	time = 0;
	clearInterval(incTimer);
	gridType = 'none'
	document.getElementById('timer').innerHTML = convertTime(time);
	document.getElementById("winlose").innerHTML = "<span class='playing'>Don't hit a bomb!</span>"
	firstClick = true;
	gridWidth = document.getElementById("width").value;
	gridHeight = document.getElementById("height").value;
	userBombTotal = document.getElementById("mineCount").value;
	flagsLeft = userBombTotal;
	if (gridWidth > 1 && gridHeight > 1 && userBombTotal > 0 && userBombTotal < gridWidth * gridHeight) {
		document.getElementById('bombs').innerHTML = flagsLeft + " Bombs Remaining";
		document.getElementById('grid').innerHTML = drawGrid(gridWidth, gridHeight);
	} else {
		alert("Error: bad values");
	}
}

function startSpecificGame(width, height, bombs, type) {
	time = 0;
	clearInterval(incTimer);
	gridType = type;
	document.getElementById('timer').innerHTML = convertTime(time);
	document.getElementById("winlose").innerHTML = "<span class='playing'>Don't hit a bomb!</span>"
	firstClick = true;
	gridWidth = width;
	gridHeight = height;
	userBombTotal = bombs;
	flagsLeft = userBombTotal;
	if (gridWidth > 1 && gridHeight > 1 && userBombTotal > 0 && userBombTotal < gridWidth * gridHeight) {
		document.getElementById('bombs').innerHTML = flagsLeft + " Bombs Remaining";
		document.getElementById('grid').innerHTML = drawGrid(gridWidth, gridHeight);
	} else {
		alert("Error: bad values");
	}
}

function drawGrid(width, height) {
	var table = "<table class='grid'><tr>";
	var tableSection;
	for (var j = 0; j < height; j++) {
		table = table + "</tr><tr>"
		for (var i = 0; i < width; i++) {
			tableSection = "<td id='sq" + i + "-" + j + "'>" + unopenedSquare + " oncontextmenu='toggleFlag(" + i + ", " + j + ")'" + " onclick='openSquare(" + i + ", " + j + ")'" + "></td>"
			table = table + tableSection
		}
	}
	table = table + "</tr></table>"
	openArray = generateOpenArray();
	flagArray = generateOpenArray();
	gridArray = generateArray();
	document.getElementById('bombPercent').innerHTML = convert2dp(userBombTotal / (gridHeight * gridWidth) * 100) + "% Bombs";
	return table;
}

function randomArrayPosOrder(x, y) {
	let array = [];
	let startSquare = toNumber(x, y)
	//generate array
	for (var k = 0; k < gridWidth * gridHeight; k++) {
		array.push(k);
	}
	
	if (y !== undefined && userBombTotal <= gridHeight*gridWidth-9) {
		if (startSquare == 0) {
			//top left (working)
			array.splice(toNumber(x+1, y), 2); //fi
			array.splice(toNumber(x, y), 2); //eh
		} else if (startSquare == gridHeight * gridWidth - gridWidth) {
			//top right (working)
			array.splice(toNumber(x, y), 2); //eh
			array.splice(toNumber(x-1, y), 2); //dg
		} else if (startSquare == gridWidth-1) {
			//bottom left (working)
			array.splice(toNumber(x+1, y-1), 2); //cf
			array.splice(toNumber(x, y-1), 2); //be
		} else if (startSquare == gridHeight * gridWidth - 1) {
			//bottom right (working)
			array.splice(toNumber(x, y-1), 2); //be
			array.splice(toNumber(x-1, y-1), 2); //ad
		} else if (startSquare % gridWidth == 0) {
			//top (working)
			array.splice(toNumber(x+1, y), 2); //fi
			array.splice(toNumber(x, y), 2); //eh
			array.splice(toNumber(x-1, y), 2); //dg
		} else if (startSquare <= gridWidth - 1) {
			//left
			array.splice(toNumber(x+1, y-1), 3); //beh
			array.splice(toNumber(x, y-1), 3); //adg
		} else if (startSquare >= gridHeight * (gridWidth - 1)) {
			//right
			array.splice(toNumber(x, y-1), 3); //cfi
			array.splice(toNumber(x-1, y-1), 3); //beh
		} else if (startSquare % gridWidth == gridWidth - 1) {
			//bottom (working)
			array.splice(toNumber(x+1, y-1), 2); //cf
			array.splice(toNumber(x, y-1), 2); //be
			array.splice(toNumber(x-1, y-1), 2); //ad
		} else {
			array.splice(toNumber(x+1, y-1), 3); //cfi
			array.splice(toNumber(x, y-1), 3); //beh
			array.splice(toNumber(x-1, y-1), 3); //adg
		}
	} else if (y !== undefined) {
		array.splice(startSquare, 1);
	}
	//randomise array
	var m = array.length, t, i;
	while (m) {
		i = Math.floor(Math.random() * m--);
		t = array[m];
		array[m] = array[i];
		array[i] = t;
	}
	return array;
}

function toYPos(num) {
	return num % gridHeight;
}

function toXPos(num) {
	return Math.floor(num / gridHeight);
}

function toNumber(num1, num2) {
	return num1 * gridHeight + num2;
}

function setBomb(bombCount) {
	for (var i = 0; i < bombCount; i++) {
		addBomb(toYPos(randomArray[i]), toXPos(randomArray[i]))
	}	
}

function addBomb(yBomb, xBomb) {
	gridArray[yBomb][xBomb] = "B";
	if(checkSquare(yBomb-1, xBomb-1)) {gridArray[yBomb-1][xBomb-1]++;}
	if(checkSquare(yBomb-1, xBomb)) {gridArray[yBomb-1][xBomb]++;}
	if(checkSquare(yBomb-1, xBomb+1)) {gridArray[yBomb-1][xBomb+1]++;}
	
	if(checkSquare(yBomb, xBomb-1)) {gridArray[yBomb][xBomb-1]++;}
	if(checkSquare(yBomb, xBomb+1)) {gridArray[yBomb][xBomb+1]++;}
	
	if(checkSquare(yBomb+1, xBomb-1)) {gridArray[yBomb+1][xBomb-1]++;}
	if(checkSquare(yBomb+1, xBomb)) {gridArray[yBomb+1][xBomb]++;}
	if(checkSquare(yBomb+1, xBomb+1)) {gridArray[yBomb+1][xBomb+1]++;}
}
	
function toggleFlag(x, y) {
	let tempId = "sq" + x + "-" + y
	if (flagArray[y][x] == false && openArray[y][x] == false) {
		flagArray[y][x] = true;
		flagsLeft--;
		document.getElementById('bombs').innerHTML = flagsLeft + " Bombs Remaining";
		document.getElementById(tempId).innerHTML = flagSquare + " oncontextmenu='toggleFlag(" + x + ", " + y + ")'" + " onclick='openSquare(" + x + ", " + y + ")'" + ">";
	} else if (flagArray[y][x] && openArray[y][x] == false) {
		flagArray[y][x] = false;
		flagsLeft++;
		document.getElementById('bombs').innerHTML = flagsLeft + " Bombs Remaining";
		document.getElementById(tempId).innerHTML = unopenedSquare + " oncontextmenu='toggleFlag(" + x + ", " + y + ")'" + " onclick='openSquare(" + x + ", " + y + ")'" + ">";
	}
	return false; //prevent context menu from opening when square is flagged
}

function forceToggleFlag(x, y) {
	let tempId = "sq" + x + "-" + y;
	flagArray[y][x] = true;
	flagsLeft--;
	document.getElementById('bombs').innerHTML = flagsLeft + " Bombs Remaining";
	document.getElementById(tempId).innerHTML = flagSquare + ">";
}

function generateArray() {
	let finalArray = [];
	for (var j2 = 0; j2 < gridHeight; j2++) {
		finalArray.push(generateColoumnArray());
	}
	return finalArray;
}

function generateColoumnArray() {
	let coloumnArray = [];
	for (var i2 = 0; i2 < gridWidth; i2++) {
		coloumnArray.push(0);
	}
	return coloumnArray;
}

function generateOpenArray() {
	let finalArray = [];
	for (var j2 = 0; j2 < gridHeight; j2++) {
		finalArray.push(generateOpenColoumnArray());
	}
	return finalArray;
}

function generateOpenColoumnArray() {
	let coloumnArray = [];
	for (var i2 = 0; i2 < gridWidth; i2++) {
		coloumnArray.push(false);
	}
	return coloumnArray;
}

function checkSquare(y, x) {
	if (x >= 0 && y >= 0 && x < gridWidth && y < gridHeight) {
		if (gridArray[y][x] != "B") {
			return true;
		} else {return false;}
	} else {return false;}
}

function checkoSquare(y, x) {
	if (x >= 0 && y >= 0 && x < gridWidth && y < gridHeight && openArray[y][x] == false) {
		if (gridArray[y][x] != "B") {
			return true;
		} else {return false;}
	} else {return false;}
}

function openSquare(x, y) {
	if (firstClick == true) {
		randomArray = randomArrayPosOrder(x, y);
		setBomb(userBombTotal);
		firstClick = false;
		incTimer = setInterval(incTime, 100);
		openSquare(x, y);
	} else {
		let id = "sq" + x + "-" + y
		if (flagArray[y][x] == false) {
			openArray[y][x] = true;
			if (gridArray[y][x] == "B") {
				document.getElementById(id).innerHTML = bombSquare;
				loseGame();
				return;
			} else {
				document.getElementById(id).innerHTML = openedSquare[gridArray[y][x]];	
				checkZeros();
				checkWin();
			}
		}
	}
}

function loseGame() {
	console.log("lose");
	clearInterval(incTimer);
	document.getElementById('sqMin').innerHTML = "<span style='color: #aaaaaa;'>" + convert2dp(calcOpen() / time * 60) + "/min</span>";
	document.getElementById('flagMin').innerHTML = "<span  style='color: #aaaaaa;'>" + convert2dp((userBombTotal - flagsLeft) / time * 60) + "/min</span>";
	document.getElementById("winlose").innerHTML = "<span class='lose'>You blew up!</span>"
	for (var i = 0; i < gridHeight*gridWidth; i++) {
		let tempX = toXPos(i);
		let tempY = toYPos(i);
		if (openArray[tempY][tempX] == false) {
			if (gridArray[tempY][tempX] == "B") {
			document.getElementById("sq" + tempX + "-" + tempY).innerHTML = bombSquare;
			} else {
				if (flagArray[tempY][tempX] == true) {
					toggleFlag(tempX, tempY);
				}
				quickOpen(tempY, tempX);
			}
		}
	}
}

function checkWin() {
	let totalSafe = gridHeight * gridWidth - userBombTotal;
	let safeOpened = 0;
	for (var i = 0; i < gridHeight*gridWidth; i++) {
		let tempX = toXPos(i);
		let tempY = toYPos(i);
		if (openArray[tempY][tempX] == true) {
			safeOpened++
		}
	}
	if (safeOpened >= totalSafe) {
		console.log("win");
		clearInterval(incTimer);
		document.getElementById('sqMin').innerHTML = convert2dp(calcOpen() / time * 60) + "/min";
		document.getElementById("winlose").innerHTML = "<span class='win'>You swept the mines!</span>"
		for (var i = 0; i < gridHeight*gridWidth; i++) {
		let tempX = toXPos(i);
		let tempY = toYPos(i);
		if (openArray[tempY][tempX] == false && flagArray[tempY][tempX] == false) {
			forceToggleFlag(tempX, tempY);
		}
		document.getElementById('flagMin').innerHTML = convert2dp((userBombTotal - flagsLeft) / time * 60) + "/min";
		if (gridType == 'easy' && time < bestTimes.easy) {
			bestTimes.easy = time;
			document.getElementById('beginnerBest').innerHTML = convertTime(bestTimes.easy);
		} else if (gridType == 'med' && time < bestTimes.med) {
			bestTimes.med = time;
			document.getElementById('intermediateBest').innerHTML = convertTime(bestTimes.med);
		} else if (gridType == 'hard' && time < bestTimes.hard) {
			bestTimes.hard = time;
			document.getElementById('expertBest').innerHTML = convertTime(bestTimes.hard);
		}
		saveTimes();
	}
	}
}

function quickOpen(y, x) {
	let tempId = "sq" + x + "-" + y;
	if (flagArray[y][x] == false) {
		document.getElementById(tempId).innerHTML = openedSquare[gridArray[y][x]];
		openArray[y][x] = true;
	}
}

function checkZeros() {
	let zeroFound = false;
	for (var i = 0; i < gridHeight * gridWidth; i++) {
		let x0 = toXPos(i);
		let y0 = toYPos(i);
		if (gridArray[y0][x0] == 0 && openArray[y0][x0] == true) {
			if(checkoSquare(y0-1, x0-1)) {quickOpen(y0-1, x0-1); if(gridArray[y0-1][x0-1] == 0) {zeroFound = true;}}
			if(checkoSquare(y0-1, x0)) {quickOpen(y0-1, x0); if(gridArray[y0-1][x0] == 0) {zeroFound = true;}}
			if(checkoSquare(y0-1, x0+1)) {quickOpen(y0-1, x0+1); if(gridArray[y0-1][x0+1] == 0) {zeroFound = true;}}
			
			if(checkoSquare(y0, x0-1)) {quickOpen(y0, x0-1); if(gridArray[y0][x0-1] == 0) {zeroFound = true;}}
			if(checkoSquare(y0, x0+1)) {quickOpen(y0, x0+1); if(gridArray[y0][x0+1] == 0) {zeroFound = true;}}
			
			if(checkoSquare(y0+1, x0-1)) {quickOpen(y0+1, x0-1); if(gridArray[y0+1][x0-1] == 0) {zeroFound = true;}}
			if(checkoSquare(y0+1, x0)) {quickOpen(y0+1, x0); if(gridArray[y0+1][x0] == 0) {zeroFound = true;}}
			if(checkoSquare(y0+1, x0+1)) {quickOpen(y0+1, x0+1); if(gridArray[y0+1][x0+1] == 0) {zeroFound = true;}}
		}
	}
	
	if (zeroFound) {
		checkZeros();
	}
}
function convertTime(num) {
	let hour = Math.floor(num / 3600);
	let minute = Math.floor((num - hour * 3600) / 60)
	let second = Math.round(num % 60 * 10) / 10;
	
	if (hour < 10) {hour = "0" + hour;}
	if (minute < 10) {minute = "0" + minute;}
	if (second < 10) {second = "0" + second;}
	if (second % 1 == 0) {second = second + ".0"}
	
	return hour + ":" + minute + ":" + second;
}

function convert2dp(num) {
	if (num === Infinity) {
		return "Infinity";
	}
	let tempNum = Math.round(num * 100) / 100;
	if (tempNum % 1 == 0) {
		return tempNum + ".00";
	} else if ((tempNum * 10) % 1 == 0) {
		return tempNum + "0";
	} else {
		return tempNum;
	}
}

function calcOpen() {
	let opened = 0;
	for (var z = 0; z < gridHeight*gridWidth; z++) {
		if (openArray[toYPos(z)][toXPos(z)]) {
			opened++
		}
	}
	return opened;
}

var incTime = function() {
	time += 0.1
	document.getElementById('timer').innerHTML = convertTime(time);
	
	//Update This Game Stats
	document.getElementById('sqMin').innerHTML = convert2dp(calcOpen() / time * 60) + "/min";
	document.getElementById('flagMin').innerHTML = convert2dp((userBombTotal - flagsLeft) / time * 60) + "/min";
	//document.getElementById('flagMin').innerHTML = convert2dp(time);
}