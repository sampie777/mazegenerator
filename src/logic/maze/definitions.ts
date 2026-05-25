export type Cell = {
  x: number
  y: number
  walls: number[]
  explored: boolean
  isSolution: boolean
  hasUnvisitedNeighbors: boolean
  isCurrentlyProcessing: boolean
}

export type Alignment = "random" | "horizontal" | "vertical" | "square";

export type Dimension = {
  width: number
  height: number
}