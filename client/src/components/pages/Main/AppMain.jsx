import { Button, Card, CardActions, CardContent, CardMedia, Grid, LinearProgress, Paper, Typography } from '@material-ui/core';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import io from 'socket.io-client';
import { useStyles } from './AppMain.styles';

let socket;

export default () => {
  const classes = useStyles();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const ENDPOINT = 'http://localhost:3000/';

  const getServices = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/services');
      setServices(res.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    getServices();
  }, []);

  useEffect(() => {
    socket = io(ENDPOINT);

    return () => {
      socket.emit('disconnect');

      socket.off();
    };
  }, [ENDPOINT]);

  const renderCollection = useCallback(
    () =>
      services.map(service => (
        <Grid item md={6} xs={12} key={service.id}>
          <Card className={classes.card}>
            <CardMedia className={classes.cardMedia} image={service.img} title='Contemplative Reptile' />
            <CardContent>
              <Typography gutterBottom variant='h5' component='h2'>
                {service.name}
              </Typography>
            </CardContent>
            <CardActions>
              <Button component={RouterLink} to={{ pathname: '/room', state: { service } }} size='small' variant='outlined' color='secondary'>
                start
              </Button>
            </CardActions>
          </Card>
        </Grid>
      )),
    [services, classes.card, classes.cardMedia]
  );

  return (
    <div className={classes.main}>
      <Paper className={classes.paper}>
        <div className={classes.errorLabel}>{error}</div>
        {loading ? (
          <LinearProgress className={classes.progress} color='secondary' />
        ) : (
          <Grid className={classes.grid} container spacing={2}>
            {renderCollection()}
          </Grid>
        )}
      </Paper>
    </div>
  );
};
