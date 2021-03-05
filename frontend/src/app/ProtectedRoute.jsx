import React from 'react';
import { Redirect, Route } from 'react-router-dom';

const ProtectedRoute = ({ user, component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
     user ? <Component {...props} /> : <Redirect to={{ pathname: '/', state: { from: props.location }}} />   
  )} />
);

export default ProtectedRoute;