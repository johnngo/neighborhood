/******
neighborhood map
   ************/


var model = {
locations : [
    {   name : 'craft beer',
        address: 'granville island',
        location: {lat:49.270999, lng: -123.105898},
        content: ''
    },
    {
        name: 'tap and barrel',
        address: 'downtown vancouver',
        location: {lat:49.289365, lng: -123.116712},
        content:''
    },
    {
        name: 'steamworks',
        address: 'gastown',
        location: {lat:49.284681, lng: -123.110780},
        content: ''
    },
    {
        name: 'library square',
        address: 'downtown',
        location: {lat:49.279806, lng: -123.114659},
        content: ''
    },
    {
        name: 'cinema public',
        address: 'main st',
        location: {lat:49.280158, lng: -123.121305},
        content:''
    },
    {   name: 'new oxford',
        address: 'yaletown',
        location: {lat:49.275845, lng: -123.121952},
        content:''
    },
    {
        name: 'the park',
        address: 'west end',
        location: {lat:49.286720, lng: -123.141296},
        content:''
    }
    ]
};


var map;
var markers = [];

var view =  function (data){
      this.name=ko.observable(data.name);
      this.showMe=ko.observable(true);
    };


var vModel = {
    init:function () {
    var self = this;
    //marker.setMap(map);
//list View
    this.locationList=ko.observableArray([]);
    model.locations.forEach(function(Item){
        self.locationList.push(new view(Item));
    });

//credit to Karol, helping with building the click event
  this.selectedLocation = function () {
          var marker= this.marker;
          google.maps.event.trigger(marker, 'click');
        };

  //credit to Ryan Vrba, building the filter function
     this.inputValue = ko.observable('');
        //   this.titles = ko.observableArray(titlesArray);
           this.filteredTitles = ko.computed(function(){
            var filter = self.inputValue().toLowerCase();

          for(var i =0; i<self.locationList().length;i++){
            if(self.locationList()[i].name().toLowerCase().includes(filter)=== true){
              self.locationList()[i].showMe(true);
              if(self.locationList()[i].marker != undefined){
                self.locationList()[i].marker.setVisible(true);
              }
            } else{
              self.locationList()[i].showMe(false);
              self.locationList()[i].marker.setVisible(false);
            }
          }
    });

    this.renderMarker= function() {

        var largeInfoWindow= new google.maps.InfoWindow({
          maxWidth: 250
        });
        var bounds = new google.maps.LatLngBounds();
        var locations=model.locations;
          //create a marker for each location
        for (var i=0 ; i < locations.length; i++) {
            var position = locations[i].location;
            var name = locations[i].name;
            var content = locations[i].content;

         var marker = new google.maps.Marker({
            position: position,
            map: map,
            title: name,
            content:content,
            animation: google.maps.Animation.DROP,

        });
         markers.push(marker);
         //added marker attribute/property to location list
         self.locationList()[i].marker=marker;

         marker.setMap(map);

        bounds.extend(marker.position);

         marker.addListener('click', function(){
            populateInfoWindow(this, largeInfoWindow);
         });
         marker.addListener('click',function(){
            toggleBounce(this);
         });
      }
        map.fitBounds(bounds);

        function showListings() {
          var bounds= new google.maps.LatLngBounds();
          for(var i =0; i < markers.length; i++){
            markers[i].setMap(map);
            bounds.extend(markers[i].position);

          map.fitBounds(bounds);


        }
        }

        document.getElementById('show-listings').addEventListener('click', showListings);
        document.getElementById('hide-listings').addEventListener('click', function() {
          hideListings(markers);
           function hideListings(marker) {
          for(var i = 0; i< markers.length; i++){
            markers[i].setMap(null);
          }
          }

        });

         function populateInfoWindow(marker, infowindow) {

        //if (infowindow.marker != marker) {
          infowindow.marker = marker;
          infowindow.setContent('<div>' + marker.title + '</div>');
          infowindow.open(map, marker);
        //  Make sure the marker property is cleared if the infowindow is closed.
        //  infowindow.addListener('closeclick',function(){
        //  infowindow.setMarker = null;
         // });

            }

            function toggleBounce(marker){
              marker.setAnimation(google.maps.Animation.BOUNCE);
              setTimeout(function(){marker.setAnimation(null);},1400);
            }

         }

        }
      }


var vM = new vModel.init();
ko.applyBindings(vM);


    function initMap() {
      vancouverDowntown = {lat: 49.282455, lng: -123.1234};
        map = new google.maps.Map(document.getElementById('map'), {
          center: vancouverDowntown,
          zoom: 14
        });
      vM.renderMarker();
      }
      /***********
      yelp api
      ********/