import * as React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import NewHomePage from './routes/home/NewHomePage';
import settings from '../../settings';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import GlobalStyles from '@mui/material/GlobalStyles';

const theme = createTheme({
  spacing: 0,
  palette: {
    primary: {
      main: 'rgb(45, 49, 58)',
      light: 'rgb(121, 123, 129)',
      dark: 'rgb(35, 37, 44)',
      contrastText: 'rgb(233, 234, 234)',
    },
    secondary: {
      main: 'rgb(32, 142, 44)',
      contrastText: 'rgb(233, 234, 234)',
    },
  },
});

const inputGlobalStyles = <GlobalStyles styles={{
  html: {
    margin: 0,
    height: '100vh',
    position: 'relative',
  },
  '#app': {
    margin: 0,
    height: '100%',
    position:'absolute',
    top:0,
    bottom:0,
    left:0,
    right:0,
    // overflow:'scroll',
  },
  body: {
    margin: 0,
    backgroundColor: "rgb(35, 37, 44)", // primary.dark
    height: '100%',
  },
}} />;

export default function App() {
  // document.body.style.backgroundColor = "rgb(35, 37, 44)";

  return (
    <React.Fragment>
      {inputGlobalStyles}
      <ThemeProvider theme={theme}>
        <HashRouter basename={settings.repoPath}>
          <Switch>
            <Route exact path="/" component={NewHomePage} />
          </Switch>
        </HashRouter>
      </ThemeProvider>
    </React.Fragment>
  );
}
