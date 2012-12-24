/**
 * msExchange.js
 * Communication with the msExchange server
 * Kevin Cadieux
 */

 var net = require("net");
 var events = require("events");
 
 
 var createClient = function(priceFeedPort, tradingPort, host) {
 	if (host == null) {
 		host = "localhost";
 	}
 	return new Client(priceFeedPort, tradingPort, host);
 }
 
 var Client = function(priceFeedPort, tradingPort, hostAddress) {
 
 	var self = this;
 	var isPriceClientConnected = false;
 	var isTradeClientConnected = false;
 	
 	var amountBought = 0;
 	var amountGroups10 = 0;
 	
 	var lastTransactionTypeQueue = [];
 	var lastTransactionTimeQueue = [];
 	var lastTransactionStrategyQueue = [];
 	
 	
	 	var priceClient = net.connect({port: priceFeedPort, host: hostAddress}, 
	 		function() {
	 			if (isTradeClientConnected) self.emit("connected");
	 			else isPriceClientConnected = true;
	 			priceClient.on("end", onPriceClientEnd);
			 	priceClient.on("data", onPriceClientData);
	 		});
	 	priceClient.once("error", function(error) {self.emit("connectionError");});
	 	
	 	var tradeClient = net.connect({port: tradingPort, host: hostAddress}, 
	 		function() {
	 			if (isPriceClientConnected) self.emit("connected");
	 			else isTradeClientConnected = true;
	 			tradeClient.on("end", onTradeClientEnd);
	 			tradeClient.on("data", onTradeClientData);
	 		});
	 	tradeClient.once("error", function(error) {self.emit("connectionError");});
 	
 	//End event
 	var onPriceClientEnd = function() {
 		tradeClient.end();
 		self.emit("exchangeClose");
 		console.log("Price client connection ended!");
 	}
 	
 	var onTradeClientEnd = function() {
 		console.log("Trade client connection ended!");
 		console.log("Nb bought: " + amountBought);
 		console.log("Nb groups of 10: " + amountGroups10);
 	}
 	
 	//Data event
 	var onPriceClientData = function(data) {
 		var response = data.toString();
 		
 		var prices = response.split("|");
 		var i=0;
 		var nbPrices = 0;
	 	for (; i<prices.length; ++i) {
	 		if (prices[i].length > 1) {
	 			self.emit("price", parseFloat(prices[i]));
	 			++nbPrices;
	 		}
	 	}
	 	
	 	if (nbPrices == 10) ++amountGroups10;
 	}
 	
 	var onTradeClientData = function(data) {
 		var response = data.toString();
 		
 		while (response.length > 0) {
 			if (response[0] == "E") {
 				response = response.substr(1);
 			} else {
		 		var decimalPointIndex = response.indexOf(".");
		 		var price = response.substr(0, decimalPointIndex+4);
		 		response = response.substr(decimalPointIndex+4);
		 		amountBought++;
		 		self.emit("transactionComplete", lastTransactionTypeQueue.pop(), parseFloat(price), lastTransactionTimeQueue.pop(), lastTransactionStrategyQueue.pop());
	 		}
 		}
 	}
 	
 	this.end = function() {
 		priceClient.end();
 		tradeClient.end();
 	}
 	
 	this.startTrade = function() {
 		priceClient.write("H\r\n");
 	}
 	
 	this.buy = function(time, strategy) {
 		lastTransactionTypeQueue.unshift("buy");
 		lastTransactionTimeQueue.unshift(time);
 		lastTransactionStrategyQueue.unshift(strategy);
 		tradeClient.write("B\r\n");
 	}
 	
 	this.sell = function(time, strategy) {
 		lastTransactionTypeQueue.unshift("sell");
 		lastTransactionTimeQueue.unshift(time);
 		lastTransactionStrategyQueue.unshift(strategy);
 		tradeClient.write("S\r\n");
 	}
 }
 
 Client.prototype = new events.EventEmitter();
 
 exports.createClient = createClient;
 
