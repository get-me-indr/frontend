import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import GeoHash from 'latlon-geohash';

class App extends Component {

constructor(){
super();
this.success = this.success.bind(this);
this.state = {lat:0,long:0,geohash:''}
}


  feelingLucky() {
    window.TMIdentity.init({
      serverUrl: 'https://dev1.identity.nonprod-tmaws.io',
      flags: {
        social: true
      }
    }).then(window.TMIdentity.login);
  }

 success(pos){
   let crd = pos.coords;

    let hashCode = GeoHash.encode(crd.latitude,crd.longitude);
    this.setState({lat:crd.latitude, long:crd.longitude,hash:hashCode});
    console.log(hashCode);
    console.log('i succeed' + this.state.lat + this.state.long );
    console.log('i succeed' + crd.latitude + crd.longitude );
   }
   error(){
    console.log('I errored');
   }


 getLatLong(){
  navigator.geolocation.getCurrentPosition(this.success, this.error, {enableHighAccuracy: true,  timeout: 5000,  maximumAge: 0 });

  }

componentDidMount() {
    this.getLatLong();
  }
  render() {


    return (
      <div className="App">
        <p className="App-intro">
          <button className="btn btn-primary" onClick={this.feelingLucky}>"I'm feeeeling lukcy!"</button>
        </p>
        <p> Lat: {this.state.lat}</p>
        <p> Long: {this.state.long}</p>
        <p> GeoHAsh: {this.state.hash}</p>

      </div>
    );
  }
}

export default App;
