import React, { type MouseEvent } from "react";
import MazeCanvas from "./MazeCanvas.tsx";
import type { Cell } from "../../logic/maze/definitions.ts";

type Props = {
  cells: Cell[][];
  showSolutionPath?: boolean;
}

const Maze: React.FC<Props> = ({ cells, showSolutionPath }) => {
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

  const findCellAtEvent = (e: MouseEvent<HTMLCanvasElement>) => {
    const location = {
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY,
    };

    return findCellAtLocation(cells, location);
  }

  let isDragging = false;
  let cellsChanged: Set<Cell> = new Set();
  let startCellWasSolution = false;

  const onMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
    if (e.button != 0) return;

    isDragging = true;
    cellsChanged.clear();
    startCellWasSolution = findCellAtEvent(e)?.isSolution ?? false;
  }

  const onMouseUp = (e: MouseEvent<HTMLCanvasElement>) => {
    isDragging = false;
    if (e.button != 0) return;

    const endCell = findCellAtEvent(e);
    if (cellsChanged.size < 2 && endCell) {
      if (cellsChanged.size == 0) {
        endCell.isSolution = !endCell.isSolution;
      } else if (startCellWasSolution) {
        endCell.isSolution = !startCellWasSolution;
      }
    }

    cellsChanged.clear();
  }

  const onMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;

    const cell = findCellAtEvent(e);
    if (!cell) return;
    cell.isSolution = !(e.ctrlKey || e.metaKey);
    cellsChanged.add(cell);
  }

  return <div className={"Maze"}>
    <MazeCanvas cells={cells}
                size={cellSize}
                wallSize={wallSize}
                showSolutionPath={showSolutionPath}
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseUp}
                onMouseMove={onMouseMove} />
  </div>;
}

export default Maze;
