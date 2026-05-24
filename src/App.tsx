import './App.less'
import Maze from "./gui/maze/Maze";
import { useMemo, useState } from "react";
import { Generator } from "./logic/maze/generator.ts";

const App = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [pathLengths, setPathLengths] = useState((1 - 0.07) * 100);
  const [stepDuration, setStepDuration] = useState(6);
  const [showSolutionPath, setShowSolutionPath] = useState(true);
  const [width, setWidth] = useState(12);
  const [height, setHeight] = useState(8);

  const cells = useMemo(() => Generator.generateNewCells(width, height), [width, height]);

  const startGeneration = async () => {
    if (isGenerating) return;

    setIsGenerating(true);
    await Generator.generatePaths(cells, {
      pathLengths: pathLengths,
      stepDuration: stepDuration,
    });
    setIsGenerating(false);
  }

  const resetMaze = () => {
    Generator.fullResetMaze(cells);
  }

  return <>
    <section id="center">
      <div className="container f-full">
        <h1>Maze Generator</h1>
        <p>
          This tool let's you create a maze based on a predefined solution path.<br/>
          Draw this path, click Generate, and let the magic happen!
        </p>
        <div className={"instructions"}>
          <ul>
            <li>Click on a cell to mark/unmark it as part of the solution path</li>
            <li>Click and drag to mark a whole path in once</li>
            <li>Hold Ctrl or Command while dragging, to remove cells from the path</li>
          </ul>
        </div>

        <div className={"options"}>
          Size:
          <input type={"number"}
                 name={"width"}
                 min={1}
                 value={width}
                 onChange={e => setWidth(+e.target.value)} />
          x
          <input type={"number"}
                 name={"height"}
                 min={1}
                 value={height}
                 onChange={e => setHeight(+e.target.value)} />
        </div>

        <Maze cells={cells} showSolutionPath={showSolutionPath} />

        <div className={"options"}>
          <label>Path lengths:
            <input type="range" id="pathLengths"
                   name="pathLengths"
                   min={0} max={100}
                   value={pathLengths}
                   onChange={e => setPathLengths(+e.target.value)} />
            ({pathLengths} %)
          </label>
          <label>Animation duration:
            <input type="range" id="stepDuration"
                   name="stepDuration"
                   min={0} max={300}
                   value={stepDuration}
                   onChange={e => setStepDuration(+e.target.value)} />
            ({stepDuration} ms)
          </label>
        </div>

        <div className={"actions"}>
          <button onClick={resetMaze}
                  disabled={isGenerating}>Reset</button>
          <button onClick={startGeneration}
          className={"generateButton"}
                  disabled={isGenerating}>{isGenerating ? "Generating..." : "Generate"}</button>
          <label>
            <input type={"checkbox"}
                   onChange={() => setShowSolutionPath(!showSolutionPath)}
                   checked={showSolutionPath} />
            Show solution path
          </label>
        </div>
      </div>

      <footer>
        <div className="container">
          S. Jansen © 2026. All rights reserved.
        </div>
      </footer>
    </section>
  </>
};

export default App
