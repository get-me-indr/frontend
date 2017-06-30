import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import GeoHash from 'latlon-geohash';
import Header from './components/header';
import EventCard from './components/event-card';
import RaisedButton from 'material-ui/RaisedButton';
import Cards, { Card } from 'react-swipe-card';
import moment from 'moment';

const reportSwipe = payload => fetch('http://get-me-indr-backend.herokuapp.com/interactions', { method: "POST", body: JSON.stringify(payload) });

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
      loading: true,
      redirecting: false,
      user: {
        status: 'not_connected'
      },
      cardData:[]
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
    this.start();
  }

  isUserLoggedIn() {
    const { user } = this.state;
    return user.status === 'connected';
    this.start();
  }

  start() {
    console.log('this.state', this.state);
    const { user: { tmToken, tmUserId, fbUserId, fbToken } } = this.state;
    const params = { tmToken, tmUserId, fbUserId, fbToken };
    const esc = encodeURIComponent;
    const query = Object.keys(params)
        .map(k => esc(k) + '=' + esc(params[k]))
        .join('&');

    var myHeaders = new Headers();
     myHeaders.append('Access-Control-Allow-Origin', '*');

      params.headers = myHeaders;
      params.mode = 'cors';
      params.cache = 'default';
      console.log(params);
    fetch('http://get-me-indr-backend.herokuapp.com?'+query, params)
        .then(response => {
          this.setState({ loading: false });
            if (response.status >= 400) {
                throw new Error("Bad response from server");
            }
            return response.json();
        })
        .then(data => {
            const cardData = data.events.map(evt => ({
              title: evt.eventName,
              url: evt.eventUrl || evt.url || '#',
              img: evt.imageUrl
            }));
            this.setState({ cardData })
        });
  }

  success(pos) {

    let crd = pos.coords;

    let hashCode = GeoHash.encode(crd.latitude,crd.longitude,9);
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
    const { tmUserId } = this.state.user;
    return data ? data.map((item) => (
      <Card
        key={item}
        onSwipeLeft={() => {
          reportSwipe({ direction: 'left', event: item, tmUserId });
        }}
        onSwipeRight={() => {
          reportSwipe({ direction: 'right', event: item, tmUserId });
        }}
        onSwipeTop={() => {
          this.setState({ redirecting: true });
          reportSwipe({ direction: 'up', event: item, tmUserId });
          window.location = item.url
        }}
        onSwipeBottom={() => {
          reportSwipe({ direction: 'left', event: item, tmUserId });
        }}>
        <EventCard name={ item.title }
         subtitle = {item.location}
         image = {item.img}
         dateTime = {item.dateTime }
         distance = {item.distance}/>
      </Card>
    )) : [];
  }

  renderContent() {
    const data = ['Alexandre', 'Thomas', 'Lucien'];

    if (this.isUserLoggedIn()) {
      if (this.state.redirecting) {
        return <div>Please wait while we take you to an event you'll love!</div>
      } else if (this.state.loading) {
        return <div>loading...</div>
      }
      return (
        <Cards onEnd={() => console.log('end')} className='master-root'>
          {this.renderCards(this.state.cardData)}
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
