import React, { type MouseEvent } from "react";
import './style.less';
import type { Cell } from "../../logic/maze/definitions.ts";
import Canvas from "./Canvas.tsx";

type Props = {
  cells: Cell[][];
  size: number;
  onClick?: (e: MouseEvent<HTMLCanvasElement>) => void;
}

const MazeCanvas: React.FC<Props> = ({ cells, size, onClick }) => {
  const wallSize = 4;
  const canvasPadding = wallSize;
  const canvasWidth = cells[0].length * size + 2 * canvasPadding;
  const canvasHeight = cells.length * size + 2 * canvasPadding;

  const onCanvasInit = (context: CanvasRenderingContext2D) => {
    repaint(context);
  }

  const repaint = (context: CanvasRenderingContext2D) => {
    clearCanvas(context);
    paintCells(context);

    requestAnimationFrame(() => repaint(context));
  }

  const clearCanvas = (context: CanvasRenderingContext2D) => {
    context.fillStyle = "#fff";
    context.fillRect(0, 0, canvasWidth, canvasHeight);
  }

  const paintCells = (context: CanvasRenderingContext2D) => {
      // Draw background color and passive walls
    cells.forEach((row, y) => row.forEach((cell, x) => {
      const cellStart = {
        x: canvasPadding + x * size,
        y: canvasPadding + y * size,
      }
      context.fillStyle = cell.isSolution ? "#8c8"
        : cell.explored ? "#fff" : "#aaa";
      context.fillRect(cellStart.x, cellStart.y, size, size);

      cell.walls.forEach((_, w) => {
        const wallStart = getStartingPointForWall(w);
        const wallEnd = getStartingPointForWall(w + 1);
        context.beginPath();
        context.moveTo(cellStart.x + wallStart.x * size, cellStart.y + wallStart.y * size);
        context.lineTo(cellStart.x + wallEnd.x * size, cellStart.y + wallEnd.y * size);

        context.strokeStyle = "#fff";
        context.lineWidth = wallSize;
        context.lineCap = "round";
        context.stroke();
      })
    }))

    // Draw active walls on top
    cells.forEach((row, y) => row.forEach((cell, x) => {
      const cellStart = {
        x: canvasPadding + x * size,
        y: canvasPadding + y * size,
      }

      cell.walls.forEach((wall, w) => {
        if (!wall) return;

        const wallStart = getStartingPointForWall(w);
        const wallEnd = getStartingPointForWall(w + 1);
        context.beginPath();
        context.moveTo(cellStart.x + wallStart.x * size, cellStart.y + wallStart.y * size);
        context.lineTo(cellStart.x + wallEnd.x * size, cellStart.y + wallEnd.y * size);

        context.strokeStyle = "#000";
        context.lineWidth = wallSize;
        context.lineCap = "round";
        context.stroke();
      })
    }))

  }

  const getStartingPointForWall = (wallIndex: number) => {
    return {
      x: Math.floor((wallIndex + 1) /2) % 2,
      y: Math.floor(wallIndex /2) % 2
    }
  }

  return <Canvas width={canvasWidth}
                 height={canvasHeight}
                 onInit={onCanvasInit}
                 onClick={onClick} />
}

export default MazeCanvas;
