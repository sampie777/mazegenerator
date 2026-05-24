import React, { type MouseEvent } from "react";
import MazeCanvas from "./MazeCanvas.tsx";
import type { Cell } from "../../logic/maze/definitions.ts";

type Props = {
  cells: Cell[][];
}

const Maze: React.FC<Props> = ({ cells }) => {
  const cellSize = 40;
  const wallSize = 4;

  const findCellAtLocation = (cells: Cell[][], location: { x: number; y: number }) => {
    const cellX = Math.floor((location.x - wallSize) / cellSize);
    const cellY = Math.floor((location.y - wallSize) / cellSize);

    if (cellY < 0 || cellY >= cells.length || cellX < 0 || cellX >= cells[0].length) {
      return null;
    }

    return cells[cellY][cellX];
  };

  const onClick = (e: MouseEvent<HTMLCanvasElement>) => {
    const location = {
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY,
    };

    const cell = findCellAtLocation(cells, location);
    if (!cell) return;
    cell.isSolution = !cell.isSolution;
  }

  return <div className={"Maze"}>
    <MazeCanvas cells={cells}
                size={cellSize}
                wallSize={wallSize}
                onClick={onClick} />
  </div>;
}

export default Maze;
