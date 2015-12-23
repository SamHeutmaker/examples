angular.module('starter.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})

.service('Map', function(){

  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'https://pbs.twimg.com/profile_images/598205061232103424/3j5HUXMY.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
  }];

    this.searchResults = [];
    this.mapMarkers = [];
    this.centerLatlng = null;

    this.searchResults[0] = {
        name: "Sam",
        icon: "somethingelse"
    };

    


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
    
    this.updateMapMarkers = function() {
      this.clearMap();
      for(var i = 0; i < this.searchResults.length; i ++) {

          this.marker = new google.maps.Marker({
              map: this.map,
              position: this.searchResults[i].geometry.location
        });
          this.mapMarkers.push(this.marker);
      }
    }


    
});
