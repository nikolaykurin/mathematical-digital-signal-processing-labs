import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Lab1 from './components/lab1';
import Lab2 from './components/lab2';


class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Route exact path="/lab1" component={Lab1} />
          <Route exact path="/lab2" component={Lab2} />
        </div>
      </Router>
    );
  }
}

export default App;
