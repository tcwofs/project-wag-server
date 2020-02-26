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
    maxWidth: '80vw',
    width: '60vw',
    backgroundColor: theme.palette.background.fiveperc,
  },
  form: {
    display: 'flex',
    justifyContent: 'space-between',
    '& .MuiTextField-root': {
      width: '100%',
      marginRight: '5px',
    },
  },
}));
