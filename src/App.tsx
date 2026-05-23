import './App.css'
import Maze from "./gui/maze/Maze";
import { useMemo, useState } from "react";
import { Generator } from "./logic/maze/generator.ts";

const App = () => {
  const cells = useMemo(() => Generator.generateNewCells(12, 8), []);
  const [title, setTitle] = useState("Draw the solution and click 'Generate'");
  const [isGenerating, setIsGenerating] = useState(false);
  const [pathLengths, setPathLengths] = useState((1 - 0.07) * 100);
  const [stepDuration, setStepDuration] = useState(6);

  const startGeneration = async () => {
    if (isGenerating) return;

    setTitle("Generating...");
    setIsGenerating(true);
    await Generator.generatePaths(cells, {
      pathLengths: pathLengths,
      stepDuration: stepDuration,
    });
    setIsGenerating(false);
    setTitle("Done")
  }

  return <>
    <section id="center">
      <div>
        <h1>{title}</h1>

        <Maze cells={cells} />

        <br />
        <div>
          <div>
            <label>Path lengths:
              <input type="range" id="pathLengths"
                     name="pathLengths"
                     min={0} max={100}
                     value={pathLengths}
              onChange={e => setPathLengths(+e.target.value)}/>
              ({pathLengths} %)
            </label>
            <label>Animation duration:
              <input type="range" id="stepDuration"
                     name="stepDuration"
                     min={0} max={300}
                     value={stepDuration}
              onChange={e => setStepDuration(+e.target.value)}/>
              ({stepDuration} ms)
            </label>
          </div>
          <button onClick={startGeneration} disabled={isGenerating}>Generate</button>
        </div>
      </div>
    </section>
  </>
};

export default App
