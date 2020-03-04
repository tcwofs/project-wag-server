import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AppHeader } from '../layout';
import { AppMain, ChatView, DurakView, RoomView, RPSView, TTTView } from '../pages';

const useStyles = makeStyles(theme => ({
  appContent: {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
    width: '100%',
    height: '100%',
  },
}));

export default () => {
  const classes = useStyles();
  return (
    <div className={classes.appContent}>
      <Router>
        <AppHeader />
        <Switch>
          <Route path='/' component={AppMain} exact />
          <Route path='/room' component={RoomView} exact />
          <Route path='/chat' component={ChatView} exact />
          <Route path='/durak' component={DurakView} exact />
          <Route path='/rps' component={RPSView} exact />
          <Route path='/ttt' component={TTTView} exact />
          <Route component={AppMain} />
        </Switch>
      </Router>
    </div>
  );
};
