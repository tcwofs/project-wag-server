import { Button, Card, CardActions, CardContent, CardMedia, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

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
    <React.Fragment>
      <Card className={classes.card}>
        <CardMedia className={classes.cardMedia} image={props.service.img} title='Contemplative Reptile' />
        <CardContent>
          <Typography gutterBottom variant='h5' component='h2'>
            {props.service.name}
          </Typography>
        </CardContent>
        <CardActions>
          <Button component={RouterLink} to={props.service.path} size='small' variant='outlined' color='secondary'>
            start
          </Button>
        </CardActions>
      </Card>
    </React.Fragment>
  );
}
