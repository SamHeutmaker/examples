angular.module('bite-directives', [])

.directive('googleMap', [ '$cordovaGeolocation', '$ionicPlatform', function($cordovaGeolocation, $ionicPlatform){
	return {
		restrict: 'E',
    scope: {
      	onCreate: '&'
    },
		link: function($scope, $element, $attr) {
	
			function init(center){

				var noPoi = [
						{
						    featureType: "poi",
						    stylers: [
						      { visibility: "off" }
						    ]   
						  }
						];

				var mapOptions = {
					center: center,
					zoom: 8,
					mapTypeId: google.maps.MapTypeId.ROADMAP,
					disableDefaultUI: true,
					styles: noPoi
				};

				var map = new google.maps.Map($element[0], mapOptions);

				$scope.onCreate({map: map});

        		// Stop the side bar from dragging when mousedown/tapdown on the map
        		google.maps.event.addDomListener($element[0], 'mousedown', function (e) {
          			e.preventDefault();
          			return false;
        		});

			}

			if (document.readyState === "complete") {
        		setCenter();
      		} else {
        		google.maps.event.addDomListener(window, 'load', setCenter);
      		}

      		var setCenter = function(pos) {

				var centerLatlng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
				

				init(centerLatlng);
			}

			var logError = function(err) {
				console.log(err.code);
			}

			var locationSettings = {maximumAge:600000, 
									timeout:5000, 
									enableHighAccuracy: true};

      		//get user location
      		$ionicPlatform.ready(function() {
      			navigator.geolocation.getCurrentPosition(setCenter, logError, locationSettings);
      			
			});
      		
		}
	}
}])