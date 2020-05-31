const urlParameter = new URLSearchParams(window.location.search);
const time = urlParameter.get('time');
const FRAMERATE = 1000/60

setInterval(function() {
	timeInt = Math.round(parseInt(time, 10) / 10);
	let d = timeInt - Math.round(new Date().getTime() / 10);
	
	if (d <= 0) d = 0;
	
	//get 100th s
	let hs = d % 100;
	hs += ''
	if (hs.length == 1) {
		hs = '0' + hs;
	}
	//get s
	let s = Math.floor(d / 100);
	
	document.getElementById('stime').innerHTML = s;
	document.getElementById('hstime').innerHTML = '.' + hs;
}, FRAMERATE);
