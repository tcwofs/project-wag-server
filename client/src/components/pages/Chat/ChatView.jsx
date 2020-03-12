import { Button, Paper, TextField } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useStyles } from './ChatView.style';

let socket;

export default props => {
  if (!props.location.state) {
    window.location.href = `http://${window.location.host}/`;
  }
  const classes = useStyles();
  const { username, roomname } = props.location.state;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const ENDPOINT = 'http://' + window.location.host + '/chat';

  useEffect(() => {
    socket = io(ENDPOINT);

    return () => {
      socket.emit('disconnect');
      socket.off();
    };
  }, [ENDPOINT, username]);

  useEffect(() => {
    socket.on('message', recievedMessage => {
      setMessages([...messages, recievedMessage]);
    });
  }, [messages]);

  const sendMessage = () => {
    socket.emit('get-users', { roomname });
    // if (message) {
    //   socket.emit('sendMessage', message, () => setMessage(''));
    // }
  };

  return (
    <div className={classes.main}>
      <Paper className={classes.paper}>
        <p>{roomname}</p>
        <div id='message-container'></div>
        <div className={classes.form}>
          <TextField
            id='standard-textarea'
            autoComplete='off'
            placeholder='Placeholder'
            value={message}
            onChange={event => setMessage(event.target.value)}
          />
          <Button variant='contained' color='primary' onClick={event => sendMessage(event)}>
            Send
          </Button>
        </div>
      </Paper>
    </div>
  );
};
