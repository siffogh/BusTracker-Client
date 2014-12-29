///*********************************************************************************///
///********************************* Trip-Simulation *******************************///
///*********************************************************************************///
var i=0;
var arr = [
[25.2150722,55.4097698],
[25.2152275,55.4097698],
[25.2153634,55.4097913],
[25.2155769,55.4098557],
[25.2159652,55.4098557],
[25.2163729,55.4098557],
[25.2165087,55.4098557],
[25.2166058,55.4098557],
[25.2167417,55.4098557],
[25.2168776,55.4098557],
[25.2170329,55.4098557],
[25.2172076,55.4098771],
[25.2174017,55.4098986],
[25.2176541,55.4098986],
[25.2180035,55.4099200],
[25.2181782,55.4098986],
[25.2183530,55.4098986],
[25.2186636,55.4098986],
[25.2189547,55.4098986],
[25.2191877,55.4098986],
[25.2193624,55.4097269],
[25.2193624,55.4092763],
[25.2194012,55.4084609]
];

function giveServer(){
    $.post("http://ec2-54-148-134-208.us-west-2.compute.amazonaws.com:8001/post", { body:JSON.stringify({lat: arr[i][0], longi: arr[i][1]}) }, function(){
      i++;
      if(i<23)
        setTimeout(giveServer,1000);
    });
  }
  

///*********************************************************************************///
///********************************* Map-Configuration *****************************///
///*********************************************************************************///

function initializeBus() {
  var mapOptions = {
    center: {lat: 25.2150722, lng: 55.4097698},
    zoom: 16
  };

  var map = new google.maps.Map(document.getElementById('bus-map'),
    mapOptions);


var userLatLng = new google.maps.LatLng(25.2150722,55.4097698);

var marker = new google.maps.Marker({
  position: userLatLng,
  title: 'Your Location',
  map: map,
  icon: 'img/bus.png'
});


var polyOptions = {
  strokeColor: '#FF0000',
  strokeOpacity: 3.0,
  strokeWeight: 3
};
poly = new google.maps.Polyline(polyOptions);
poly.setMap(map);
var clat, clng;
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
///********************************* GUI-Functions *********************************///
///*********************************************************************************///

var active = 'bus-home';

function showBusSettings(){                   //To show settings tab
  document.getElementById('bus-settings-view').style.display = 'block';
  document.getElementById('bus-map').style.display = 'none';
  document.getElementById('bus-notifications-view').style.display = 'none';
}

function showBusDelay(){             //To show Notifications tab
  document.getElementById('bus-notifications-view').style.display = 'block';
  document.getElementById('bus-map').style.display = 'none';
  document.getElementById('bus-settings-view').style.display = 'none';
}

function showBusHome(){                      //To show Home tab
  document.getElementById('bus-settings-view').style.display = 'none';
  document.getElementById('bus-map').style.display = 'block';
  document.getElementById('bus-notifications-view').style.display = 'none';
}


function showBus(){                      //To show BusDriver Application    
  document.getElementById('bus-page').style.display = 'block';
  document.getElementById('main-page').style.display = 'none';
  initializeBus();
  giveServer();
}