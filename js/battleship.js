/**
 *  implementint the view object that will control the displayed messages
 * on the screen
 */


var view = {

  displayMessage: function (msg) {
    var messageArea = document.getElementById("messageArea");
    messageArea.innerHTML = msg;

  },

  displayHit: function (location) {
    var cell = document.getElementById(location);
    cell.setAttribute("class", "hit");

  },

  displayMiss: function (location) {
    var cell = document.getElementById(location);
    cell.setAttribute("class", "miss");

  }
};

// view.displayHit("00");
// view.displayMessage("testing testing");
// view.displayMiss("54");

/**
 * The model to hold and control the game state
 * 
 * 
 */

var model = {
  boardSize: 7, //size of the grid
  numShips: 3, //number of ships
  shipLength: 3, //number of location each ship occupies(3boxes vertically/horizontally)
  shipsSunk: 0,

  // ships: [
  //   {
  //     locations: ["06", "16", "26"],
  //     hits: ["", "", ""]
  //   }, //ship 1
  //   {
  //     locations: ["24", "34", "44"],
  //     hits: ["", "", ""]
  //   }, //ship2
  //   {
  //     locations: ["10", "11", "12"],
  //     hits: ["", "", ""]
  //   } //ship 3
  // ],

  ships: [
    {
      locations: [0, 0, 0],
      hits: ["", "", ""]
    }, //ship 1
    {
      locations: [0, 0, 0],
      hits: ["", "", ""]
    }, //ship2
    {
      locations: [0, 0, 0],hits: ["", "", ""]
    } //ship 3
  ],


  fire: function (guess) {
    for (let i = 0; i < this.numShips; i++) {
      var ship = this.ships[i]; //grab each ship obj from the array of objects

      var index = ship.locations.indexOf(guess); //[i].locations.indexOf(guess)

      if (index >= 0) {
        //if we get an index>=0,then users guess is in the locations array.we have a hit 
        //mark the hits array at the same index
        ship.hits[index] = "hit";
        view.displayHit(guess);
        view.displayMessage("Hit");

        //check after we have a hit if the ship is sunk,then increase number of ships sunk
        if (this.isSunk(ship)) {
          view.displayMessage("You sank my battleship!");
          this.shipsSunk++;
          // console.log(this.shipsSunk++); dont you ever do this 
        }

        return true;
      }

    }
    view.displayMiss(guess);
    view.displayMessage("Seriously,What a miss.")

    return false;

  },

    /**method takes a ship and checks every possible location for a hit
     * if there is location that doesnt have a hit,means ship is floating
     * return false.otherwise return true
     */
  isSunk: function (ship) {
  
    for (let k = 0; k < this.shipLength; k++) {
        if (ship.hits[k] !== "hit") {
          return false;
        }
    }
    return true;
  },

  generateShipLocations:function(){
    var locations;
// for each ship we generate newlocation
    for (var i = 0; i < this.numShips; i++) {

      do{

        locations=this.generateShip();

      }while(this.collisions(locations));

      this.ships[i].locations=locations;
    }
    console.log("Ships array: ");
    console.log(this.ships);
  },

  generateShip:function(){
    var direction=Math.floor(Math.random() *2);
    var row,col;

    if(direction===1){
      //generate  starting location for a horizontal ship
      //a horizontal ship can exist on any row
      row=Math.floor(Math.random() * this.boardSize);
      col=Math.floor(Math.random() *(this.boardSize-this.shipLength));

    }else{
      //generate  starting location for a vertical ship
      //a vertical ship can exist on any column
      row=Math.floor(Math.random() * (this.boardSize-this.shipLength));
      col=Math.floor(Math.random() * this.boardSize);


    }

    var newShipLocations=[];
    // loop for the number of locations in a ship
    for (var i = 0; i < this.shipLength; i++) {
      if (direction===1) {
        //add location to array for new horizontal ship
        newShipLocations.push(row + ""+ (col + i));

      } else {
        //add location to array for vertical ship
        newShipLocations.push((row + i) +""+ col);
      }

    }
      //return the filled array to the generateShipLocation method
    return newShipLocations;

  },

  /* avoiding collisions of generated ships i.e no ship overlaps another*/
  collisions:function(locations){
    //loop for every ship on the board
    for (var i = 0; i < this.numShips; i++) {
      var ship=model.ships[i];

//check to see if any location of the newly generated ship are in any existing ship
      for (var j = 0; j < locations.length; j++) {
        if (ship.locations.indexOf(locations[j]) >=0) {
          /*meaning collisons and thus the generateShipLocations
          method do while, will have to loop again to create a new ship*/ 
          return true;
        }
      }
     }
     //no collision found
     return false;
  }


};

// model.fire("06");
// model.fire("11");
// model.fire("54");


/**
 * Gets and process the players guess like "A0 or G6,etc"
 * Keeps track of the number of guesses
 * it parses("A0" to "00") and passes converted guess to the model
 * Determines when the games is over
 * 
 */
var controller = {
  guesses: 0,

  processGuess: function (guess) {
    var location = parseGuess(guess);

    if (location) {
      this.guesses++;
      var hit = model.fire(location);

      if (hit && model.shipsSunk === model.numShips) {
        view.displayMessage("You sunk all my battleships,in " + this.guesses + " guesses");
        console.log(hit, this.guesses, model.shipsSunk, model.numShips);
      }
    }

  }
};



function parseGuess(guess) {
  var alphabet = ["A", "B", "C", "D", "E", "F", "G"];

  if (guess === null || guess.length !== 2) {
    alert("Please enter a letter and a number on the board");

  } else {
    firstChar = guess.charAt(0);
    var row = alphabet.indexOf(firstChar);
    var column = guess.charAt(1);

      if (isNaN(row) || isNaN(column)) {
        alert("OOps,that isn't on the board my friend");

      } else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
        alert("Unless the board is stretching to the moon,that's totally off the board mate");

      } else {

        return row + column;
      }
  }

  return null;

}


// controller.processGuess("A0");
// controller.processGuess("A6");
// controller.processGuess("B6");
// controller.processGuess("C6");
// controller.processGuess("C4");
// controller.processGuess("D4");
// controller.processGuess("E4");
// controller.processGuess("B0");
// controller.processGuess("B1");
// controller.processGuess("B2");


// grabbing user input

function init(){
  var fireButton=document.getElementById("fireButton");
  fireButton.onclick=handleFireButton;

  /** A new handler. This one handles key
    press events from the HTML form input field*/
  var guessInput=document.getElementById("guessInput");
  guessInput.onkeypress=handleKeyPress;


  // generate shipLocation when the page is loaded
  model.generateShipLocations();
}

function handleFireButton(){
  var guessInput=document.getElementById("guessInput");
  var guess=guessInput.value;
  controller.processGuess(guess);

  //resets the form input element to be an empty string after submitting
  guessInput.value="";

}


/** the key press handler is
called whenever you press a key in
the form input in the page.*/
function handleKeyPress(e){
  var fireButton=document.getElementById("fireButton");
  if (e.keyCode===13 || e.which == 13) {
    console.log(e.keycode);
    fireButton.click();
    
    // stops page reload by preventing the form submitting itself...hahaha didnt know that
    return false;
  }
}

window.onload=init;

