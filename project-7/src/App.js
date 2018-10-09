import React, { Component } from 'react';
import './App.css';
import axios from 'axios'
import Navbar from './Navbar_backup'
import Menu from './Menu'
import {mapCustomStyle} from './mapCustomStyle'
//import restaurant_icon from './restaurant_icon.svg'

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
  componentDidMount(){
    this.getVenues();//invoking getVenues function
  }

  updateTheMarkers(){
    const listItems = document.getElementsByTagName('li');
    const listItemsArray = Array.from(listItems);

    const visibleListItems = listItemsArray.filter(li=>li.offsetParent!=null);
    const listIds = visibleListItems.map(item=>item.getAttribute('id'));
  }

  loadTheMap=()=>{
    loadScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyBqKIezQ6vPrfhO0UgjsPZcD4EbpkRiSNg&callback=initMap');
    window.initMap = this.initMap;
  }

  getVenues=()=>{
    //getting information from foursquare Api
    const endPoint = 'https://api.foursquare.com/v2/venues/explore?';
    const parameters = {
      client_id: '0HWDBVRB2JSKVNZHY1PCJE0P2GQLV2U2ZD0BYKGS2RR125FW',
      client_secret: '2HIXLJWVN0BUHFCSUSJZCWJF0AHQNX3TMHFO0VW5C4DF35U2',
      query: 'wings',
      near: 'Jacksonville',
      v: '20181003' 
    }
 /*  
// Creates the full URL
const endPoint = venueRequest + new URLSearchParams(parameters)

fetch(endPoint).then(response => response.json()).then(parsedJSON => {
  console.log(parsedJSON)
  this.props.addVenues(parsedJSON.response.groups[0].items)
  this.setState({
    venues: parsedJSON.response.groups[0].items
  },
  // loads and initiates the map.
  this.loadInitMap())
}).catch(error => {console.log('Foursquare had an error! ', error)
  alert('Foursquare API failed to load. Please check your internet connection and refresh the page. ', error)});
}
}*/


    //installed axios- npm install axios //axios is similar to fetch
    axios.get(endPoint + new URLSearchParams(parameters))
    .then(response => {
      this.setState({//setting the state with the data we got from the ajax call
        venues: response.data.response.groups[0].items,
      }, this.loadTheMap()) //calling this.loadMap() as a callback - which gets invoked after our ajax call is successful
    })
    .catch(err=>{
      alert(`${fourSquareFailMsg} ${err}`)
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

       //looping through the venues array which is inside this.state to generate markers
       this.state.venues.map(theVenue => {
        console.log(theVenue);
              
        const contentString = `<div id="info" tabIndex="0">   
        <h3>${theVenue.venue.name}</h3>
        <p>${theVenue.venue.location.formattedAddress[0]}<br>
        ${theVenue.venue.location.formattedAddress[1]}</p>
        </div>`;
       
        //animate marker
        function toggleBounce(marker) {
          marker.setAnimation(window.google.maps.Animation.DROP);
          setTimeout(function(){
            marker.setAnimation(null);
          }, 1500);
        }
       
        //creating a marker for each venue
        const theMarker = new window.google.maps.Marker({
          position: {lat: theVenue.venue.location.lat, lng: theVenue.venue.location.lng},
          map: theMap,
          title: theVenue.venue.name,
         
        });
      
        //adding event listener to each marker
        theMarker.addListener('click', function(e) {

          toggleBounce(this);

          //change the content
           infoWindow.setContent(contentString)

          //open an infoWindow
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

export default App;