var app = angular.module("biteLA", []);

app.service('Map', function(){

   	this.mapMarkers = [];
   	this.centerLatlng = null;


	this.init = function(){

		mapOptions = { 
            center: this.centerLatlng,
            zoom: 12,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: true
        };

        this.map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
        this.places = new google.maps.places.PlacesService(this.map);
	}



	//clear all markers from map 
	this.setMapOnAll = function(map){
    	for (var i = 0; i < this.mapMarkers.length; i++) {
        	this.mapMarkers[i].setMap(map);
	    }
	}

	//clear the entire map
	this.clearMap = function(){
    	this.setMapOnAll(null);
	}

	  this.textSearch = function(str, callback) {

        var request = {
	        location: this.centerLatlng,
	        keyword: str,
	        rankBy: google.maps.places.RankBy.DISTANCE,
	        types: [ 'bakery',
	        		'bar',
	        		'cafe',
	        		'convenience_store',
	        		'food', 
	        		'grocery_or_supermarket', 
	        		'gas_station', 
	        		'liquor_store', 
	        		'meal_delivery', 
	        		'meal_takeaway',
	        		'restaurant', 
	        		
	        		]
    	};	

        this.places.nearbySearch(request, callback);

    
    }
    
    this.addMarker = function(res) {
        this.marker = new google.maps.Marker({
            map: this.map,
            position: res.geometry.location
        });

        this.mapMarkers.push(this.marker);

    }
    
});
