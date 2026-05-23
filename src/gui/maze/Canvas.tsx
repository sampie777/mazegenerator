import React, { type MouseEvent, useEffect, useRef } from "react";

type Props = {
  width: number;
  height: number;
  onInit?: (context: CanvasRenderingContext2D) => void;
  onClick?: (e: MouseEvent<HTMLCanvasElement>) => void;
}

const Canvas: React.FC<Props> = ({ width, height, onInit, onClick }) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !onInit) return;
    const context = canvas.getContext('2d');
    onInit(context!);
  }, []);

  return <canvas className={"Canvas"}
                 onClick={onClick}
                 width={width}
                 height={height}
                 ref={ref} />
}

export default Canvas;
