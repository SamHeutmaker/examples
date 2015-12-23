
angular.module('bite-controllers', [])

.controller('MapCtrl', function($scope, $ionicPlatform, $interval) {


    //map object
    $scope.map = "";
    //map center
    $scope.mapCenter = "";
    //places object
    $scope.places = "";
    //search results
    $scope.searchResults = [];
    //currently mapped result markers
    $scope.resultMapMarkers = [];
    //user interests
    $scope.userInterests = [];
    //user pin
    $scope.userPin = "";
    //function to watch user location
    $scope.watchUser = "";
    //drawn radius
    $scope.drawnRadius = "";



    //store map and places objects
    $scope.passMap = function(mapObj) {
            $scope.map = mapObj;
            $scope.$apply();
            $scope.mapCenter = $scope.map.getCenter();
            $scope.places = new google.maps.places.PlacesService($scope.map);
            $scope.$apply();
            $scope.radiusSliderValue = "50000";
            $scope.$watch('radiusSliderValue', function() {
                $scope.drawRadius();
                $scope.keyUp();
            });
        }



////////// EventCircle API //////////

$scope.searchEventCircle = function(){

    $.ajax({
            type: "GET",
            url: "http://localhost:8888/StartUp/php/getPosts.php",        
            success: function(data) {   
                var eventsObject = jQuery.parseJSON(data);
                var eventsArray = eventsObject.events;
                var firstEvent = jQuery.parseJSON(eventsArray[0]);
                console.log(firstEvent.website);

            },



//             var returnedEvent = jQuery.parseJSON(data);
            
//             var geocoder = new google.maps.Geocoder();
//             var address = returnedEvent.events[0].address;

//         geocoder.geocode( { 'address': address}, function(results, status) {

//         if (status == google.maps.GeocoderStatus.OK) {
//          var latitude = results[0].geometry.location.lat();
//             var longitude = results[0].geometry.location.lng();

//             $scope.eventPin = new google.maps.Marker({
//                 map: $scope.map,
//                 position: new google.maps.LatLng(latitude, longitude)
//                 //icon: userImage,
//                 //shape: userShape,
//             });
            
//   } 
// });


//             },
            error: function(xhr, ajaxOptions, thrownError) {}
            });

    }

    $interval($scope.searchEventCircle, 1000);




////////// MENU FUNCTIONN ///////////

    $scope.searchMenuSwitch = false;
    $scope.settingsMenuSwtich = false;

    $scope.toggleSearchMenu = function() {

        if ($scope.searchMenuSwitch) {
            $(".fadeInMenu").fadeOut(200);
            $("#search-input-container").fadeOut(200);
            $("#radius-slider-container").fadeOut(200);
            $scope.searchMenuSwitch = false;
        } else {
            $(".fadeInMenu").fadeIn(200);
            $("#search-input-container").fadeIn(200)
            $("#radius-slider-container").fadeIn(200);
            $scope.searchMenuSwitch = true;
        }
    }

    $scope.toggleSettingsMenu = function() {

        if ($scope.settingsMenuSwitch) {
            $(".fadeInSettingsMenu").fadeOut(200);
            $scope.settingsMenuSwitch = false;
        } else {
            $(".fadeInSettingsMenu").fadeIn(200);
            $scope.settingsMenuSwitch = true;
        }
    }




    //detect user input
    $scope.keyUp = function() {
        var queryText = $scope.getQueryText();


        //clear current search results
        $scope.clearSearchResults();
        //clear the whole map
        $scope.clearMap();

        if (queryText.length > 2) {
            //send query
            $scope.sendQuery(queryText);
        }
    }

    ////////// MAP FUNCTIONS //////////

    //drawing function

    $scope.drawRadius = function() {

        if ($scope.drawnRadius !== "") {
            $scope.drawnRadius.setMap(null);
        }

        if($scope.map !== "") {

        $scope.drawnRadius = new google.maps.Circle({
            strokeColor: '#6d1770',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#6d1770',
            fillOpacity: 0.0,
            map: $scope.map,
            center: $scope.userPin.position,
            radius: $scope.radiusSliderValue
        });
    }

    }


    ///// USER LOCTATION /////


    $scope.userLocationSettings = {
        maximumAge: 600000,
        timeout: 5000,
        enableHighAccuracy: true
    };

    $ionicPlatform.ready(function() {
        $scope.watchUser = navigator.geolocation.watchPosition($scope.setUserPin, $scope.userLocationError, $scope.userLocationSettings);
        $scope.drawRadius();
    });


    //set user pin
    $scope.setUserPin = function(pos) {
        //user pin data
        var userImage = {
            url: '../img/userPin.png',
            // This marker is 20 pixels wide by 32 pixels high.
            size: new google.maps.Size(70, 70),
            // The origin for this image is (0, 0).
            origin: new google.maps.Point(0, 0),
            // The anchor for this image is the base of the flagpole at (0, 32).
            anchor: new google.maps.Point(0, 0)
        };
        //user pin shape data
        var userShape = {
            coords: [1, 1, 1, 100, 100, 100, 18, 1],
            type: 'poly'
        };
        //current user position
        var userLocation = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);

        if ($scope.userPin !== "") {

            $scope.userPin.setPosition(userLocation);

        } else {
            $scope.userPin = new google.maps.Marker({
                map: $scope.map,
                position: userLocation,
                //icon: userImage,
                //shape: userShape,
                zIndex: 5000,


            });
        }
    }

    //log user location error
    $scope.userLocationError = function() {
        console.log("There was an error logging the users location");
    }

    ///// MAP DATA MANAGEMENT /////

    //clear all markers from map 
    $scope.setMapOnAll = function(map) {
        for (var i = 0; i < this.resultMapMarkers.length; i++) {
            $scope.resultMapMarkers[i].setMap(map);
        }
    }

    //clear the entire map
    $scope.clearMap = function() {
        this.setMapOnAll(null);
    }
    $scope.addMapMarker = function(res) {

        var image = {
            url: '../img/medium-blue-pin.png',
            // This marker is 20 pixels wide by 32 pixels high.
            size: new google.maps.Size(100, 80),
            // The origin for this image is (0, 0).
            origin: new google.maps.Point(0, 0),
            // The anchor for this image is the base of the flagpole at (0, 32).
            anchor: new google.maps.Point(50, 40)
        };
        var shape = {
            coords: [1, 1, 1, 100, 100, 100, 18, 1],
            type: 'poly'
        };
        this.marker = new google.maps.Marker({
            map: $scope.map,
            position: res.geometry.location,
            //icon: image,
            //shape: shape,
            title: res.title,
            zIndex: $scope.resultMapMarkers.length,


        });

        var infoWindow = new google.maps.InfoWindow({
            content: res.name
        });

        google.maps.event.addListener(this.marker, 'click', function() {
            infoWindow.open($scope.map, this);
        });

        $scope.resultMapMarkers.push(this.marker);
    }

    ////////// API SEARCH //////////

    $scope.textSearch = function(str, callback) {

        var request = {
            location: $scope.mapCenter,
            keyword: str,
            radius: $scope.radiusSliderValue,
            types: ['bakery',
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

        $scope.places.nearbySearch(request, callback);
    }


    $scope.bandsInTown = function(str, callback) {

      


    }


    /////////// QUERY FUNCTIONS //////////


    //get text from input box
    $scope.getQueryText = function() {
            var queryText = $("#search-input").val();
            return queryText;
        }
        //clear search results array
    $scope.clearSearchResults = function() {
        $scope.searchResults.length = 0;
    }

    //send  Text Search query to Google Place API using Map service
    $scope.sendQuery = function(queryText) {

        $scope.textSearch(queryText, $scope.managePlacesResults);
        $scope.bandsInTown(queryText, $scope.manageBandsInTownResults);
        //$scope.eventCircleSearch(queryText, $scope.manageEventCircleSearch);

    }

    ////////// MANAGE RESULTS //////////

    //Text Search query sucess callback -
    $scope.managePlacesResults = function(result, status) {
        //check status
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            //feed returned array through loop
            for (var i = 0; i < result.length; i++) {
                if (result[i].name.length > 3 && !result[i].permanently_closed) {
                    if (result[i].photos) {
                        result[i].profileImageString = result[i].photos[0].getUrl({
                            maxHeight: 600
                        });
                    } else {
                        result[i].profileImageString = result[i].icon;
                    }
                    result[i].distanceFrom = $scope.calcDistance($scope.mapCenter.lat(),
                        $scope.mapCenter.lng(),
                        result[i].geometry.location.lat(),
                        result[i].geometry.location.lng(),
                        'M');

                    $scope.addMapMarker(result[i]);
                    $scope.searchResults.push(result[i]);
                    $scope.$apply();
                }
            }
        }
    }




    $scope.manageBandsInTownResults = function(result) {



    }




    //////////Data calcuation functions

    $scope.calcDistance = function(lat1, lon1, lat2, lon2, unit) {

        var radlat1 = Math.PI * lat1 / 180
        var radlat2 = Math.PI * lat2 / 180
        var radlon1 = Math.PI * lon1 / 180
        var radlon2 = Math.PI * lon2 / 180
        var theta = lon1 - lon2
        var radtheta = Math.PI * theta / 180
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        dist = Math.acos(dist)
        dist = dist * 180 / Math.PI
        dist = dist * 60 * 1.1515
        if (unit == "K") {
            dist = dist * 1.609344
        }
        if (unit == "N") {
            dist = dist * 0.8684
        }
        return dist
    }

});