$(document).ready(function() {
  // Socket.IO initializers
  var socket = io.connect();

  //Graphs
  window.charts = {};
  window.priceFeeds = [];
  window.transactionFeeds = [];
  window.tradingInitialized = false;
  window.transactionClosed = false;

  function loadTransactionHistory(){
    $.each(transactionFeeds, function(i, v){
      addToTransactionHistory(v);
    });
  }

  function addToTransactionHistory(feed){
    var el = $('tbody#'+feed.strategy);
    var template = _.template(templates.transactionrow, feed);
    el.append(template);
  }

  window.addToTransactionHistory = addToTransactionHistory;

  function loadGraph(strategy, s, e){
    st = strategy.toUpperCase();
    if(s == '' || e == ''){
    }else{
      if( s < e && s >= 0 && s < 32400){
        if((e-s)>1000){
          alert("Please select an interval smaller than 1000. (Otherwise, it can significantly slow down everything.)");
        }else{
          var pricesData = [];
          var tma5Data = [];
          var tma20Data = [];
          $.each(priceFeeds.slice(s,e), function(i, item) {
            pricesData.push({x: item.time, y: item.price});
            tma5Data.push({x: item.time, y: item[st].fast});
            tma20Data.push({x: item.time, y: item[st].slow});
          });
          charts[strategy].series[0].setData(pricesData, false);
          charts[strategy].series[1].setData(tma5Data, false);
          charts[strategy].series[2].setData(tma20Data, true);
        }
      }
   }
  }

  function generateGraph(strategy, number){
            charts[strategy] = new Highcharts.Chart({
            chart: {
                renderTo: strategy+'-graph',
                type: 'line',
                marginRight: 10,
                events: {
                }
            },
            title: {
                text: 'Strategy '+number+': '+strategy
            },
            xAxis: {
                type: 'linear',
                tickPixelInterval: 150
            },
            yAxis: {
                title: {
                    text: 'Price'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }],
            },
            tooltip: {
                formatter: function() {
                        return '<b>'+ this.series.name +'</b><br/>'+
                        Highcharts.numberFormat(this.x, 2) +'seconds<br/>'+
                        Highcharts.numberFormat(this.y, 2) +' $';
                }
            },
            legend: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            series: [{
                name: 'Price',
                data: (function() {
                    // generate an array of random data
                    var data = [],
                        i;
                    for (i = -60; i <= 0; i++) {
                        data.push({
                            x: i,
                            y: 0 
                        });
                    }
                    return data;
                })(),
                marker: {
                  enabled: false
                }
            },{
                name: strategy+' (5)',
                data: (function() {
                    // generate an array of random data
                    var data = [],
                        i;
                    for (i = -60; i <= 0; i++) {
                        data.push({
                            x: i,
                            y: 0 
                        });
                    }
                    return data;
                })(),
                marker: {
                  enabled: false
                }
            },
            {
                name: strategy+' (20)',
                data: (function() {
                    // generate an array of random data
                    var data = [],
                        i;
                    for (i = -60; i <= 0; i++) {
                        data.push({
                            x: i,
                            y: 0 
                        });
                    }
                    return data;
                })(),
                marker: {
                  enabled: false
                }
            }]
        });
    return charts[strategy];
  }

  // Views
  NavbarView = Backbone.View.extend({
    el: $(".navbar .navbar-inner .nav"),
    initialize: function(options){
      this.render(options);
    },
    render: function(options){
      var variables = { active: options.id };
      var template = _.template( templates.navbartemplate , variables );
      this.$el.html(template);
    }
  });

  TestView = Backbone.View.extend({
    el: $("body"),
    initialize: function(){
      this.render();
    },
    events: {
      "click #trading": "showTest"
    },
    showTest: function(){
    },
    render: function(){
    }
  });

  WelcomeView = Backbone.View.extend({
    el: $("#appview"),
    initialize: function(){
      tradingInitialized = false;
      this.render();
    },
    events: {
      "click .btn#uselocalserver": "useLocalServer",
      "keyup input[type='text']": "changeDetected",
      "keyup input[type='number']": "changeDetected",
      "click .btn#remoteconnect": "useRemoteServer",
      "click .btn#bell": "ringBell"
    },
    useRemoteServer: function(event){
      event.preventDefault();
      $('.btn#remoteconnect').button('loading');
      var pP = $('#pricePort').val();
      var tP = $('#tradePort').val();
      var h = $('#exchangeServer').val();

      socket.emit("useRemoteExchange", { pricePort: pP , tradePort: tP, host: h });
      $('.btn#remoteconnect').button('reset');
    },
    useLocalServer: function(event){
      var self = this;
      $('.btn#uselocalserver').button('loading');
      socket.emit("useLocalExchange");
    },
    ringBell: function(){
      Backbone.history.navigate('trading', true);
    },
    changeDetected: function(event){
      var isAllFilled = true;
      if( $('#exchangeServer').val() == '' || $('#pricePort').val() == '' || $('#tradePort').val() == ''){
        isAllFilled = false;
      }
      if(isAllFilled){
        $('#remoteBtnHolder').slideDown();
      }else{
        $('#remoteBtnHolder').slideUp();
      }
    },
    render: function(){
      var template = _.template( templates.welcometemplate , {} );
      this.$el.html(template); 
    }
  });

  TradingView = Backbone.View.extend({
    el: $("#appview"),
    initialize: function(){
      this.render();
    },
    events: {
      "click #sma-select": "updateSMAGraph",
      "click #lwma-select": "updateLWMAGraph",
      "click #ema-select": "updateEMAGraph",
      "click #tma-select": "updateTMAGraph"
    },
    updateSMAGraph: function(event){
      event.preventDefault();

      var s = $('#sma-start').val();
      var e = $('#sma-end').val();

      if(s == '' || e == ''){
      }else{
        if( s < e && s >= 0 && s < 32400){
          if((e-s)>1000){
            alert("Please select an interval smaller than 1000. (Otherwise, it can significantly slow down everything.)");
          }else{
            var pricesData = [];
            var sma5Data = [];
            var sma20Data = [];
            $.each(priceFeeds.slice(s,e), function(i, item) {
              pricesData.push({x: item.time, y: item.price});
              sma5Data.push({x: item.time, y: item.SMA.fast});
              sma20Data.push({x: item.time, y: item.SMA.slow});
            });
            charts.sma.series[0].setData(pricesData, false);
            charts.sma.series[1].setData(sma5Data, false);
            charts.sma.series[2].setData(sma20Data, true);
          }
        }
      }
    },
    updateLWMAGraph: function(event){
      event.preventDefault();

      var s = $('#lwma-start').val();
      var e = $('#lwma-end').val();

      if(s == '' || e == ''){
      }else{
        if( s < e && s >= 0 && s < 32400){
          if((e-s)>1000){
            alert("Please select an interval smaller than 1000. (Otherwise, it can significantly slow down everything.)");
          }else{
            var pricesData = [];
            var lwma5Data = [];
            var lwma20Data = [];
            $.each(priceFeeds.slice(s,e), function(i, item) {
              pricesData.push({x: item.time, y: item.price});
              lwma5Data.push({x: item.time, y: item.LWMA.fast});
              lwma20Data.push({x: item.time, y: item.LWMA.slow});
            });
            charts.lwma.series[0].setData(pricesData, false);
            charts.lwma.series[1].setData(lwma5Data, false);
            charts.lwma.series[2].setData(lwma20Data, true);
          }
        }
      }
    },
    updateEMAGraph: function(event){
      event.preventDefault();

      var s = $('#ema-start').val();
      var e = $('#ema-end').val();

      if(s == '' || e == ''){
      }else{
        if( s < e && s >= 0 && s < 32400){
          if((e-s)>1000){
            alert("Please select an interval smaller than 1000. (Otherwise, it can significantly slow down everything.)");
          }else{
            var pricesData = [];
            var ema5Data = [];
            var ema20Data = [];
            $.each(priceFeeds.slice(s,e), function(i, item) {
              pricesData.push({x: item.time, y: item.price});
              ema5Data.push({x: item.time, y: item.EMA.fast});
              ema20Data.push({x: item.time, y: item.EMA.slow});
            });
            charts.ema.series[0].setData(pricesData, false);
            charts.ema.series[1].setData(ema5Data, false);
            charts.ema.series[2].setData(ema20Data, true);
          }
        }
      }
    },
    updateTMAGraph: function(event){
      event.preventDefault();

      var s = $('#tma-start').val();
      var e = $('#tma-end').val();

      if(s == '' || e == ''){
      }else{
        if( s < e && s >= 0 && s < 32400){
          if((e-s)>1000){
            alert("Please select an interval smaller than 1000. (Otherwise, it can significantly slow down everything.)");
          }else{
            var pricesData = [];
            var tma5Data = [];
            var tma20Data = [];
            $.each(priceFeeds.slice(s,e), function(i, item) {
              pricesData.push({x: item.time, y: item.price});
              tma5Data.push({x: item.time, y: item.TMA.fast});
              tma20Data.push({x: item.time, y: item.TMA.slow});
            });
            charts.tma.series[0].setData(pricesData, false);
            charts.tma.series[1].setData(tma5Data, false);
            charts.tma.series[2].setData(tma20Data, true);
          }
        }
      }
    },
    render: function(){
      var template = _.template( templates.tradingtemplate , {} );
      this.$el.html(template); 

      var smaChart = generateGraph("sma", 1);
      var lwmaChart = generateGraph("lwma", 2);
      var emaChart = generateGraph("ema", 3);
      var tmaChart = generateGraph("tma", 4);
      if(!tradingInitialized){
        socket.emit("launchTrade");
        tradingInitialized = true;
      }else{
        loadGraph("sma", 32300, 32400);
        loadGraph("lwma", 32300, 32400);
        loadGraph("ema", 32300, 32400);
        loadGraph("tma", 32300, 32400);
        loadTransactionHistory();
      }
    }
  });

  SchedulingView = Backbone.View.extend({
    el: $("#appview"),
    initialize: function(){
      this.render();
    },
    render: function(){
      var template = _.template( templates.schedulingtemplate , {} );
      this.$el.html(template); 
    }
  });

  ReportingView = Backbone.View.extend({
    el: $("#appview"),
    initialize: function(){
      this.render();
    },
    render: function(){
      var template = _.template( templates.reportingtemplate , {} );
      this.$el.html(template); 
      $('#reportbtn').click(function(){
        $('#reportbtn').button('loading');
        if(!($('#reportbtn').hasClass('disabled'))){
          socket.emit("sendReport");
        }
      });
      if(transactionClosed){
        $('#reportbtn').removeClass('disabled');
      }
      socket.on("tradeClosed", function(data){
        $('#reportbtn').removeClass('disabled');
      });

    }
  });

  var vNavbar = new NavbarView({id : "welcome"});
  var vAppView = new WelcomeView();

  //Router
  var MSETController = Backbone.Router.extend({
    routes: {
      "": "welcome",
      "welcome": "welcome",
      "trading": "trading",
      "scheduling": "scheduling",
      "reporting": "reporting"
    },
    welcome: function(){
      vAppView.undelegateEvents();
      vNavbar = new NavbarView({id: "welcome"});
      vAppView = new WelcomeView();
    },
    trading: function(){
      vAppView.undelegateEvents();
      vNavbar = new NavbarView({id: "trading"});
      vAppView = new TradingView();
    },
    scheduling: function(){
      vAppView.undelegateEvents();
      vNavbar = new NavbarView({id: "scheduling"});
      vAppView = new SchedulingView();
    },
    reporting: function(){
      vAppView.undelegateEvents();
      vNavbar = new NavbarView({id: "reporting"});
      vAppView = new ReportingView();
    }
  });

  var app_router = new MSETController();
  Backbone.history.start();

  $(document).on("click", "a:not([data-bypass])", function(evt) {
    // Get the anchor href and protcol
    var href = $(this).attr("href");
    var protocol = this.protocol + "//";

    // Ensure the protocol is not part of URL, meaning its relative.
    if (href && href.slice(0, protocol.length) !== protocol &&
        href.indexOf("javascript:") !== 0) {
      // Stop the default event to ensure the link will not cause a page
      // refresh.
      evt.preventDefault();

      // `Backbone.history.navigate` is sufficient for all Routers and will
      // trigger the correct events.  The Router's internal `navigate` method
      // calls this anyways.
      Backbone.history.navigate(href, {trigger: true});
    }
  });

  //SOCKET CALLBACKS
  socket.on("exchangeConnectionResult", function(data){
    $('.btn#uselocalserver').button('reset');
    $('.btn#remoteconnect').button('reset');
    if(data.success){
      $('#bellring').slideDown();
    }else{
      alert(data.message);
    }
  });

  socket.on("newPrice", function(data){
    if(isNaN(parseInt(data.price))){}
    else{
      window.priceFeeds.push(data);
      charts.sma.series[0].addPoint([parseInt(data.time),parseFloat(data.price)], false, true);
      charts.sma.series[1].addPoint([parseInt(data.time),parseFloat(data.SMA.fast)], false, true);
      charts.sma.series[2].addPoint([parseInt(data.time),parseFloat(data.SMA.slow)], false, true);

      charts.lwma.series[0].addPoint([parseInt(data.time),parseFloat(data.price)], false, true);
      charts.lwma.series[1].addPoint([parseInt(data.time),parseFloat(data.LWMA.fast)], false, true);
      charts.lwma.series[2].addPoint([parseInt(data.time),parseFloat(data.LWMA.slow)], false, true);

      charts.ema.series[0].addPoint([parseInt(data.time),parseFloat(data.price)], false, true);
      charts.ema.series[1].addPoint([parseInt(data.time),parseFloat(data.EMA.fast)], false, true);
      charts.ema.series[2].addPoint([parseInt(data.time),parseFloat(data.EMA.slow)], false, true);

      charts.tma.series[0].addPoint([parseInt(data.time),parseFloat(data.price)], false, true);
      charts.tma.series[1].addPoint([parseInt(data.time),parseFloat(data.TMA.fast)], false, true);
      charts.tma.series[2].addPoint([parseInt(data.time),parseFloat(data.TMA.slow)], false, true);
    }
  });

  socket.on("newTransaction", function(data){
    window.transactionFeeds.push(data);
    addToTransactionHistory(data);
  });

  socket.on("tradeClosed", function(data){
    transactionClosed = true;
  });

  socket.on("ceremonyId", function(data){
    $('#reportbtn').button('reset');
    $('#reportbtn h1').text('Ceremony ID: '+data.ceremonyId);
  });

  //QUICK HACK FOR REFRESHING GRAPHS
  setInterval(function(){
    if(typeof charts.sma === undefined){
    }else{
      $(window).resize(); //little hack to fix charts sizing dynamically
      charts.sma.redraw();
    }
  }, 250);

  //QUICK HACK FOR BOOTSTRAP TABS
  $('#strategyTab a').click(function(e){
    e.preventDefault();
    $(this).tab('show');
  });
});
