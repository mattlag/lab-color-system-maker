function refreshOutputs() {
	const outputCSS = document.getElementById('outputCSS');
	outputCSS.innerHTML = ':root {\n';
	const outputJSON = document.getElementById('outputJSON');
	outputJSON.innerHTML = 'const colors = {\n';
	const variablePrefix = document.getElementById('variablePrefix').value;

	gradients.forEach((gradient) => {
		let gradientCSS = '';
		let gradientJSON = '';
		gradient.steps.forEach((step) => {
			gradientCSS = makeOneValueCSS(step, gradient.name, variablePrefix) + '\n' + gradientCSS;
			gradientJSON = makeOneValueJSON(step, variablePrefix) + '\n' + gradientJSON;
		});

		outputJSON.innerHTML += `  ${gradient.name}: {\n${gradientJSON}  },\n\n`;
		outputCSS.innerHTML += `${gradientCSS}\n`;
	});

	outputJSON.innerHTML += '};';
	outputCSS.innerHTML += '}';
}

function makeOneValueCSS(colorData, colorName, variablePrefix) {
	let stepID = '' + colorData.stepID;
	if (stepID.length === 1) stepID = `0${stepID}`;
	const color = `hsl(${colorData.h}, ${colorData.s}%, ${colorData.l}%)`;
	const value = `  --${colorName}-${variablePrefix}${stepID}: ${color};`;
	return value;
}

function makeOneValueJSON(colorData, variablePrefix) {
	let stepID = '' + colorData.stepID;
	if (stepID.length === 1) stepID = `0${stepID}`;
	const color = `hsl(${colorData.h}, ${colorData.s}%, ${colorData.l}%)`;
	const value = `    ${variablePrefix}${stepID}: '${color}',`;
	return value;
}
