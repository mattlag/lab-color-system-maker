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

	refreshPage();
}

function refreshPage() {
	refreshGradients();
	refreshOutputs();
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

	refreshPage();
}
