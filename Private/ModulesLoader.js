//Automatically imports all codes of this library to the HTML

const HSSPModules = ["Collision.js"]

for (let i = 0; i < HSSPModules.length; i++) {
	document.write(
		'<script src="HotSoupScript_Physics/Public/' +
			HSSPModules[i] +
			'"></script>',
	)
}
