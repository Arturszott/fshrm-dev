'use strict';

var config = {
	// 20% of the screen height
	verticalCellSize: 1/6,
	// negative value mean background is scrolling top
	baseWaterSpeed: -120,
	baseBottomSpeed: -60,
	// miliseconds
	GAME_TIME: 40000,
	accelerationSpeed: -3600,
	bottomAccelerationSpeed: -200,
	waterAccelerationSpeed: -300,
	baseElementSpeed: -20,
	fishRotationAngle: 270,
	throwAnimationTime: 400
}

module.exports = config;