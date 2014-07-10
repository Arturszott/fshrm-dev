'use strict';

var config = {
	// 20% of the screen height
	verticalCellSize: 1/6,
	// negative value mean background is scrolling top
	baseWaterSpeed: -200,
	baseBottomSpeed: -120,
	// miliseconds
	GAME_TIME: 4000,
	accelerationSpeed: -2400,
	bottomAccelerationSpeed: -300,
	waterAccelerationSpeed: -450,
	baseElementSpeed: -20,
	fishRotationAngle: 270,
	throwAnimationTime: 400
}

module.exports = config;