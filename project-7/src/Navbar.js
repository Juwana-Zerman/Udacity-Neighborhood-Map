import React, { Component } from 'react';
import './App.css';

class Navbar extends Component {

	handleEvent=(name)=>{
		const oneMarker = this.props.markers.find(marker => marker.title === name.venue.name);
		window.google.maps.event.trigger(oneMarker, 'click')
	}

	updateTheMarkers(e){
    const venueItems = document.getElementsByTagName('li');
    const venueItemsArray = Array.from(venueItems);
    const visibleVenueItems = venueItemsArray.filter(li=>li.offsetParent!=null);
    const venueIds = visibleVenueItems.map(item=>item.getAttribute('id'));
	
	for(let i=0; i<venueIds.length; i++){
	this.props.markers.forEach(marker=>{
    	let name=marker.title.toLowerCase()
    	if(!name.includes(e)){	
    		marker.setVisible(false)
    	}
    	else {
    		marker.setVisible(true)
			}
    	})
    }
   
}

	handleSearch=(e)=>{
		let input, filter, ul, li, a, i;
	    input = document.getElementById("listInput");
	    filter = input.value.toUpperCase();
	    ul = document.getElementById("UL");
	    li = ul.getElementsByTagName("li");

	    for (i = 0; i < li.length; i++) {
	        a = li[i].getElementsByTagName("a")[0];
	        if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
	        }
	    }
	   	this.updateTheMarkers(e.target.value);
	}

	render(){
		return(
			<div id='navbar'>
			<input type='search' id='listInput' aria-label="Filter location by name" tabIndex="0"
			onChange={this.handleSearch}
			placeholder="Filter..."
			/>
			<ul id='UL' aria-label="Venue List">
				{
					this.props.venues.map(eachVenue=>{
						return (
							<li
							key={eachVenue.venue.id}
							onClick={()=>this.handleEvent(eachVenue)}
							onKeyPress={()=>this.handleEvent(eachVenue)}
							id={eachVenue.venue.name}
							>
							<a href="#">
							{eachVenue.venue.name}
							</a>
							</li>
						)
					})
				}
			</ul>
			</div>
		)
	}
}

export default Navbar