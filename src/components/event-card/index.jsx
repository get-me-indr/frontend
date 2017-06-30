import React, { PropTypes } from 'react';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

const EventCard = ({ name,subtitle,image,dateTime,distance}) => (
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
    <CardText>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
      Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
      Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
    </CardText>
    <CardActions>
      <FlatButton label="Action1" />
      <FlatButton label="Action2" />
    </CardActions>
  </Card>
);

EventCard.propTypes = {
  name: PropTypes.string
};

EventCard.defaultProps = {
  name: ''
};

export default EventCard;
