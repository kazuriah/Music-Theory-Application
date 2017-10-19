function appendHtml(elt, eltsAndStrings) {
    if (eltsAndStrings) {
	if (eltsAndStrings instanceof HTMLElement) {
	    elt.appendChild(eltsAndStrings);
	} else if (typeof(eltsAndStrings) === "string") {
	    elt.innerHTML += eltsAndStrings;
	} else {
	    for (var i = 0; i < eltsAndStrings.length; i++) {
		var x = eltsAndStrings[i];
		if (typeof(x) === "string") {
		    elt.innerHTML += x;
		} else {
		    elt.appendChild(x);
		}
	    }
	}
    }
}

function e(type, eltsAndStrings) {
    var elt = document.createElement(type);
    appendHtml(elt, eltsAndStrings);
    return elt;
}
function addElements(eltsAndStrings) { 
    appendHtml(document.body, eltsAndStrings);
}

function tableRow(elts) {
    var r = e("tr");
    for (var j = 0; j < elts.length; j++) {
	var d = e("td");
	appendHtml(d, elts[j]);
	r.appendChild(d);
    }
    return r;
}

function table(rows, caption) {
    var t = e("t");
    if (caption) t.appendChild(e("caption", caption));
    for (var i = 0; i < rows.length; i++)
	t.appendChild(tableRow(rows[i]));
    return t;
}

function button(name, f) {
    var b = e("button", name);
    if (f) onclick(b, f);
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
	var c = e("option", options[i]);
	c.value = i;
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

function dlist(defs) {
    var elt = e("dl");
    for (var i = 0; i < defs.length; i++) {
	if (typeof(defs[i]) === "string") {
	    elt.appendChild(e("dt", defs[i]));
	} else {
	    elt.appendChild(e("dt", defs[i][0]));
	    elt.appendChild(e("dd", defs[i][1]));
	}
    }
    return elt;
}

function olist(defs) {
    var elt = e("ol");
    for (var i = 0; i < defs.length; i++) {
	elt.appendChild(e("li", defs[i]));
    }
    return elt;
}

function ulist(defs) {
    var elt = e("ul");
    for (var i = 0; i < defs.length; i++) {
	elt.appendChild(e("li", defs[i]));
    }
    return elt;
}

function form(html, action, method) {
    var f = e("form", html);
    if (action) f.action = action;
    if (method) f.method = method;
    return f;
}

function img(src, alt, width, height) {
    var i = e("img");
    i.src = src;
    i.alt = alt ? alt : src;
    if (width) i.width = width;
    if (height) i.height = height;
    return i;
}

function iframe(src) { 
    var i = e("iframe");
    i.src = src;
    return i;
}

function escape(str) { return "&" + str + ";"; }
var emsp = escape("emsp");
function div(eltsAndStrings) { return e("div", eltsAndStrings); }
function br() { return e("br"); }
