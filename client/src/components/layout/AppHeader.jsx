import { AppBar, IconButton, Link, Toolbar, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import React, { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Context } from '../../app';

const useStyles = makeStyles(theme => ({
  main: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
}));

export default function AppHeader() {
  const classes = useStyles();
  const { toggleTheme } = useContext(Context);

  return (
    <div className={classes.main}>
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='h5' className={classes.title}>
            <Link component={RouterLink} to='/' underline='none' color='textSecondary'>
              project wag
            </Link>
          </Typography>
          <IconButton color='inherit' onClick={toggleTheme}>
            <Brightness7Icon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
}
