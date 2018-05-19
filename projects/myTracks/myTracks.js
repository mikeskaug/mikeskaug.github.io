

var map = L.map('map', {zoomControl: false}).setView([39.99,-105.263875], 13);
var tooltip = $('#tooltip')

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
	attribution: '<a href="http://openstreetmap.org">OpenStreetMap</a>, <a href="http://mapbox.com">Mapbox</a>',
	maxZoom: 18,
	id:'mapbox.light',
	accessToken: 'pk.eyJ1IjoibWlrZXNrYXVnIiwiYSI6ImNpZzl1MHJ4eTAydDR1ZG0xcnE1Nm95NnUifQ._cFzGhBLWh5v1tZJ0C15Bg'
    }).addTo(map);

var lineStyle = {
    "color": "#7f7f7f",
    "weight": 3,
    "opacity": 0.7
};

var highlightStyle = {
    "color": "#7f7f7f",
    "weight": 3,
    "opacity": 1
};



new L.Control.Zoom({ position: 'topright' }).addTo(map);


function onEachFeature(feature, layer) {
	
	var tags = /run|bike|hike|approach|ski|bouldering/i;
	var matches = tags.exec(feature.properties.notes);
	
	if (matches !== null){
		switch (matches[0]) {
			case 'run': layer.setStyle({className: "run"}); break;
			case 'bike':   layer.setStyle({className: "bike"}); break;
			case 'hike':   layer.setStyle({className: "hike"}); break;
			case 'approach':   layer.setStyle({className: "approach"}); break;
			case 'ski':   layer.setStyle({className: "ski"}); break;
			case 'bouldering':  break;
		}
	}
	
	layer.on('mouseover',function(e){
		layer.setStyle(highlightStyle);
		tooltip.toggleClass("hidden")
				.css({top: event.pageY, left: event.pageX})
				.find('#value').text(feature.properties.title);
	});
	
	layer.on('mouseout',function(e){
		layer.setStyle(lineStyle);
		tooltip.toggleClass("hidden");
	});
}

function calc_stats(data){
	
	var features = data.features,
		distance = 0,
		elevation_gain = 0;
		
	features.forEach(function(e){

		distance += e.properties.distance * 0.000621371; //convert to miles
		elevation_gain += e.properties.total_ascent * 3.28084 //convert to feet
		
	});
	
	return [distance, elevation_gain]
	
}

function update_board(stats) {
	
	var miles = Math.round( stats[0] );
	var miles_dig = miles.toString().split("").reverse();
	var counter_nums = $($("#miles-counter").find(".num").get().reverse());
	
	for (var i = 0; i < miles_dig.length; i++){

		$(counter_nums[i]).find(".top").text(miles_dig[i]);
		$(counter_nums[i]).find(".shift").text(miles_dig[i]);
		
	}
	
	var ascent = Math.round( stats[1] );
	var ascent_dig = ascent.toString().split("").reverse();
	counter_nums = $($("#ascent-counter").find(".num").get().reverse());
	
	for (var i = 0; i < ascent_dig.length; i++){

		$(counter_nums[i]).find(".top").text(ascent_dig[i]);
		$(counter_nums[i]).find(".shift").text(ascent_dig[i]);
		
	}
}

function load_data(){

	filepath = "tracks/all.topojson";
	$.getJSON(filepath,  function(jsonData) {
		
		for (key in jsonData.objects) {
			
			geojson = topojson.feature(jsonData, jsonData.objects[key]);
			tracks_visible = L.geoJson(geojson,{onEachFeature: onEachFeature, style: lineStyle}).addTo(map);
			var stats = calc_stats(geojson);
			update_board(stats);
			
		}
		
	});

}


load_data();

