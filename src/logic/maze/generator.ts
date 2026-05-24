import type { Cell } from "./definitions.ts";
import { delayed } from "../utils.ts";

export namespace Generator {
  export type Options = {
    pathLengths: number // 0 for long paths, 1 for very short paths
    stepDuration: number  // ms each step may take. Set to 0 for no animation
  }

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
            isSolution: false,
            hasUnvisitedNeighbors: true,
            isCurrentlyProcessing: false,
          }
        )
      }
    }
    return cells;
  };

  export const generatePaths = async (
    cells: Cell[][],
    options: Options = {
      pathLengths: 0.07,
      stepDuration: 10
    }) => {
    const pathLengths = Math.max(0, Math.min(0.9, options.pathLengths));
    const stepDuration = Math.max(0, options.stepDuration);

    // Reset
    prepareMazeForGeneration(cells);

    // First clear the solution path from walls
    drawSolutionWalls(cells);

    while (cells.some(row => row.some(cell => !cell.explored))) {
      // Then, find a random wall inside the perimeter (should be on the solution path if this is the first run)
      const currentCell = getRandomStartCell(cells);
      currentCell.isCurrentlyProcessing = true;

      // Then, open that wall and randomly create/walk a path over all unexplored cells until a random number hits or there's no valid path available
      let nextCell: Cell | null = currentCell;
      while (nextCell && (pathLengths == 0 || Math.random() > pathLengths)) {
        if (stepDuration == 0) {
          nextCell = walkFromCell(cells, nextCell)
        } else {
          nextCell = await delayed(() => walkFromCell(cells, nextCell!), stepDuration);
        }
      }

      // Then start over by finding a new random wall anywhere inside the perimeter
      currentCell.isCurrentlyProcessing = false;
    }
  }

  export const fullResetMaze = (cells: Cell[][]) => {
    cells.forEach(row => row.forEach(cell => {
      cell.walls = [0, 0, 0, 0];
      cell.explored = false;
      cell.isSolution = false;
      cell.hasUnvisitedNeighbors = true;
      cell.isCurrentlyProcessing = false;
    }))
  }

  const prepareMazeForGeneration = (cells: Cell[][]) => {
    cells.forEach(row => row.forEach(cell => {
      cell.walls = [1, 1, 1, 1];
      cell.explored = cell.isSolution;
      cell.hasUnvisitedNeighbors = true;
      cell.isCurrentlyProcessing = false;
    }))
  }

  const drawSolutionWalls = (cells: Cell[][]) => {
    const solution = cells.flatMap(row => row.filter(it => it.isSolution));

    solution.forEach(cell => {
      const adjacent = getNeighbours([solution], cell);
      adjacent.forEach(it => removeWallBetweenCells(cell, it));

      // Remove walls on outside
      if (adjacent.length == 1) {
        if (cell.x == 0) cell.walls[3] = 0;
        if (cell.x == cells[0].length - 1) cell.walls[1] = 0;
        if (cell.y == 0) cell.walls[0] = 0;
        if (cell.y == cells.length - 1) cell.walls[2] = 0;
      }
    })
  }

  const getRandomStartCell = (cells: Cell[][]): Cell => {
    const explored = cells.flatMap(row => row.filter(it => it.explored && it.hasUnvisitedNeighbors));
    if (explored.length == 0) {
      // Get random cell
      return cells[getRandomIndex(cells.length)][getRandomIndex(cells[0].length)];
    }

    return explored[getRandomIndex(explored.length)];
  }

  const walkFromCell = (cells: Cell[][], cell: Cell): Cell | null => {
    // Get random unexplored neighbor cell
    const neighbors = getNeighbours(cells, cell);
    const unexplored = neighbors.filter(it => !it.explored);
    if (unexplored.length == 0) {
      cell.hasUnvisitedNeighbors = false;
      cell.explored = true;
      return null;
    }

    const nextCell = unexplored[getRandomIndex(unexplored.length)];
    nextCell.explored = true;

    // Remove wall between the cells
    removeWallBetweenCells(cell, nextCell);
    return nextCell;
  }

  const getRandomIndex = (max: number) => Math.floor(Math.random() * max)

  const getNeighbours = (cells: Cell[][], cell: Cell) =>
    cells.flatMap(row => row)
      .filter(it => it != cell)
      .filter(it => {
        const diffX = Math.abs(it.x - cell.x);
        const diffY = Math.abs(it.y - cell.y);
        if (diffX > 1 || diffY > 1) return false; // Not a neighbor
        if (diffX == diffY) return false; // Diagonal neighbor
        return true;
      });

  const removeWallBetweenCells = (a: Cell, b: Cell) => {
    const diffX = b.x - a.x;
    const diffY = b.y - a.y;
    if (diffX < 0) {
      a.walls[3] = 0;
      b.walls[1] = 0;
    } else if (diffX > 0) {
      a.walls[1] = 0;
      b.walls[3] = 0;
    } else if (diffY < 0) {
      a.walls[0] = 0;
      b.walls[2] = 0;
    } else if (diffY > 0) {
      a.walls[2] = 0;
      b.walls[0] = 0;
    }
  };
}