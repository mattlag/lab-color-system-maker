function recalculateAllGradients() {
	console.log('recalculateAllGradients');
	const mainSat = document.getElementById('mainSat').value * 1;
	console.log(`mainSat = ${mainSat}`);
	const lightnessStep = document.getElementById('lightnessStep').value * 1;
	console.log(`lightnessStep = ${lightnessStep}`);
	const lightnessStart = document.getElementById('lightnessStart').value * 1;
	console.log(`lightnessStart = ${lightnessStart}`);

	console.log(gradients);

	gradients.forEach((gradient) => recalculateGradient(gradient, mainSat, lightnessStart, lightnessStep));

	const columnCount = Math.floor((100 - lightnessStart) / lightnessStep);
	const gradientsArea = document.getElementById('visual');
	gradientsArea.style.gridTemplateColumns = `repeat(${columnCount}, minmax(80px, 1fr))`;

	refreshFromGradientData();
}

function recalculateGradient(gradient, mainSat, lightnessStart, lightnessStep) {
	console.log('recalculateGradient');
	console.log(gradient);
	const hueFraction = gradient.hue / 360;
	console.log(`hueFraction = ${hueFraction}`);
	const satFraction = mainSat / 100;
	console.log(`satFraction = ${satFraction}`);

	let position = 0;
	for (let mainLightness = lightnessStart; mainLightness < 100; mainLightness += lightnessStep) {
		console.log(`\nSTEP ${position}`);
		console.log(`mainLightness = ${mainLightness}`);

		const step = makeStepData(hueFraction, satFraction, mainLightness / 100, mainLightness);
		gradient.steps[position] = step;
		position++;
	}

	console.log(gradient);
}

function makeStepData(hue, saturation, lightness, stepID) {
	const rgb = HSLtoRGB({ h: hue, s: saturation, l: lightness });
	// console.log(rgb);

	const m_color = new mColor(rgb);

	const step = {
		h: Math.round(hue * 360),
		s: Math.round(saturation * 100),
		l: Math.round(lightness * 100),
		stepID: stepID,
		lightnessLab: m_color.getLightness('lab'),
		lightnessSRGB: m_color.getLightness('srgb'),
	};

	return step;
}

function updateStepData(positionID, deltaH = 0, deltaS = 0, deltaL = 0) {
	const step = gradients[0].steps[positionID];
	if (deltaH) step.h += deltaH;
	if (deltaS) step.s += deltaS;
	if (deltaL) step.l += deltaL;

	step.h = Math.max(Math.min(step.h, 360), 0);
	step.s = Math.max(Math.min(step.s, 100), 0);
	step.l = Math.max(Math.min(step.l, 100), 0);

	const rgb = HSLtoRGB({ h: step.h / 360, s: step.s / 100, l: step.l / 100 });
	// console.log(rgb);
	const m_color = new mColor(rgb);

	step.lightnessLab = m_color.getLightness('lab');
	step.lightnessSRGB = m_color.getLightness('srgb');

	refreshFromGradientData();
}

function toggleInputs(gradientID) {
	gradients[gradientID].showInputs = !gradients[gradientID].showInputs;
	refreshFromGradientData();
}

function refreshFromGradientData() {
	const visual = document.getElementById('visual');
	visual.innerHTML = '';
	const outputCSS = document.getElementById('outputCSS');
	outputCSS.innerHTML = '';
	const outputJSON = document.getElementById('outputJSON');
	outputJSON.innerHTML = '';
	const variablePrefix = document.getElementById('variablePrefix').value;

	gradients.forEach((gradient, gradientID) => {
		let gradientCSS = '';
		let gradientJSON = '';
		gradient.steps.forEach((step, stepID) => {
			visual.innerHTML += makeOneGradientStep(step, stepID, gradient, gradientID);
			gradientCSS = makeOneValueCSS(step, gradient.name, variablePrefix) + '\n' + gradientCSS;
			gradientJSON = makeOneValueJSON(step, variablePrefix) + '\n' + gradientJSON;
		});

		outputJSON.innerHTML += `${gradient.name}: {\n${gradientJSON}}\n\n`;
		outputCSS.innerHTML += `${gradientCSS}\n\n`;
	});
}

function makeOneGradientStep(colorData, position, gradientData, gradientID) {
	console.log('makeOneGradientStep');
	console.log(colorData);
	const color = `hsl(${colorData.h}, ${colorData.s}%, ${colorData.l}%)`;
	let oneStep = `
		<div class="oneStep">
			<div
			class="thumbnail"
			style="background-color: ${color}; color: ${colorData.l > 50 ? 'black' : 'white'};"
			onclick="toggleInputs(${gradientID});"
			title="${gradientData.name} ${colorData.stepID}"
			></div>
		`;

	if (gradientData.showInputs) {
		oneStep += `
			<div class="topMargin">
				<span class="small readout">${colorData.h}</span>
				<button onclick="updateStepData(${position}, -1, 0, 0);" class="minus">h-</button>
				<button onclick="updateStepData(${position}, 1, 0, 0);">h+</button>
			</div>
			<div>
				<span class="small readout">${colorData.s}</span>
				<button onclick="updateStepData(${position}, 0, -1, 0);" class="minus">s-</button>
				<button onclick="updateStepData(${position}, 0, 1, 0);">s+</button>
			</div>
			<div>
				<span class="small readout">${colorData.l}</span>
				<button onclick="updateStepData(${position}, 0, 0, -1);" class="minus">l-</button>
				<button onclick="updateStepData(${position}, 0, 0, 1);">l+</button>
			</div>
			<div class="topMargin">
				<span class="small readout">${colorData.stepID}</span>
				:hsl
			</div>
			<div>
				<span class="small readout">${Math.round(colorData.lightnessLab * 100)}</span>
				:lab
			</div>
			<div>
				<span class="small readout">${Math.round(colorData.lightnessSRGB * 100)}</span>
				:srgb
			</div>
			<br>
		`;
	}

	oneStep += `</div>\n`;
	return oneStep;
}

function makeOneValueCSS(colorData, colorName, variablePrefix) {
	let stepID = '' + colorData.stepID;
	if (stepID.length === 1) stepID = `0${stepID}`;
	const color = `hsl(${colorData.h}, ${colorData.s}%, ${colorData.l}%)`;
	const value = `--${colorName}-${variablePrefix}${stepID}: ${color};`;
	return value;
}

function makeOneValueJSON(colorData, variablePrefix) {
	let stepID = '' + colorData.stepID;
	if (stepID.length === 1) stepID = `0${stepID}`;
	const color = `hsl(${colorData.h}, ${colorData.s}%, ${colorData.l}%)`;
	const value = `  ${variablePrefix}${stepID}: '${color}',`;
	return value;
}
