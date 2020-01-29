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
  },
}));

function AppMain() {
  const classes = useStyles();
  const servicesCollection = [
    {
      id: 1,
      img: 'https://img.mobiscroll.com/demos/gridlayout/toucan.jpg',
      name: 'chat',
    },
    {
      id: 2,
      img: 'https://img.mobiscroll.com/demos/gridlayout/kingfisher.jpg',
      name: 'rps',
    },
    {
      id: 3,
      img: 'https://img.mobiscroll.com/demos/gridlayout/swift.jpg',
      name: 'durak',
    },
    {
      id: 4,
      img: 'https://img.mobiscroll.com/demos/gridlayout/humming.jpg',
      name: 'tic-tac-toe',
    },
  ];

  return (
    <div className={classes.main}>
      <CardCollection services={servicesCollection} />
    </div>
  );
}

export default AppMain;
