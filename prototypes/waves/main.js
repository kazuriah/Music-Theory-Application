function e(type) { return document.createElement(type); }
function addElements(elts) { 
	for (var i = 0; i < elts.length; i++) 
		document.body.appendChild(elts[i]);
}

function table(elts) {
	var t = e("t");
	for (var i = 0; i < elts.length; i++) {
		var r = e("tr");
		for (var j = 0; j < elts[i].length; j++) {
			var d = e("td");
			d.appendChild(elts[i][j]);
			r.appendChild(d);
		}
		t.appendChild(r);
	}
	return t;
}

function range(value, min, max) {
	var x = e("input");
	x.type = "range";
	x.min = min;
	x.max = max;
	x.value = value;
	return x;
}

function select(options) {
	var elt = e("select");
	for (var i = 0; i < options.length; i++) {
		var c = e("option");
		c.value = i;
		c.innerHTML = options[i];
		elt.appendChild(c);
	}
	return elt;
}

function div() { return e("div"); }
function br() { return e("br"); }

function rangeView(r) {
	var t = e("div");
	t.innerHTML = r.value;
	oninputorchange(r, function () {
		t.innerHTML = r.value;
	});
	return t;
}

var notes = ["A", "A#/Bb", "B", "C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab"];
function noteIdx(note, octave) {
	var idx = notes.indexOf(note);
	return octave*12 + idx - 3;
}

function octaveFromNoteIdx(idx) {
	return Math.trunc((idx + 3) / 12);
}
function noteFromNoteIdx(idx) {
	return (idx + 3) % 12;
}

function noteIdxOctave(noteIdx) {
	var idx = notes.indexOf(note);
	return octave*12 + idx;
}

function noteFromRangeIdx(idx) {
	return notes[idx];
}

function oninput(elt, f) {
	elt.addEventListener("input", f);
}

function oninputorchange(elt, f) {
	elt.addEventListener("input", f);
	elt.addEventListener("change", f);
}

function noteRangeView(r) {
	var t = e("div");
	t.innerHTML = noteFromRangeIdx(r.value);
	oninputorchange(r, function () {
		t.innerHTML = noteFromRangeIdx(r.value);
	});
	return t;
}

function canvasSine(c, v) {
		var ctx = c.getContext("2d");
		var h2 = c.height / 2;
		ctx.clearRect(0, 0, c.width, c.height);
		ctx.beginPath();
		ctx.moveTo(0, h2);

		for(x=0; x<=1.0; x+=0.0001){
			var s = Math.sin(Math.PI*x*v);
			y = h2 - (h2-10)*s;
			if (s < 0.01 && s > -0.01) {
				ctx.fillRect(x*c.width - 5, y - 5, 10, 10);
			}
			ctx.lineTo(x*c.width,y);
		}
		ctx.stroke();
}

function canvas(r) {
	var c = e("canvas");
	canvasSine(c, r.value);
	oninputorchange(r, function () {
		canvasSine(c, r.value);
	});
	return c;
}

function noteIdxFromRanges(o) {
	return noteIdx(noteFromRangeIdx(o.noteRange.value), o.octaveRange.value);
}

function changeValue(elt, value) {
	elt.value = value;
	elt.dispatchEvent(new Event('change'));
}

function syncNoteRanges(o) {
	changeValue(o.octaveRange, octaveFromNoteIdx(o.noteIdx));
	changeValue(o.noteRange, noteFromNoteIdx(o.noteIdx));
}

function noteRangeInputHandler(o1, o2) {
	return function () {
		var noteIdx = noteIdxFromRanges(o1);
		var delta = noteIdx - o1.noteIdx;
		o2.noteIdx += delta;
		o1.noteIdx = noteIdx;
		syncNoteRanges(o1);
		syncNoteRanges(o2);
	}
}

function gcd(a, b) {
	if (!b) {
		return a;
	}
	return gcd(b, a % b);
}

function wavesFromInterval(semitones) {
	return [[1,1], [16, 17], [8, 9], [5, 6], [4, 5], [2, 3], [1, 1], // !!
		 [3,2], [5,4], [6, 5], [9,8], [17, 16], [1, 2]][semitones]
}

