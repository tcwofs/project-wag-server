import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CardCollection } from '../cards';

const useStyles = makeStyles(theme => ({
  main: {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
    fontSize: 'calc(10px + 2vmin)',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '1vh',
    paddingBottom: '1vh',
  },
}));

function AppMain() {
  const classes = useStyles();
  const servicesCollection = [
    {
      id: 1,
      img: 'https://img.mobiscroll.com/demos/gridlayout/toucan.jpg',
      name: 'chat',
      overview: 'A chat',
      path: '/chat',
    },
    {
      id: 2,
      img: 'https://img.mobiscroll.com/demos/gridlayout/kingfisher.jpg',
      name: 'rps',
      overview: 'A rps game',
      path: '/rps',
    },
    {
      id: 3,
      img: 'https://img.mobiscroll.com/demos/gridlayout/swift.jpg',
      name: 'durak',
      overview: 'A durak game',
      path: '/durak',
    },
    {
      id: 4,
      img: 'https://img.mobiscroll.com/demos/gridlayout/humming.jpg',
      name: 'tic-tac-toe',
      overview: 'A tic-tac-toe game',
      path: '/ttt',
    },
  ];

  return (
    <div className={classes.main}>
      <CardCollection services={servicesCollection} />
    </div>
  );
}

export default AppMain;
