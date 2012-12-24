/* Linear Weighted Moving Average
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
		return computeWeightedMovingAverage(this.clippedData);
	};
	
	this.average = this.getInitialAverage();
	
	// Updates the data and clippedData arrays and recomputes the average
	this.addValue = function(value) {
		// Updates the partial sums
		var partialSum = 0;
		if (this.clippedData.length >= this.window) {
			for (var i = 0; i < this.clippedData.length; i++) {
				partialSum += this.clippedData[i];
			}
		}
		
		// Add new value to the arrays
		data.push(value);
		this.clippedData.push(value);
		
		var exceededLength = this.clippedData.length > this.window;
		var offset = (exceededLength) ? 1 : 0;
		
		var oldValue = (exceededLength) ? this.clippedData.shift() : 0;
		
		// compute new average without summing all the terms again
		var denominator = (this.clippedData.length) * (this.clippedData.length + 1) / 2;
		var oldNumerator = this.average * (denominator - ((!exceededLength) ? this.clippedData.length : 0));
		var newNumerator = oldNumerator + (this.clippedData.length) * value - partialSum;

		this.average = newNumerator / denominator;
		return this.average;
	};
}

// Computes the LWMA with a full sum of the data, fills partialSum with the partial Sum of the equation
function computeWeightedMovingAverage(dataPoints) {
	if (dataPoints.length == 0) {
		return 0;
	}
	else {
		// Computes the LWMA for the current data points
		var sum = 0;
		
		// faster implementation than doing a for loop
		var i = dataPoints.length;
		while (i--) {
			sum = sum + dataPoints[i] * (i+1);
		}
		
		var denominator = dataPoints.length * (dataPoints.length + 1) / 2;
		return sum / denominator;
	}
}

exports.createAverageTracker = createAverageTracker;
