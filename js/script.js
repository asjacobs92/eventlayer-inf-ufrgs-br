// Variaveis Globais

var eventList;		//Armazena todos os eventos
var map;
var markers = [];	//Armazena todos os marcadores do mapa

var page = "php/consulta.php"; 	//Página para a consulta dos eventos no banco de dados

//Inicializa com a página
function initialize() {
	initializeMap();
	$.getJSON(page, initializeEvents); //Retorna a lista de eventos da pagina PAGE e aplica como parametro na função initializeEvents

}

//Inicializa o mapa
function initializeMap() {
	var mapCanvas = document.getElementById("events-map");
	var mapOptions = {
			center: new google.maps.LatLng(-30.068473, -51.120434),
			zoom: 18,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			mapTypeControl: false
		}
	map = new google.maps.Map(mapCanvas, mapOptions)
}

function initializeEvents(eventList) {
	
	var infowindow = new google.maps.InfoWindow(), marker, i;

	//Variaveis para definir o centro do mapa
	var centerLng = 0;
	var centerLat = 0;

	for (i = 0; i < eventList.length; i++) {
		var start = eventList[i].timeStart.split(" ");
		var startDate = start[0];
		var startTime = start[1];

		var end = eventList[i].timeEnd.split(" ");
		var endDate = end[0];
		var endTime = end[1];

		//Soma as coordenadas de cada um dos marcadores, para depois fazer a média de localização
		centerLat += parseFloat(eventList[i].latitude);
		centerLng += parseFloat(eventList[i].longitude);

		var eventInfo =
			"<form action='index.php' method='post'>" +
				"<input type='text' value='" + eventList[i].eventId +"' hidden name='eventId'/>" +
				"<div class='event-card-wide mdl-card mdl-shadow--2dp mdl-js-ripple-effect'>" + 
			      	"<div class='mdl-card__title' style='background: url("+ eventList[i].image +") left top / cover'>" + 
			      		"<h2 class='mdl-card__title-text'>" + eventList[i].title + "</h2>" + 
			      	"</div>" +
			      	"<div class='mdl-card__supporting-text'>" + 
			      		"<table id='eventPopup'>" +
				      		"<tr>" +
								"<td class='inp' colspan='0'>Início em </td>" +
								"<td class='inp' colspan='2'> <strong>" + startDate + "</strong> às <strong>"+ startTime + "</strong> </td>" +
								"<td class='inp' colspan='3'>" + eventList[i].type + "</td>" +
							"</tr>" +
							"<tr>" +
								"<td class='inp' colspan='0'> até </td><td class='inp' colspan='2' style='text-align:center;'> <strong>" + endDate + "</strong> às <strong>" + endTime + "</strong></td>" +
							"</tr>" +
						"</table>" +
						eventList[i].description + eventList[i].placeName +
			      	"</div>" +
			    "</div>" +
		    "</form>";
		$('#events-list').append(("<div class='mdl-cell mdl-cell--1-col clickable justified'> " + eventInfo + "</div>"));	//events on list

	  	var imageBig = {
	    	url: 'resource/gps45.png',
		  	size: new google.maps.Size(50, 60),
		  	origin: new google.maps.Point(4, 0),
		  	scaledSize: new google.maps.Size(60, 60)
  		};

  		var imageSimple = {
	    	url: 'resource/pin59.png',
		  	size: new google.maps.Size(40, 60),
		  	origin: new google.maps.Point(4, 0),
		  	scaledSize: new google.maps.Size(50, 50)
  		};

		marker = new google.maps.Marker({
			position: new google.maps.LatLng(eventList[0].latitude, eventList[0].longitude),
			map: map,
			animation: google.maps.Animation.DROP,
			icon: imageSimple,
			title: eventList[0].title
		});


		bigMarker = new google.maps.Marker({
			position: new google.maps.LatLng(eventList[1].latitude, eventList[1].longitude),
			map: map,
			animation: google.maps.Animation.DROP,
			icon: imageBig,
			title: eventList[1].title
		});

		function toggleBounce() {
		  if (marker.getAnimation() !== null) {
		    marker.setAnimation(null);
		  } else {
		    marker.setAnimation(google.maps.Animation.BOUNCE);
		  }
		}

		google.maps.event.addListener(marker, 'mouseover', (function(marker, eventInfo) {		//markers on map
			return function() {
					infowindow.setContent(eventInfo);
					infowindow.open(map, marker);
			}
		}) (marker, eventInfo));

		google.maps.event.addListener(marker, 'mouseout', (function(marker, eventInfo) {		//markers on map
			return function() {
					infowindow.close();
			}
		}) (marker, eventInfo));

		google.maps.event.addListener(bigMarker, 'click', (function(bigMarker, eventInfo) {		//markers on map
			return function() {
					$('#events-list').slideToggle();
			}
		}) (bigMarker, eventInfo));

		google.maps.event.addListener(infowindow, 'domready', function() {
		    // Reference to the DIV that wraps the bottom of infowindow
		    var infoWindowOuter = $('.gm-style-iw');
		    var infoWindowBackground = infoWindowOuter.prev();
		    // Removes background shadow DIV
		    infoWindowBackground.children(':nth-child(2)').css({'display' : 'none'});
		    // Removes white background DIV
		    infoWindowBackground.children(':nth-child(4)').css({'display' : 'none'});

		    infoWindowBackground.children(':nth-child(3)').find('div').children().css({'box-shadow': 'rgba(178, 178, 178, 0.6) 0px 1px 6px', 'z-index' : '1'});

		    // Reference to the div that groups the close button elements.
		    var infoWindowCloseBtn = infoWindowOuter.next();
		    // Apply the desired effect to the close button
		    infoWindowCloseBtn.css({display: 'none'});
		  });

		markers.push(marker);
	}

	//Calcula a localização central (média) entre os marcadores de eventos
	centerLat /= eventList.length;
	centerLng /= eventList.length;

	//Define o centro do mapa
	var center = new google.maps.LatLng(centerLat, centerLng);
	map.setCenter(center);
	
}

