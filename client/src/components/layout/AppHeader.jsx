import { AppBar, IconButton, Link, Toolbar, Typography } from '@material-ui/core';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import React, { useContext } from 'react';
import { AppContext, NameContext } from '../../app';
import { useStyles } from './AppHeader.styles';

export default () => {
  const classes = useStyles();
  const { switchTheme } = useContext(AppContext);
  const { username } = useContext(NameContext);

  return (
    <div className={classes.main}>
      <AppBar position='static'>
        <Toolbar>
          <Typography data-testid='title' variant='h5' className={classes.title}>
            <Link href='/' onClick={event => event.preventDefault} underline='none' color='textSecondary'>
              project wag
            </Link>
          </Typography>
          <Typography data-testid='username'>{username}</Typography>
          <IconButton data-testid='theme-changer-button' color='inherit' onClick={switchTheme}>
            <Brightness7Icon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
};
