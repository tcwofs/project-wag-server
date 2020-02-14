import { createMuiTheme, responsiveFontSizes } from '@material-ui/core';

// FIXME: добавлен responsiveFontSizes
export const lightTheme = responsiveFontSizes(
  createMuiTheme({
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
  })
);

export const darkTheme = responsiveFontSizes(
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
