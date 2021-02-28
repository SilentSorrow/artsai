import React from 'react';
import { Route, Switch } from 'react-router-dom';
import SignUp from '../pages/SignUp';
import VerifyAccount from '../pages/VerifyAccount';
import Profile from '../pages/Profile';

const App = () => {
  return (
    <Switch>
      <Route exact path="/signup" component={SignUp} />
      <Route exact path="/verify-account" component={VerifyAccount} /> {/*  */}
      <Route exact path="/" component={Profile} /> {/*  */}
    </Switch>
  );
};

export default App;
