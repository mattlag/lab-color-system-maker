class Gradient {
	constructor({ hue = 0, name = 'color', showInputs = true } = {}) {
		this.hue = hue;
		this.name = name;
		this.showInputs = showInputs;
		this.steps = [];
	}

	recalculate(mainSat, lightnessStart, lightnessStep) {
		console.log('Gradient.recalculate');
		console.log(this);
		const hueFraction = this.hue / 360;
		console.log(`hueFraction = ${hueFraction}`);
		const satFraction = mainSat / 100;
		console.log(`satFraction = ${satFraction}`);

		let position = 0;
		for (let mainLightness = lightnessStart; mainLightness < 100; mainLightness += lightnessStep) {
			console.log(`\nSTEP ${position}`);
			console.log(`mainLightness = ${mainLightness}`);

			const step = makeStepData(hueFraction, satFraction, mainLightness / 100, mainLightness);
			this.steps[position] = step;
			position++;
		}

		console.log(this);
	}
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
