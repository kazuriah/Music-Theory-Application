
function main() {
    addElements([
	table([[number(10, 0, 20, 5), div(["Hello"])],
	       [select(["option 1", ["option 2", "word"]], 0), range(10, 0, 20)]],
	     "caption"),
	br(),
	div(["hi, again"]),
	button([emsp, "button"]),
	br(),
	e("code", "x = x + 1;"), br(),
	dlist(["coffee", ["tea", "a drink with jam and bread"]]), br(),
	div(["hello", div("world"), br(), "hi"]), br(),
	img("blah.jpg"), br(),
	iframe("https://www.google.com"), br()
    ]);
}
window.onload = main;
