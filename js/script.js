var eventList =
[
	{
		"EventId":1,
		"EventTitle":"Feira de Oportunidade da UFRGS",
		"EventType":"Palestra",
		"EventImage":"resource/logo.png",
		"TimeStart":"2014-02-05 15:25:23",
		"TimeEnd":"2014-02-28 14:29:48",
		"Description":"Feira para palestras de empresas interessadas na carne fresca da UFRGS.",
		"Longitude":-51.121261,
		"Latitude":-30.068719
	},
	{
		"EventId":2,
		"EventTitle":"Workshop de WebServices",
		"EventType":"Workshop",
		"EventImage":"resource/logo2.gif",
		"TimeStart":"2014-02-05 00:00:00",
		"TimeEnd":"2014-02-17 00:00:00",
		"Description":"Workshop sobre diferentes tipos de WebServices.",
		"Longitude":-51.120520,
		"Latitude":-30.068685
	}
];

function initialize() {
		var mapCanvas = document.getElementById("events-map");
		var mapOptions = {
		    center: new google.maps.LatLng(-30.068473, -51.120434),
		    zoom: 18,
		    mapTypeId: google.maps.MapTypeId.ROADMAP,
				mapTypeControl: false
		  }

		var map = new google.maps.Map(mapCanvas, mapOptions);

		var infowindow = new google.maps.InfoWindow(), marker, i;
		for (i = 0; i < eventList.length; i++) {
			var start = eventList[i].TimeStart.split(" ");
			var startDate = start[0];
			var startTime = start[1];

			var end = eventList[i].TimeEnd.split(" ");
			var endDate = end[0];
			var endTime = end[1];

			var popupContent =
				"<form action='index.php' method='post'>" +
					"<input type='text' value='" + eventList[i].EventId +"' hidden name='eventId'/>" +
			 		"<table id='eventPopup'>" +
						"<tr>" +
							"<th style='text-align:center;' colspan='4'> <strong>" + eventList[i].EventTitle + "</strong> </th>" +
							"<td colspan='2' style='text-align:right;'>" + eventList[i].EventType + "</td>" +
						"</tr>" +
						"<tr>" +
							"<td class='inp' colspan='1' style='text-align:right;'> Início em </td>" +
							"<td class='inp' colspan='3' style='text-align:center;'> <strong>" + startDate + "</strong> às <strong>"+ startTime + "</strong> </td>" +
							"<td colspan='1' rowspan='3'> <img border='solid 1px' src='"+ eventList[i].EventImage +"' height='150px' style='padding-left:15px'> </td>" +
						"</tr>" +
						"<tr>" +
							"<td class='inp' colspan='1'> até </td><td class='inp' colspan='3' style='text-align:center;'> <strong>" + endDate + "</strong> às <strong>" + endTime + "</strong></td>" +
						"</tr>" +
						"<tr>" +
							"<td class='inp' colspan='1'> <strong> Descrição </strong> </td> <td colspan='3' style='max-width:300px; padding-left:10px'>" + eventList[i].Description + "</td>" +
						"</tr>"+
					"</table>" +
				"</form>";

			marker = new google.maps.Marker({
		    position: new google.maps.LatLng(eventList[i].Latitude, eventList[i].Longitude),
		    map: map,
		    title: eventList[i].EventTitle
	  	});

			google.maps.event.addListener(marker, 'click', (function(marker, popupContent) {
        return function() {
            infowindow.setContent(popupContent);
            infowindow.open(map, marker);
        }
    	}) (marker, popupContent));
		}
}
