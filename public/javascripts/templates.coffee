window.templates = {
  navbartemplate : '''
    <% if(active == "welcome") { %>
    <li class="active"><a href="#welcome" id="welcome">Welcome</a></li>
    <% } %>
    <% if(active != "welcome") { %>
      <li class="<% if(active == "trading") { %> active <% } %>"><a href="#trading" id="trading">Trading</a></li>
      <li class="<% if(active == "scheduling") { %> active <% } %>"><a href="#scheduling" id="scheduling">Scheduling</a></li>
      <li class="<% if(active == "reporting") { %> active <% } %>"><a href="#reporting" id="reporting">Reporting</a></li>
    <% } %>
  ''',

  welcometemplate : '''
    <div class="page-header">
      <h1> Welcome to MSET!<small>Our goal is to help you make more money on financial markets!</small></h1>
    </div>


    <div id="configureserver">
    <h4>First, we need to configure the exchange server. You can:</h4>
    <div class="row-fluid">
      <div class="span6">
        <div class="well">
          <strong>Use our local server (we will be using the amd.txt datafile):</strong>
          <div class="btn btn-primary" data-loading-text="Connecting..." id="uselocalserver">Use local server</div>
        </div>
      </div>
      <div class="span6">

        <div class="well">
          <strong>Or, tell us where your exchange server is located and which ports we should use:</strong>

          <form class="form-horizontal">
            <div class="control-group">
              <label class="control-label" for="exchangeServer">Server</label>
              <div class="controls">
                <input type="text" id="exchangeServer" placeholder="Server">
              </div>
            </div>
            <div class="control-group">
              <label class="control-label" for="pricePort">Price port</label>
              <div class="controls">
                <input type="number" id="pricePort" placeholder="Price port">
              </div>
            </div>
            <div class="control-group">
              <label class="control-label" for="tradePort">Trading port</label>
              <div class="controls">
                <input type="number" id="tradePort" placeholder="Trade port">
              </div>
            </div>
            <div class="control-group" id="remoteBtnHolder">
              <div class="controls">
                <button id="remoteconnect" data-bypass="" type="submit" data-loading-text="Connecting..." class="btn btn-primary">Connect</button>
              </div>
            </div>
          </form>
  
        </div>

      </div>
      </div>
      <div class="row-fluid" id="bellring">
        <div class="span12">
          <h4>Connection established, perfect! So just ring the Stock Market Bell to start trading!</h4>
          <div id="bell" class="btn btn-primary">
            <img src="/img/bell.png"></img>
          </div>
        </div>
      </div>
    </div>
  ''',

  tradingtemplate: '''
    <div class="page-header">
      <h1>The Trading Console <small>Yes, you're in control!</small></h1>
    </div>

      <ul class="nav nav-pills" id="strategyTab">
        <li class="active">
          <a href="#tab1" data-bypass="" data-toggle="pill">Strategy 1: Simple Moving Average</a>
        </li>
        <li><a href="#tab2" data-bypass="" data-toggle="pill">Strategy 2: Linear Weighted Moving Average </a></li>
        <li><a href="#tab3" data-bypass="" data-toggle="pill">Strategy 3: Exponential Moving Average</a></li>
        <li><a href="#tab4" data-bypass="" data-toggle="pill">Strategy 4: Triangular Moving Average</a></li>
      </ul>
      <div class="tab-content">
        <div class="tab-pane active" id="tab1">
          <div class="alert alert-info">
            <a class="close" data-dismiss="alert" href="#" data-bypass="">&times;</a>
            <strong>Information:</strong>Our graphs are realtime! The msExchange program that we were given sends us 32400 prices in around 5 seconds, so our application seems to freeze sometimes, but in reality it's working correctly in the background.
          </div>
          <div id="sma-graph">
          </div>
          <form class="form-inline" id="sma-selector">
            <input id="sma-start" type="number" class="input-small" placeholder="Start Time">
            <input id="sma-end" type="number" class="input-small" placeholder="End Time">
            <button type="submit" class="btn" id="sma-select">Update Graph</button>
          </form>

          <table class="table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Type</th>
                <th>Price</th>
                <th>Manager</th>
                <th>Strategy</th>
              </tr>
            <thead>
            <tbody id="SMA">

            </tbody>
          </table>
        </div>
        <div class="tab-pane" id="tab2">
          <div id="lwma-graph">

          </div>
          <form class="form-inline" id="lwma-selector">
            <input id="lwma-start" type="number" class="input-small" placeholder="Start Time">
            <input id="lwma-end" type="number" class="input-small" placeholder="End Time">
            <button type="submit" class="btn" id="lwma-select">Update Graph</button>
          </form>

          <table class="table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Type</th>
                <th>Price</th>
                <th>Manager</th>
                <th>Strategy</th>
              </tr>
            <thead>
            <tbody id="LWMA">

            </tbody>
          </table>


        </div>
        <div class="tab-pane" id="tab3">
          <div id="ema-graph">

          </div>
          <form class="form-inline" id="ema-selector">
            <input id="ema-start" type="number" class="input-small" placeholder="Start Time">
            <input id="ema-end" type="number" class="input-small" placeholder="End Time">
            <button type="submit" class="btn" id="ema-select">Update Graph</button>
          </form>

          <table class="table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Type</th>
                <th>Price</th>
                <th>Manager</th>
                <th>Strategy</th>
              </tr>
            <thead>
            <tbody id="EMA">

            </tbody>
          </table>

        </div>
        <div class="tab-pane" id="tab4">
          <div id="tma-graph">

          </div>
          <form class="form-inline" id="tma-selector">
            <input id="tma-start" type="number" class="input-small" placeholder="Start Time">
            <input id="tma-end" type="number" class="input-small" placeholder="End Time">
            <button type="submit" class="btn" id="tma-select">Update Graph</button>
          </form>

          <table class="table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Type</th>
                <th>Price</th>
                <th>Manager</th>
                <th>Strategy</th>
              </tr>
            <thead>
            <tbody id="TMA">

            </tbody>
          </table>

        </div>
      </div>
  ''',

  schedulingtemplate: '''
    <div class="page-header">
      <h1>Manage effectively! <small></small></h1>
    </div>

  <table class="table">
    <thead>
      <tr>
        <th>Manager Name</th>
        <th>Working Hours</th>
        <th>Break Time</th>
        <th>Strategies</th>
      </tr>
    <thead>
    <tbody id="schedule">
      <tr class="info">
        <td>Manager 1</td>
        <td>9:00 AM-1:30 PM</td>
        <td>11:00AM-11:30AM</td>
        <td>SMA, LWMA</td>
      </tr>

      <tr>
        <td>Manager 2</td>
        <td>9:00 AM-1:30 PM</td>
        <td>11:00 AM-11:30 AM</td>
        <td>EMA, TDA</td>
      </tr>

      <tr class="info">
        <td>Manager 3</td>
        <td>1:30 PM-6:00 PM</td>
        <td>3:30 PM-4:00 PM</td>
        <td>SMA, LWMA</td>
      </tr>

      <tr>
        <td>Manager 4</td>
        <td>1:30 PM-6:00 PM</td>
        <td>3:30 PM-4:00 PM</td>
        <td>EMA, TDA</td>
      </tr>

      <tr class="info">
        <td>Manager 5</td>
        <td>11:00 AM-11:30 AM</td>
        <td>No break</td>
        <td>SMA, LWMA</td>
      </tr>

      <tr>
        <td>Manager 6</td>
        <td>11:00 AM-11:30 AM</td>
        <td>No break</td>
        <td>EMA, TDA</td>
      </tr>

      <tr class="info">
        <td>Manager 7</td>
        <td>3:30 PM-4:00 PM</td>
        <td>No break</td>
        <td>SMA, LWMA</td>
      </tr>

      <tr>
        <td>Manager 8</td>
        <td>3:30 PM-4:00 PM</td>
        <td>No break</td>
        <td>EMA, TDA</td>
      </tr>

    </tbody>
  </table>

  ''',

  reportingtemplate: '''
    <div class="page-header">
      <h1>Reporting! <small></small></h1>
    </div>

    <div class="btn btn-primary btn-large btn-block disabled" id="reportbtn">
      <h1>
        REPORT!
      </h1>
    </div>
  ''',

  transactionrow: '''
    <tr class="<% if(type=="buy") { %>
        success
        <% } %>"
    >
      <td><%= time %></td>
      <td><%= type %></td>
      <td><%= price %></td>
      <td><%= manager %></td>
      <td><%= strategy %></td>
    </tr>
  '''
}
