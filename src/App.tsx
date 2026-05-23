import './App.css'
import Maze from "./gui/maze/Maze";
import { useMemo, useState } from "react";
import { Generator } from "./logic/maze/generator.ts";

const App = () => {
  const [title, setTitle] = useState("Draw the solution and click 'Generate'");
  const cells = useMemo(() => Generator.generateNewCells(12, 8), []);

  const startGeneration = () => {
    setTitle("Generating...");
    Generator.generatePaths(cells);
    setTitle("Done")
  }

  return <>
    <section id="center">
      <div>
        <h1>{title}</h1>

        <Maze cells={cells} />

        <br/>
        <div>
          <button onClick={startGeneration}>Generate</button>
        </div>
      </div>
    </section>
  </>
};

export default App
