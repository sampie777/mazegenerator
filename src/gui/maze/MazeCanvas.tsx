import React, { type DOMAttributes, useEffect, useMemo, useRef } from "react";
import './style.less';
import type { Cell } from "../../logic/maze/definitions.ts";
import Canvas from "./Canvas.tsx";

type Props = {
  cells: Cell[][];
  size: number;
  wallSize?: number;
  showSolutionPath?: boolean;
} & DOMAttributes<HTMLCanvasElement>;

const MazeCanvas: React.FC<Props> = (props) => {
  const cells = props.cells;
  const size = props.size;

  const wallSize = props.wallSize ?? 4;
  const canvasPadding = wallSize;
  const cellsRef = useRef<Cell[][]>([[]]);
  const showSolutionPath = useRef(props.showSolutionPath);

  const canvasWidth = useMemo(() => cells[0].length * size + 2 * canvasPadding, [cells]);
  const canvasHeight = useMemo(() => cells.length * size + 2 * canvasPadding, [cells]);
  const canvasWidthRef = useRef(canvasWidth);
  const canvasHeightRef = useRef(canvasHeight);

  useEffect(() => {
    // Keep our threads updated with any big value changes
    cellsRef.current = cells

    canvasWidthRef.current = canvasWidth;
    canvasHeightRef.current = canvasHeight;
  }, [cells]);

  useEffect(() => {
    showSolutionPath.current = props.showSolutionPath ?? true;
  }, [props.showSolutionPath]);

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
    context.fillRect(0, 0, canvasWidthRef.current, canvasHeightRef.current);
  }

  const paintCells = (context: CanvasRenderingContext2D) => {
    // Draw background color and passive walls
    cellsRef.current.forEach((row, y) => row.forEach((cell, x) => {
      const cellStart = {
        x: canvasPadding + x * size,
        y: canvasPadding + y * size,
      }
      context.fillStyle = cell.isSolution && showSolutionPath.current ? "#8c8"
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
    cellsRef.current.forEach((row, y) => row.forEach((cell, x) => {
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
      x: Math.floor((wallIndex + 1) / 2) % 2,
      y: Math.floor(wallIndex / 2) % 2
    }
  }

  const domProps = {...props};
  delete domProps.wallSize;
  delete domProps.showSolutionPath;
  // @ts-ignore
  delete domProps.size;
  // @ts-ignore
  delete domProps.cells;

  return <Canvas
    {...domProps}
    width={canvasWidth}
    height={canvasHeight}
    onInit={onCanvasInit}
  />
}

export default MazeCanvas;
