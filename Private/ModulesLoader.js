//Automatically imports all codes of this library to the HTML

const HSSModules = [

]
for (let i = 0; i < HSSModules.length; i++) {
	//document.write("<script src=\"HotSoupScript/Public/" + HSSModules[i] + "\"></script>")
	let script = document.createElement("script")
	script.src = "HotSoupScript_Physics/Public/" + HSSModules[i]
	document.body.appendChild(script)
}
