class Gradient {
	constructor({ hue = 0, saturation = 100, name = 'color', showInputs = true, steps = [] } = {}) {
		this.steps = steps;
		this.hue = hue;
		this.saturation = saturation;
		this.name = name;
		this.showInputs = showInputs;

		this.recalculateAllStepLightnesses();
	}

	save() {
		const result = {
			name: this.name,
			hue: this.hue,
			saturation: this.saturation,
			showInputs: this.showInputs,
			steps: this.steps,
		};
		return result;
	}

	initializeSteps(lightnessStart, lightnessStep) {
		// console.log('Gradient.initializeSteps');
		// console.log(this);
		const hueFraction = this.hue / 360;
		// console.log(`hueFraction = ${hueFraction}`);
		const satFraction = this.saturation / 100;
		// console.log(`satFraction = ${satFraction}`);
		this.steps = [];
		let position = 0;
		for (let mainLightness = lightnessStart; mainLightness < 100; mainLightness += lightnessStep) {
			// console.log(`\nSTEP ${position}`);
			// console.log(`mainLightness = ${mainLightness}`);

			const step = makeStepData(hueFraction, satFraction, mainLightness / 100, mainLightness);
			this.steps[position] = step;
			position++;
		}

		// console.log(this);
	}

	recalculateStepLightness(stepID) {
		let step = this.steps[stepID];
		const rgb = HSLtoRGB({ h: step.h / 360, s: step.s / 100, l: step.l / 100 });
		const m_color = new mColor(rgb);
		step.lightnessLab = m_color.getLightness('lab');
		step.lightnessSRGB = m_color.getLightness('srgb');
	}

	recalculateAllStepLightnesses() {
		this.steps.forEach((step) => {
			this.recalculateStepLightness(step.stepID);
		});
	}

	set hue(hue) {
		this._hue = Number(hue) || 0;
		this.steps.forEach((step) => {
			step.h = hue;
		});
	}

	get hue() {
		return this._hue;
	}

	set saturation(saturation) {
		this._saturation = Number(saturation) || 100;
		this.steps.forEach((step) => {
			step.s = saturation;
		});
	}

	get saturation() {
		return this._saturation;
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
