import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props){
  return(
    <button className={`square ${props.win ? 'win' : ''}`} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {

  renderSquare(i) {
    const win = this.props.winner.fields.includes(i);
    
    return(
      <Square 
        win={win}
        value={this.props.squares[i]} 
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        winner: {
          winner: null,
          fields: Array(3).fill(null),
        },
      }],
      xIsNext: true,
      stepNumber: 0,
    };
  }

  handleClick(i){
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length -1];
    const squares = current.squares.slice();
    if (current.winner.winner || squares[i]){
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    const winner = calculateWinner(squares);
    this.setState({
      history: history.concat([{
        squares: squares,
        move: i,
        winner: winner,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      winner: winner,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  newGame() {
    this.setState({
      history: [{
        squares: Array(9).fill(null),
        winner: {
          winner: null,
          fields: Array(3).fill(null),
        },
      }],
      xIsNext: true,
      stepNumber: 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = current.winner;

    const moves = history.map((step, move) => {
      let desc = move ? `Go to move no. ${move}` : 'Go to the beginning';
      return (
        <li key={move}>
          <span>{ step.xIsNext } on {parseGameField(step.move)}</span>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    // tie
    if (winner.winner === false){
      status = "It's a tie!";
    // winner
    } else if (winner.winner){
      status = `The winner is: ${ winner.winner }`;
    // next player
    } else {
      status = `Next player: ${ this.state.xIsNext ? 'X' : 'O' }`;
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            winner={winner}
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
          <button onClick={() => this.newGame()}>New Game</button>
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

function parseGameField(i) {
  switch (i) {
    case 0:
      return 'A1';
    case 1:
      return 'A2';
    case 2:
      return 'A3';
    case 3:
      return 'B1';
    case 4:
      return 'B2';
    case 5:
      return 'B3';
    case 6:
      return 'C1';
    case 7:
      return 'C2';
    case 8:
      return 'C3';
    default:
      return null;
  };
}

function calculateWinner(squares){
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  let winner = null;
  let fields = [];
  for (const line of lines){
    const [a, b, c] = line;

    if( squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
      winner = squares[a];
      fields = fields.concat([a, b, c]);
    } 
  }
  if (squares.every( x => x ) && !winner){
    winner = false;
  }
  return {
    winner: winner,
    fields: fields,
  }
}


