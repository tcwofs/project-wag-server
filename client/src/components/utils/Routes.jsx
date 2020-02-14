import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AppHeader } from '../layout';
import { AppMain, ChatView, DurakView, RPSView, TTTView } from '../pages';

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
          <Route path='/' exact>
            <AppMain />
          </Route>
          <Route path='/chat'>
            <ChatView />
          </Route>
          <Route path='/durak'>
            <DurakView />
          </Route>
          <Route path='/rps'>
            <RPSView />
          </Route>
          <Route path='/ttt'>
            <TTTView />
          </Route>
        </Switch>
      </Router>
    </div>
  );
};
