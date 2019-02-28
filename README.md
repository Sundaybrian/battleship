
# BattleShip

#### By Sunday Brian

## Description
A browser battleship game


## Installation

```
* Clone repo
* Open index.html
* Play
* Enjoy

```
## Behaviour Driven Development(BDD)

*Create a **view object** that controls the displayed messages on the screen
```javascript
    
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
```

*Create The model object that holds and controls the game state

```javascript

var model = {
    boardSize: 7,
    numShips: 3,
    shipLength: 3,
    shipsSunk: 0,
    ships: [ { locations: [0, 0, 0], hits: ["", "", ""] },
    { locations: [0, 0, 0], hits: ["", "", ""] },
    { locations: [0, 0, 0], hits: ["", "", ""] } ],
    fire: function(guess) { ... },
    isSunk: function(ship) { ... },
    generateShipLocations: function() { ... },
    generateShip: function() { ... },
    collision: function(locations) { ... }
};
```
1.The Grid is a 7by7
2.numShips is the number of ships in the board.
3.shipLength is the boxes each ship occupies either vertically or horizontally.
4.shipsSunk is the number of ships a player sink,if all are sunk game ends.
5.ships is an **array of objects** containing the 3 ships and their properties.
6.fire method checks each ship and see's if it occupies a given location.
If it does, you get a hit, and it marks the corresponding item
in the hits array (and let the view object know you got a hit) and returns true. 
If no ship occupies the guessed location, you get a miss and it updates the
view also, and return false from the method.


```javascript

    fire: function (guess) {
    for (let i = 0; i < this.numShips; i++) {
      var ship = this.ships[i]; //grab each ship obj from the array of objects

      var index = ship.locations.indexOf(guess); //check for a hit

      if (index >= 0) {
        //if we get an index>=0,then users guess is in the locations array.we have a hit 
        //mark the hits array at the same index as the location
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

```
7.isSunk
```javascript
     /**method takes a ship and checks every possible location for a hit
     * if there is location that doesnt have a hit,means ship is floating
     * return false.otherwise return true to the fire method
     */
  isSunk: function (ship) {
  
    for (let k = 0; k < this.shipLength; k++) {
        if (ship.hits[k] !== "hit") {
          return false;
        }
    }
    return true;
  },

```

8.generateShipLocations creates the locations for ships array.Also with other helper
methods it checks for overlaps of locations
```javascript
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

```
9.generateShip is the workhorse that actually creates the locations.it gets called from the generateShipLocation
```javascript
    generateShip:function(){
    var direction=Math.floor(Math.random() *2);
    var row,col;

    if(direction===1){
      //generate  starting location for a horizontal ship
      //a horizontal ship can exist on any row
      row=Math.floor(Math.random() * this.boardSize);

      //a horizontal ship on any given row has to occupy 3 column boxes left-right
      col=Math.floor(Math.random() *(this.boardSize-this.shipLength));

    }else{
      //generate  starting location for a vertical ship
      //a vertical ship can exist on any column
      row=Math.floor(Math.random() * (this.boardSize-this.shipLength));

     //a vertical ship on any given column has to occupy 3 row boxes downward*/
      col=Math.floor(Math.random() * this.boardSize);


    }

    var newShipLocations=[];
    // loop for the number of locations a ship has to occupy
    for (var i = 0; i < this.shipLength; i++) {
      if (direction===1) {
        //add location to newShipLocations array for new horizontal ship
        newShipLocations.push(row + ""+ (col + i));

      } else {
        //add location to newShipLocations array for vertical ship
        newShipLocations.push((row + i) +""+ col);
      }

    }
      //return the filled array to the generateShipLocation method locations=this.generateShip();
    return newShipLocations;

  },

```
10.collision methods checks that no generated location overlaps another
```javascript

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
```

*Create a controller object to hold usser guesses,inputs and inputs conversion
```javascript
    **
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

    //if truthy not falsey
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

```
1.The controller uses the parseGuess function to convert user form inputs into the 
required string format that will be passed to the model.fire() method.

```javascript
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
```

*Create an init() function to start the game by generating the ship location on window fully loading
as well as take form inputs and pas to the controller object
```javascript
    function init(){
    //is used when user clicks the fireButton 
  var fireButton=document.getElementById("fireButton");
  fireButton.onclick=handleFireButton;

  /** A new handler. This one handles key
    press events from the HTML form input field*/
  var guessInput=document.getElementById("guessInput");
  guessInput.onkeypress=handleKeyPress;


  // generate shipLocation when the page is loaded
  model.generateShipLocations();
}

```
1.handleFireButton
```javascript
    function handleFireButton(){
  var guessInput=document.getElementById("guessInput");
  var guess=guessInput.value;
  controller.processGuess(guess);

  //resets the form input element to be an empty string after submitting
  guessInput.value="";

}

```

2.handleKeyPress
```javascript
    /** the key press handler is
called whenever you press the enter key in
the form input on the page.*/
function handleKeyPress(e){
  var fireButton=document.getElementById("fireButton");
  if (e.keyCode===13 || e.which == 13) {
    console.log(e.keycode);
    fireButton.click();
    
    // stops page reload by preventing the form submitting itself...hahaha didnt know that
    return false;
  }
}

```
3.finally setting window.onload to the init function so nothing happens until the page is fully loaded
```javascript
    window.onload=init;
```

## License

MIT
Copyright (c) 2019
