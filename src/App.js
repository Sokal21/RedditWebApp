import React, { Component } from 'react';
import SubredditSearch from './components/subredditSearch';
import SubredditList from './components/SubredditList';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <SubredditSearch />
        <SubredditList />
      </div>
    );
  }
}

export default App;
