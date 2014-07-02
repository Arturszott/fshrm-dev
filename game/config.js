'use strict';

var config = {
	// 20% of the screen height
	verticalCellSize: 0.25,
	// negative value mean background is scrolling top
	baseWaterSpeed: -30,
	baseBottomSpeed: -60,
	// miliseconds
	GAME_TIME: 4000,
	accelerationSpeed: -3600,
	bottomAccelerationSpeed: -200,
	waterAccelerationSpeed: -300,
	baseElementSpeed: -20,
	fishRotationAngle: 320,
	throwAnimationTime: 400
}

module.exports = config;