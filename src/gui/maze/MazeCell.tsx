import React, { useState } from "react";
import type { Cell } from "../../logic/maze/definitions.ts";

type Props = {
  cell: Cell
}

const MazeCell: React.FC<Props> = ({cell}) => {
  const [isSolution, setIsSolution] = useState(cell.isSolution);

  const onClick = () => {
    cell.isSolution = !cell.isSolution;
    setIsSolution(cell.isSolution);
  }

  return <div className={`MazeCell ${cell.explored && 'explored'} ${isSolution && 'solution'}`}
  onClick={onClick}>
  </div>;
}

export default MazeCell;
