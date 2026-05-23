import './App.css'
import Maze from "./gui/maze/Maze";
import { useMemo } from "react";
import { Generator } from "./logic/maze/generator.ts";

const App = () => {
  const cells = useMemo(() => Generator.generateNewCells(12, 8), []);

  return <>
    <section id="center">
      <div>
        <h1>Get started</h1>

        <Maze cells={cells} />
      </div>
    </section>
  </>
};

export default App
