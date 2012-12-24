/* Exponential Moving Average
 * Kevin Dam <kevin.dam@mail.mcgill.ca>
 * Team Profonde Intelligence
 * McGill Code Jam 2012
 */

var data = [];
var oldValue = 0;

function createAverageTracker(windowSize) {
	data = [];	
	return new tracker(windowSize);
}

// tracker object model
function tracker(windowSize) {
	this.window = windowSize;
	this.clippedData = data.splice(data.length - this.window, this.window);
		
	this.getInitialAverage = function() {
		return computeExponentialMovingAverage(this.clippedData);
	};
	
	this.average = this.getInitialAverage();
	
	// Updates the data and clippedData arrays and recomputes the average
	this.addValue = function(value) {
		data.push(value);
		this.clippedData.push(value);
		
		var exceededLength = this.clippedData.length > this.window;
		if (exceededLength) {
			this.clippedData.shift();
		}
		
		var alpha = 2/(this.window + 1);
		
		// compute new average
		var newAverage;
		if (this.clippedData.length == 1) {
			oldValue = this.clippedData[0];
			this.average = oldValue;
		}
		else {
			newAverage = oldValue + alpha * (value - oldValue);
			oldValue = newAverage;
			this.average = newAverage
		}
		return this.average;
	};
}

// Computes the EMA with a full sum of the data
function computeExponentialMovingAverage(dataPoints) {
	var n = dataPoints.length;

	if (n == 0) {
		oldValue = 0;
		return 0;
	}
	if (n == 1) {
		oldValue = dataPoints[0];
		return oldValue;
	}

	var alpha = 2/(n + 1);
	oldValue = dataPoints[n-1];
	firstValue = dataPoints[0];
	var newValue = oldValue + alpha * (firstValue - oldValue);
	
	return newValue;
}

exports.createAverageTracker = createAverageTracker;
