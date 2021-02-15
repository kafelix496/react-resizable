interface Coordinate {
  x: number
  y: number
}

interface NodeSize {
  width: number
  height: number
}

interface TargetNodeStyle {
  x: number
  y: number
  width: number
  height: number
}

type TargetNodeMatrix = number[][]

interface HandlesRef {
  current: {
    n: HTMLElement | null
    e: HTMLElement | null
    s: HTMLElement | null
    w: HTMLElement | null
    nw: HTMLElement | null
    ne: HTMLElement | null
    sw: HTMLElement | null
    se: HTMLElement | null
  }
}

interface InitialData {
  handle: string
  mouseCoordinate: Coordinate
  mouseCoordinateBeforeTransform: Coordinate
  targetNodeStyle: TargetNodeStyle
  targetNodeMatrix: TargetNodeMatrix
}

interface Ui {
  targetNode: HTMLElement | null
  startSize: NodeSize
  currentSize: NodeSize
}

interface ResizableProps {
  readonly children: JSX.Element
  readonly handles?: string
  readonly disabled?: boolean
  readonly resizingClassName?: string
  readonly resizeStart?: (event: MouseEvent, ui: Ui) => void
  readonly resizing?: (event: MouseEvent, ui: Ui) => void
  readonly resizeStop?: (event: MouseEvent, ui: Ui) => void
}

export type {
  Coordinate,
  TargetNodeStyle,
  TargetNodeMatrix,
  HandlesRef,
  InitialData,
  Ui,
  ResizableProps
}
