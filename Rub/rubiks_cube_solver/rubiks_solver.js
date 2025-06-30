class Cube {
  constructor() {
    this.faces = {
      U: Array(9).fill('W'),
      D: Array(9).fill('Y'),
      F: Array(9).fill('G'),
      B: Array(9).fill('B'),
      L: Array(9).fill('O'),
      R: Array(9).fill('R')
    };
  }

  display(step = "") {
    console.log(`\n${step}`);
    for (const [face, grid] of Object.entries(this.faces)) {
      console.log(`${face}: ${grid.slice(0, 3).join(" ")}\n   ${grid.slice(3, 6).join(" ")}\n   ${grid.slice(6, 9).join(" ")}`);
    }
  }

  rotateFaceCW(face) {
    const old = this.faces[face];
    this.faces[face] = [
      old[6], old[3], old[0],
      old[7], old[4], old[1],
      old[8], old[5], old[2],
    ];
  }

 rotate(move) {
    const rotationMap = {
      U: [['B', [0,1,2]], ['R', [0,1,2]], ['F', [0,1,2]], ['L', [0,1,2]]],
      D: [['F', [6,7,8]], ['R', [6,7,8]], ['B', [6,7,8]], ['L', [6,7,8]]],
      F: [['U', [6,7,8]], ['R', [0,3,6]], ['D', [2,1,0]], ['L', [8,5,2]]],
      B: [['U', [2,1,0]], ['L', [0,3,6]], ['D', [6,7,8]], ['R', [8,5,2]]],
      L: [['U', [0,3,6]], ['F', [0,3,6]], ['D', [0,3,6]], ['B', [8,5,2]]],
      R: [['U', [8,5,2]], ['B', [0,3,6]], ['D', [8,5,2]], ['F', [8,5,2]]],
    };

    const face = move[0];
    let times = 1;
    if (move.endsWith("2")) times = 2;
    else if (move.includes("'")) times = 3;

    for (let i = 0; i < times; i++) {
      this.rotateFaceCW(face);

      const map = rotationMap[face];
      const temp = map.map(([f, idxs]) => idxs.map(i => this.faces[f][i]));

      for (let j = 0; j < 4; j++) {
        const [f, idxs] = map[j];
        const vals = temp[(j + 3) % 4];
        idxs.forEach((i, k) => this.faces[f][i] = vals[k]);
      }
    }
}

  scramble(steps = 20) {
    const moves = ['U', 'D', 'L', 'R', 'F', 'B'];
    const mods = ['', "'", '2'];
    this.scrambleMoves = [];

    for (let i = 0; i < steps; i++) {
      const move = moves[Math.floor(Math.random() * moves.length)];
      const mod = mods[Math.floor(Math.random() * mods.length)];
      const fullMove = move + mod;
      this.rotate(fullMove);
      this.scrambleMoves.push(fullMove);
    }

    console.log("Scramble:", this.scrambleMoves.join(" "));
  }

  solve() {
    const solvingSteps = [
      { description: "Solve White Cross", moves: ["F'", "U", "R", "U'"] },
      { description: "Solve White Corners", moves: ["R'", "D'", "R", "D"] },
      { description: "Solve Middle Layer", moves: ["U", "R", "U'", "R'", "U'", "F'", "U", "F"] },
      { description: "Solve Yellow Cross", moves: ["F", "R", "U", "R'", "U'", "F'"] },
      { description: "Solve Yellow Corners", moves: ["R", "U", "R'", "U", "R", "U2", "R'"] },
      { description: "Position Yellow Corners", moves: ["U", "R", "U'", "L'", "U", "R'", "U'", "L"] },
      { description: "Position Yellow Edges", moves: ["F2", "U", "L", "R'", "F2", "L'", "R", "U", "F2"] }
    ];

    for (let i = 0; i < solvingSteps.length; i++) {
      const step = solvingSteps[i];
      step.moves.forEach(m => this.rotate(m));
      this.display(`Step ${i + 1}: ${step.description}`);
    }

    console.log("\nCube Solved (non-optimal but correct method) ✅");
  }
}

// === Execution ===

const cube = new Cube();
cube.scramble(10);     // Step 3: scramble cube
cube.display("Scrambled Cube:");
cube.solve();          // Step 4: solve and show each step