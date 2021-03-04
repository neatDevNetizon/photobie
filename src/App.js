import React, { Fragment, Suspense, lazy } from "react";
import { MuiThemeProvider, CssBaseline } from "@material-ui/core";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import theme from "./theme";
import GlobalStyles from "./GlobalStyles";
// import * as serviceWorker from "./serviceWorker";
import Pace from "./shared/components/Pace";
import "./app.css"
import NotistackProvider from './shared/components/NotistackProvider';
import { SnackbarProvider } from "notistack";
const AdminComponent = lazy(() => import("./admin/components/Main"));
const ClientComponent = lazy(() => import("./client/components/Main"));
const ProviderComponent = lazy(() => import("./provider/components/Main"));
const ModeratorComponent = lazy(() => import("./moderator/components/Main"));
const LoggedOutComponent = lazy(() => import("./logged_out/components/Main"));

function App() {
 
  return (

    <BrowserRouter>
    <SnackbarProvider 
      dense
      maxSnack={5}
      preventDuplicate
      autoHideDuration={2000}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles />
        <Pace color={theme.palette.primary.light} />
        <Suspense fallback={<Fragment />}>
          <Switch>
            <Route path="/c">
              <ClientComponent />
            </Route>
            <Route path="/p">
              <ProviderComponent />
            </Route>
            <Route path="/a">
              <AdminComponent />
            </Route>
            <Route path="/m">
              <ModeratorComponent />
            </Route>
            <Route>
              <LoggedOutComponent />
            </Route>
          </Switch>
        </Suspense>
      </MuiThemeProvider>
      </SnackbarProvider>
    </BrowserRouter>
  );
}

// serviceWorker.register();

export default App;
