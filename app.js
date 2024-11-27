// Initialize game state
let columns = [];
let moveCount = 0;
let onChangeCallback = null;

// Reset the game state
function resetGame(callback) {
  columns = Array(7)
    .fill()
    .map(() => Array(6).fill(0));
  moveCount = 0;
  onChangeCallback = callback;
  callback(0);
}

// Drop a piece into a column
function dropPiece(column) {
  const row = columns[column].indexOf(0);
  if (
    row === -1 ||
    getResult() !== 0 ||
    !document.querySelector('.win-card-container').classList.contains('hidden')
  )
    return;
  columns[column][row] = (moveCount % 2) + 1;
  moveCount++;
  onChangeCallback(getResult());
}

function getResult() {
  const checkWin = player => {
    const directions = [
      { x: 1, y: 0 }, // Horizontal
      { x: 0, y: 1 }, // Vertical
      { x: 1, y: 1 }, // Diagonal \
      { x: 1, y: -1 }, // Diagonal /
    ];

    for (let col = 0; col < 7; col++) {
      for (let row = 0; row < 6; row++) {
        if (columns[col][row] !== player) continue;

        for (let { x, y } of directions) {
          let count = 0;

          for (let step = 0; step < 4; step++) {
            const checkCol = col + step * x;
            const checkRow = row + step * y;

            if (
              checkCol < 0 ||
              checkCol >= 7 ||
              checkRow < 0 ||
              checkRow >= 6 ||
              columns[checkCol][checkRow] !== player
            ) {
              break;
            }

            count++;
          }

          if (count === 4) return player;
        }
      }
    }

    return 0;
  };

  const winner = checkWin(1) || checkWin(2);
  if (winner) return winner;

  return moveCount === 42 ? -1 : 0; // -1 for tie, 0 for ongoing
}

function renderGame(result) {
  const container = document.querySelector('#container');
  container.innerHTML = `
    <table>
      ${Array(6)
        .fill()
        .map(
          (_, row) => `
        <tr>
          ${Array(7)
            .fill()
            .map(
              (_, col) => `
            <td class="${['', 'yellow', 'pink'][columns[col][5 - row]]}"></td>
          `
            )
            .join('')}
        </tr>
      `
        )
        .join('')}
    </table>`;

  if (result == 1) {
    displayWinner(1);
    clearInterval(setTimer());
  }
  if (result == 2) {
    displayWinner(2);
  }

  if (result == -1) {
    displayTie();
    //
    document.querySelector('.tie-btn').addEventListener('click', () => {
      resetGame(renderGame);

      document.querySelector('.tie-card-container').classList.add('hidden');
      document.querySelector('.player-1-footer').classList.remove('hidden');
      document.querySelector('.player-2-footer').classList.add('hidden');

      setTimer();
    });
  }

  setTimer();
  displayPlayer();
}

document.querySelector('.play-again-btn').addEventListener('click', () => {
  resetGame(renderGame);

  document.querySelector('.win-card-container').classList.add('hidden');
  document.querySelector('.player-1-footer').classList.remove('hidden');
  document.querySelector('.player-2-footer').classList.add('hidden');
  const footerClassnames =
    document.querySelector('.footer-background').className;
  const toBeRemovedClass = footerClassnames.slice(
    footerClassnames.indexOf(' ') + 1
  );
  document
    .querySelector('.footer-background')
    .classList.remove(toBeRemovedClass);

  setTimer();
});

document.querySelector('#container').addEventListener('click', event => {
  if (event.target.tagName === 'TD' && event.target.className === '') {
    const cell = event.target;
    const column = Array.from(cell.parentNode.children).indexOf(cell);
    dropPiece(column);
  }
});

//
const clickRestartBtn = () => {
  const winCard = document.querySelector('.win-card-container');

  document.querySelector('.restart-btn').addEventListener('click', () => {
    if (winCard.classList.contains('hidden')) {
      resetGame(renderGame);
      document.querySelector('.player-2-footer').classList.remove('hidden');
      document.querySelector('.player-1-footer').classList.remove('hidden');
      document.querySelector('.player-2-footer').classList.add('hidden');
    }
  });
};
clickRestartBtn();

const displayTie = () => {
  const firstPlayerContainer = document.querySelector('.player-1-footer');
  const secondPlayerContainer = document.querySelector('.player-2-footer');
  const tieCard = document.querySelector('.tie-card-container');

  firstPlayerContainer.classList.remove('hidden');
  secondPlayerContainer.classList.remove('hidden');
  tieCard.classList.remove('hidden');
};

// Display the winner
const displayWinner = player => {
  const playerNum = player == 1 ? 2 : 1;

  const currentPlayerContainer = document.querySelector(
    `.player-${playerNum}-footer`
  );
  const playerWinCard = document.querySelector('.win-card-container');
  const playerWinText = document.querySelector('.player-win');
  const footerContainer = document.querySelector('.footer-background');
  const playerScore = document
    .querySelector(`.player-${playerNum}-container`)
    .querySelector('.player-score');

  currentPlayerContainer.classList.toggle('hidden');
  playerWinText.textContent = `player ${playerNum}`;
  playerWinCard.classList.toggle('hidden');
  footerContainer.classList.toggle(`player-${playerNum}-background`);
  playerScore.textContent = Number(playerScore.textContent) + 1;
};

// Chnage players turn
const displayPlayer = () => {
  const playerOne = document.querySelector('.player-1-footer');
  const playerTwo = document.querySelector('.player-2-footer');

  playerOne.classList.toggle('hidden');
  playerTwo.classList.toggle('hidden');
};

// Set timer
let counter = 1;
const setTimer = () => {
  let sec = 5;

  const playerNum = counter % 2 == 0 ? 2 : 1;

  const timerLabel = document.querySelector(`.player-${playerNum}-timer-label`);
  timerLabel.textContent = sec;

  let timer = setInterval(function () {
    timerLabel.textContent = sec + '';
    sec--;

    if (sec < -1) {
      clearInterval(timer);
      displayWinner(playerNum == 2 ? 1 : 2);
    }
  }, 1000);

  if (
    !document
      .querySelector('.win-card-container')
      .classList.contains('hidden') ||
    !document.querySelector('.tie-card-container').classList.contains('hidden')
  ) {
    clearInterval(timer);
  }

  document.querySelector('#container').addEventListener('click', event => {
    if (event.target.tagName === 'TD' && event.target.className === '')  {
      clearInterval(timer);
    }
  });
  document.querySelector('.restart-btn').addEventListener('click', () => {
    clearInterval(timer);
    setTimer();
  });

  counter++;
  return timer;
};

// Start the game
resetGame(renderGame);
