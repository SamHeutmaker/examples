app.controller('MainController', ['$scope', 'Map', function($scope, Map) { 

//results array from Google Places API Query
$scope.searchResults = [];


//detect user input
$scope.keyUp = function() {
 var queryText = $scope.getQueryText();
 	//clear current search results
 	 $scope.clearSearchResults();
    //clear the whole map
     Map.clearMap();

    if(queryText.length > 2) {
        //send query
        $scope.sendQuery(queryText);
    } 
}

//////////////////Functions for query


//get text from input box
$scope.getQueryText = function(){
    var queryText = $("#search-input").val();
    return queryText;
}
//clear search results array
$scope.clearSearchResults = function(){
	$scope.searchResults.length = 0;
}

//send  Text Search query to Google Place API using Map service
$scope.sendQuery = function(queryText){

    Map.textSearch(queryText, $scope.manageQueryResults);

}

//Text Search query sucess callback -
$scope.manageQueryResults = function(result, status){
	//check status
    if (status == google.maps.places.PlacesServiceStatus.OK) {
    //feed returned array through loop
    for (var i = 0; i < result.length; i++) {
    	if(result[i].name.length > 3 && !result[i].permanently_closed){
    		if(result[i].photos) {
    			result[i].profileImageString = result[i].photos[0].getUrl({maxHeight: 600});
    		} else {
    			result[i].profileImageString = result[i].icon;
    		}
    		result[i].distanceFrom = $scope.calcDistance( Map.centerLatlng.lat(), 
    													  Map.centerLatlng.lng(), 
    													  result[i].geometry.location.lat(),
    													  result[i].geometry.location.lng(), 
    													  'M');
    		result[i].name = result[i].name.substring(0, 14);

	      Map.addMarker(result[i]);
	      $scope.searchResults.push(result[i]);
	      $scope.$apply();
  		}
    }
  }
}
//////////Data calcuation functions

$scope.calcDistance = function(lat1, lon1, lat2, lon2, unit){

	var radlat1 = Math.PI * lat1/180
	var radlat2 = Math.PI * lat2/180
	var radlon1 = Math.PI * lon1/180
	var radlon2 = Math.PI * lon2/180
	var theta = lon1-lon2
	var radtheta = Math.PI * theta/180
	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	dist = Math.acos(dist)
	dist = dist * 180/Math.PI
	dist = dist * 60 * 1.1515
	if (unit=="K") { dist = dist * 1.609344 }
	if (unit=="N") { dist = dist * 0.8684 }
	return dist
}



//////////Position functions

$scope.getUserLocation = function(){
	if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition($scope.getPositionSuccess, $scope.getPositionError);
            }
            else {
                alert("Geolocation is not supported by this browser.");
            }
}

$scope.getPositionSuccess = function(position){
	//get using position and pass to map
	Map.centerLatlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
	//update
	$scope.$apply();
	//initialize google map via Map service
	Map.init();

}

$scope.getPositionError = function(){
	console.log("There was an error");
}


$scope.getUserLocation();

}]);