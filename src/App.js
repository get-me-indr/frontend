import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import GeoHash from 'latlon-geohash';
import fetch from 'isomorphic-fetch';
import moment from 'moment';

class App extends Component {

constructor(){
super();
this.success = this.success.bind(this);
this.fetchDiscovery = this.fetchDiscovery.bind(this);
this.state = {
    lat:0,
    long:0,
    geohash:'',
    radius:50,
    units:'miles',
    apiKey:'DAGQUQARKor32zsH3Fn7AFxJTE8R7aI7',
    size: 200,
    }
}


  feelingLucky() {
    window.TMIdentity.init({
      serverUrl: 'https://dev1.identity.nonprod-tmaws.io',
      flags: {
        social: true
      }
    }).then(window.TMIdentity.login);
  }
fetchDiscovery(){
let startDateTime = moment().format("YYYY-MM-DDTHH:mm:ss") + "Z";
let endDateTime = moment().add(7, 'days').format("YYYY-MM-DDTHH:mm:ss") + "Z";
let uri = 'https://app.ticketmaster.com/discovery/v2/events.json?geoPoint='+ this.state.hash + '&radius=' + this.state.radius + '&unit=' + this.state.units + '&size=' + this.state.size + '&startDateTime=' + startDateTime + '&endDateTime=' + endDateTime + '&apikey=' + this.state.apiKey;
console.log(uri);
fetch(uri)
    .then(function(response) {
        if (response.status >= 400) {
            throw new Error("Bad response from server");
        }
        return response.json();
    })
    .then(function(stories) {
        console.log(stories);
    });
}
 success(pos){
   let crd = pos.coords;

    let hashCode = GeoHash.encode(crd.latitude,crd.longitude,9);
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
        <p> GeoHash: {this.state.hash}</p>
        <button className = 'btn btn-primary' onClick = {this.fetchDiscovery} > " Fecth that sweet metallica " </button>

      </div>
    );
  }
}

export default App;
