const net = require("net");
const { maze, directionToName } = require("./maze");

let players = [];

const createPlayer = (name, socket) => {
  const newPlayer = {
    name,
    socket,
    pos: [0, 0]
  };

  players.push(newPlayer);

  return newPlayer;
};

const removePlayer = player => {
  players = players.filter(p => p.name !== player.name);
};

const findPlayer = name => players.filter(p => p.name === name)[0];

const printLocation = player => {
  const [x, y] = player.pos;
  const mazeTile = maze[x][y];

  player.socket.write("You see maze walls around you\n");

  const directions = mazeTile.map(directionToName);

  player.socket.write(`You can move ${directions.join(", ")}\n`);
};

const canMove = (player, direction) => {
  const [x, y] = player.pos;
  const mazeTile = maze[x][y];

  return mazeTile.includes(direction);
};

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

const hasPlayerWon = player => {
  const [x, y] = player.pos;

  return x === 6 && y === 6;
};

const server = net.createServer(socket => {
  socket.write("Welcome to the maze! What is your name?\n");

  socket.on("data", data => {
    let player;
    const command = data.toString("utf8").trim();

    if (!socket.name) {
      socket.name = command;

      player = createPlayer(socket.name, socket);
    } else {
      player = findPlayer(socket.name);

      if (/^move/i.test(command)) {
        const matches = command.match(/^move ([nesw])$/i);
        const dir = matches[1];

        if (canMove(player, dir)) {
          socket.write(`Moving ${dir}\n`);

          move(player, dir);
        }

        if (hasPlayerWon(player)) {
          socket.write(
            "You've managed to get out of the maze!\nCongratz! 🎉🎉🎉\n"
          );
          socket.end();
          removePlayer(player);
          return;
        }
      }
    }

    printLocation(player);
  });

  socket.on("end", () => {
    const player = findPlayer(socket.name);
    removePlayer(player);
  });
});

server.listen(1234);
