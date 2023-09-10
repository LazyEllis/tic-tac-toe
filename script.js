const SymbolFactory = (source, altInfo) => {
  const image = document.createElement('img');
  image.src = source;
  image.alt = altInfo;

  return { image };
};

const GameBoard = (() => {
  const xSymbol = SymbolFactory(
    'assets/img/x.svg',
    "Player X's move in Tic Tac Toe"
  );
  const oSymbol = SymbolFactory(
    'assets/img/o.svg',
    "Player O's move in Tic Tac Toe"
  );
  const restartButton = document.querySelector('.restart-btn');
  const board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ];

  const getBoardStatus = () => [...board];

  const displayBoard = () => {
    // Retrieve grid cells and organize them into rows
    const gridCells = Array.from(document.querySelectorAll('.board-cell'));
    const gridRows = [];

    while (gridCells.length) gridRows.push(gridCells.splice(0, 3));

    // Loop through the board and display X or O symbols as appropriate
    for (let row in board) {
      for (let column in board[row]) {
        if (gridRows[row][column].firstChild !== null) {
          continue;
        } else if (board[row][column] === 'X') {
          gridRows[row][column].appendChild(xSymbol.image.cloneNode());
        } else if (board[row][column] === 'O') {
          gridRows[row][column].appendChild(oSymbol.image.cloneNode());
        }
      }
    }
  };

  const clearBoard = () => {
    // Clear the internal board representation
    board.forEach((row) => row.fill(''));

    // Clear the visual representation on the webpage
    const nodeList = Array.from(document.querySelectorAll('.board-cell'));
    nodeList.forEach((node) => {
      if (node.hasChildNodes()) node.removeChild(node.firstChild);
    });

    // Reset the message board and set the turn to Player X
    const messageBoard = document.querySelector('.message-board');
    messageBoard.textContent = "Player X's Turn";
    messageBoard.dataset.turn = 'X';

    // Add event listeners to each board cell for playing moves and checking game status
    document.querySelectorAll('.board-cell').forEach((cell) => {
      cell.addEventListener('click', Game.playMove);
      cell.addEventListener('click', Game.checkGameStatus);
    });
  };

  // Add a click event listener to the restart button to clear the board
  restartButton.addEventListener('click', clearBoard);

  return { displayBoard, getBoardStatus };
})();

const Player = (name) => {
  return { name };
};

const Game = (() => {
  const playerOne = Player('Player X');
  const playerTwo = Player('Player O');
  const boardStatus = GameBoard.getBoardStatus();
  const messageBoard = document.querySelector('.message-board');

  const declareWinner = (player) => {
    messageBoard.textContent = `${player.name} Wins!`;
  };

  const declareDraw = () => {
    messageBoard.textContent = `It's a Draw!`;
  };

  const changeTurn = () => {
    messageBoard.dataset.turn = messageBoard.dataset.turn === 'X' ? 'O' : 'X';
    messageBoard.textContent =
      messageBoard.textContent === `${playerOne.name}'s Turn`
        ? `${playerTwo.name}'s Turn`
        : `${playerOne.name}'s Turn`;
  };

  const playMove = (e) => {
    const row = e.target.dataset.cell.slice(1, 2);
    const column = e.target.dataset.cell.slice(4, 5);

    if (boardStatus[row][column] !== '') return;

    boardStatus[row][column] = messageBoard.dataset.turn;
    changeTurn();
    GameBoard.displayBoard();
  };

  const checkGameStatus = (e) => {
    const row = e.target.dataset.cell.slice(1, 2);
    const column = e.target.dataset.cell.slice(4, 5);

    // Check for winning conditions or a draw
    if (
      (boardStatus[row][0] === boardStatus[row][1] &&
        boardStatus[row][1] === boardStatus[row][2]) ||
      (boardStatus[0][column] === boardStatus[1][column] &&
        boardStatus[1][column] === boardStatus[2][column]) ||
      (boardStatus[0][0] === boardStatus[1][1] &&
        boardStatus[1][1] === boardStatus[2][2] &&
        boardStatus[0][0] !== '') ||
      (boardStatus[0][2] === boardStatus[1][1] &&
        boardStatus[1][1] === boardStatus[2][0] &&
        boardStatus[0][2] !== '')
    ) {
      // Declare the winner and remove event listeners to end the game
      boardStatus[row][column] === 'X'
        ? declareWinner(playerOne)
        : declareWinner(playerTwo);

      document.querySelectorAll('.board-cell').forEach((cell) => {
        cell.removeEventListener('click', playMove);
        cell.removeEventListener('click', checkGameStatus);
      });
    } else if (
      !(
        boardStatus[0].includes('') ||
        boardStatus[1].includes('') ||
        boardStatus[2].includes('')
      )
    ) {
      // Declare a draw if no winner and no empty cells
      declareDraw();
    }
  };

  // Add click event listeners to each board cell for playing moves and checking game status
  document.querySelectorAll('.board-cell').forEach((cell) => {
    cell.addEventListener('click', playMove);
    cell.addEventListener('click', checkGameStatus);
  });

  return { playMove, checkGameStatus };
})();
