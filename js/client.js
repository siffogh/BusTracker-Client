///*********************************************************************************///
///********************** Map-Configuration & Request-Data *************************///
///*********************************************************************************///
var contentString =  '<div class="scrollFix">'+ '<h3> Bus Informaiton </h3>'
+'<div id="bodyContent">'
+'<p>School: American University of Sharjah</p>'
+'<p>Phone Number: +971XXXXXXXXX </p>';
+'</div>' + '</div>'
;

var infowindow = new google.maps.InfoWindow({
  content: contentString
});


function initializeClient() {
  var mapOptions = {
    center: {lat: 25.2150722, lng: 55.4097698},
    zoom: 16
  };

  var map = new google.maps.Map(document.getElementById('client-map'),
    mapOptions);

var userLatLng = new google.maps.LatLng(25.2150722,55.4097698);
var clat, clng;

var marker = new google.maps.Marker({
  position: userLatLng,
  title: 'Your Location',
  map: map,
  icon: 'img/bus.png'
});


google.maps.event.addListener(marker, 'click', function() {
  infowindow.open(map,marker);
});

var polyOptions = {
  strokeColor: '#FF0000',
  strokeOpacity: 3.0,
  strokeWeight: 3
};
poly = new google.maps.Polyline(polyOptions);
poly.setMap(map);
setInterval(function(){
  $.get("http:ec2-54-148-134-208.us-west-2.compute.amazonaws.com:8001/get", function(data){
    if(data.lat > 0 && ( (clat != data.lat) || (clng != data.longi) ) )
    {
      moveBus(data.lat,data.longi);
      clat = data.lat;
      clng = data.longi;
    }
  })
}, 1000);



function moveBus(lat,lng) {
  temp = new google.maps.LatLng(lat,lng);
  marker.setPosition(temp);
  map.panTo(temp);
  poly.getPath().push(new google.maps.LatLng(lat,lng));
}


}

///*********************************************************************************///
///********************************* Location-map *********************************///
///*********************************************************************************///

var markers = [];

var input =document.getElementById('pac-input');

var searchBox;

function initializeLocationMap(){
  var mapOptions = {
    center: {lat: 25.2150722, lng: 55.4097698},
    zoom: 10
  };

  var map = new google.maps.Map(document.getElementById('location-map'),
    mapOptions);

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  searchBox = new google.maps.places.SearchBox((input))
  google.maps.event.addListener(searchBox, 'places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }
 
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0, place; place = places[i]; i++) {
      bounds.extend(place.geometry.location);
    }

    map.fitBounds(bounds);
  });

  google.maps.event.addListener(map, 'bounds_changed', function() {
    var bounds = map.getBounds();
    searchBox.setBounds(bounds);
  });

  var locMarker, loc;
  $.get("http://localhost:8001/getInfo", function(data){
    loc = new google.maps.LatLng(data.lat,data.lng);
    locMarker = new google.maps.Marker({
      position: loc,
      title: 'Your Location',
      map: map
    });
    var els = document.getElementsByClassName("ttn-input");
    Array.prototype.forEach.call(els, function(el) {
      if(data.arr.indexOf(el.value) > -1)
      {
        el.checked = true;
      }
      else
        el.checked = false;
    });

  });

  google.maps.event.addListener(map, 'click', setLocation);

  function setLocation(event){
    $.post("http://localhost:8001/setLocation", {body: JSON.stringify({lat: event.latLng.lat(), lng: event.latLng.lng()}) }, function(){
    });
    locMarker.setMap(map);
    locMarker.setPosition(event.latLng);
    map.panTo(locMarker);

  }


}



///*********************************************************************************///
///********************************* GUI-Functions *********************************///
///*********************************************************************************///

var clientActive = 'client-home';

function activeTab(obj){
  if(obj.id != clientActive)
  {
    obj.className = 'tab-item active';
    document.getElementById(clientActive).className = 'tab-item';
    clientActive = obj.id;
  }

}

function showClientSettings(){
  document.getElementById('client-settings-view').style.display = 'block';
  document.getElementById('client-map').style.display = 'none';
  document.getElementById('client-notifications-view').style.display = 'none';
  initializeLocationMap();
}

function showClientNotifications(){
  document.getElementById('client-notifications-view').style.display = 'block';
  document.getElementById('client-map').style.display = 'none';
  document.getElementById('client-settings-view').style.display = 'none';
}

function showClientHome(){
  document.getElementById('client-settings-view').style.display = 'none';
  document.getElementById('client-map').style.display = 'block';
  document.getElementById('client-notifications-view').style.display = 'none';
}

function showDivider(divider){
  var divider = document.getElementById(divider);
  if(divider.style.display == 'none')
    divider.style.display = 'block';
  else
    divider.style.display = 'none';
}

function showClient(){
  document.getElementById('client-page').style.display = 'block';
  document.getElementById('main-page').style.display = 'none';
  initializeClient();
}

function changeTtn(obj){
  if(obj.checked)
  {
    $.post("http://localhost:8001/pushTtn", {body: JSON.stringify({ttn: obj.value}) }, function(){

    });
  }
  else
    $.post("http://localhost:8001/popTtn", {body: JSON.stringify({ttn: obj.value}) }, function(){

    });
}