import { Button, Card, CardActions, CardContent, CardMedia, Grid, Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  main: {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '1vh',
    paddingBottom: '1vh',
  },
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
  card: {
    backgroundColor: theme.palette.background.eightperc,
    color: theme.palette.text.primary,
    width: 'auto',
  },
  cardMedia: {
    height: '15vh',
    filter: 'blur(10px)',
  },
}));

export default () => {
  const classes = useStyles();
  const servicesCollection = [
    {
      id: 1,
      img: 'https://img.mobiscroll.com/demos/gridlayout/toucan.jpg',
      name: 'chat',
      overview: 'A chat',
      path: '/chat',
    },
    {
      id: 2,
      img: 'https://img.mobiscroll.com/demos/gridlayout/kingfisher.jpg',
      name: 'rps',
      overview: 'A rps game',
      path: '/rps',
    },
    {
      id: 3,
      img: 'https://img.mobiscroll.com/demos/gridlayout/swift.jpg',
      name: 'durak',
      overview: 'A durak game',
      path: '/durak',
    },
    {
      id: 4,
      img: 'https://img.mobiscroll.com/demos/gridlayout/humming.jpg',
      name: 'tic-tac-toe',
      overview: 'A tic-tac-toe game',
      path: '/ttt',
    },
  ];

  const renderCollection = useCallback(
    () =>
      servicesCollection.map(collection => (
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
    [servicesCollection, classes.card, classes.cardMedia]
  );

  return (
    <div className={classes.main}>
      <Paper className={classes.paper}>
        <Grid className={classes.grid} container spacing={2}>
          {renderCollection()}
        </Grid>
      </Paper>
    </div>
  );
};
