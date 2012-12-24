

var getManagerNumber = function(time, strategy){

	if (time > 0 && time <= 7200) {
		if (strategy == 1 || strategy == 2) return 1;
		else return 2;
	} else if (time > 7200 && time <= 9000) {
		if (strategy == 1 || strategy == 2) return 5;
		else return 6;
	} else if (time > 9000 && time <= 16200) {
		if (strategy == 1 || strategy == 2) return 1;
		else return 2;
	} else if (time > 16200 && time <= 23400) {
		if (strategy == 1 || strategy == 2) return 3;
		else return 4;
	} else if (time > 23400 && time <= 25200) {
		if (strategy == 1 || strategy == 2) return 7;
		else return 8;
	} else if (time > 25200 && time <= 32400) {
		if (strategy == 1 || strategy == 2) return 3;
		else return 4;
	}
}

exports.getManagerNumber = getManagerNumber;