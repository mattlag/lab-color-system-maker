function resetInitialGradient() {
	console.log('==========================\nresetInitialGradient');

	const mainHue = document.getElementById('mainHue').value * 1;
	console.log(`mainHue = ${mainHue}`);
	const mainSat = document.getElementById('mainSat').value * 1;
	console.log(`mainSat = ${mainSat}`);
	const lightnessStep = document.getElementById('lightnessStep').value * 1;
	console.log(`lightnessStep = ${lightnessStep}`);
	const lightnessStart = document.getElementById('lightnessStart').value * 1;
	console.log(`lightnessStart = ${lightnessStart}`);

	const hueFraction = mainHue / 360;
	console.log(`hueFraction = ${hueFraction}`);
	const satFraction = mainSat / 100;
	console.log(`satFraction = ${satFraction}`);

	let position = 0;
	for (let mainLightness = lightnessStart; mainLightness < 100; mainLightness += lightnessStep) {
		console.log(`\nSTEP ${position}`);
		console.log(`mainLightness = ${mainLightness}`);

		const step = makeStepData(hueFraction, satFraction, mainLightness / 100, mainLightness);
		gradientData[position] = step;
		position++;
	}

	refreshFromGradientData();
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
	const step = gradientData[positionID];
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

function refreshFromGradientData() {
	const visual = document.getElementById('visual');
	visual.innerHTML = '';
	const outputCSS = document.getElementById('outputCSS');
	outputCSS.innerHTML = '';
	const outputJSON = document.getElementById('outputJSON');
	outputJSON.innerHTML = '';
	const colorName = document.getElementById('colorName').value;
	const variablePrefix = document.getElementById('variablePrefix').value;
	gradientData.forEach((step, i) => {
		visual.innerHTML += makeOneVisual(step, i);
		outputCSS.innerHTML = makeOneValueCSS(step, colorName, variablePrefix) + '\n' + outputCSS.innerHTML;
		outputJSON.innerHTML = makeOneValueJSON(step, variablePrefix) + '\n' + outputJSON.innerHTML;
	});

	outputJSON.innerHTML = `${colorName}: {\n${outputJSON.innerHTML}}`;
}

function makeOneVisual(colorData, position) {
	// console.log(colorData);
	const color = `hsl(${colorData.h}, ${colorData.s}%, ${colorData.l}%)`;
	const oneStep = `
		<div class="oneStep">
			<div class="thumbnail" style="
				background-color: ${color}; 
				color: ${colorData.l > 50 ? 'black' : 'white'};
				">${colorData.stepID}</div>
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
		</div>
	`;
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
