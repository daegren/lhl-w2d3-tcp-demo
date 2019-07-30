const allWay = ["n", "e", "s", "w"];

const eWall = ["n", "s", "w"];
const wWall = ["n", "e", "s"];
const nWall = ["e", "s", "w"];
const sWall = ["n", "e", "w"];

const verticalCorridor = ["n", "s"];
const horizontalCorridor = ["e", "w"];

const swCorner = ["s", "w"];
const seCorner = ["e", "s"];
const nwCorner = ["n", "w"];
const neCorner = ["n", "e"];

const nDeadEnd = ["s"];
const eDeadEnd = ["w"];
const sDeadEnd = ["n"];
const wDeadEnd = ["e"];

const maze = [
  // row 1
  [
    seCorner,
    horizontalCorridor,
    horizontalCorridor,
    eDeadEnd,
    seCorner,
    horizontalCorridor,
    swCorner
  ],
  // row 2
  [
    verticalCorridor,
    seCorner,
    horizontalCorridor,
    eDeadEnd,
    verticalCorridor,
    nDeadEnd,
    verticalCorridor
  ],
  // row 3
  [wWall, eWall, seCorner, horizontalCorridor, sWall, nwCorner, sDeadEnd],
  // row 4
  [
    verticalCorridor,
    wWall,
    allWay,
    swCorner,
    seCorner,
    horizontalCorridor,
    swCorner
  ],
  // row 5
  [
    verticalCorridor,
    verticalCorridor,
    sDeadEnd,
    neCorner,
    nwCorner,
    seCorner,
    eWall
  ],
  // row 6
  [
    verticalCorridor,
    neCorner,
    horizontalCorridor,
    swCorner,
    nDeadEnd,
    verticalCorridor,
    verticalCorridor
  ],
  // row 7
  [
    neCorner,
    horizontalCorridor,
    eDeadEnd,
    sDeadEnd,
    neCorner,
    nwCorner,
    sDeadEnd
  ]
];

const directionToName = dir => {
  switch (dir) {
  case "n":
    return "North";
  case "e":
    return "East";
  case "s":
    return "South";
  case "w":
    return "West";
  }
};

module.exports = { maze, directionToName };
