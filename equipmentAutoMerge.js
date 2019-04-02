var itemArray, mythicArray, alphaLevel, iotaLevel;
var stoneProb = [
	[0.9975, 0.9475, 0],[0.9975, 0.9475, 0.0475, 0],[0.9975, 0.9475, 0.0475, 0],[0.9975, 0.9475, 0.0475, 0],[0.9975, 0.9475, 0.0475, 0],
	[0.997, 0.947, 0.037, 0],[0.995, 0.945, 0.035, 0],[0.994, 0.944, 0.034, 0],[0.992, 0.942, 0.032, 0],[0.99, 0.98, 0.94, 0.03, 0]
]

var mythProb = [
	[0], [0.6, 0], [0.8, 0], [0.9, 0], [0.9, 0], 
	[0], [0.05, 0],[0.1, 0.03, 0],[0.14, 0.04, 0],[0.2, 0.05, 0]
]

var mythicNames = [" Alpha I", " Beta I", " Gamma I", " Delta I", " Epsilon I", " Zeta I", " Eta I", " Theta I", " Iota I", " Kappa I"];
var runeNames = [" Luck", " Prosperity", " Bartering", " Haste", " Efficiency",];
var levelNames = [" &alpha; (1)", " &beta; (2)", " &gamma; (3)", " &delta; (4)", " &epsilon; (5)", " &zeta; (6)", " &eta; (7)", " &theta; (8)", " &iota; (9)", " &kappa; (10)", " &lambda; (11)", " &mu; (12)", " &nu; (13)", " &xi; (14)", " &omicron; (15)", " &pi; (16)", " &rho; (17)", " &sigma; (18)", " &tau; (19)", " &upsilon; (20)", " &phi; (21)", " &chi; (22)", " &psi; (23)", " &Omega; (24)"];
var idArray = ["a", "b", "g", "d", "epsi", "z", "eta", "t", "i", "k", "l", "m", "n", "x", "omi", "pi", "r", "s", "tau", "u", "phi", "c", "psi", "omega"];

//on web load
headings = "";
for (let i = 0; i < 24; i++) {
	for (let j = 1; j <= 5; j++) {
		headings += "<h6 class='" + idArray[i] + "' id=\"" + idArray[i] + j + "\"></h6>"
	}
}
console.log(headings);document.getElementById("headingDisplay").innerHTML = headings;

function craftStones() {
	itemArray = [
		[0, 0, 0, 0, 0],[0, 0, 0, 0, 0],[0, 0, 0, 0, 0],[0, 0, 0, 0, 0],[0, 0, 0, 0, 0],[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0],[0, 0, 0, 0, 0],[0, 0, 0, 0, 0],[0, 0, 0, 0, 0],[0, 0, 0, 0, 0],[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0],[0, 0, 0, 0, 0],[0, 0, 0, 0, 0],[0, 0, 0, 0, 0],[0, 0, 0, 0, 0],[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0],[0, 0, 0, 0, 0],[0, 0, 0, 0, 0],[0, 0, 0, 0, 0],[0, 0, 0, 0, 0],[0, 0, 0, 0, 0]
	]
	mythicArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	
	kappaLevel = document.getElementById("kappaRune").value;
	iotaLevel = document.getElementById("iotaRune").value;
	alphaLevel = document.getElementById("alphaRune").value;
	var rStone = document.getElementById("a").value;
	for (let s = 0; s < rStone; s++) {
		openAlphaStone();
	}	

	for (let r = 1; r < 9; r++) {
		rStone = document.getElementById(idArray[r]).value
		for (let s = 0; s < rStone; s++) {
			openOtherStone(r);
		}	
	}
	
	rStone = document.getElementById("k").value
	for (let s = 0; s < rStone; s++) {
		openKappaStone();
	}
	mergeRunes();
	writeOutcome();
}

function openAlphaStone() {
	x = checkProb(stoneProb[0]);
	bonus = alphaBoostCheck();
	switch(x) {
		case 0:
			mythicArray[doMythic(0)]++;
			break;
		case 1:
			itemArray[1][random(5)]++;
			break;
		case 2:
			itemArray[0][random(5)]++;
			break;
		default:
			sendError();
	}
}

function openKappaStone() {
	x = checkProb(stoneProb[9]);
	bonus = alphaBoostCheck();
	switch(x) {
		case 0:
			mythicArray[doMythic(9)]++;
			break;
		case 1:
			itemArray[bonus+11][random(5)]++;
			break;
		case 2:
			itemArray[bonus+10][random(5)]++;
			break;
		case 3:
			itemArray[bonus+9][random(5)]++;
			break;
		case 4:
			itemArray[bonus+8][random(5)]++;
			break;
		default:
			sendError();
	}
}

