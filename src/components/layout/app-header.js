import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Typography, IconButton, Link } from '@material-ui/core';
import Brightness7Icon from '@material-ui/icons/Brightness7';

const useStyles = makeStyles(theme => ({
  main: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
}));

export default function AppHeader({ onToggleTheme }) {
  const classes = useStyles();
  return (
    <div className={classes.main}>
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='h5' className={classes.title}>
            <Link href='#' underline='none' color='textSecondary'>
              project wag
            </Link>
          </Typography>
          <IconButton color='inherit' onClick={onToggleTheme}>
            <Brightness7Icon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
}
