function initialize() {
		var mapCanvas = document.getElementById("events-map");
		var mapOptions = {
		    center: new google.maps.LatLng(-30.068473, -51.120434),
		    zoom: 18,
		    mapTypeId: google.maps.MapTypeId.ROADMAP
		  }

		var map = new google.maps.Map(mapCanvas, mapOptions);
}