function intervalSize(r1, r2, octaves) {
  var interval;
	if (r1 == 1 && r2 == 1) interval = 0;
	else if (r1 == 1 && r2 == 2) interval = 12;
	else if (r1 == 2 && r2 == 1) interval = 12;
	else if (r1 == 2 && r2 == 3) interval = 5;
	else if (r1 == 3 && r2 == 2) interval = 7;
	else if (r1 == 4 && r2 == 5) interval = 4;
	else if (r1 == 5 && r2 == 4) interval = 9;
	else if (r1 == 5 && r2 == 6) interval = 3;
	else if (r1 == 5 && r2 == 9) interval = 10;
	else if (r1 == 8 && r2 == 9) interval = 2;
	else if (r1 == 9 && r2 == 8) interval = 10;
	else if (r1 == 3 && r2 == 5) interval = 9;
	else if (r1 == 8 && r2 == 15) interval = 11;
	else if (r1 == 16 && r2 == 17) interval = 1;
	else {
		if (r1 < r2) { 
			var r = r1;
			while (r*2 < r2) {
				r *= 2;
				octaves++;
			}
			if (r == r1) {
				return -1;
			}
			return intervalSize(r/gcd(r, r2), r2/gcd(r,r2), octaves);
		} else {
			var r = r2;
			while (r*2 < r1) {
				r *= 2;
				octaves++;
			}
			if (r == r2) {
				return -1;
			}
			return intervalSize(r1/gcd(r1, r), r/gcd(r1,r), octaves);
		}
	}
	return interval + octaves*12;
}

function intervalOctaves(semitones) {
	var octaves = 0;
	while (semitones > 12) {
		semitones -= 12;
		octaves++
	}
	return octaves;
}

function intervalNorm(semitones) {
	while (semitones > 12) {
		semitones -= 12;
	}
	return semitones;
}

var intervals = ["Unison", "Minor 2nd", "Major 2nd", "Minor 3rd", "Major 3rd",
		"4th", "Tritone", "5th", "Minor 6th", "Major 6th", "Minor 7th",
		"Major 7th", "Octave"];
var intervalDescriptions = ["Literally the same note.", "Very dissonant. Smallest interval.",
		"First interval in a major scale", "Major 2nd + Minor 2nd", "Two steps in a major scale.",
		"Inverted 5th", "Very dissonant. Exactly halfway.", "Inverted 4th.", "Minor 6th description",
		"Major 6th description", "Minor 7th description",
		"Major 7th description", "Octave. Notes are so similar that we identify them as the same note."];

function intervalName(semitones) {
	var octaves = intervalOctaves(semitones), interval = intervalNorm(semitones);
	if (octaves) {
		return octaves + " octaves + " + intervals[interval];
	}
	return intervals[interval];
}

function calculateInterval(w1, w2) {
	var g = gcd(w1, w2);

	var r1 = w1/g;
	var r2 = w2/g;
	return intervalSize(r1, r2, 0);
}

function syncIntervalText(intervalText, intervalDescription, semitones) {
	if (semitones == -1) {
		intervalText.innerHTML = "unknown";
		intervalDescription.innerHTML = "Not yet implemented or may not exist.";
	} else {
		var interval = intervalName(semitones);

		intervalText.innerHTML = interval + "; " + semitones + " semitones";
		intervalDescription.innerHTML = intervalDescriptions[intervalNorm(semitones)];
	}
}

function syncInterval(o1, o2, intervalText, intervalDescription) {
	var semitones = calculateInterval(o1.waveRange.value, o2.waveRange.value);
	if (semitones != -1) {
		o1.noteIdx = o2.noteIdx + semitones;
		syncNoteRanges(o1);
	}
	syncIntervalText(intervalText, intervalDescription, semitones);
}

window.onload = function() {
	var o1 = {}, o2 = {}, intervalText, intervalDescription, intervalSelect;
	addElements([
		table([
				[o1.waveRange = range(2, 1, 17), rangeView(o1.waveRange), canvas(o1.waveRange),
				o1.noteRange = range(3, 0, 11), noteRangeView(o1.noteRange),
				o1.octaveRange = range(4, 2, 6), rangeView(o1.octaveRange)],
				[o2.waveRange = range(2, 1, 17), rangeView(o2.waveRange), canvas(o2.waveRange),
				o2.noteRange = range(0, 0, 11), noteRangeView(o2.noteRange),
				o2.octaveRange = range(4, 2, 6), rangeView(o2.octaveRange)],
				[intervalText = div()]]),
		br(),
		intervalSelect = select(intervals),
		br(),
		intervalDescription = div()]);

	oninput(intervalSelect, function () {
		var ws = wavesFromInterval(intervalSelect.value);
		changeValue(o1.waveRange, ws[0]);
		changeValue(o2.waveRange, ws[1]);

		syncInterval(o1, o2, intervalText, intervalDescription);
	});

	o1.noteIdx = noteIdxFromRanges(o1);
	o2.noteIdx = noteIdxFromRanges(o2);

	oninput(o1.noteRange, noteRangeInputHandler(o1, o2));
	oninput(o1.octaveRange, noteRangeInputHandler(o1, o2));
	oninput(o2.noteRange, noteRangeInputHandler(o2, o1));
	oninput(o2.octaveRange, noteRangeInputHandler(o2, o1));

	syncInterval(o1, o2, intervalText, intervalDescription);

	oninput(o1.waveRange, function () {
		syncInterval(o1, o2, intervalText, intervalDescription);
	});
	oninput(o2.waveRange, function () {
		syncInterval(o1, o2, intervalText, intervalDescription);
	});
}
