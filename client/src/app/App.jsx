import { MuiThemeProvider } from '@material-ui/core/styles';
import React, { createContext, useState } from 'react';
import Routes from '../components/utils/Routes';
import { darkTheme, lightTheme } from '../styles';

export const AppContext = createContext({});

export default () => {
  const [theme, setTheme] = useState(darkTheme);

  const switchTheme = () => setTheme(theme.palette.type === 'light' ? darkTheme : lightTheme);

  return (
    <MuiThemeProvider theme={theme}>
      <AppContext.Provider value={{ switchTheme }}>
        <Routes />
      </AppContext.Provider>
    </MuiThemeProvider>
  );
};
