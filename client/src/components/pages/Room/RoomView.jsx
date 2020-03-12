import { Button, Divider, Paper, TextField, Typography } from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import {
  // Link as RouterLink,
  Redirect,
} from 'react-router-dom';
import io from 'socket.io-client';
import { NameContext } from '../../../app';
import { useStyles } from './RoomView.styles';

let socket;

export default props => {
  if (!props.location.state) {
    window.location.href = `http://${window.location.host}/`;
  }
  const classes = useStyles();
  const [roomname, setRoomname] = useState('');
  const [rooms, setRooms] = useState([]);
  const [clicked, setClicked] = useState(false);
  const { username } = useContext(NameContext);
  const { service } = props.location.state;
  const ENDPOINT = `http://${window.location.host}/rooms`;

  useEffect(() => {
    socket = io(ENDPOINT);

    return () => {
      socket.emit('disconnect');
      socket.off();
    };
  }, [ENDPOINT]);

  useEffect(() => {
    socket.emit('get-active-rooms', { type: service.type });
  }, [service]);

  useEffect(() => {
    socket.on('get-active-rooms', recievedRooms => {
      setRooms(recievedRooms);
    });
  }, [rooms]);

  useEffect(() => {
    socket.on('error-redirect', message => {
      window.alert(message.error);
      window.location.href = `http://${window.location.host}/`;
    });
    socket.on('error-msg', message => {
      window.alert(message.error);
    });
  }, []);

  const connectToNewRoom = () => {
    socket.emit('connect-new-room', { roomname, type: service.type });
    socket.on('room created', () => {
      setClicked(true);
    });
  };

  const connectToExistingRoom = selectedRoom => {
    socket.emit('connect-exist-room', { roomname: selectedRoom, type: service.type });
    socket.on('room created', () => {
      setClicked(true);
    });
  };

  return (
    <div className={classes.main}>
      <Paper className={classes.paper}>
        {clicked ? <Redirect push to={{ pathname: service.path, state: { username, roomname } }} /> : null}
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
          <div className={classes.createRoom}>
            <TextField className={classes.createRoomInput} onChange={event => setRoomname(event.target.value)} label='new room name' />
            <Button className={classes.createRoomButton} variant='outlined' color='primary' onClick={connectToNewRoom}>
              Create
            </Button>
          </div>
          <Typography variant='h6' gutterBottom>
            Connect to a existing one
          </Typography>
          {rooms.map(room => (
            <div key={room.id}>
              <p>{room.roomname}</p>
              <Button
                variant='outlined'
                color='primary'
                onClick={() => {
                  setRoomname(room.roomname);
                  connectToExistingRoom(room.roomname);
                }}
              >
                connect
              </Button>
            </div>
          ))}
        </div>
      </Paper>
    </div>
  );
};
