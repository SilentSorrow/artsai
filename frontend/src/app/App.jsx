import React, { useState, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import SignUp from '../pages/SignUp';
import VerifyAccount from '../pages/VerifyAccount';
import Profile from '../pages/Profile';
import ArtDetails from '../pages/ArtDetails';
import AccountSettings from '../pages/AccountSettings';
import { UserContext } from './UserContext';
import { checkToken } from '../services';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      const res = await checkToken();
      if (!res.data.error) {
        setUser(res.data);
      }
    })();
  }, []);

  return (
    <Switch>
      <UserContext.Provider value={{ user, setUser }}>
        <Route exact path="/signup" component={SignUp} /> {/* */}
        <Route exact path="/verify-account" component={VerifyAccount} /> {/* */}
        <Route exact path="/account-settings" component={AccountSettings} /> {/* */}
        <Route exact path="/artists/:username" component={Profile} />
        <Route exact path="/details/:artId" component={ArtDetails} />
      </UserContext.Provider>
    </Switch>
  );
};

export default App;
