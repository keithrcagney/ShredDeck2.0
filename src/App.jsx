import React from 'react';
import { render } from 'react-dom';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import './styles.css';
import "core-js/stable";
import "regenerator-runtime/runtime";

import PrivateRoute from './PrivateRoute.jsx';
import DeckDashboard from './DeckDashboard.jsx';
import Signup from './Signup.jsx';
import Login from './Login.jsx';

const App = () => {
  return (
    <Router basename="/">
      <>
        <h1 className='shredHeader'>
          ShredDeck 2.0
        </h1>
      </>

      <Switch>
        <Route path="/signup" exact>
          <Signup/>
        </Route>
          
        <Route path ="/deckDash">
          <PrivateRoute/>
        </Route>

        <Route path="/" exact component={Login} />
      </Switch>
      
    </Router>
  );
}

render(<App />, document.querySelector('#root'));

if (module.hot){
  module.hot.accept(
    './App.jsx',
    (err) => {console.error(err)
  });
}