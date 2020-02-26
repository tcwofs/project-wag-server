import { Button, Card, CardActions, CardContent, CardMedia, Grid, LinearProgress, Paper, Typography } from '@material-ui/core';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useStyles } from './AppMain.styles';

export default () => {
  const classes = useStyles();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getServices = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/services');
        setServices(res.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
      }
    };
    getServices();
  }, []);

  const renderCollection = useCallback(
    () =>
      services.map(collection => (
        <Grid item md={6} xs={12} key={collection.id}>
          <Card className={classes.card}>
            <CardMedia className={classes.cardMedia} image={collection.img} title='Contemplative Reptile' />
            <CardContent>
              <Typography gutterBottom variant='h5' component='h2'>
                {collection.name}
              </Typography>
            </CardContent>
            <CardActions>
              <Button component={RouterLink} to={collection.path} size='small' variant='outlined' color='secondary'>
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
