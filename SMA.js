/* Simple Moving Average
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
		return computeSimpleMovingAverage(this.clippedData);
	};
	
	this.average = this.getInitialAverage();
	
	// Updates the data and clippedData arrays and recomputes the average
	this.addValue = function(value) {
		data.push(value);
		this.clippedData.push(value);
		
		var exceededLength = this.clippedData.length > this.window;
		var offset = (exceededLength) ? 0 : 1;
		var oldValue = (exceededLength) ? this.clippedData.shift() : 0;
		
		// compute new average without summing all the terms again
		this.average = (this.average*(this.clippedData.length-offset) - oldValue + value)/this.clippedData.length;
		return this.average;
	};
}

// Computes the SMA with a full sum of the data
function computeSimpleMovingAverage(dataPoints) {
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
