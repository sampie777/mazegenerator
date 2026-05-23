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
    // First fill all the walls for the perimeter and the solution path

    // The, find a random wall inside the perimeter (should be on the solution path if this is the first run

    // Then, open that wall and randomly create/walk a path over all unexplored cells until a random number hits or there's no valid path available

    // Then start over by finding a new random wall anywhere inside the perimeter

  }
}