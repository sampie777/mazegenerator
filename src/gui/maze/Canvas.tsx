import React, { type DOMAttributes, useEffect, useRef } from "react";

type Props = {
  width: number;
  height: number;
  onInit?: (context: CanvasRenderingContext2D) => void;
} & DOMAttributes<HTMLCanvasElement>

const Canvas: React.FC<Props> = (props) => {
  const onInit = props.onInit;
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !onInit) return;
    const context = canvas.getContext('2d');
    onInit(context!);
  }, []);

  const domProps = {...props};
  delete domProps.onInit;

  return <canvas {...domProps}
                 className={"Canvas"}
                 width={props.width}
                 height={props.height}
                 ref={ref} />
}

export default Canvas;
