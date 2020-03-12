import { MuiThemeProvider } from '@material-ui/core/styles';
import React, { createContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import Routes from '../components/utils/Routes';
import { darkTheme, lightTheme } from '../styles';
import generateName from '../utils/nameGenerator';

let socket;

export const AppContext = createContext({});
export const NameContext = createContext({});

export default () => {
  const [theme, setTheme] = useState(darkTheme);
  const [username] = useState(generateName());
  const ENDPOINT = 'http://' + window.location.host;
  const switchTheme = () => setTheme(theme.palette.type === 'light' ? darkTheme : lightTheme);

  useEffect(() => {
    socket = io(ENDPOINT).emit('new-user-connection', { username });

    return () => {
      socket.emit('disconnect');
      socket.off();
    };
  }, [ENDPOINT, username]);

  useEffect(() => {
    socket.on('error-redirect', message => {
      window.alert(message.error);
      window.location.href = `http://${window.location.host}/`;
    });
  }, []);

  return (
    <MuiThemeProvider theme={theme}>
      <AppContext.Provider value={{ switchTheme }}>
        <NameContext.Provider value={{ username }}>
          <Routes />
        </NameContext.Provider>
      </AppContext.Provider>
    </MuiThemeProvider>
  );
};
