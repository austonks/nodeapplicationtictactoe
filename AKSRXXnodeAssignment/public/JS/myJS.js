const board = document.getElementById('board');
const buttons = board.getElementsByClassName('ttt');
let player = 'X';
for (let i = 0; i < buttons.length; i++) 
{
    buttons[i].addEventListener('click', function() 
    {
        if (this.innerText === '') 
        {
        this.innerText = player;
        if (player === 'X') 
        {
            player = 'O';
        } 
        else {
            player = 'X';
        }
        this.style.backgroundColor = "black";
        showResult(checkWinner(getInputs()));
        }
    });
  
}

function getInputs() 
{
    const inputs = [];
    for (let i = 0; i < buttons.length; i++) 
    {
      inputs.push(buttons[i].innerText);
    }
    return inputs;
}
function checkWinner(inputs) {
    const winningCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6] // Diagonals
    ];
  
    for (let i = 0; i < winningCombinations.length; i++) {
      const [a, b, c] = winningCombinations[i];
      if ( inputs[a] && inputs[a] === inputs[b] && inputs[b] === inputs[c]) {
        buttons[a].style.backgroundColor = "green";
        buttons[b].style.backgroundColor = "green";
        buttons[c].style.backgroundColor = "green";
        return inputs[a];
      }
    }
    return null;
  }
function showResult(winner) {
    const result = document.getElementById('result');
    if (winner !== null ) {
      setTimeout(() => {
        alert(`Player ${winner} wins!`);
        location.reload();
      }, 50);
    } 
    if ((checkTie() == true) && winner == null) {
      for (let t = 0; t < buttons.length; t++) 
      {
        buttons[t].style.backgroundColor = "red";
      }
      setTimeout(() => {
        alert('Tie game!');
        location.reload();
      }, 50);
    }
} 

function checkTie() {
    for (let i = 0; i < buttons.length; i++) 
    {
        if (buttons[i].innerText == null || buttons[i].innerText == ''){
            return false;
        }
    
    }
    return true;
}
