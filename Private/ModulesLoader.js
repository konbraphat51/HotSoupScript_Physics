//Automatically imports all codes of this library to the HTML

const HSSPModules = [

]

for (let i = 0; i < HSSPModules.length; i++) {
	document.write("<script src=\"HotSoupScript/Public/" + HSSPModules[i] + "\"></script>")
}
