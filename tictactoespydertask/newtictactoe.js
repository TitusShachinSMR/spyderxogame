let board = []; //creating the array variable for dynamic board
let currentPlayer = "X"; //initialising the current player
let initialPlayer; //for knowing the current plahyer
let time = 10; // timer
let interval; // for setting time interval
let modeOfGame = 3; // dummy mode of game

const mainContainer = document.querySelector(".gamecontainer");
const playerDisplay = document.querySelector(".player");
const message = document.querySelector(".instantmessage");
const playerChooseButtons = document.querySelectorAll(".chooseplayer");
const messageBox = document.querySelector(".message");
const timeDiv = document.querySelector(".timer");
const modes = document.querySelectorAll(".mode");
const background = document.querySelector(".background");
let cells;
const container = document.querySelector("body");

//this is for creating opening and closing of the navigation bar at side
function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
  background.classList.add("show");
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  if (messageBox.classList.contains("hidden")) {
    background.classList.remove("show");
  }
}
//function for starting the mode
function startmode1() {
  document.querySelector(".three").click();
  document.querySelector(".centermode").style.display = "none";
}
function startmode2() {
  document.querySelector(".four").click();
  document.querySelector(".centermode").style.display = "none";
}
function startmode3() {
  document.querySelector(".five").click();
  document.querySelector(".centermode").style.display = "none";
}
// this function takes care of the timer, which is called during every game
//this is for creating timer image in which the seconds hand rotates one revolution over 10 sec
function stopwatch() {
  const secondHand = document.querySelector(".second");
  const computedStyle = window.getComputedStyle(secondHand);
  const matrix = new WebKitCSSMatrix(computedStyle.transform);
  const angle = Math.round(
    Math.atan2(matrix.m21, matrix.m11) * (180 / Math.PI)
  );

  secondHand.style.animation = "none";
  secondHand.style.transform = `rotate(${angle}deg)`;
}
function startwatch() {
  const secondHand = document.querySelector(".second");
  secondHand.style.animation = "rotate 10s linear";
}

// this is for creating dynamic grid , this helps to set the size of the grid button and number of grid button
//depending on the mode
function createGrid(size) {
  mainContainer.setAttribute("mode", modeOfGame);
  mainContainer.innerHTML = "";
  board = Array(size).fill(null);
  for (let i = 0; i < size; i++) {
    const cell = document.createElement("button");
    cell.classList.add("button");
    cell.style.zIndex = 1;
    cell.style.border = "2px solid black";
    cell.style.borderRadius = "10px";
    cell.style.fontSize = "50px";
    if (modeOfGame == 5) {
      cell.style.width = "80px";
      cell.style.height = "80px";
    } else if (modeOfGame == 4) {
      cell.style.width = "100px";
      cell.style.height = "100px";
    } else {
      cell.style.width = "120px";
      cell.style.height = "120px";
    }
    cell.dataset.index = i;
    mainContainer.appendChild(cell);
  }
  cells = document.querySelectorAll(".button");
}

// this function helps to provide proper frequency for grid depending on mode of game
function updateGridSize(mode) {
  if (mode === 3) {
    modeOfGame = 3;
    createGrid(9);
    mainContainer.style.gridTemplateColumns = "repeat(3, 1fr)";
  } else if (mode === 4) {
    modeOfGame = 4;
    createGrid(16);
    mainContainer.style.gridTemplateColumns = "repeat(4, 1fr)";
  } else if (mode === 5) {
    modeOfGame = 5;
    createGrid(25);
    mainContainer.style.gridTemplateColumns = "repeat(5, 1fr)";
  }
}

// getting the mode from user using the navigation bar
modes.forEach((option) => {
  option.addEventListener("click", (event) => {
    if (event.target.classList.contains("three")) {
      updateGridSize(3);
    } else if (event.target.classList.contains("four")) {
      updateGridSize(4);
    } else if (event.target.classList.contains("five")) {
      updateGridSize(5);
    }
    restartGame();
    document.getElementById("mySidenav").style.width = "0";
  });
});

