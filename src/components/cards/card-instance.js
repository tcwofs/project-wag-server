import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardActions, CardMedia, CardContent, Typography, Button } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
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

export default function CardInstance(props) {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardMedia className={classes.cardMedia} image={props.service.img} title='Contemplative Reptile' />
      <CardContent>
        <Typography gutterBottom variant='h5' component='h2'>
          {props.service.name}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size='small' variant='outlined' color='secondary'>
          start
        </Button>
        <Button size='small' variant='outlined' color='secondary'>
          overview
        </Button>
      </CardActions>
    </Card>
  );
}
