import { Button, Divider, Grid, Paper, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useStyles } from './DurakView.styles';

let socket;

export default props => {
  const classes = useStyles();
  const [finished, setFinished] = useState(null);
  const [lobby, setLobby] = useState(true);
  const [users, setUsers] = useState([]);
  const [userhand, setUserhand] = useState([]);
  const [lastcard, setLastcard] = useState();
  const [otherusers, setOtherusers] = useState();
  const [cardcount, setCardcount] = useState();
  const [userstatus, setUserStatus] = useState('other');
  const [field, setField] = useState();

  if (!props.location.state) {
    window.location.href = `http://${window.location.host}/`;
  }
  const { username, roomname } = props.location.state;
  const ENDPOINT = 'http://' + window.location.host + '/durak';

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit('connect-room', { roomname });

    return () => {
      socket.emit('disconnect');
      socket.off();
    };
  }, [ENDPOINT, username, roomname]);

  useEffect(() => {
    socket.on('error-redirect', message => {
      window.alert(message.error);
      window.location.href = `http://${window.location.host}/`;
    });
    socket.on('error-msg', message => {
      window.alert(message.error);
    });
  }, []);

  useEffect(() => {
    socket.on('get-room-users', ({ activeUsers }) => {
      setUsers(activeUsers);
    });

    socket.on('start-game', () => {
      setLobby(false);
    });

    socket.on('handcards', ({ recievedUserhand, allcards, userhands, status }) => {
      setUserhand(recievedUserhand);
      setLastcard(allcards.lastcard);
      setCardcount(allcards.cardcount);
      setField(allcards.field);
      setOtherusers(userhands);
      setUserStatus(status);
    });

    socket.on('update-field', ({ updatedField, updatedUserhand }) => {
      setField(updatedField);
      setUserhand(updatedUserhand);
    });

    socket.on('finish-game', ({ lostuser }) => {
      setFinished(lostuser.username);
    });
  });

  const userReady = () => {
    socket.emit('user-ready', { roomname });
  };

  const cardAttack = ({ card, second }) => {
    socket.emit('attack', { card, roomname, second });
  };

  const cardDeffence = ({ card }) => {
    socket.emit('defence', { card, roomname });
  };

  const finishMove = () => {
    socket.emit('finish-attack');
  };

  return (
    <div className={classes.main}>
      <Paper className={classes.paper}>
        <Typography style={{ textAlign: 'center' }} variant='h4'>
          {roomname}
        </Typography>
        <Divider style={{ marginBottom: '1rem' }} light />
        {finished !== null ? (
          <div>
            <p style={{ textAlign: 'center' }}>{finished} lost! game ended</p>
            <Button variant='contained' color='secondary' href={`http://${window.location.host}/`}>
              Go Home
            </Button>
          </div>
        ) : (
          [
            lobby ? (
              <div key={1}>
                {users.map(user => (
                  <p key={user.id}>
                    {user.username} | {user.ready ? 'ready' : 'not ready'}
                  </p>
                ))}
                <Button variant='contained' color='secondary' onClick={userReady}>
                  <Typography>Ready</Typography>
                </Button>
              </div>
            ) : (
              <div className={classes.gamefield} key={1}>
                <Grid container spacing={2} alignItems='flex-start' justify='flex-end' direction='row'>
                  {otherusers ? (
                    otherusers.map(othuser => (
                      <Grid item xs={12 / otherusers.length}>
                        <img
                          alt=''
                          style={{
                            maxWidth: '4rem',
                            width: '80%',
                            height: 'auto',
                          }}
                          src={process.env.PUBLIC_URL + `/cards/gray_back.png`}
                        />
                        <div>
                          <Typography>{othuser.username}</Typography>
                          <Typography>{othuser.handlength}</Typography>
                        </div>
                      </Grid>
                    ))
                  ) : (
                    <></>
                  )}
                </Grid>

                <Grid container spacing={2}>
                  <Grid item xs={9}>
                    <Grid container spacing={1}>
                      {field &&
                        field.map(row => (
                          <Grid item xs={2}>
                            {row.map(item => (
                              <img
                                alt=''
                                style={{
                                  maxWidth: '6rem',
                                  width: '100%',
                                  height: 'auto',
                                }}
                                src={process.env.PUBLIC_URL + `/cards/${item}.png`}
                              />
                            ))}
                          </Grid>
                        ))}
                    </Grid>
                  </Grid>
                  <Grid item xs={3} style={{ position: 'relative' }}>
                    <img
                      alt=''
                      style={{
                        position: 'relative',
                        maxWidth: '6rem',
                        width: '100%',
                        height: 'auto',
                      }}
                      src={process.env.PUBLIC_URL + `/cards/${lastcard}.png`}
                    />
                    <img
                      alt=''
                      style={{
                        transform: 'rotate(90deg)',
                        maxWidth: '6rem',
                        width: '80%',
                        height: 'auto',
                        position: 'absolute',
                        top: '30px',
                        left: '20px',
                      }}
                      src={process.env.PUBLIC_URL + `/cards/gray_back.png`}
                    />
                    <div>
                      <Typography>{cardcount}</Typography>
                      {userstatus === 'other' || !userstatus ? (
                        <Typography>Please wait for you turn</Typography>
                      ) : userstatus === 'attacking_1' ? (
                        <div>
                          <Typography>You are attacking 1st</Typography>
                          <Button variant='contained' color='secondary' onClick={finishMove}>
                            <Typography>Finish</Typography>
                          </Button>
                        </div>
                      ) : userstatus === 'attacking_2' ? (
                        <div>
                          <Typography>You are attacking 2nd</Typography>
                          <Button variant='contained' color='secondary' onClick={finishMove}>
                            <Typography>Finish</Typography>
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <Typography>You are defending</Typography>
                          <Button variant='contained' color='secondary' onClick={finishMove}>
                            {field.filter(row => row.length % 2 === 0).length === field.length ? (
                              <Typography>Draft</Typography>
                            ) : (
                              <Typography>Take</Typography>
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container spacing={0}>
                      {userhand &&
                        userhand.map(card => (
                          <Grid item xs={2}>
                            <div>
                              <img
                                alt=''
                                style={{ maxWidth: '6rem', width: '100%', height: 'auto' }}
                                src={process.env.PUBLIC_URL + `/cards/${card}.png`}
                                onClick={e => {
                                  userstatus === 'attacking_1'
                                    ? cardAttack({ card, second: false })
                                    : userstatus === 'attacking_2'
                                    ? cardAttack({ card, second: true })
                                    : userstatus === 'defending'
                                    ? cardDeffence({ card })
                                    : e.preventDefault();
                                }}
                              />
                            </div>
                          </Grid>
                        ))}
                    </Grid>
                  </Grid>
                </Grid>
              </div>
            ),
          ]
        )}
      </Paper>
    </div>
  );
};
