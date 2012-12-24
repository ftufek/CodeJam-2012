/* Triangular Moving Average
 * Kevin Dam <kevin.dam@mail.mcgill.ca>
 * Team Profonde Intelligence
 * McGill Code Jam 2012
 */

var data = [];

function createAverageTracker(windowSize) {
	data = [];
	return new tracker(windowSize);
}

// tracker object model
function tracker(windowSize) {
	this.window = windowSize;
	this.clippedData = data.splice(data.length - this.window, this.window);

	this.getInitialAverage = function() {
		return computeTriangularMovingAverage(this.clippedData);
	};

	this.average = this.getInitialAverage();

	var sma = require('./SMA').createAverageTracker(this.window);
	var smaClippedData = [];
	// Updates the data and clippedData arrays and recomputes the average
	this.addValue = function(value) {	
		data.push(value);
		this.clippedData.push(value);

		// Use the SMA module to compute the SMA partial sums
		var smaValue = sma.addValue(value);
		smaClippedData.push(smaValue);

		var exceededLength = this.clippedData.length > this.window;
		var offset = (exceededLength) ? 0 : 1;
		var oldValue = 0;
		if (exceededLength) {
			this.clippedData.shift();
			oldValue = smaClippedData.shift();
		}

		var prevNumerator = this.average*(this.clippedData.length-offset) - oldValue + smaValue;
		this.average = prevNumerator / this.clippedData.length;
		return this.average;
	};
}

function computeTriangularMovingAverage(dataPoints) {
	if (dataPoints.length == 0) {
		return 0;
	}
	else {
		// Computes the SMA for the current data points
		var sum = 0;
		// faster implementation than doing a for loop
		var i = dataPoints.length;
		while (i--) {
			sum += dataPoints[i];
		}
		return sum / dataPoints.length;
	}
}

exports.createAverageTracker = createAverageTracker;