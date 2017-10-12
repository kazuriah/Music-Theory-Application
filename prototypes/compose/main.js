function e(type) { return document.createElement(type); }
function addElements(elts) { 
	for (var i = 0; i < elts.length; i++) 
		document.body.appendChild(elts[i]);
}

function tableRow(elts) {
	var r = e("tr");
	for (var j = 0; j < elts.length; j++) {
		var d = e("td");
		d.appendChild(elts[j]);
		r.appendChild(d);
	}
	return r;
}

function table(rows) {
	var t = e("t");
	for (var i = 0; i < rows.length; i++) {
		t.appendChild(tableRow(rows[i]));
	}
	return t;
}

function button(name, f) {
	var b = e("button");
	b.innerHTML = name;
	if (f) {
		onclick(b, f);
	}
	return b;
}

function range(value, min, max) {
	var x = e("input");
	x.type = "range";
	x.min = min;
	x.max = max;
	x.value = value;
	return x;
}

function select(options, value) {
	var elt = e("select");
	for (var i = 0; i < options.length; i++) {
		var c = e("option");
		c.value = i;
		c.innerHTML = options[i];
		if (value == i) c.selected = "selected";
		elt.appendChild(c);
	}
	return elt;
}

function number(value, min, max, step) {
	var n = e("input");
	n.type = "number";
	n.min = min;
	n.max = max;
	n.step = step ? step : 1;
	n.value = value;
	return n;
}

function div(innerHTML) {
	var elt =  e("div");
	if (innerHTML) {
		elt.innerHTML = innerHTML;
	}
	return elt;
}
function br() { return e("br"); }

function oninput(elt, f) {
	elt.addEventListener("input", f);
}

function onclick(elt, f) {
	elt.addEventListener("click", f);
}

function oninputorchange(elt, f) {
	elt.addEventListener("input", f);
	elt.addEventListener("change", f);
}

function changeValue(elt, value) {
	elt.value = value;
	elt.dispatchEvent(new Event('change'));
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function chooseRandom(list) {
	var r = getRandomInt(0, list.length - 1);
	return list[r];
}

function gcd(a, b) {
	if (!b) {
		return a;
	}
	return gcd(b, a % b);
}

var majorScaleNames = ["vii*", "I", "ii", "iii", "IV", "V", "vi"];
var notes = ["A", "A#/Bb", "B", "C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab"];
var fifths = [0, 7, 2, 9, 4, 11, 6, 1, 8, 3, 10, 5];

function noteName(noteIdx) { return notes[noteIdx]; }
function titleText(noteIdx) { return "Compose in " + noteName(noteIdx); }
function majorKeyFifths(keyIdx) {
	var fs = [];
	keyIdx = (keyIdx + 12 - 7) % 12;
	for (var i = 0; i < 7; i++) {
		fs[i] = keyIdx;
		keyIdx = (keyIdx + 7) % 12
	}
	return fs.reverse();
}

function majorKeysText(keyIdx) {
	var fs = majorKeyFifths(keyIdx);
	var res = "";
	for (var i = 0; i < fs.length; i++) {
		for (var j =0; j < i; j++) res += "&emsp;";
		res += majorScaleNames[i] + " " + noteName(fs[i]) + "</br>";
	}
	return res;
}

function compositionChordRow() {
	return tableRow([select(notes), select([1, 2, 3, 4]), div("--"), div("")]);
}

var s;

function playNextChord(i) {
	var t = s.compositionTable;
	if (i > 1) {
		t.children[i-1].children[3].innerHTML = "";
	}
	if (i == t.children.length) return;
	t.children[i].children[3].innerHTML = "***";
	setTimeout(function() { playNextChord(1 + i); }, 700);
}

function main() {
	s = {
		noteIdx: 3
	};
	addElements([
			s.title = div(titleText(s.noteIdx)),
			br(),
			s.keySelect = select(notes, s.noteIdx),
			s.majorKeys = div(majorKeysText(s.noteIdx)),  br(),
			div("Rules:"),  br(),
			div("1. Down by at most one step."),  br(),
			div("2. Up one or more steps."),  br(),
			div("3. End in the root note."),  br(),
			br(),
			s.newChord = button("Add Chord", function () {
				s.compositionTable.appendChild(compositionChordRow())
			}),
			s.newChord = button("Remove Chord", function () {
				var t = s.compositionTable;
				if (t.children.length > 2) {
					t.removeChild(t.children[t.children.length - 1]);
				}
			}),
			s.newChord = button("Verify Progression", function () {
				var t = s.compositionTable;
				for (var i = 1; i < t.children.length; i++) {
					var options = ["Complies!", "Check rule 1", "Check rule 2", "Check rule 3"];
					var r = chooseRandom(options);
					t.children[i].children[2].innerHTML = r;
				}
			}),
			br(),
			s.compositionTable = table([[div("Chord&emsp;"), div("Beats&emsp;"), div("Complies with Rules?&emsp;"), div("Playing?")]]),
			br(),
			s.bpm = number(60, 30, 300),
			s.playComposition = button("Play Composition", function () {
				var i = 1;
				playNextChord(1);
			})
			]);

	s.compositionTable.appendChild(compositionChordRow());

	oninput(s.keySelect, function () {
		s.noteIdx = s.keySelect.value;
		s.title.innerHTML = titleText(s.noteIdx);
		s.majorKeys.innerHTML = majorKeysText(s.noteIdx);
	});
}

window.onload = main;
