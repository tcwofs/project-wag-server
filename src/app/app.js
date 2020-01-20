import React, { useState } from 'react';
import { AppHeader, AppMain } from '../components/layout';
import {
  makeStyles,
  MuiThemeProvider,
  createMuiTheme,
} from '@material-ui/core/styles';

const lightTheme = createMuiTheme({
  palette: {
    type: 'light',
    background: {
      default: '#FFFFFF',
    },
    primary: {
      light: '#03DAC6',
      main: '#018786',
    },
    secondary: {
      main: '#6200EE',
      dark: '#3700B3',
    },
    text: {
      primary: '#000000',
      error: '#B00020',
    },
  },
});

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
    background: {
      default: '#121212',
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
      error: '#CF6679',
    },
  },
});

const useStyles = makeStyles(theme => ({
  main: {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
  },
  app: {
    backgroundColor: theme.palette.background.default,
    fontSize: 'calc(10px + 2vmin)',
    color: theme.palette.text.primary,
    width: '100%',
  },
  appMain: {
    display: 'flex',
    width: '100%',
    height: '100%',
  },
}));

const Main = ({ onToggleTheme }) => {
  const classes = useStyles();
  return (
    <div className={classes.app}>
      <AppHeader onToggleTheme={onToggleTheme} />
      <AppMain classes={classes} />
    </div>
  );
};

export default function App() {
  const classes = useStyles();
  const [theme, setTheme] = useState(lightTheme);

  const ToggleTheme = () => {
    let newTheme = theme.palette.type === 'light' ? darkTheme : lightTheme;
    setTheme(newTheme);
  };

  return (
    <MuiThemeProvider theme={theme}>
      <div className={classes.appMain}>
        <Main classes={classes} onToggleTheme={ToggleTheme} />
      </div>
    </MuiThemeProvider>
  );
}
