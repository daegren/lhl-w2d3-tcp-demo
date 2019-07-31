const net = require("net");
const { maze, directionToName } = require("./maze");

let players = [];

/**
 * Creates and appends a player into memory
 * @param {String} name name of the player
 * @param {net.socket} socket The TCP socket for the player
 * @returns The object representing the player
 */
const createPlayer = (name, socket) => {
  const newPlayer = {
    name,
    socket,
    pos: [0, 0]
  };

  players.push(newPlayer);

  return newPlayer;
};

/**
 * Removes a player from memory
 * @param {Object} player The player to remove
 */
const removePlayer = player => {
  players = players.filter(p => p.name !== player.name);
};

/**
 * Find a player from our array by name
 * @param {String} name the player's name
 * @returns {Object|undefined} the player we found
 */
const findPlayer = name => players.filter(p => p.name === name)[0];

/**
 * Helper to print the current location of the player in the maze
 * @param {Object} player the player object
 */
const printLocation = player => {
  // Using array destructuring here, this just saves us from having this on multiple lines
  const [x, y] = player.pos;
  const mazeTile = maze[x][y];

  player.socket.write("You see maze walls around you\n");

  const directions = mazeTile.map(directionToName);

  player.socket.write(`You can move ${directions.join(", ")}\n`);
};

/**
 * Checks if a player is able to move in a given direction
 * @param {Object} player the player object
 * @param {String} direction the direction the player is tring to move
 * @returns {Boolean} `true` if the player can move in that direction, `false` otherwise
 */
const canMove = (player, direction) => {
  const [x, y] = player.pos;
  const mazeTile = maze[x][y];

  return mazeTile.includes(direction);
};

/**
 * Moves the player in the given direction
 * @param {Object} player the player to move
 * @param {String} direction the direction to move the player
 */
const move = (player, direction) => {
  const [x, y] = player.pos;

  switch (direction) {
  case "n":
    player.pos = [x - 1, y];
    break;
  case "e":
    player.pos = [x, y + 1];
    break;
  case "s":
    player.pos = [x + 1, y];
    break;
  case "w":
    player.pos = [x, y - 1];
    break;
  }
};

/**
 * Checks if the player has reached the exit
 * @param {Object} player the player to check
 */
const hasPlayerWon = player => {
  const [x, y] = player.pos;

  return x === 6 && y === 6;
};

// Create our TCP server
const server = net.createServer(socket => {
  // Send an initial  message to the client asking for the player's name
  socket.write("Welcome to the maze! What is your name?\n");

  // This event handler will get called whenever this client sends the server a message
  socket.on("data", data => {
    let player;
    const command = data.toString("utf8").trim();

    // If the socket doesn't have a name, then we've just asked them for it
    if (!socket.name) {
      socket.name = command;
      console.log(`Player ${command} has connected.`);
      // Create a player and add it to the memory database
      player = createPlayer(socket.name, socket);
    } else {
      // Otherwise, the player has started in the maze, figure out what the user is asking the server to do
      player = findPlayer(socket.name);

      // Using a regular expression here (don't worry if you don't get this yet)
      // Essentially we're just checking to see if the command starts with the word `move`
      if (/^move/i.test(command)) {
        // Using another regular expression to pull out the direction the player is tring to move.
        const matches = command.match(/^move ([nesw])$/i);

        if (matches) {
          const dir = matches[1];

          console.log(`Player ${player.name} is trying to move ${dir}`);

          // Check if the player can move in the given direction
          if (canMove(player, dir)) {
            socket.write(`Moving ${directionToName(dir)}\n`);

            // Move the player in the right direction
            move(player, dir);
            console.log(
              `Player ${player.name} is moving ${directionToName(dir)}`
            );
          }

          // Check if the player has gotten to the exit.
          if (hasPlayerWon(player)) {
            socket.write(
              "You've managed to get out of the maze!\nCongratz! 🎉🎉🎉\n"
            );
            console.log(`Player ${player.name} has exited the maze!`);
            // Close the socket
            socket.end();

            // Clean up our memory database
            removePlayer(player);

            // Need to exit out of the function here as we don't want to keep going.
            return;
          }
        }
      }
    }

    // Tell the player where they currently are.
    printLocation(player);
  });

  // This event handler handles when the socket gets closed (either by the client disconnecting our us closing it.)
  socket.on("end", () => {
    const player = findPlayer(socket.name);
    if (player) {
      console.log(`Player ${player.name} has left early`);
      removePlayer(player);
    }
  });
});

// Make the server start listening on the given port (1234)
server.listen(1234);
