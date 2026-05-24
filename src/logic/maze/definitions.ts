export type Cell = {
  x: number
  y: number
  walls: number[]
  explored: boolean
  isSolution: boolean
  hasUnvisitedNeighbors: boolean
  isCurrentlyProcessing: boolean
}

export type Alignment = "default" | "horizontal" | "vertical";