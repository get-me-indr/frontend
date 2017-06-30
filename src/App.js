import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import GeoHash from 'latlon-geohash';
import Header from './components/header';
import EventCard from './components/event-card';
import Loading from './components/loading';
import RaisedButton from 'material-ui/RaisedButton';
import Cards, { Card } from 'react-swipe-card';
import moment from 'moment';

const reportSwipe = payload => fetch('https://get-me-indr-backend.herokuapp.com/interactions', { method: "POST", body: JSON.stringify(payload) });

class App extends Component {

constructor(){
  super();
    this.success = this.success.bind(this);
    this.feelingLucky = this.feelingLucky.bind(this);
    this.login = this.login.bind(this);
    this.checkLoginStatus = this.checkLoginStatus.bind(this);
    this.logout = this.logout.bind(this);
    this.onLoginSuccess = this.onLoginSuccess.bind(this);

    this.state = {
      lat: 0,
      long: 0,
      geohash: '',
      loading: false,
      redirecting: false,
      user: {
        status: 'not_connected'
      },
      cardData:[]
    };
  }

  feelingLucky() {
    this.setState({ loading: true });

    window.TMIdentity.init({
        serverUrl: 'https://identity.ticketmaster.com',
        flags: {
          social: true
        }
      })
      .then(this.login);
  }

  checkLoginStatus() {
    window.TMIdentity.getLoginStatus()
      .then(resp => {
        if (resp.status && resp.status === 'connected') {
          this.onLoginSuccess(resp);
          return;
        }

        this.login();
      })
      .catch(() => this.setState({ loading: false }))
  }

  login() {
    window.TMIdentity.login()
      .then(this.onLoginSuccess)
      .catch(() => this.setState({ loading: false }))
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
    this.setState({ loading: true });
    const { user: { tmToken, tmUserId, fbUserId, fbToken } } = this.state;
    const params = { tmToken, tmUserId, fbUserId, fbToken };
    const esc = encodeURIComponent;
    const query = Object.keys(params)
        .map(k => esc(k) + '=' + esc(params[k]))
        .join('&');

    const myHeaders = new Headers();
    myHeaders.append('Access-Control-Allow-Origin', '*');

    params.headers = myHeaders;
    params.mode = 'cors';
    params.cache = 'default';

    fetch('https://get-me-indr-backend.herokuapp.com?'+query, params)
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
              img: evt.imageUrl,
              venueName: evt.venueName || '',
              venueCity: evt.venueCity || '',
              startLocalDate: evt.startLocalDate
            }));

            cardData.push({
              title: 'Test Event',
              url: 'Whatever',
              img: 'evt.imageUrl'
            });
            this.setState({ cardData })
        })
        .catch(() => this.setState({ loading: false }));
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
    const { tmUserId, userInfo } = this.state.user;
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
        <EventCard
          title={ item.title }
          url = {item.url}
          img = {item.img}
          venueName = {item.venueName}
          venueCity = {item.venueCity}
          startLocalDate = {item.startLocalDate}
          displayName={ userInfo.user.displayName }
          profilePic={ userInfo.user.pictureUrl } />
      </Card>
    )) : [];
  }

  renderContent() {
    const { redirecting, loading, cardData } = this.state;
    const data = ['Alexandre', 'Thomas', 'Lucien'];

    if (loading) {
      return <Loading text="Loading..." />
    }

    if (this.isUserLoggedIn()) {
      if (redirecting) {
        return <Loading text="Please wait while we take you to an event you'll love!" />
      }

      return (
        <Cards onEnd={() => console.log('end')} className='master-root'>
          {this.renderCards(cardData)}
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
          onLogout={ this.logout }
          onLogin={ this.feelingLucky } />
        { this.renderContent() }
      </div>
    );
  }
}

export default App;
