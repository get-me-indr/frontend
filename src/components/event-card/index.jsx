import React, { PropTypes } from 'react';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

const EventCard = ({
  title,
  url,
  img,
  displayName,
  profilePic,
  venueName,
  venueCity,
  startLocalDate
}) => {
  const openEDP = () => window.open(url);
  const profilePicUrl = profilePic ? profilePic : 'https://unsplash.it/500/300/?random';
  const imageUrl = img ? img : 'https://unsplash.it/500/300/?random';
  return (
    <Card>
      <CardHeader
        title={ displayName }
        subtitle="Recommended for you"
        avatar={ profilePic }
      />
      <CardMedia>
        <img src={ imageUrl } alt="" />
      </CardMedia>
      <CardTitle title={ title } />
      <CardText>
        { venueName || venueCity ?
          <div>{ venueName } { venueCity ? `, ${venueCity}` : null }</div>
          : null
        }
        { startLocalDate ? <div>{ startLocalDate }</div> : null }
      </CardText>
      <CardActions>
        <FlatButton label="Buy Now" onClick={ openEDP } />
      </CardActions>
    </Card>
  );
};

EventCard.propTypes = {
  name: PropTypes.string,
  url: PropTypes.string,
  img: PropTypes.string,
  displayName: PropTypes.string,
  profilePic: PropTypes.string
};

EventCard.defaultProps = {
  name: null,
  url: null,
  img: null,
  displayName: null,
  profilePic: null,
  venueName: null,
  venueCity: null,
  startLocalDate: null
};

export default EventCard;
