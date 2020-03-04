import { Button, Divider, Paper, TextField, Typography } from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import io from 'socket.io-client';
import { NameContext } from '../../../app';
import { useStyles } from './RoomView.styles';

let socket;

export default props => {
  const classes = useStyles();
  const [room, setRoom] = useState('');
  const { username } = useContext(NameContext);
  const { service } = props.location.state;
  const ENDPOINT = 'http://localhost:3000/rooms';

  useEffect(() => {
    socket = io(ENDPOINT);

    socket.emit('get-active-rooms', { type: service.type });

    return () => {
      socket.disconnect();
      socket.off();
    };
  }, [ENDPOINT, service]);

  return (
    <div className={classes.main}>
      <Paper className={classes.paper}>
        <Typography variant='h4'>{service.name}</Typography>
        <Divider />
        <div className={classes.roomInfo}>
          <Typography variant='h6' gutterBottom>
            {service.overview}
          </Typography>
          <Divider light />
          <Typography variant='subtitle1' gutterBottom>
            {service.rules}
          </Typography>
        </div>
        <div className={classes.roomPanel}>
          <Typography variant='h6'>Create new room</Typography>
          <form className={classes.createRoom} noValidate autoComplete='off'>
            <TextField
              className={classes.createRoomInput}
              onChange={event => setRoom(event.target.value)}
              label='new room name'
              onKeyPress={event => (event.key === 'Enter' ? event.preventDefault() : null)}
            />
            <Button
              component={RouterLink}
              to={{ pathname: service.path, state: { username, room } }}
              className={classes.createRoomButton}
              variant='outlined'
              color='primary'
            >
              Create
            </Button>
          </form>
          <Typography variant='h6' gutterBottom>
            Connect to a existing one
          </Typography>
        </div>
      </Paper>
    </div>
  );
};
