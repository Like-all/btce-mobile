var settings = require('../settings.js'),
	querystring = require('querystring'),
	https = require('https'),
	fs = require('fs'),
	crypto = require('crypto'),
	btc_nonce = fs.readFileSync('/tmp/btcenonce', 'utf8');

function BtceClient(key, secret) {
	this.key = key;
	this.secret = secret;
}

BtceClient.prototype.query = function(args, callback) {
	var client = this;
	if (typeof args != 'object') args = {};
	btc_nonce++;
	fs.writeFileSync('/tmp/btcenonce', btc_nonce);
	args['nonce'] = btc_nonce;
	var post = querystring.stringify(args);
	var hmac = crypto.createHmac('sha512', client.secret);
	hmac.update(post);
	
	var options = {
		host: 'btc-e.com',
		port: 443,
		path: '/tapi',
		method: 'POST',
		agent: false,
		headers: {
			'Content-type': 'application/x-www-form-urlencoded',
			'Key': client.key,
			'Sign': hmac.digest('hex')
		}
	}

	var req = https.request(options, function(res){
		res.setEncoding('utf8');
		var buffer = '';
		res.on('data', function(data) {buffer += data; });
		res.on('end', function() { if (typeof callback == 'function') { callback(JSON.parse(buffer)); } });
	});

	req.on('error', function(e) { console.log('an error occured: ' + e.message); });
	req.write(post);
	req.end();
	console.log("Btc Nonce: " + btc_nonce);
}

exports.pairs = function(req, res) {
	res.render('pairs');
};

exports.index = function(req, res) {
	var btcestats = JSON.parse(fs.readFileSync('/tmp/btcestats.json', 'utf8'));
	var client = new BtceClient(settings.getKey(), settings.getSecret()), apiresponse = '';
	client.query({'method': 'getInfo'}, function(json) {
		switch (req.params.pair) {
			case 'btc_usd':
				res.render('index', 
							{
								sell_currency: 'BTC',
								buy_currency: 'USD',
								sell_price: btcestats.btc_usd.sell,
								buy_price: btcestats.btc_usd.buy,
								sell_amount: json.return.funds.btc,
								buy_amount: json.return.funds.usd,
								hidden: '<input type="hidden" id="pair" name="pair" value="btc_usd">'
							}
				);
				break;
			case 'btc_rur':
				res.render('index', 
							{
								sell_currency: 'BTC',
								buy_currency: 'RUR',
								sell_price: btcestats.btc_rur.sell,
								buy_price: btcestats.btc_rur.buy,
								sell_amount: json.return.funds.btc,
								buy_amount: json.return.funds.rur,
								hidden: '<input type="hidden" id="pair" name="pair" value="btc_rur">'
							}
				);
				break;
			case 'ltc_usd':
				res.render('index', 
							{
								sell_currency: 'LTC',
								buy_currency: 'USD',
								sell_price: btcestats.ltc_usd.sell,
								buy_price: btcestats.ltc_usd.buy,
								sell_amount: json.return.funds.ltc,
								buy_amount: json.return.funds.usd,
								hidden: '<input type="hidden" id="pair" name="pair" value="ltc_usd">'
							}
				);
				break;
			case 'ltc_rur':
				res.render('index', 
							{
								sell_currency: 'LTC',
								buy_currency: 'RUR',
								sell_price: btcestats.ltc_rur.sell,
								buy_price: btcestats.ltc_rur.buy,
								sell_amount: json.return.funds.ltc,
								buy_amount: json.return.funds.rur,
								hidden: '<input type="hidden" id="pair" name="pair" value="ltc_rur">'
							}
				);
				break;
		} });
};

exports.sell = function(req, res) {
	//console.log(req.query);
	if (req.query.amount == '' || req.query.price == '') {
		res.render('operation', { opStatus: 'Error. You must type a values in.', backlink: '<a href="pair/' + req.query.pair + '"> Go back</a>' });
	} else {
		var client = new BtceClient(settings.getKey(), settings.getSecret()), apiresponse = '';
		client.query({'method': 'Trade', pair: req.query.pair, type: 'sell', rate: req.query.price, amount: req.query.amount }, function(json) {
			res.render('operation', { opStatus: 'Order succesfully created', backlink: '<a href="pair/' + req.query.pair + '"> Go back</a>' });
			console.log(json);
		});
	}
};

exports.buy = function(req, res) {
	if (req.query.amount == '' || req.query.price == '') {
		res.render('operation', { opStatus: 'Error. You must type a values in.', backlink: '<a href="pair/' + req.query.pair + '"> Go back</a>' });
	} else {
		var client = new BtceClient(settings.getKey(), settings.getSecret()), apiresponse = '';
		client.query({'method': 'Trade', pair: req.query.pair, type: 'buy', rate: req.query.price, amount: req.query.amount }, function(json) {
			res.render('operation', { opStatus: 'Order succesfully created', backlink: '<a href="pair/' + req.query.pair + '">Go back</a>' });
			console.log(json);
		});
	}
}

exports.orders = function(req, res) {
	var client = new BtceClient(settings.getKey(), settings.getSecret()), apiresponse = '';
	client.query({'method': 'ActiveOrders'}, function(json){
		var orders_table = ''
		for (i in json.return) {
			orders_table += '<div class="alert alert-success"><form action="../cancel">' + json.return[i].pair + ' ' + json.return[i].type + ' ' + json.return[i].amount + ' at ' + json.return[i].rate + '<input type="hidden" name="order" value="' + i + '"><button class="btn btn-danger pull-right" type="submit">Cancel</button></form></div>';
		}
		res.render('orders', { ordersTable: orders_table});
	});
}

exports.cancel = function(req, res) {
	var client = new BtceClient(settings.getKey(), settings.getSecret()), apiresponse = '';
	client.query({'method': 'CancelOrder', order_id: req.query.order }, function(json) {
		res.render('operation', { opStatus: 'Order ' + req.query.order + ' successfully cancelled', backlink: '<a href="/orders">Go back</a>' });
		console.log(json);
	});
}
