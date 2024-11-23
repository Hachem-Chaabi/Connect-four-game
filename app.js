const game = {
  reset(onchange) {
    this.columns = Array.from({ length: 7 }, () => Array(6).fill(0));
    this.moveCount = 0;
    (this.onchange = onchange)(-1);
  },
  drop(column) {
    let i = this.columns[column].indexOf(0);
    if (i < 0 || this.result() >= 0) return;
    this.columns[column][i] = (this.moveCount++ % 2) + 1;
    this.onchange(this.result());
  },
  result() {
    return (
      +this.columns
        .map(col => col.join(''))
        .join()
        .match(/([12])(\1{3}|(.{5}\1){3}|(.{6}\1){3}|((.{7}\1){3}))/)?.[1] ||
      -(this.moveCount < 42)
    );
  },
};

const container = document.querySelector('#container');

const display = result =>
  (container.innerHTML =
    '<table>' +
    game.columns[0]
      .map(
        (_, rowNo) =>
          '<tr>' +
          game.columns
            .map(
              column =>
                `<td class="${
                  ['', 'yellow', 'pink'][column[5 - rowNo]]
                }"><\/td>`
            )
            .join('') +
          '</tr>'
      )
      .join('') +
    `<\/table><out class="${
      ['nobody', 'yellow', 'pink'][result] ?? ''
    }"><\/out>`);

document.addEventListener('click', e => {
  console.log(e.target.tagName);
  e.target.tagName == 'TD'
    ? game.drop(e.target.cellIndex)
    : e.target.tagName == 'OUT'
    ? game.reset(display)
    : null;
});
game.reset(display);

const restartBtn = document.querySelector('.restart-btn');
restartBtn.addEventListener('click', () => game.reset(display));