// the function for creating time interval
function startTimer() {
  clearInterval(interval);
  stopwatch();
  time = 10;
  timeDiv.textContent = "10";
  interval = setInterval(() => {
    time--;
    startwatch();
    timeDiv.textContent = time;
    if (time < 0) {
      clearInterval(interval);
      stopwatch();
      message.textContent = `TIME OUT! \n PLAYER-${
        currentPlayer === "X" ? "O" : "X"
      } WON THE MATCH`;
      showMessageBox();
      setTimeout(restartGame, 3000);
    }
  }, 1000);
}
// this helps to check the winning condition of the game
function checkWin() {
  const winningPatterns =
    modeOfGame === 3
      ? [
          [0, 1, 2],
          [3, 4, 5],
          [6, 7, 8], //creating two dimensional array for checking different winning condition depending on mode
          [0, 3, 6],
          [1, 4, 7],
          [2, 5, 8],
          [0, 4, 8],
          [2, 4, 6],
        ]
      : modeOfGame === 4
      ? [
          [0, 1, 2, 3],
          [4, 5, 6, 7],
          [8, 9, 10, 11],
          [12, 13, 14, 15],
          [0, 4, 8, 12],
          [1, 5, 9, 13],
          [2, 6, 10, 14],
          [3, 7, 11, 15],
          [0, 5, 10, 15],
          [3, 6, 9, 12],
        ]
      : [
          [0, 1, 2, 3, 4],
          [5, 6, 7, 8, 9],
          [10, 11, 12, 13, 14],
          [15, 16, 17, 18, 19],
          [20, 21, 22, 23, 24],
          [0, 5, 10, 15, 20],
          [1, 6, 11, 16, 21],
          [2, 7, 12, 17, 22],
          [3, 8, 13, 18, 23],
          [4, 9, 14, 19, 24],
          [0, 6, 12, 18, 24],
          [4, 8, 12, 16, 20],
        ];

  for (const pattern of winningPatterns) {
    const values = pattern.map((index) => board[index]); // nothing but checking if values of all the index in winning
    //condition is having X or Y if it has x it means x is winner, else y is winner
    if (values.every((val) => val === "X")) {
      return "X";
    } else if (values.every((val) => val === "O")) {
      return "O";
    }
  }
  if (board.every((cell) => cell !== null)) {
    return "Draw"; //if none of the cell is empty but none of the player met the winning condition it is draw
  }
  return null;
}
//handling the clicking events, depending upon which the x and o is created when player click the board

function handleCellClick(event) {
  const cell = event.target;
  const index = parseInt(cell.dataset.index);
  if (board[index] !== null) return;
  board[index] = currentPlayer;
  cell.textContent = currentPlayer;
  if (currentPlayer == "X") {
    cell.style.color = "black";
    cell.style.backgroundImage =
      "linear-gradient(to top right, rgb(0, 255, 4), rgba(254, 254, 254, 1))";
  } else {
    cell.style.color = "black";
    cell.style.backgroundImage =
      "linear-gradient(to top left ,  rgb(255, 0, 0),rgba(0, 255, 247, 1))";
  }
  cell.disabled = true;
  const result = checkWin();
  // checking the winning condition during every game
  if (result) {
    clearInterval(interval);
    stopwatch();
    //depending upon which we can show message if the player is won , or draw
    if (result === "Draw") {
      message.textContent = "MATCH IS DRAW";
    } else {
      message.textContent = `PLAYER ${result} WON THE MATCH`;
    }
    showMessageBox();
    setTimeout(restartGame, 3000);
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    playerDisplay.textContent = `player-${currentPlayer}`;
    startTimer();
  }
}
// message for showing the messagebox
function showMessageBox() {
  background.classList.add("show");
  cells.forEach((cell) => (cell.disabled = true));
  messageBox.classList.remove("hidden");
}

function setUpEvents() {
  cells.forEach((cell) => {
    cell.addEventListener("mouseover", (event) => {
      if (!event.target.disabled) {
        event.target.textContent = currentPlayer;
        event.target.style.color = currentPlayer === "X" ? "blue" : "orange";
      }
    });
    cell.addEventListener("mouseout", (event) => {
      if (!event.target.disabled) {
        event.target.textContent = "";
        event.target.style.color = "white";
      }
    });
    cell.addEventListener("click", handleCellClick);
  });
}
// choosing the player in the starting of every game

function choosePlayer() {
  document.querySelector(".messagemode").classList.remove("hidden");
  document.querySelector(
    ".messagemode"
  ).textContent = `GAME MODE :${mainContainer.getAttribute(
    "mode"
  )} ✖️ ${mainContainer.getAttribute("mode")}`;
  background.classList.add("show");
  playerChooseButtons.forEach((button) => {
    button.classList.remove("hidden");
    button.addEventListener("click", (event) => {
      currentPlayer = event.target.textContent.split("-")[1];
      initialPlayer = currentPlayer;
      playerDisplay.textContent = `player-${currentPlayer}`;
      messageBox.classList.add("hidden");
      playerChooseButtons.forEach((btn) => btn.classList.add("hidden"));
      cells.forEach((cell) => (cell.disabled = false));
      background.classList.remove("show");
      document.querySelector(".messagemode").classList.add("hidden");
      startTimer();
      startwatch();
    });
  });
  playerDisplay.classList.remove("hidden");
  messageBox.classList.remove("hidden");
  message.textContent = "CHOOSE A PLAYER:";
}
// restarting the game if the game ends or different mode is chose on the middle of the game
function restartGame() {
  board = Array(modeOfGame * modeOfGame).fill(null);
  clearInterval(interval);
  stopwatch();
  timeDiv.textContent = "10";
  choosePlayer();
  cells.forEach((cell) => {
    cell.textContent = "";
    cell.disabled = true;
    cell.style.backgroundImage =
      "linear-gradient(to top left ,  rgb(255, 255, 255),rgb(255, 255, 255))";

    cell.classList.remove("player-X", "player-O");
  });
  setUpEvents();
}
