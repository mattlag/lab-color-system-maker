function recalculateAllGradients() {
	console.log('recalculateAllGradients');
	const lightnessStep = document.getElementById('lightnessStep').value * 1;
	console.log(`lightnessStep = ${lightnessStep}`);
	const lightnessStart = document.getElementById('lightnessStart').value * 1;
	console.log(`lightnessStart = ${lightnessStart}`);

	console.log(gradients);

	gradients.forEach((gradient) => gradient.initializeSteps(lightnessStart, lightnessStep));

	const columnCount = Math.ceil((100 - lightnessStart) / lightnessStep);
	const gradientsArea = document.getElementById('visual');
	gradientsArea.style.gridTemplateColumns = `repeat(${columnCount}, minmax(80px, 1fr))`;

	refreshGradients();
}

function addGradient() {
	const lightnessStep = document.getElementById('lightnessStep').value * 1;
	console.log(`lightnessStep = ${lightnessStep}`);
	const lightnessStart = document.getElementById('lightnessStart').value * 1;
	console.log(`lightnessStart = ${lightnessStart}`);

	const newGradient = new Gradient();
	newGradient.initializeSteps(lightnessStart, lightnessStep);
	gradients.push(newGradient);
	refreshGradients();
}

function refreshGradients() {
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
		if (gradient.showInputs) {
			visual.innerHTML += `
			<div class="gradientInputs">
				<span>
					<label for="gradientName">Name:</label>
					<input type="text" id="gradientName" value="${gradient.name}" 
					onchange="updateGradientName(${gradientID}, this.value);"/>
				</span>

				<span>
					<label for="gradientHue">Hue:</label>
					<input type="number" id="gradientHue" min="0" max="360" value="${gradient.hue}" 
					onchange="updateGradientHue(${gradientID}, this.value);"/>
				</span>

				<span>
					<label for="gradientSaturation">Saturation:</label>
					<input type="number" id="gradientSaturation" min="0" max="100" value="${gradient.saturation}" 
					onchange="updateGradientSaturation(${gradientID}, this.value);"/>
				</span>

				<button class="gradientAction" ${gradientID === 0 ? 'disabled' : ''} onclick="moveGradientUp(${gradientID});">⭱</button>
				<button class="gradientAction" ${
					gradientID === gradients.length - 1 ? 'disabled' : ''
				} onclick="moveGradientDown(${gradientID});">⭳</button>
				<button class="gradientAction" ${
					gradients.length === 1 ? 'disabled' : ''
				} onclick="removeGradient(${gradientID});">✖</button>
			</div>
			`;
		}
		gradient.steps.forEach((step, stepID) => {
			visual.innerHTML += makeOneGradientStep(step, stepID, gradient, gradientID);
			gradientCSS = makeOneValueCSS(step, gradient.name, variablePrefix) + '\n' + gradientCSS;
			gradientJSON = makeOneValueJSON(step, variablePrefix) + '\n' + gradientJSON;
		});

		outputJSON.innerHTML += `${gradient.name}: {\n${gradientJSON}}\n\n`;
		outputCSS.innerHTML += `${gradientCSS}\n\n`;
	});
}

function updateGradientHue(gradientID, hue) {
	gradients[gradientID].hue = hue;
	gradients[gradientID].recalculateAllStepLightnesses();
	refreshGradients();
}

function updateGradientSaturation(gradientID, saturation) {
	gradients[gradientID].saturation = saturation;
	gradients[gradientID].recalculateAllStepLightnesses();
	refreshGradients();
}

function updateGradientName(gradientID, name) {
	gradients[gradientID].name = name;
	refreshGradients();
}

function moveGradientUp(gradientID) {
	const gradient = gradients[gradientID];
	gradients.splice(gradientID, 1);
	gradients.splice(gradientID - 1, 0, gradient);
	refreshGradients();
}

function moveGradientDown(gradientID) {
	const gradient = gradients[gradientID];
	gradients.splice(gradientID, 1);
	gradients.splice(gradientID + 1, 0, gradient);
	refreshGradients();
}

function removeGradient(gradientID) {
	gradients.splice(gradientID, 1);
	refreshGradients();
}

function makeOneGradientStep(colorData, position, gradientData, gradientID) {
	// console.log('makeOneGradientStep');
	// console.log(colorData);
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
				<button onclick="updateStepData(${gradientID}, ${position}, -1, 0, 0);" class="minus">h-</button>
				<button onclick="updateStepData(${gradientID}, ${position}, 1, 0, 0);">h+</button>
			</div>
			<div>
				<span class="small readout">${colorData.s}</span>
				<button onclick="updateStepData(${gradientID}, ${position}, 0, -1, 0);" class="minus">s-</button>
				<button onclick="updateStepData(${gradientID}, ${position}, 0, 1, 0);">s+</button>
			</div>
			<div>
				<span class="small readout">${colorData.l}</span>
				<button onclick="updateStepData(${gradientID}, ${position}, 0, 0, -1);" class="minus">l-</button>
				<button onclick="updateStepData(${gradientID}, ${position}, 0, 0, 1);">l+</button>
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

function updateStepData(gradientID, positionID, deltaH = 0, deltaS = 0, deltaL = 0) {
	const modifier = isShiftDown ? 10 : 1;
	const step = gradients[gradientID].steps[positionID];
	if (deltaH) step.h += 1 * deltaH * modifier;
	if (deltaS) step.s += 1 * deltaS * modifier;
	if (deltaL) step.l += 1 * deltaL * modifier;

	step.h = Math.max(Math.min(step.h, 360), 0);
	step.s = Math.max(Math.min(step.s, 100), 0);
	step.l = Math.max(Math.min(step.l, 100), 0);
	gradients[gradientID].recalculateStepLightness(positionID);

	refreshGradients();
}

function toggleInputs(gradientID) {
	gradients[gradientID].showInputs = !gradients[gradientID].showInputs;
	refreshGradients();
}

function saveProjectFile() {
	const project = {
		lightnessStart: document.getElementById('lightnessStart').value,
		lightnessStep: document.getElementById('lightnessStep').value,
		variablePrefix: document.getElementById('variablePrefix').value,
		gradients: [],
	};

	gradients.forEach((gradient) => {
		project.gradients.push(gradient.save());
	});

	const json = JSON.stringify(project, null, '\t');
	const blob = new Blob([json], { type: 'text/plain' });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = 'Lab Color System.json';
	a.click();
}

function loadProjectFile(data) {
	const newProject = JSON.parse(data);
	document.getElementById('lightnessStart').value = newProject.lightnessStart;
	document.getElementById('lightnessStep').value = newProject.lightnessStep;
	document.getElementById('variablePrefix').value = newProject.variablePrefix;

	gradients = [];
	newProject.gradients.forEach((gradient) => {
		gradients.push(new Gradient(gradient));
	});

	const columnCount = Math.ceil((100 - newProject.lightnessStart) / newProject.lightnessStep);
	const gradientsArea = document.getElementById('visual');
	gradientsArea.style.gridTemplateColumns = `repeat(${columnCount}, minmax(80px, 1fr))`;

	refreshGradients();
}
