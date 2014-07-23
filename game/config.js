'use strict';

var config = {
	// 20% of the screen height
	verticalCellSize: 1/6,
	// negative value mean background is scrolling top
	baseWaterSpeed: -200,
	baseBottomSpeed: -120,
	// miliseconds
	GAME_TIME: 4000,
	throwAnimationTime: 400,
	// strange units
	accelerationSpeed: -600,
	bottomAccelerationSpeed: -300,
	waterAccelerationSpeed: -450,
	baseElementSpeed: -20,
	fishRotationAngle: 270,

	itemChance: 0.8,

	tiers: {
		1: [30, 100],
		2: [101, 200],
		3: [201, 300],
	},
}

module.exports = config;