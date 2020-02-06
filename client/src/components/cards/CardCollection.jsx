import { Grid, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { CardInstance } from './index';
const useStyles = makeStyles(theme => ({
  paper: {
    padding: '20px',
    maxWidth: '80vw',
    width: '60vw',
    backgroundColor: theme.palette.background.fiveperc,
  },
  grid: {
    display: 'flex',
    justifyContent: 'center',
    padding: 0,
  },
}));

export default function CardCollection(props) {
  const classes = useStyles();

  return (
    <Paper className={classes.paper}>
      <Grid className={classes.grid} container spacing={2}>
        {props.services.map(function(app) {
          return (
            <Grid item md={6} xs={12}>
              <CardInstance service={app} key={app.id} />
            </Grid>
          );
        })}
      </Grid>
    </Paper>
  );
}
