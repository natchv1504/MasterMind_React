import React, { Component } from 'react';
import './Game.css';

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      settings: props.settings,
      code: getNewCode(),
      history: setEmptyGame(),

      currentGuess: Array(4).fill(null),
      guessNumber: 0
    }

    this.submitGuess = this.submitGuess.bind(this);
    this.reset = this.reset.bind(this);
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.guessNumber];

    var submitDisabled = this.state.currentGuess.indexOf(null) >= 0;

	// Detecting victory and loss
    if (this.state.guessNumber > 0 && history[this.state.guessNumber - 1].keyPawns[1] === 4) {
      alert('Congratulations, you won !');
      submitDisabled = true;
    } else if (this.state.guessNumber >= 10) {
      alert('Sorry, you Lost!');
      submitDisabled = true;
    }

	// creating the html for the web page
    return <div className="Board">
      <ul className="PreviousGuesses">
        <PreviousGuesses
          history={history}
          guessNumber={this.state.guessNumber} />
      </ul>
      <PlayerSubmit
        currentGuess={this.state.currentGuess}
        submitDisabled={submitDisabled}
        handlePawnChange={(i) => this.handlePawnChange(i)}
        submitGuess={this.submitGuess}
        reset={this.reset}/>
    </div>;
  }

  // when the player clicks on a pawn, it changes color
  handlePawnChange(i) {
    var currentGuess = this.state.currentGuess.slice();
    var match = CONSTANTS.COLORS.indexOf(currentGuess[i]);
    if (match === CONSTANTS.COLORS.length - 1 || match < 0) {
      currentGuess[i] = CONSTANTS.COLORS[0];
    } else {
      currentGuess[i] = CONSTANTS.COLORS[match + 1];
    }
    this.setState({ currentGuess: currentGuess });
  }

  submitGuess() {
    const history = this.state.history;
    history[this.state.guessNumber].codePawns = this.state.currentGuess.slice();
    history[this.state.guessNumber].keyPawns = checkWinner(this.state.code, history[this.state.guessNumber].codePawns);
    this.setState({
      history: history,
      guessNumber: ++this.state.guessNumber
    });
  }

  // resets the entire game
  reset() {
    this.setState({
      code: getNewCode(),
      history: setEmptyGame(),
      currentGuess: Array(4).fill(null),
      guessNumber: 0
    });
  }
  
  
}
export default Board;