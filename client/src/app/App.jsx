import { MuiThemeProvider } from '@material-ui/core/styles';
import React, { createContext, useEffect, useState } from 'react';
import Routes from '../components/utils/Routes';
import { darkTheme, lightTheme } from '../styles';
import generateName from '../utils/nameGenerator';

export const AppContext = createContext({});
export const NameContext = createContext({});

export default () => {
  const [theme, setTheme] = useState(darkTheme);
  const [username, SetUsername] = useState('');

  const switchTheme = () => setTheme(theme.palette.type === 'light' ? darkTheme : lightTheme);

  useEffect(() => {
    SetUsername(generateName());
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
