function fillSellAmount() {
	document.getElementById('sell_amount_input').value = document.getElementById('sell_amount').innerHTML
}

function fillSellPrice() {
	document.getElementById('sell_price_input').value = document.getElementById('sell_price').innerHTML
}

function fillBuyAmount() {
	document.getElementById('buy_amount_input').value = (document.getElementById('buy_amount').innerHTML / document.getElementById('buy_price').innerHTML).toFixed(6)}

function fillBuyPrice() {
	document.getElementById('buy_price_input').value = document.getElementById('buy_price').innerHTML
}

function clearPrices() {
	document.getElementById('buy_price_input').value = "";
	document.getElementById('buy_amount_input').value = "";
	document.getElementById('sell_price_input').value = "";
	document.getElementById('sell_amount_input').value = "";
}
