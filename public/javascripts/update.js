function update() {
	$.ajax({
		url: "/javascripts/btcestats.json",
		dataType: "json",
		data: "",
		success: function(json) {
			var pair = $("#pair").val();
			console.log(pair);
			$("#sell_price").html(json[pair].sell);
			$("#buy_price").html(json[pair].buy);
		}
	});
	setTimeout(function () { update(); }, 2000);
}

update();