function openOtherStone(level) {
	x = checkProb(stoneProb[level]);
	bonus = alphaBoostCheck();
	switch(x) {
		case 0:
			mythicArray[doMythic(level)]++;
			break;
		case 1:
			itemArray[level+bonus+1][random(5)]++;
			break;
		case 2:
			itemArray[level+bonus][random(5)]++;
			break;
		case 3:
			itemArray[level+bonus-1][random(5)]++;
			break;
		default:
			sendError();
	}
}

function checkProb(prob) {
	let randomNumber = Math.random();
	for (let i = 0; i < prob.length; i++) {
		if (prob[i] <= randomNumber) {
			return i 
		}
	}
}

function alphaBoostCheck() {
	let alphaChanceArray = [0, 0.03, 0.06, 0.1, 0.15, 0.2];
	if (Math.random() < alphaChanceArray[alphaLevel]) {
		return 1;
	} else {
		return 0;
	}
}

function doMythic(stone) {
	y = checkProb(mythProb[stone]);
	switch(stone) {
		case 0: return random(2);
		case 1: return twoMythicProbGet(2);
		case 2: return twoMythicProbGet(4);
		case 3: return twoMythicProbGet(6);
		case 4: return twoMythicProbGet(8);
		case 5: return random(10);
		case 6:
			switch(y) {
				case 0: return random(8) + 2; 
				case 1: return random(2);
			}
		case 7:
			switch(y) {
				case 0: return random(6) + 4; 
				case 1: return random(2) + 2;
				case 2: return random(2);
			}
		case 8:
			switch(y) {
				case 0: return random(4) + 6; 
				case 1: return random(2) + 4;
				case 2: return random(2) + 2;
			}
		case 9:
			switch(y) {
				case 0: return random(2) + 8; 
				case 1: return random(2) + 6;
				case 2: return random(2) + 4;
			}
		default:
			sendError();
	}
}
function twoMythicProbGet(mn) {
	switch(y) {
		case 0: return random(2) + mn; 
		case 1: return random(mn);
		default: sendError();
	}
}

function random(randMax) {
	return Math.floor(Math.random() * randMax);
}

function mergeRunes() {
	var mergeReqArray = [5, 4, 4, 3, 3, 2];
	var doubleMergeArray = [[1, 0], [0.98, 0], [0.95, 0], [0.9, 0], [0.86, 0], [0.82, 0]];
	let mergeReq = mergeReqArray[iotaLevel]; 
	let doubleReq = doubleMergeArray[kappaLevel]; 
	for (let i = 0; i <= 4; i++) {
		for (let j = 0; j < 23; j++) {
			let forLimit = itemArray[j][i] / mergeReq;
			for (let k = 0; k < forLimit; k++) {
				if (itemArray[j][i] >= mergeReq) {
					switch(checkProb(doubleReq)) {
						case 0:
							if (j != 22) {
								itemArray[j+2][i]++;
								itemArray[j][i] -= mergeReq;
							} else {
								itemArray[j+1][i]++;
								itemArray[j][i] -= mergeReq;
							}
							break;
						case 1:
							itemArray[j+1][i] += Math.floor(itemArray[j][i] / mergeReq);
							itemArray[j][i] = itemArray[j][i] % mergeReq;
							break;
						default: sendError();
					}
				}
			}
		}
	}
}

function writeOutcome() {
	for (let i = 0; i < itemArray.length; i++) {
		for (let j = 0; j < 5; j++) {
			if (itemArray[i][j] != 0) {
				document.getElementById(idArray[i] + (j+1)).innerHTML = itemArray[i][j] + levelNames[i] + runeNames[j];
			} else {
				document.getElementById(idArray[i] + (j+1)).innerHTML = "";
			}
		}
	}
	
	var text = "";
	for (let i = 0; i < 10; i++) {
		if (mythicArray[i] != 0) {
			text += "<h6>" + mythicArray[i] + mythicNames[i] + "</h6>"
		}
	}
	document.getElementById("mythicList").innerHTML = text;
}

function sendError() {
	alert("Dogz has screwed something up badly... Send this to him to get it fixed, and have a 1 Common Box compensation");
	//If you are looking at this with Inspect Element go away no Common Boxes for you >:(
}