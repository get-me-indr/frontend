import React, { PropTypes } from 'react';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Cards from 'react-swipe-card';


const EventCard = ({ name,subtitle,image,dateTime,distance,url}) => (
  <Card>
    <CardHeader
      title={ name }
      subtitle={ subtitle }
      avatar="https://unsplash.it/128/128/?random"
    />
    <CardMedia
      overlay={<CardTitle title={ name } subtitle={ subtitle } />}
    >
      <img src={image} alt="" />
    </CardMedia>
    <CardTitle title={dateTime} subtitle={distance} />


  </Card>
);

EventCard.propTypes = {
  name: PropTypes.string
};

EventCard.defaultProps = {
  name: ''
};

export default EventCard;
