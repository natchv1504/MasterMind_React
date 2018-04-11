import React, { Component } from 'react';
import './Game.css';
import Board from './Game.js';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      settings: Object.assign({}),
    }
  }
  render() {

    return (
      <div className="App">
        <Board
          settings={this.state.settings}
          incrementWins={i => this.incrementWins(i)} />
      </div>
    );
  }
}

export default App;