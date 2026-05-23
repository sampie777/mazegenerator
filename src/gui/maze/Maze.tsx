import React from "react";
import MazeCell from "./MazeCell.tsx";
import './style.less';
import type { Cell } from "../../logic/maze/definitions.ts";

type Props = {
  cells: Cell[][];
}

const Maze: React.FC<Props> = ({ cells }) => {
  return <div className={"Maze"}>
    {cells.map(row =>
      <div className={"MazeRow"}>
        {row.map(cell =>
          <MazeCell key={cell.y * row.length + cell.x} cell={cell} />
        )}
      </div>
    )}
  </div>;
}

export default Maze;
