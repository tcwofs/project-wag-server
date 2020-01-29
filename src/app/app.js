import React, { useState } from 'react';
import { AppHeader, AppMain } from '../components/layout';
import { makeStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

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

const darkTheme = createMuiTheme({
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
});

const useStyles = makeStyles(theme => ({
  appContent: {
    backgroundColor: theme.palette.background.default,
    fontSize: 'calc(10px + 2vmin)',
    color: theme.palette.text.primary,
    width: '100%',
  },
  app: {
    display: 'flex',
    width: '100%',
    height: '100%',
  },
}));

const Main = ({ onToggleTheme }) => {
  const classes = useStyles();
  return (
    <div className={classes.appContent}>
      <AppHeader onToggleTheme={onToggleTheme} />
      <AppMain />
    </div>
  );
};

export default function App() {
  const classes = useStyles();
  const [theme, setTheme] = useState(darkTheme);

  const ToggleTheme = () => {
    let newTheme = theme.palette.type === 'light' ? darkTheme : lightTheme;
    setTheme(newTheme);
  };

  return (
    <MuiThemeProvider theme={theme}>
      <div className={classes.app}>
        <Main onToggleTheme={ToggleTheme} />
      </div>
    </MuiThemeProvider>
  );
}
