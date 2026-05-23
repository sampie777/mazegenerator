import type { Cell } from "./definitions.ts";

export namespace Generator {
  export const generateNewCells = (width: number, height: number) => {
    const cells: Cell[][] = [];
    for (let y = 0; y < height; y++) {
      cells.push([]);
      for (let x = 0; x < width; x++) {
        cells[y].push(
          {
            x: x,
            y: y,
            walls: [0, 0, 0, 0],
            explored: false,
            isSolution: false
          }
        )
      }
    }
    return cells;
  };

  export const generatePaths = (cells: Cell[][]) => {
    // Reset
    resetMaze(cells);

    // First fill all the walls for the perimeter and the solution path
    drawPerimeterWalls(cells);
    drawSolutionWalls(cells);

    // The, find a random wall inside the perimeter (should be on the solution path if this is the first run

    // Then, open that wall and randomly create/walk a path over all unexplored cells until a random number hits or there's no valid path available

    // Then start over by finding a new random wall anywhere inside the perimeter

  }

  const resetMaze = (cells: Cell[][]) => {
    cells.forEach(row => row.forEach(cell => {
      cell.walls = [0, 0, 0, 0];
      cell.explored = false;
    }))
  }

  const drawPerimeterWalls = (cells: Cell[][]) => {
    cells.forEach((row, y) => {
      row[0].walls[3] = 1;
      row[row.length - 1].walls[1] = 1;

      if (y == 0) {
        row.forEach(cell => cell.walls[0] = 1);
      }
      if (y == cells.length - 1) {
        row.forEach(cell => cell.walls[2] = 1);
      }
    })
  }

  const drawSolutionWalls = (cells: Cell[][]) => {
    const solution = cells.flatMap(row => row.filter(it => it.isSolution));
    solution.forEach(cell => cell.walls = [1, 1, 1, 1]);

    // const startCell = solution.find(cell => cell.x == 0 || cell.y == 0 || cell.x == cells[0].length - 1 || cell.y == cells.length - 1);
    // const endCell = solution.find(cell => cell != startCell && (cell.x == 0 || cell.y == 0 || cell.x == cells[0].length - 1 || cell.y == cells.length - 1));
    // if (startCell == null) throw Error("Could not find start cell")
    // if (endCell == null) throw Error("Could not find end cell")

    solution.forEach(cell => {
      const adjecent = solution
        .filter(it => it != cell)
        .filter(it => {
          const diffX = Math.abs(it.x - cell.x);
          const diffY = Math.abs(it.y - cell.y);
          if (diffX > 1 || diffY > 1) return false; // Not a neighbour
          if (diffX == diffY) return false; // Diagonal neighbour
          return true;
        });

      // Remove walls between the cells
      adjecent.forEach(it => {
        const diffX = it.x - cell.x;
        const diffY = it.y - cell.y;
        if (diffX < 0) {
          cell.walls[3] = 0;
          it.walls[1] = 0;
        } else if (diffX > 0) {
          cell.walls[1] = 0;
          it.walls[3] = 0;
        } else if (diffY < 0) {
          cell.walls[0] = 0;
          it.walls[2] = 0;
        } else if (diffY > 0) {
          cell.walls[2] = 0;
          it.walls[0] = 0;
        }
      })

      // Remove walls on outside
      if (adjecent.length == 1) {
        if (cell.x == 0) cell.walls[3] = 0;
        if (cell.x == cells[0].length - 1) cell.walls[1] = 0;
        if (cell.y == 0) cell.walls[0] = 0;
        if (cell.y == cells.length - 1) cell.walls[2] = 0;
      }
    })
  }
}