import './App.less'
import Maze from "./gui/maze/Maze";
import { useEffect, useMemo, useRef, useState } from "react";
import { Generator } from "./logic/maze/generator.ts";
import type { Alignment } from "./logic/maze/definitions.ts";
import { delayed } from "./logic/utils.ts";

const App = () => {
  const cellSize = 40;
  const wallSize = 4;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [pathLengths, setPathLengths] = useState(100);
  const [stepDuration, setStepDuration] = useState(6);
  const [showSolutionPath, setShowSolutionPath] = useState(true);
  const [width, setWidth] = useState(12);
  const [height, setHeight] = useState(8);
  const [scale, setScale] = useState(100);
  const [alignment, setAlignment] = useState<Alignment>("default");

  const stepDurationRef = useRef(stepDuration);

  const cells = useMemo(() => Generator.generateNewCells(width, height), [width, height]);

  const startGeneration = () => {
    if (isGenerating) return;
    if (width < 1 || height < 1) return;

    setIsGenerating(true);

    setTimeout(async () => {
      await Generator.generatePaths(cells, {
        pathLengths: 1 - pathLengths / 100,
        alignment: alignment
      }, stepCallback);
      setIsGenerating(false);
    }, 10);
  }

  const stepCallback = async () => {
    const cappedStepDuration = Math.max(0, stepDurationRef.current);
    if (cappedStepDuration == 0) return
    // Sleep
    await delayed(() => null, cappedStepDuration);
  }

  const resetMaze = () => {
    Generator.fullResetMaze(cells);
  }

  useEffect(() => {
    if (containerRef.current == null) return;
    const maxWidth = containerRef.current.clientWidth;
    const canvasWidth = cellSize * width + wallSize * 4;
    const desirableScale = maxWidth / canvasWidth;

    setScale(Math.min(100, Math.floor(desirableScale * 100)));
  }, [width]);

  useEffect(() => {
    stepDurationRef.current = stepDuration;
  }, [stepDuration]);

  return <>
    <section id="center">
      <div className="container f-full" ref={containerRef}>
        <h1>Maze Generator</h1>
        <p>
          This tool let's you create a maze based on a predefined solution path.<br />
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
          <div className={"options"}>
            Size:
            <input type={"number"}
                   name={"width"}
                   disabled={isGenerating}
                   min={1}
                   value={width}
                   onChange={e => setWidth(+e.target.value)} />
            x
            <input type={"number"}
                   name={"height"}
                   disabled={isGenerating}
                   min={1}
                   value={height}
                   onChange={e => setHeight(+e.target.value)} />
          </div>
          <div className={"options"}>
            <label>Scale:
              <input type="range"
                     name="scale"
                     min={1} max={150}
                     value={scale}
                     onChange={e => setScale(+e.target.value)} />
              ({scale} %)
            </label>
          </div>
        </div>

        <div className={"options"}>
          Alignment:
          <label>
            <input type={"radio"}
                   name={"alignment"}
                   value={"default"}
                   checked={alignment == "default"}
                   onChange={e => setAlignment(e.target.value as Alignment)} />
            Default
          </label>
          <label>
            <input type={"radio"}
                   name={"alignment"}
                   value={"horizontal"}
                   checked={alignment == "horizontal"}
                   onChange={e => setAlignment(e.target.value as Alignment)} />
            Horizontal
          </label>
          <label>
            <input type={"radio"}
                   name={"alignment"}
                   value={"vertical"}
                   checked={alignment == "vertical"}
                   onChange={e => setAlignment(e.target.value as Alignment)} />
            Vertical
          </label>
        </div>

        <Maze cells={cells}
              disabled={isGenerating}
              showSolutionPath={showSolutionPath}
              cellSize={cellSize * scale / 100}
              wallSize={wallSize * scale / 100}
        />

        <div className={"options"}>
          <label>Path lengths:
            <input type="range"
                   name="pathLengths"
                   disabled={isGenerating}
                   min={0} max={100}
                   value={pathLengths}
                   onChange={e => setPathLengths(+e.target.value)} />
            ({pathLengths} %)
          </label>
          <label>Animation duration:
            <input type="range"
                   name="stepDuration"
                   min={0} max={150}
                   value={stepDuration}
                   onChange={e => setStepDuration(+e.target.value)} />
            ({stepDuration} ms)
          </label>
        </div>

        <div className={"actions"}>
          <button onClick={resetMaze}
                  disabled={isGenerating}>Reset
          </button>
          <button onClick={startGeneration}
                  className={"generateButton"}
                  disabled={isGenerating || (width < 1 || height < 1)}>{isGenerating ? "Generating..." : "Generate"}</button>
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
