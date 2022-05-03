
const GRID_HEIGHT = 35;
const GRID_WIDTH = 40;

const { Component } = React;
const { createStore, applyMiddleware } = Redux;
const { Provider } = ReactRedux;
const { connect } = ReactRedux;
const { combineReducers } = Redux;

const makeGrid = (height, width, makeRandom = false) => {
  let grid = [];
  for (let i = 0; i < height; i++) {
    const row = [];
    for (let j = 0; j < width; j++) {
      let value;
      if (makeRandom) {
        value = Math.random() > 0.85;
      }
      row.push({
        status: value,
        newBorn: value });

    }
    grid.push(row);
  }
  return grid;
};

const advanceGrid = function (grid = []) {
  let gridHeight = grid.length;
  let gridWidth = grid[0].length;

  let calculateNeighbours = function (x, y) {

    let topRow = x - 1 < 0 ? gridHeight - 1 : x - 1;
    let bottomRow = x + 1 === gridHeight ? 0 : x + 1;
    let leftColumn = y - 1 < 0 ? gridWidth - 1 : y - 1;
    let rightColumn = y + 1 === gridWidth ? 0 : y + 1;

    let total = 0;
    total += grid[topRow][leftColumn].status;
    total += grid[topRow][y].status;
    total += grid[topRow][rightColumn].status;
    total += grid[x][leftColumn].status;
    total += grid[x][rightColumn].status;
    total += grid[bottomRow][leftColumn].status;
    total += grid[bottomRow][y].status;
    total += grid[bottomRow][rightColumn].status;

    return total;
  };

  let gameState = [];
  for (let i = 0; i < gridHeight; i++) {
    let row = [];
    for (let j = 0; j < gridWidth; j++) {
      let cellIsAlive = grid[i][j].status;
      let neighbours = calculateNeighbours(i, j);
      if (cellIsAlive) {
        if (neighbours < 2) {
          row.push({ status: 0 });
        } else if (neighbours > 3) {
          row.push({ status: 0 });
        } else {
          row.push({ status: 1 });
        }
      }
      if (!cellIsAlive) {
        if (neighbours === 3) {
          row.push({
            status: 1,
            newBorn: true });

        } else {
          row.push({ status: 0 });
        }
      }
    }
    gameState.push(row);
  }
  return gameState;
};


function toggleAlive(x, y) {
  return {
    type: 'TOGGLE_ALIVE',
    x, y };

}

function makeRandomGrid() {
  return {
    type: 'MAKE_RANDOM' };

}

function tick() {
  return {
    type: 'TICK' };

}

function startPlaying(timerId) {
  return {
    type: 'PLAY',
    timerId };

}

function stopPlaying(timerId) {
  return {
    type: 'STOP',
    timerId };

}

function clear() {
  return {
    type: 'CLEAR' };

}



const Button = ({ title, icon, handleClick }) =>
React.createElement("span", { onClick: handleClick, className: "button" },
React.createElement("i", { className: icon }), " ", title);



const Cell = ({ alive, newBorn, handleClick }) =>
React.createElement("td", {
  onClick: handleClick,
  className: `${alive ? 'alive' : ''} ${newBorn ? 'new-born' : ''}` });


class Board_ extends Component {
  render() {
    return /*#__PURE__*/(
      React.createElement("div", null,
      React.createElement("table", null,
      React.createElement("tbody", null,
      this.props.board.map((row, i) =>
      React.createElement("tr", { key: i }, " ", row.map((cell, j) =>
      React.createElement(Cell, {
        key: j,
        alive: cell.status,
        newBorn: cell.newBorn,
        handleClick: () => this.props.toggleAlive(i, j) }))))))));






  }}


const mapStateToProps_1 = ({ board }) => {
  return { board };
};

const mapDispatchToProps_1 = dispatch => {
  return { toggleAlive: (x, y) => dispatch(toggleAlive(x, y)) };
};

