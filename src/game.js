import React, { Component } from 'react';
import './Game.css';
import App from './app.js';

var CONSTANTS = {
    COLORS: [
    'rouge',
    'bleu',
    'vert',
    'jaune',
    'violet',
    'noir'
  ],

}

// function to create the pawns in the game
function Pawn(props) {
  var classes = `pawn ${props.color} ${props.type} ${props.classes}`;
  return (
    <i className={classes} />
  );
}

function PreviousGuessPawns(props) {
  return props.pawns.map((pawn, i) => {
    return <li key={i}><Pawn color={pawn} type="code"/></li>;
  });
}

// creates the list of all guesses to show to the player
function PreviousGuesses(props) {
  var history = props.history.slice(0, props.history.length).map((guess, i) => {
    var keyPawns = [];
    guess.codePawns.forEach((pawn, i) => { 
      var classes = (guess.keyPawns[0] > i ? ' correct' : '') + (guess.keyPawns[1] > i ? ' inPlace' : '');
      keyPawns.push(<li key={i}><Pawn type="key" classes={classes} /></li>);
    });
    return <li key={i} className="PreviousGuess">
      <ul className="codePawns"><PreviousGuessPawns pawns={guess.codePawns} id={i}/></ul>
      <ul className="keyPawns">{keyPawns}</ul>
    </li>;
  });

  return <ul>{history}</ul>;
}
// function to allow the player to input the pawns to the game
function PlayerSubmit(props) {
  const inputs = props.currentGuess.map((color, i) => {
    return <li key={i}  onClick={() => props.handlePawnChange(i)}>
      <Pawn color={color} type="code" />
    </li>;
  });
// function to show the current guess and to modify the colors
  return <div className="currentGuess">
      <ul>{inputs}</ul>
      <button onClick={props.submitGuess} disabled={props.submitDisabled} className="submitGuess">✓</button>
      <button className="resetGame" onClick={props.reset}>R</button>
    </div>;
}

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
// create a new code at the begining of a game
function getNewCode() {
  return [...new Array(4)]
    .map(() => CONSTANTS.COLORS[Math.floor((Math.random() * (CONSTANTS.COLORS.length)) + 1) - 1]);
}

// Empties the entire game (restart)
function setEmptyGame() {
  return [...new Array(10)]
    .map(() => {
      return {
        codePawns: Array(4).fill(null),
        keyPawns: [0,0]
      }
    });
}

// check if the player inputs match the code, and determines the red and white pawns needed to help him
function checkWinner(code, guess) {
  const check = code.slice();
  var numCorrect = 0;
  var numInPlace = 0;

  for (var x in guess) {
    var match = check.indexOf(guess[x]);
    if (match >= 0) {
      check.splice(match, 1);
      numCorrect++;
    }
  }

  for (var x in guess) {
    if (guess[x] === code[x]) numInPlace++;
  }

  return [numCorrect, numInPlace];
}

