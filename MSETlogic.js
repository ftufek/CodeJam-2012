/**
 * MSETapi.js
 * The main server/dispatcher/trader code
 * Kevin Cadieux
 */

 var SMA = {
 	slow : require("./SMA").createAverageTracker(20),
 	fast : require("./SMA").createAverageTracker(5)
 };
 
 var LWMA = {
 	slow : require("./LWMA").createAverageTracker(20),
 	fast : require("./LWMA").createAverageTracker(5)
 };
 
 var EMA = {
 	slow : require("./EMA").createAverageTracker(20),
 	fast : require("./EMA").createAverageTracker(5)
 };
 
 var TMA = {
 	slow : require("./TMA").createAverageTracker(20),
 	fast : require("./TMA").createAverageTracker(5)
 };
  
 var msExchange = require("./msExchange");
 var scheduling = require("./scheduling");
 var fs = require("fs");
 var https = require("http");
 var request = require('request');
 
 var time = 32399;
 var db;
 var Transaction;
 var msExchangeClient = null;
 
 var pendingTransactions = [];
 var JSONData;
 
 var SMA_INDEX = 1;
 var LWMA_INDEX = 2;
 var EMA_INDEX = 3;
 var TMA_INDEX = 4;
 
 var oldSMA = {slow: 0, fast: 0};
 var oldLWMA = {slow: 0, fast: 0};
 var oldEMA = {slow: 0, fast: 0};
 var oldTMA = {slow: 0, fast: 0};
 
 var initTradingLogic = function(socket) {
 	socket.on("useLocalExchange", function() {
 		connectToMsExchange(8001, 8002, "localhost");
 	});
 	
 	socket.on("useRemoteExchange", function(data) {
 		console.log();
 		connectToMsExchange(data.pricePort, data.tradePort, data.host);
 	});
 	
 	socket.on("launchTrade", function() {
 		launchTrade();
 	});
 	
 	socket.on("sendReport", function() {
 		console.log("Received sendReport message");
 		sendReport();
 	});
 	
 	var connectToMsExchange = function(priceFeedPort, tradePort, hostAddress) {
 		try {
 			msExchangeClient.end();
 			msExchangeClient.removeListeners();
 		} catch (err) { }
 		msExchangeClient = msExchange.createClient(priceFeedPort, tradePort, hostAddress);
		msExchangeClient.once("connected", onMsExchangeConnected);
	 	msExchangeClient.once("connectionError", onMsExchangeConnectionError)
 	
 	/*
 		if (msExchangeClient == null) {
 			msExchangeClient = msExchange.createClient(priceFeedPort, tradePort, hostAddress);
		 	msExchangeClient.once("connected", onMsExchangeConnected);
	 		msExchangeClient.once("connectionError", onMsExchangeConnectionError)
 		} else {
 			socket.emit("exchangeConnectionResult", {success: false, message: "You are already connected to the server."});
 		}*/
	}
	
	var launchTrade = function() {
		time = 0;
		pendingTransactions = [];
	 	msExchangeClient.startTrade();
		console.log("Launching trade");
	}
	
	var sendReport = function() {
		
		var testData = '{"team":"Kevin","destination":"kcadieux@gmail.com","transactions":[]}'
      	
      	request({
 			uri: "https://stage-api.e-signlive.com/aws/rest/services/codejam",
 			method: "POST",
 			body: JSONData,
 			headers: {
 				"Authorization": "Basic Y29kZWphbTpBRkxpdGw0TEEyQWQx",
 				"Accept": "*/*",
 				"content-type": "application/json"
 			}
 		}, function(error, response, body) {
 			socket.emit("ceremonyId", {ceremonyId : JSON.parse(response.body).ceremonyId});
 			console.log("Ceremony ID sent");
 			//console.log(body);
 			//console.log(body.ceremonyId);
 			console.log(response.body);
      	});
	}
	
	//CALLBACK: When the connection to msExchange.jar succeeds
	var onMsExchangeConnected = function() {
	 	console.log("Connected to msExchange!");
	 	socket.emit("exchangeConnectionResult", {success: true});
	 	msExchangeClient.on("price", onPriceReceived);
	 	msExchangeClient.on("transactionComplete", onTransactionComplete);
	 	msExchangeClient.on("exchangeClose", onExchangeClose);
	}
	
	//CALLBACK: Error callback when we cant connect to the msExchange.jar
	var onMsExchangeConnectionError = function() {
		socket.emit("exchangeConnectionResult", {
			success: false, 
			message: "Connection to the server has failed. Please contact your administrator. We hope it's not you."
		});
		console.log("Connection to msExchange failed!");
	}
	
	//CALLBACK: Called after we get a price from the msExchange.jar
	var onPriceReceived = function(price) {
		time++;
		
		//Get the new average
		var newSMA =  {slow: SMA.slow.addValue(price), fast: SMA.fast.addValue(price)};
		var newLWMA = {slow: LWMA.slow.addValue(price), fast: LWMA.fast.addValue(price)};
		var newEMA =  {slow: EMA.slow.addValue(price), fast: EMA.fast.addValue(price)};
		var newTMA =  {slow: TMA.slow.addValue(price), fast: TMA.fast.addValue(price)};
		
		//Check for crossovers
		if (oldSMA.fast <= oldSMA.slow && newSMA.fast > newSMA.slow) {
			msExchangeClient.buy(time, SMA_INDEX);
		} 
		if (oldLWMA.fast <= oldLWMA.slow && newLWMA.fast > newLWMA.slow) {
			msExchangeClient.buy(time, LWMA_INDEX);
		} 
 		if (oldEMA.fast <= oldEMA.slow && newEMA.fast > newEMA.slow) {
			msExchangeClient.buy(time, EMA_INDEX);
		} 
		if (oldTMA.fast <= oldTMA.slow && newTMA.fast > newTMA.slow) {
			msExchangeClient.buy(time, TMA_INDEX);
		} 
		if (oldSMA.fast >= oldSMA.slow && newSMA.fast < newSMA.slow) {
			msExchangeClient.sell(time, SMA_INDEX);
		} 
		if (oldLWMA.fast >= oldLWMA.slow && newLWMA.fast < newLWMA.slow) {
			msExchangeClient.sell(time, LWMA_INDEX);
		} 
		if (oldEMA.fast >= oldEMA.slow && newEMA.fast < newEMA.slow) {
			msExchangeClient.sell(time, EMA_INDEX);
		} 
		if (oldTMA.fast >= oldTMA.slow && newTMA.fast < newTMA.slow) {
			msExchangeClient.sell(time, TMA_INDEX);
		}
		
		//Save new values as old values
		oldSMA = newSMA;
		oldLWMA = newLWMA;
		oldEMA = newEMA;
		oldTMA = newTMA;
		
	 	socket.emit("newPrice", {
	 		time: time,
	 		price: price,
	 		SMA: newSMA,
	 		LWMA: newLWMA,
	 		EMA: newEMA,
	 		TMA: newTMA
	 	});
	}
	
	//CALLBACK: Called after a buy or a sell	
	var onTransactionComplete = function(type, price, time, strategy) {
		
		var strategyString;
		if (strategy == SMA_INDEX) strategyString = "SMA";
		else if (strategy == LWMA_INDEX) strategyString = "LWMA";
		else if (strategy == EMA_INDEX) strategyString = "EMA";
		else if (strategy == TMA_INDEX) strategyString = "TMA";
		
		var transaction = {
			time : time.toString(),
			type : type,
			price : price,
			manager : "Manager" + scheduling.getManagerNumber(time, strategy),
			strategy : strategyString
		};
		
		pendingTransactions.push(transaction);
		socket.emit("newTransaction", transaction);
	}
		 
	var onExchangeClose = function() {
		console.log("Exchange closing");
		console.log(pendingTransactions.length);
		
		var JSONObject = {
			team: "Profonde Intelligence",
			destination: "mcgillcodejam2012@gmail.com",
			transactions: pendingTransactions
		};
		
		JSONData = JSON.stringify(JSONObject, null, 4);
		
		socket.emit("tradeClosed");
		
		var fd = fs.openSync("codejam.json", "w");
		fs.writeSync(fd, JSONData);
		fs.closeSync(fd);
		
		try {
		 	msExchangeClient.end();
		 	msExchangeClient.removeListeners();
		} catch (err) {} 
	}	

 }

 exports.initTradingLogic = initTradingLogic;
 
 
