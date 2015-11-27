// Variaveis Globais

var eventList;		//Armazena todos os eventos em JSON
var map;
var markers = [];	//Armazena todos os marcadores do mapa
var cards = [];		//Armazena todos os cartões de eventos
var mcOptions;
var markerCluster;

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

	var infobox = new InfoBox(), marker, i;
	//Variaveis para definir o centro do mapa
	var centerLng = 0;
	var centerLat = 0;

	for (i = 0; i < eventList.length; i++) {

		//Soma as coordenadas de cada um dos marcadores, para depois fazer a média de localização
		centerLat += parseFloat(eventList[i].latitude);
		centerLng += parseFloat(eventList[i].longitude);

		// Compõe o card de um Evento através de outra função

		var card = createEventInfo(eventList[i], i);

		// Alimenta a Lista de eventos
		var learnMoreBtn =
			"<div class='mdl-card__actions mdl-card--border'>" +
				"<a class='mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect'>" +
				  "Saiba mais" +
				"</a>" +
			"</div>" ;

		var infoboxPointer =
			"<img class='infobox-pointer' src='resource/ic_arrow_drop_down_white.png'/>";

		// Alimenta a Lista de eventos
		$('#events-list').append(("<div class='mdl-cell mdl-cell--1-col' onclick='openMarker(" + i + ")'> " + card + "</div>"));
		$('#events-list').find('#event-card-' + i).append(learnMoreBtn);

		marker = new google.maps.Marker({
			position: new google.maps.LatLng(eventList[i].latitude, eventList[i].longitude),
			map: map,
			animation: google.maps.Animation.DROP,
			title: eventList[i].title
		});


		function toggleBounce() {
			if (marker.getAnimation() !== null) {
				marker.setAnimation(null);
			} else {
				marker.setAnimation(google.maps.Animation.BOUNCE);
			}
		}

		google.maps.event.addListener(marker, 'click', (function(marker, card) {		//markers on map
			return function() {
					infobox.setContent(card + infoboxPointer);
					infobox.setOptions({
							maxWidth: 448,
							pixelOffset: new google.maps.Size(-220, -300),
						});
					infobox.open(map, marker);
					centerAtMarker(marker);
			}
		}) (marker, card));

		google.maps.event.addListener(map, 'click', (function(marker, card) {		//markers on map
			return function() {
					infobox.close();
			}
		}) (marker, card));

		markers.push(marker);
		cards.push(card);
		//markers.push(bigMarker);
	}

	// Define os parametros e cria os clusters de agrupamento dos marcadores
	mcOptions = {
		//gridSize: 30,
		maxZoom: 17,
		//zoomOnClick: false
	};
	markerCluster = new MarkerClusterer(map, markers, mcOptions);

	/*google.maps.event.addListener(markerCluster,'clusterclick',
		function(cluster){
			var clusterCenter = cluster.getCenter();
			//centerAtMarker(markersArray[0]);
			map.setZoom(18);
			map.panTo(clusterCenter);
			map.panBy(0,-100);
		}
	);*/

	//Calcula a localização central (média) entre os marcadores de eventos
	centerLat /= eventList.length;
	centerLng /= eventList.length;

	//Define o centro do mapa
	var center = new google.maps.LatLng(centerLat, centerLng);
	map.setCenter(center);
	map.panBy(0,-100);

}

//Limpa todos os marcadores do mapa
function deleteMarkers() {
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(null);
	}
	markers = [];
	markerCluster.clearMarkers();
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

	//Realiza nova busca
	$.getJSON(page, initializeEvents);

}

//Limpa o formulário de filtros
function limpa(){
	$('#myform').trigger("reset");
	$('#txt').val("");
	$('#search').val("");
	$('.mdl-checkbox').removeClass('is-checked');
}

//Consulta rápida, apenas por palavra-chave
function consultaRapida(){
		limpa();
		$('#txt').val($('#search').val());
		consulta();
		$('#txt').val("");
}

// Centraliza mapa após selecionar um marcador
function centerAtMarker(marker){
	var markerCenter = new google.maps.LatLng(marker.getPosition().lat(),marker.getPosition().lng());
	map.setZoom(18);
	map.panTo(markerCenter);
	map.panBy(0,-100);
}

// Localiza o marcador na lista de eventos (event-list)
function openMarker(id){
	google.maps.event.trigger(markers[id], 'click');
	toggleList();
}

// Cria o Card em HTML com as informações do Evento
function createEventInfo(event, index){
	var start = event.timeStart.split(" ");
	var startDate = start[0];
	var startTime = start[1];

	var end = event.timeEnd.split(" ");
	var endDate = end[0];
	var endTime = end[1];

	var card =
		"<div id='event-card-"+ index +"' class='event-card-wide mdl-card mdl-shadow--2dp'>" +
	      	"<div class='mdl-card__title' style='background: url("+ event.image +") left top / cover'>" +
	      		"<h2 class='mdl-card__title-text'>" + event.title + "</h2>" +
	      	"</div>" +
			"<div class='mdl-card__supporting-text'>" +
			  "<table style='width: 100%;'>" +
				  "<tr>" +
					  "<td class='inp' colspan='1'>Início em </td>" +
					  "<td class='inp' colspan='1'> <strong>" + startDate + "</strong> às <strong>"+ startTime + "</strong> </td>" +
					  "<td class='inp' style='width: 40%; color: rgba(255,0,0,1);' colspan='1' align='right'>" + event.type + "</td>" +
				  "</tr>" +
				  "<tr>" +
					  "<td class='inp' colspan='1'>até </td>" +
					  "<td class='inp' colspan='1'><strong>" + endDate + "</strong> às <strong>" + endTime + "</strong></td>" +
				  "</tr>" + "<tr></tr>" +
				  "<tr>" +
				  	  "<td class='inp' colspan='1'>Local </td>" +
					  "<td class='inp' colspan='2'> <strong>" + event.placeName + "</strong></td>" +
				  "</tr>" +
			  "</table>" +
		  	"</div>" +
		"</div>";
	return card;
}
