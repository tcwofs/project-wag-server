import { Button, Paper, TextField } from '@material-ui/core';
import React from 'react';
import { useStyles } from './ChatView.style';
export default () => {
  const classes = useStyles();

  return (
    <div className={classes.main}>
      <Paper className={classes.paper}>
        <div id='message-container'></div>
        <form className={classes.form} noValidate autoComplete='off'>
          <TextField id='standard-textarea' placeholder='Placeholder' multiline />
          <Button variant='contained' color='primary'>
            Send
          </Button>
        </form>
      </Paper>
    </div>
  );
};