const Board = connect(mapStateToProps_1, mapDispatchToProps_1)(Board_);


class Control_ extends Component {
  componentDidMount() {
    this.props.random();
    this.togglePlay();
  }
  render() {
    return (
      React.createElement("div", { className: "controls" },
      React.createElement("div", { className: "buttons" },
      React.createElement(Button, {
        handleClick: () => this.props.random(),
        title: 'Рандомно',}),

      React.createElement(Button, {
        handleClick: () => this.clear(),
        icon: 'fa fa-undo' }),

      React.createElement("div", { className: "button-group" },
      React.createElement(Button, {
        icon: this.props.playState.isRunning ? 'fa fa-pause' : 'fa fa-play',
        handleClick: () => this.togglePlay() }),

      React.createElement(Button, {
        handleClick: () => this.props.tick(),
        icon: 'fa fa-step-forward' })))));





  }
  togglePlay() {
    if (this.props.playState.isRunning) {
      clearInterval(this.props.playState.timerId);
      this.props.stopPlaying();
    } else {
      let interval = setInterval(this.props.tick, 100);
      this.props.startPlaying(interval);
    }
  }
  clear() {
    if (this.props.playState.isRunning) {
      clearInterval(this.props.playState.timerId);
      this.props.stopPlaying();
    }
    this.props.clear();
  }}



const mapStateToProps_2 = ({ playState }) => {
  return { playState };
};

const mapDispatchToProps_2 = dispatch => {
  return {
    random: () => dispatch(makeRandomGrid()),
    tick: () => dispatch(tick()),
    startPlaying: timerId => dispatch(startPlaying(timerId)),
    stopPlaying: () => dispatch(stopPlaying()),
    clear: () => dispatch(clear()) };

};

const Control = connect(mapStateToProps_2, mapDispatchToProps_2)(Control_);



class Counter_ extends Component {
  render() {
    return(
      React.createElement("div", { className: "counter" }, "Покоління: ",
      this.props.generations));


  }}


const mapStateToProps_3 = ({ counter }) => {
  return { generations: counter };
};

const Counter = connect(mapStateToProps_3)(Counter_);



const App = () =>
React.createElement("div", null,
React.createElement("h1", null, "Гра Життя"),
React.createElement(Board, null),
React.createElement(Control, null),
React.createElement(Counter, null));



//REDUCERS

const initialGrid = makeGrid(GRID_HEIGHT, GRID_WIDTH);
const boardReducer = (state = initialGrid, action) => {
  switch (action.type) {
    case 'TOGGLE_ALIVE':
      let board = state.slice(0);
      let cell = board[action.x][action.y];
      cell.status = !cell.status;
      cell.newBorn = !cell.newBorn;
      return board;
    case 'MAKE_RANDOM':

      return makeGrid(GRID_HEIGHT, GRID_WIDTH, true);
    case 'CLEAR':
      return makeGrid(GRID_HEIGHT, GRID_WIDTH);
    case 'TICK':
      return advanceGrid(state.slice(0));
    default:
      return state;}

};

const generationCounterReducer = (state = 0, action) => {
  switch (action.type) {
    case 'TICK':
      return state + 1;
    case 'CLEAR':
      return 0;
    case 'MAKE_RANDOM':
      return 0;
    default:
      return state;}

};

const playInitialState = {
  timerId: null,
  isRunning: false };


const playStatusReducer = (state = playInitialState, action) => {
  switch (action.type) {
    case 'PLAY':
      return {
        timerId: action.timerId,
        isRunning: true };

    case 'STOP':
      return {
        timerId: null,
        isRuninng: false };

    default:
      return state;}

};


const reducers = combineReducers({
  board: boardReducer,
  playState: playStatusReducer,
  counter: generationCounterReducer });


const createStoreWithMiddleware = applyMiddleware()(createStore);

ReactDOM.render(
React.createElement(Provider, { store: createStoreWithMiddleware(reducers) },
React.createElement(App, null)),

document.querySelector('.container'));