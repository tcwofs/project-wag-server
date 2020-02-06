import { createMuiTheme, makeStyles, MuiThemeProvider, responsiveFontSizes } from '@material-ui/core/styles';
import React, { createContext, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AppHeader, AppMain } from '../components/layout';
import ChatComp from '../components/service-views/chat';

const lightTheme = createMuiTheme({
  palette: {
    type: 'light',
    background: {
      default: '#FFFFFF',
    },
    primary: {
      main: '#6200EE',
      dark: '#3700B3',
    },
    secondary: {
      light: '#03DAC6',
      main: '#018786',
    },
    text: {
      primary: '#000000',
      secondary: '#F1f1f1',
      error: '#B00020',
    },
  },
});

const darkTheme = responsiveFontSizes(
  createMuiTheme({
    palette: {
      type: 'dark',
      background: {
        default: '#121212',
        fiveperc: '#1D1D1D',
        sevenperc: '#212121',
        eightperc: '#242424',
      },
      primary: {
        main: '#03DAC6',
      },
      secondary: {
        main: '#BB86FC',
        dark: '#3700B3',
      },
      text: {
        primary: '#f1f1f1',
        secondary: '#121212',
        error: '#CF6679',
      },
    },
  })
);

const useStyles = makeStyles(theme => ({
  appContent: {
    backgroundColor: theme.palette.background.default,
    fontSize: 'calc(10px + 2vmin)',
    color: theme.palette.text.primary,
    width: '100%',
    height: '100%',
  },
}));

const Main = () => {
  const classes = useStyles();
  return (
    <div className={classes.appContent}>
      <Router>
        <AppHeader />
        <Switch>
          <Route path='/' exact>
            <AppMain />
          </Route>
          <Route path='/ttt'>xd</Route>
          <Route path='/chat'>
            <ChatComp />
          </Route>
        </Switch>
      </Router>
    </div>
  );
};

export const Context = createContext({});

export default function App() {
  const [theme, setTheme] = useState(darkTheme);

  const toggleTheme = () => setTheme(theme.palette.type === 'light' ? darkTheme : lightTheme);

  return (
    <MuiThemeProvider theme={theme}>
      <Context.Provider value={{ toggleTheme }}>
        <Main />
      </Context.Provider>
    </MuiThemeProvider>
  );
}
