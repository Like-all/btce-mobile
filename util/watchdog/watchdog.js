#!/usr/bin/env node

var https = require("https"),
	fs = require("fs"),
	async = require("async"),
	currencies = ["btc_usd",
		"btc_rur",
		"btc_eur",
		"ltc_btc",
		"ltc_usd",
		"ltc_rur",
		"ltc_eur",
		"nmc_btc",
		"nmc_usd",
		"nvc_btc",
		"nvc_usd",
		"usd_rur",
		"eur_usd",
		"ppc_btc",
		"ftc_btc",
		"xpm_btc"
	];

function checkTickers() {
	tickers_ready = false;
	async.parallel([
		function(callback) {
			btc_usd = '';
			https.get("https://btc-e.com/api/2/btc_usd/ticker", function(res) {
				res.on('data', function(chunk) { btc_usd += chunk; });
				res.on('end', function() { callback(null, JSON.parse(btc_usd)); });
			});
		},
		function(callback) {
			btc_rur = '';
			https.get("https://btc-e.com/api/2/btc_rur/ticker", function(res) {
				res.on('data', function(chunk) { btc_rur += chunk; });
				res.on('end', function() { callback(null, JSON.parse(btc_rur)); });
			});
		},
		function(callback) {
			btc_eur = '';
			https.get("https://btc-e.com/api/2/btc_eur/ticker", function(res) {
				res.on('data', function(chunk) { btc_eur += chunk; });
				res.on('end', function() { callback(null, JSON.parse(btc_eur)); });
			});
		},
		function(callback) {
			ltc_btc = '';
			https.get("https://btc-e.com/api/2/ltc_btc/ticker", function(res) {
				res.on('data', function(chunk) { ltc_btc += chunk; });
				res.on('end', function() { callback(null, JSON.parse(ltc_btc)); });
			});
		},
		function(callback) {
			ltc_usd = '';
			https.get("https://btc-e.com/api/2/ltc_usd/ticker", function(res) {
				res.on('data', function(chunk) { ltc_usd += chunk; });
				res.on('end', function() { callback(null, JSON.parse(ltc_usd)); });
			});
		},
		function(callback) {
			ltc_rur = '';
			https.get("https://btc-e.com/api/2/ltc_rur/ticker", function(res) {
				res.on('data', function(chunk) { ltc_rur += chunk; });
				res.on('end', function() { callback(null, JSON.parse(ltc_rur)); });
			});
		},
		function(callback) {
			ltc_eur = '';
			https.get("https://btc-e.com/api/2/ltc_eur/ticker", function(res) {
				res.on('data', function(chunk) { ltc_eur += chunk; });
				res.on('end', function() { callback(null, JSON.parse(ltc_eur)); });
			});
		},
		function(callback) {
			nmc_btc = '';
			https.get("https://btc-e.com/api/2/nmc_btc/ticker", function(res) {
				res.on('data', function(chunk) { nmc_btc += chunk; });
				res.on('end', function() { callback(null, JSON.parse(nmc_btc)); });
			});
		},
		function(callback) {
			nmc_usd = '';
			https.get("https://btc-e.com/api/2/nmc_usd/ticker", function(res) {
				res.on('data', function(chunk) { nmc_usd += chunk; });
				res.on('end', function() { callback(null, JSON.parse(nmc_usd)); });
			});
		},
		function(callback) {
			nvc_btc = '';
			https.get("https://btc-e.com/api/2/nvc_btc/ticker", function(res) {
				res.on('data', function(chunk) { nvc_btc += chunk; });
				res.on('end', function() { callback(null, JSON.parse(nvc_btc)); });
			});
		},
		function(callback) {
			nvc_usd = '';
			https.get("https://btc-e.com/api/2/nvc_usd/ticker", function(res) {
				res.on('data', function(chunk) { nvc_usd += chunk; });
				res.on('end', function() { callback(null, JSON.parse(nvc_usd)); });
			});
		},
		function(callback) {
			usd_rur = '';
			https.get("https://btc-e.com/api/2/usd_rur/ticker", function(res) {
				res.on('data', function(chunk) { usd_rur += chunk; });
				res.on('end', function() { callback(null, JSON.parse(usd_rur)); });
			});
		},
		function(callback) {
			eur_usd = '';
			https.get("https://btc-e.com/api/2/eur_usd/ticker", function(res) {
				res.on('data', function(chunk) { eur_usd += chunk; });
				res.on('end', function() { callback(null, JSON.parse(eur_usd)); });
			});
		},
		function(callback) {
			ppc_btc = '';
			https.get("https://btc-e.com/api/2/ppc_btc/ticker", function(res) {
				res.on('data', function(chunk) { ppc_btc += chunk; });
				res.on('end', function() { callback(null, JSON.parse(ppc_btc)); });
			});
		},
		function(callback) {
			ftc_btc = '';
			https.get("https://btc-e.com/api/2/ftc_btc/ticker", function(res) {
				res.on('data', function(chunk) { ftc_btc += chunk; });
				res.on('end', function() { callback(null, JSON.parse(ftc_btc)); });
			});
		},
		function(callback) {
			xpm_btc = '';
			https.get("https://btc-e.com/api/2/xpm_btc/ticker", function(res) {
				res.on('data', function(chunk) { xpm_btc += chunk; });
				res.on('end', function() { callback(null, JSON.parse(xpm_btc)); });
			});
		}
		],
		function(err, results) {
			var outJson = "{"
			for (var i in results) {
				outJson += "\"" + currencies[i] + "\": {\"last\": \"" + results[i].ticker.last + "\", \"sell\": \"" + results[i].ticker.sell + "\", \"buy\": \"" + results[i].ticker.buy + "\"}";
				if (i < results.length - 1 ){
					outJson += ", ";
				} else {
					outJson += "}";
				}
			}
			fs.open('/tmp/btcestats.json', 'w', function(err,fd) {
				var writeBuffer = new Buffer(outJson),
					bufferOffset = 0,
					bufferLength = writeBuffer.length,
					filePosition = null;
				fs.write(fd, writeBuffer, bufferOffset, bufferLength, filePosition, function(err, written) { if(err) { throw err; } });
			});
			tickers_ready = true;
		}
	);
	function when() {
		if (tickers_ready) {
			checkTickers();
		} else {
			setTimeout(function() { when(); }, 2000);
		}
	}
	when();
}

fs.writeFileSync("/tmp/btce-watchdog.pid", process.pid);

checkTickers();
