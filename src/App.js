import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import GeoHash from 'latlon-geohash';
import Header from './components/header';
import EventCard from './components/event-card';
import RaisedButton from 'material-ui/RaisedButton';
import Cards, { Card } from 'react-swipe-card';

class App extends Component {

constructor(){
  super();
    this.success = this.success.bind(this);
    this.feelingLucky = this.feelingLucky.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.onLoginSuccess = this.onLoginSuccess.bind(this);

    this.state = {
      lat: 0,
      long: 0,
      geohash: '',
      user: {
        status: 'not_connected'
      }
    };
  }

  feelingLucky() {
    window.TMIdentity.init({
        serverUrl: 'https://identity.ticketmaster.com',
        flags: {
          social: true
        }
      })
      .then(this.login);
  }

  login() {
    window.TMIdentity.login()
      .then(this.onLoginSuccess)
  }

  logout() {
    window.TMIdentity.logout();
    this.setState({ user: { status: 'not_connected' } });
  }

  onLoginSuccess(user) {
    this.setState({ user });
  }

  isUserLoggedIn() {
    const { user } = this.state;
    return user.status === 'connected';
  }

  success(pos) {
    let crd = pos.coords;

    let hashCode = GeoHash.encode(crd.latitude,crd.longitude);
    this.setState({lat:crd.latitude, long:crd.longitude,hash:hashCode});
    console.log(hashCode);
    console.log('i succeed' + this.state.lat + this.state.long );
    console.log('i succeed' + crd.latitude + crd.longitude );
  }

  error() {
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
        onSwipeTop={() => console.log('swipe top')}
        onSwipeBottom={() => console.log('swipe bottom')}>
        <EventCard name={ item } />
      </Card>
    ));
  }

  renderContent() {
    const data = ['Alexandre', 'Thomas', 'Lucien'];

    if (this.isUserLoggedIn()) {
      return (
        <Cards onEnd={() => console.log('end')} className='master-root'>
          {this.renderCards(data)}
        </Cards>
      );
    }

    return (
      <div className="feelingLuckyButton mt-5">
        <RaisedButton
          label="I'm Feeling Lucky"
          secondary={ true }
          onClick={ this.feelingLucky } />
      </div>
    );
  }

  render() {
    return (
      <div className="App">
        <Header
          isLoggedIn={ this.isUserLoggedIn() }
          onLogout={ this.logout } />
        { this.renderContent() }
      </div>
    );
  }
}

export default App;
