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

function oninputorchange(elt, f) {
	elt.addEventListener("input", f);
	elt.addEventListener("change", f);
}

function changeValue(elt, value) {
	elt.value = value;
	elt.dispatchEvent(new Event('change'));
}

function gcd(a, b) {
	if (!b) {
		return a;
	}
	return gcd(b, a % b);
}

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
		res += noteName(fs[i]) + "</br>";
	}
	return res;
}

function main() {
	var s = {
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
			br()
			]);

	oninput(s.keySelect, function () {
		s.noteIdx = s.keySelect.value;
		s.title.innerHTML = titleText(s.noteIdx);
		s.majorKeys.innerHTML = majorKeysText(s.noteIdx);
	});
}

window.onload = main;
