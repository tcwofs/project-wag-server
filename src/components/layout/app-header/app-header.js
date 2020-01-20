import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
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
          <Typography variant='h6' className={classes.title}>
            News
          </Typography>
          <IconButton color='inherit' onClick={onToggleTheme}>
            <Brightness7Icon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
}
