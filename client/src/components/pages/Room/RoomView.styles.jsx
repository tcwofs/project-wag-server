import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme => ({
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
    width: '100%',
    maxWidth: '80vw',
    marginRight: '1rem',
    marginLeft: '1rem',
    backgroundColor: theme.palette.background.fiveperc,
  },
  grid: {},
  roomInfo: {
    float: 'left',
    paddingTop: '1vh',
    width: '100%',
    height: '100%',
  },
  roomPanel: {
    float: 'right',
    paddingTop: '1vh',
    width: '100%',
    height: '100%',
    '& > form': {
      paddingBottom: '1vh',
    },
  },
  createRoomInput: {
    width: '100%',
    '& > *': {
      color: '#eeeeee',
    },
  },
  createRoomButton: {
    width: '100%',
    marginTop: '1vh',
    marginBottom: '1vh',
  },
}));
