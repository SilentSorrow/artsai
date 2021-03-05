import React, { useState, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import SignUp from '../pages/SignUp';
import VerifyAccount from '../pages/VerifyAccount';
import Profile from '../pages/Profile';
import { UserContext } from './UserContext';
import { checkToken } from '../services';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      const res = await checkToken(localStorage.getItem('app-auth'));
      if (!res.data.error) {
        setUser(res.data);
      }
    })();
  }, []);

  return (
    <Switch>
      <UserContext.Provider value={user}>
        <ProtectedRoute exact path="/signup" component={SignUp} user={!user}/>
        <ProtectedRoute exact path="/verify-account" component={VerifyAccount} user={!user}/>
        <Route exact path="/:username" component={Profile} />
      </UserContext.Provider>
    </Switch>
  );
};

export default App;
