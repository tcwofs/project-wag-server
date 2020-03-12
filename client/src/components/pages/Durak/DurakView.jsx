import { Paper } from '@material-ui/core';
import React, { useEffect } from 'react';
import io from 'socket.io-client';

let socket;

export default props => {
  if (!props.location.state) {
    window.location.href = `http://${window.location.host}/`;
  }
  const { username, roomname } = props.location.state;
  const ENDPOINT = 'http://' + window.location.host + '/durak';

  useEffect(() => {
    socket = io(ENDPOINT);

    return () => {
      socket.emit('disconnect');
      socket.off();
    };
  }, [ENDPOINT, username]);

  return (
    <div>
      <Paper>
        return <div>durak</div>;
      </Paper>
    </div>
  );
};
