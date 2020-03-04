import { Button, Paper, TextField } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useStyles } from './ChatView.style';

let socket;

export default props => {
  const classes = useStyles();
  const { username, room } = props.location.state;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const ENDPOINT = 'http://localhost:3000/chat';

  useEffect(() => {
    socket = io(ENDPOINT, error => {
      console.error(error);
    });

    socket.emit('join', { username, room }, () => {});

    return () => {
      socket.disconnect();
      socket.off();
    };
  }, [ENDPOINT, username, room]);

  useEffect(() => {
    socket.on('message', recievedMessage => {
      setMessages([...messages, recievedMessage]);
    });
  }, [messages]);

  const sendMessage = event => {
    event.preventDefault();

    if (message) {
      socket.emit('sendMessage', message, () => setMessage(''));
    }
  };

  console.log(message, messages);

  return (
    <div className={classes.main}>
      <Paper className={classes.paper}>
        <div id='message-container'></div>
        <div className={classes.form}>
          <TextField
            id='standard-textarea'
            autoComplete='off'
            placeholder='Placeholder'
            value={message}
            onChange={event => setMessage(event.target.value)}
            onKeyPress={event => (event.key === 'Enter' ? sendMessage(event) : null)}
          />
          <Button variant='contained' color='primary' onClick={event => sendMessage(event)}>
            Send
          </Button>
        </div>
      </Paper>
    </div>
  );
};
