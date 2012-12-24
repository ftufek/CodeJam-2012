var TMA = require("./SMA");

var t = TMA.createAverageTracker(5);

console.log(t.addValue(61.590));
console.log(t.addValue(61.440));
console.log(t.addValue(61.320));
console.log(t.addValue(61.670));
console.log(t.addValue(61.920));
console.log(t.addValue(62.610));
console.log(t.addValue(62.880));
console.log(t.addValue(63.060));
console.log(t.addValue(63.290));
console.log(t.addValue(63.320));
console.log(t.addValue(63.260));
console.log(t.addValue(63.120));
console.log(t.addValue(62.240));
console.log(t.addValue(62.190));
console.log(t.addValue(62.890));