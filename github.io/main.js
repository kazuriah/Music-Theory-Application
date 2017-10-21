function main() {
	addElements([
			e("h1", "Home"),
			e("h2", "Prototypes"),
			ulist([
				a("prototypes/compose/index.html", "Compose"),
				a("prototypes/waves/index.html", "Waves")
				])
			]);
}
window.onload = main;
