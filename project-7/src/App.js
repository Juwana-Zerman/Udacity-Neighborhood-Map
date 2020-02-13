import React, { Component } from 'react';
import './App.css';
import axios from 'axios'
import Navbar from './Navbar'
import Menu from './Menu'
import {mapCustomStyle} from './mapCustomStyle'


// Google maps api failure variable
window.gm_authFailure=()=>{
 alert('A GoogleMaps error occurred! Please try again later.');
};

class App extends Component {
  state = {
    venues: [],
    markers: []
  }

  //invoke after the component is added to the DOM
  componentDidMount(){
    this.getTheVenues();
  }

updateTheMarkers() {
    const venueItems = document.getElementsByTagName('li');
    const venueItemsArray = Array.from(venueItems);

    const visibleVenueItems = venueItemsArray.filter(li=>li.offsetParent!=null);
     visibleVenueItems.map(item=>item.getAttribute('id'));
  }

loadTheMap=()=>{
    loadScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyAzJkkNk6Ir5rSt6cQPgGqibkUeseAKhFo&callback=initMap');
    window.initMap = this.initMap;
  }

getTheVenues=()=>{
  // retrieves information from foursquare Api
  const endPoint = 'https://api.foursquare.com/v2/venues/explore?';
  const parameters = {
    client_id: '0HWDBVRB2JSKVNZHY1PCJE0P2GQLV2U2ZD0BYKGS2RR125FW',
    client_secret: '2HIXLJWVN0BUHFCSUSJZCWJF0AHQNX3TMHFO0VW5C4DF35U2',
    query: 'wings',
    near: 'Jacksonville',
    v: '20181003'
   }

   //used axios which is similar to fetch
    axios.get(endPoint + new URLSearchParams(parameters))
    .then(response => {
      this.setState({//setting the state with the data we got from the ajax call
      venues: response.data.response.groups[0].items,
      }, this.loadTheMap()) //calling this.loadMap() as a callback - which gets invoked after our ajax call is successful
    })
    .catch(error=>{
      alert(`An error occurred fetching information from FourSquare! Please try again later!`)
      console.log('fetching problem ' + error)
    })
  }

initMap=()=>{

    //creating a map
    const theMap = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 30.332184, lng: -81.655},
      zoom: 10,
      styles: mapCustomStyle
     });

    const infoWindow = new window.google.maps.InfoWindow();

    //loop through venues array to generate markers
       this.state.venues.map(theVenue => {
       console.log(theVenue);

    const contentString = `<div id="content-info" tabIndex="0">
      <h3>${theVenue.venue.name}</h3>
      <p>${theVenue.venue.location.formattedAddress[0]}<br>
      ${theVenue.venue.location.formattedAddress[1]}</p>
      </div>`;

    //animate markers with DROP
function toggleBounce(marker) {
    marker.setAnimation(window.google.maps.Animation.DROP);
    setTimeout(function(){
    marker.setAnimation(null);
   }, 1500);
  }

    //create markers for the venues
    const theMarker = new window.google.maps.Marker({
      position: {lat: theVenue.venue.location.lat,
      lng: theVenue.venue.location.lng},
      map: theMap,
      title: theVenue.venue.name,
    });

    //event listener for each marker
      theMarker.addListener('click', function(e) {
      toggleBounce(this);

    //set infoWindow content
      infoWindow.setContent(contentString)

    //open the infoWindow
      infoWindow.open(theMap, theMarker)
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
     map = {this.state.theMap}
     markers = {this.state.markers}
     changeState = {this.updateTheMarkers}
    />
    <Menu/>
  <div id="map" role="application" aria-label="Map" tabIndex="-1"></div>
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

export default App