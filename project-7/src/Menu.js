import React, { Component } from 'react';
//import ReactDOM from 'react-dom';

class Menu extends Component {	
	showHide=()=>{
			const navBar = document.getElementById('navbar');
			navBar.classList.toggle('hide');
	}

	render(){
		return(
			<div className='header'>
			
			<h2 className='jax'>Jax Wing Finder</h2>	
				
			<div className='menu'
			onClick={this.showHide}
			tabindex='1'
			onKeyPress={this.showHide}>☰</div>
			
			
			</div>
		)
	}
}

export default Menu