import React, { Component } from 'react';
import Navbar from './Navbar';
import axios from 'axios';
import Menu from './Menu';
import './App.css';

window.gm_authFailure=()=>{ 
  alert('OOPS! An Error occurred while fetching GoogleMaps API! Please try again later.');
 };
 
 //variable to handle api failure
 const fourSquareFailMsg = 'OOPS! An Error occurred while fetching data from FourSquare API! Please try again later.';


class App extends Component {
  state = {
    venues: [],
    markers: []
  }

  //do this right after the component is added to the DOM
  componentDidMount() {
    this.getVenues()//invoking getVenues function
  }

  updateMarkers(){
    const listItems = document.getElementsByTagName('li');
    const listItemsArray = Array.from(listItems);

    const visibleListItems = listItemsArray.filter(li=>li.offsetParent!=null);
    const listIds = visibleListItems.map(item=>item.getAttribute('id'));
  }

  initMap=()=>{
    loadScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyBqKIezQ6vPrfhO0UgjsPZcD4EbpkRiSNg&callback=googleSuccess');
    window.googleSuccess = this.googleSuccess;
  }

  getVenues=()=>{
    //getting information from foursquare Api
    const endPoint = 'https://api.foursquare.com/v2/venues/explore?';
    const parameters = {
      client_id: '0HWDBVRB2JSKVNZHY1PCJE0P2GQLV2U2ZD0BYKGS2RR125FW',
      client_secret: '2HIXLJWVN0BUHFCSUSJZCWJF0AHQNX3TMHFO0VW5C4DF35U2',
      query: 'coffee',
      near: 'Jacksonville',
      v: '20181003' 
  }

//installed axios- npm install axios //axios is similar to fetch
axios.get(endPoint + new URLSearchParams(parameters))
.then(response => {
  this.setState({//setting the state with the data we got from the ajax call
    venues: response.data.response.groups[0].items,
  }, this.initMap()) //calling this.initMap() as a callback - which gets invoked after our ajax call is successful
})
.catch(error=>{
  alert(`${fourSquareFailMsg} ${error}`)
})
}

googleSuccess=()=>{

  //creating a map
   let theMap = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 30.332184, lng: -81.655},
      zoom: 10
    });

   const infoWindow = new window.google.maps.InfoWindow()
   // Try HTML5 geolocation.
  /* if (navigator.geolocation) {
     navigator.geolocation.getCurrentPosition(function(position) {
       var pos = {
         lat: position.coords.latitude,
         lng: position.coords.longitude
       };
      
       infoWindow.setPosition(pos);
       infoWindow.setContent('Location found.');
       infoWindow.open(map);
       map.setCenter(pos);
     }, function() {
       handleLocationError(true, infoWindow, map.getCenter());
     });
   } else {
     // Browser doesn't support Geolocation
     handleLocationError(false, infoWindow, map.getCenter());
   };
  }
 function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
};
}*/


   //looping through the venues array which is inside this.state to generate markers
   this.state.venues.map(eachVenue => {
    console.log(eachVenue);
    const name = `${eachVenue.venue.name}`;
    const address = `${eachVenue.venue.location.formattedAddress}`;

    var contentString = `<div>
    <img id='img'>
    <h3>${name}</h3>
    <p>${address}</p>
    </div>`;

    //animate marker
    function toggleBounce(marker) {
      marker.setAnimation(window.google.maps.Animation.BOUNCE);
      setTimeout(function(){
        marker.setAnimation(null);
      }, 2000);
    }
    
    //creating a marker for each venue
    
    const theMarker = new window.google.maps.Marker({
      position: {lat: eachVenue.venue.location.lat, lng: eachVenue.venue.location.lng},
      map: theMap,
      title: eachVenue.venue.name,

    });

//adding event listener to each marker
theMarker.addListener('click', function(e) {

  toggleBounce(this);

  //change the content
   infoWindow.setContent(contentString)

  //open an infoWindow
  infoWindow.open(theMap, theMarker);

});

this.setState({
  markers: [...this.state.markers, theMarker]
});


});
}


  render() {
    return (
    <main>
      <Navbar
      venues = {this.state.venues}
      map = {this.state.myMap}
      markers = {this.state.markers}
      changeState = {this.updateMarkers}
      />
      <Menu/>
      <div id="map"></div>
      </main>  
    );
  }
}

function loadScript(url){
  const index = window.document.getElementsByTagName('script')[0];
  const script = window.document.createElement('script');
  script.defer = true;
  script.async = true;
  script.src = url;
  script.onerror = window.gm_authFailure;
  index.parentNode.insertBefore(script, index);//parent.parentNode.insertBefore(child, parent);
}

export default App;