import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import GeoHash from 'latlon-geohash';
import Header from './components/header';
import EventCard from './components/event-card';
import RaisedButton from 'material-ui/RaisedButton';
import Cards, { Card } from 'react-swipe-card';
import moment from 'moment';

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
      },
      cardData:{}
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

    let hashCode = GeoHash.encode(crd.latitude,crd.longitude,9);
    this.setState({lat:crd.latitude, long:crd.longitude,hash:hashCode});
    console.log(hashCode);
    console.log('i succeed' + this.state.lat + this.state.long );
    console.log('i succeed' + crd.latitude + crd.longitude );
    let self = this;
    fetch('http://get-me-indr-backend.herokuapp.com/discovery?geoPoint=' + hashCode + '&artists=Colorado%20Rockies%20vs.%20Cincinnati%20Reds,Madonna,The%20Cranberries,Michael%20Jackson')
        .then(function(response) {
            if (response.status >= 400) {
                throw new Error("Bad response from server");
                console.log("hello");
            }
            return response.json();
        })
        .then(function(discoveryData) {
            console.log(discoveryData);
            let cardList = [];

            for(let evt of discoveryData.events){
                let card = {};
                card.title = evt.eventName;
                card.distance = evt.distance + ' mi';
                card.url = evt.url;
                card.location = evt.venueName + ', ' +  evt.venueCity + ', ' + evt.venueState.stateCode;
                card.dateTime = moment(evt.startLocalDate).format('dddd, MMM Do') + ' @ ' + moment(evt.startLocalDate+'T'+evt.startLocalTime).format('hA');
                card.img = evt.imageUrl;
                cardList.push(card);
            }
            self.setState({cardData: cardList});
        });
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
        onSwipeTop={() => window.location = item.url}
        onSwipeBottom={() => console.log('swipe bottom')}>
        <EventCard name={ item.title }
         subtitle = {item.location}
         image = {item.img}
         dateTime = {item.dateTime }
         distance = {item.distance}
         url = {item.url}/>

      </Card>
    ));
  }

  renderContent() {
    const data = ['Alexandre', 'Thomas', 'Lucien'];

    if (this.isUserLoggedIn()) {
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