//Limpa todos os marcadores do mapa
function deleteMarkers() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];
}

function toggleList() {
	$('#events-list').slideToggle();
}

//Constrói a consulta ao banco de dados de acordo com os filtros aplicados
function consulta() {

	var and = 0;	//Valor booleano para aplicar mais de um filtro

	//Fecha a aba lateral
	$('.mdl-layout__drawer').removeClass('is-visible');

	page = "php/consulta.php";	//Página base

	//Pesquisa por palavra-chave
	if ($("#txt").val().length > 0){
		var value = $("#txt").val();
		page = page + "?txt=" + value;
		and = 1;
	}

	//Data inicial (mínima)
	if ($("#ts").val().length > 0){
		var value = $("#ts").val();
		if(and){
			page = page + "&ts=" + value;
		}
		else{
			page = page + "?ts=" + value;
			and = 1;
		}
	}

	//Data final (máxima)
	if ($("#te").val().length > 0){
		var value = $("#te").val();
		if(and){
			page = page + "&te=" + value;
		}
		else{
			page = page + "?te=" + value;
			and = 1;
		}
	}

	//Tipo de evento
	if ($("#Workshop").prop('checked')){
		if(and){
			page = page + "&wo=1";
		}
		else{
			page = page + "?wo=1";
			and = 1;
		}
	}

	//Tipo de evento
	if ($("#Palestra").prop('checked')){
		if(and){
			page = page + "&pa=1";
		}
		else{
			page = page + "?pa=1";
			and = 1;
		}
	}

	//alert(page);

	//Limpa os eventos e marcadores
	$('#events-list').empty();
	eventList = null;
	deleteMarkers();

	//Realiza noca busca
	$.getJSON(page, initializeEvents);

}

//Limpa o formulário de filtros
function limpa(){
	$('#myform').trigger("reset");
	$('#txt').val("");
	$('.mdl-checkbox').removeClass('is-checked');
}

//Consulta rápida, apenas por palavra-chave
function consultaRapida(){
		limpa();
		$('#txt').val($('#search').val());
		consulta();
		$('#txt').val("");
}

