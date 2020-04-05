import { AppBar, ClickAwayListener, IconButton, Link, Toolbar, Tooltip, Typography } from '@material-ui/core';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import React, { useContext, useState } from 'react';
import { AppContext, NameContext } from '../../app';
import { useStyles } from './AppHeader.styles';

export default () => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const { switchTheme } = useContext(AppContext);
  const { username } = useContext(NameContext);

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = () => {
    setOpen(true);
  };

  return (
    <div className={classes.main}>
      <AppBar position='static'>
        <Toolbar>
          <Typography data-testid='title' variant='h5' className={classes.title}>
            <Link onClick={() => (window.location.href = `http://${window.location.host}/`)} underline='none' color='textSecondary'>
              project wag
            </Link>
          </Typography>
          <ClickAwayListener onClickAway={handleTooltipClose}>
            <Tooltip
              PopperProps={{
                disablePortal: true,
              }}
              onClose={handleTooltipClose}
              open={open}
              disableFocusListener
              disableHoverListener
              disableTouchListener
              title={username}
            >
              <Typography noWrap onClick={handleTooltipOpen} data-testid='username'>
                {username}
              </Typography>
            </Tooltip>
          </ClickAwayListener>
          <IconButton data-testid='theme-changer-button' color='inherit' onClick={switchTheme}>
            <Brightness7Icon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
};
