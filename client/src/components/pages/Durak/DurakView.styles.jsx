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

    flexGrow: 1,
  },
  paper: {
    padding: '20px',
    width: '100%',
    maxWidth: '80vw',
    marginRight: '1rem',
    marginLeft: '1rem',
    backgroundColor: theme.palette.background.fiveperc,
  },
  grid: {
    display: 'flex',
    justifyContent: 'center',
    padding: 0,
  },
  papers: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  gamefield: {
    marginTop: '0.7rem',
  },
}));
