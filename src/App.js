import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import GeoHash from 'latlon-geohash';
import Cards, { Card } from 'react-swipe-card';

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

  renderCards(data) {
    return data.map((item) => (
      <Card
        key={item}
        onSwipeLeft={() => console.log('swipe left')}
        onSwipeRight={() => console.log('swipe right')}
      >
        <div className="card">
          <img className="card-img-top" src="https://unsplash.it/300/300?random" alt="Card image cap" />
          <div className="card-block">
            <h4 className="card-title">{item}</h4>
            <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
            <a href="#" className="btn btn-primary">Go somewhere</a>
          </div>
        </div>
      </Card>
    ));
  }

  render() {
    const data = ['Alexandre', 'Thomas', 'Lucien'];

    return (
      <div className="App">
        <p className="App-intro">
          <button className="btn btn-primary" onClick={this.feelingLucky}>"I'm feeeeling lukcy!"</button>
        </p>
        <p> Lat: {this.state.lat}</p>
        <p> Long: {this.state.long}</p>
        <p> GeoHAsh: {this.state.hash}</p>

        <Cards onEnd={() => console.log('end')} className='master-root'>
          {this.renderCards(data)}
        </Cards>
      </div>
    );
  }
}

export default App;
