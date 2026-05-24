import type { Alignment, Cell } from "./definitions.ts";

export namespace Generator {
  export type Options = {
    pathLengths: number // 0 for long paths, 1 for very short paths
    alignment: Alignment  // do we prefer vertical paths over horizontal paths?
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
      alignment: "default",
    },
    preCalculationCallback?: () => Promise<boolean>
  ) => {
    const pathLengths = Math.max(0, Math.min(0.9, options.pathLengths));

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
        if (await preCalculationCallback?.() === false) return;

        nextCell = walkFromCell(cells, nextCell, options.alignment)
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
    const cellsFlat = cells.flatMap(row => row);
    const exploredButNonFinishedCells = cellsFlat.filter(it => it.explored && it.hasUnvisitedNeighbors);
    if (exploredButNonFinishedCells.length == 0) {
      // Get random cell
      return cells[getRandomIndex(cells.length)][getRandomIndex(cells[0].length)];
    }

    // If only a few are left, just get a random one for speed improvement
    const nonExploredCells = cellsFlat.filter(it => !it.explored);
    if (nonExploredCells.length < Math.max(4, 0.008 * cellsFlat.length)) {
      return nonExploredCells[getRandomIndex(nonExploredCells.length)];
    }

    return exploredButNonFinishedCells[getRandomIndex(exploredButNonFinishedCells.length)];
  }

  const walkFromCell = (
    cells: Cell[][],
    cell: Cell,
    alignment: Alignment): Cell | null => {
    // Get random unexplored neighbor cell
    const neighbors = getNeighbours(cells, cell);
    const unexplored = neighbors.filter(it => !it.explored);

    if (unexplored.length < 2) {
      // If no neighbors, set true
      // If only one neighbor, we are going to visit this neighbor right now, so we can set this to true in advance
      cell.hasUnvisitedNeighbors = false;
    }

    if (unexplored.length == 0) {
      cell.explored = true;
      return null;
    }

    const nextCell = getNextCell(cell, unexplored, alignment);
    nextCell.explored = true;

    // Remove wall between the cells
    removeWallBetweenCells(cell, nextCell);
    return nextCell;
  }

  const getNextCell = (from: Cell, cells: Cell[], alignment: Alignment) => {
    if (cells.length == 0) throw Error("Expected at least 1 cell in unexplored cells")
    if (cells.length == 1) return cells[0];

    const verticalNeighbors = cells.filter(cell => cell.x == from.x)
    const horizontalNeighbors = cells.filter(cell => cell.y == from.y)

    if (alignment == "default" || verticalNeighbors.length == 0 || horizontalNeighbors.length == 0) {
      return cells[getRandomIndex(cells.length)];
    }

    const followAlignmentChance = 0.25;
    if (Math.random() > (alignment == "horizontal" ? 1 - followAlignmentChance : followAlignmentChance)) {
      return verticalNeighbors[getRandomIndex(verticalNeighbors.length)];
    }
    return horizontalNeighbors[getRandomIndex(horizontalNeighbors.length)];
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