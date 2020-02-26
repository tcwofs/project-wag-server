import { AppBar, IconButton, Link, Toolbar, Typography } from '@material-ui/core';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import React, { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AppContext } from '../../app';
import { useStyles } from './AppHeader.styles';

export default function AppHeader() {
  const classes = useStyles();
  const { switchTheme } = useContext(AppContext);

  return (
    <div className={classes.main}>
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='h5' className={classes.title}>
            <Link component={RouterLink} to='/' underline='none' color='textSecondary'>
              project wag
            </Link>
          </Typography>
          <IconButton color='inherit' onClick={switchTheme}>
            <Brightness7Icon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
}
