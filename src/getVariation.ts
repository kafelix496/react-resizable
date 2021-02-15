import type { TargetNodeStyle, Coordinate } from './interfaces'

interface Size {
  width: number
  height: number
}

interface Param {
  targetNodeInitialStyle: TargetNodeStyle
  minSize: Size
  initialMouseCoordinateBeforeTransform: Coordinate
  currentMouseCoordinateBeforeTransform: Coordinate
  handle: string
  startRatio: number
}

export default ({
  targetNodeInitialStyle,
  minSize,
  initialMouseCoordinateBeforeTransform,
  currentMouseCoordinateBeforeTransform,
  handle,
  startRatio
}: Param): TargetNodeStyle => {
  const variation = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  }

  switch (handle) {
    case 'e':
      variation.width =
        currentMouseCoordinateBeforeTransform.x - initialMouseCoordinateBeforeTransform.x

      break
    case 'w':
      variation.x =
        currentMouseCoordinateBeforeTransform.x - initialMouseCoordinateBeforeTransform.x
      variation.width =
        (currentMouseCoordinateBeforeTransform.x -
          initialMouseCoordinateBeforeTransform.x) *
        -1

      break
    case 's':
      variation.height =
        currentMouseCoordinateBeforeTransform.y - initialMouseCoordinateBeforeTransform.y

      break
    case 'n':
      variation.y =
        currentMouseCoordinateBeforeTransform.y - initialMouseCoordinateBeforeTransform.y
      variation.height =
        (currentMouseCoordinateBeforeTransform.y -
          initialMouseCoordinateBeforeTransform.y) *
        -1

      break
    case 'ne':
      if (
        currentMouseCoordinateBeforeTransform.x -
          initialMouseCoordinateBeforeTransform.x <=
        (currentMouseCoordinateBeforeTransform.y -
          initialMouseCoordinateBeforeTransform.y) *
          -1
      ) {
        variation.height =
          (currentMouseCoordinateBeforeTransform.y -
            initialMouseCoordinateBeforeTransform.y) *
          -1
        variation.width = variation.height * startRatio

        variation.y = variation.height * -1
      } else {
        variation.width =
          currentMouseCoordinateBeforeTransform.x -
          initialMouseCoordinateBeforeTransform.x
        variation.height = variation.width / startRatio

        variation.y = variation.height * -1
      }

      break
    case 'nw':
      if (
        (currentMouseCoordinateBeforeTransform.x -
          initialMouseCoordinateBeforeTransform.x) *
          -1 <=
        (currentMouseCoordinateBeforeTransform.y -
          initialMouseCoordinateBeforeTransform.y) *
          -1
      ) {
        variation.height =
          (currentMouseCoordinateBeforeTransform.y -
            initialMouseCoordinateBeforeTransform.y) *
          -1
        variation.width = variation.height * startRatio

        variation.y = variation.height * -1
        variation.x = variation.width * -1
      } else {
        variation.width =
          (currentMouseCoordinateBeforeTransform.x -
            initialMouseCoordinateBeforeTransform.x) *
          -1
        variation.height = variation.width / startRatio

        variation.x = variation.width * -1
        variation.y = variation.height * -1
      }

      break
    case 'sw':
      if (
        (currentMouseCoordinateBeforeTransform.x -
          initialMouseCoordinateBeforeTransform.x) *
          -1 <=
        currentMouseCoordinateBeforeTransform.y - initialMouseCoordinateBeforeTransform.y
      ) {
        variation.height =
          currentMouseCoordinateBeforeTransform.y -
          initialMouseCoordinateBeforeTransform.y
        variation.width = variation.height * startRatio

        variation.x = variation.width * -1
      } else {
        variation.width =
          (currentMouseCoordinateBeforeTransform.x -
            initialMouseCoordinateBeforeTransform.x) *
          -1
        variation.height = variation.width / startRatio

        variation.x = variation.width * -1
      }

      break
    case 'se':
      if (
        currentMouseCoordinateBeforeTransform.x -
          initialMouseCoordinateBeforeTransform.x <=
        currentMouseCoordinateBeforeTransform.y - initialMouseCoordinateBeforeTransform.y
      ) {
        variation.height =
          currentMouseCoordinateBeforeTransform.y -
          initialMouseCoordinateBeforeTransform.y
        variation.width = variation.height * startRatio
      } else {
        variation.width =
          currentMouseCoordinateBeforeTransform.x -
          initialMouseCoordinateBeforeTransform.x
        variation.height = variation.width / startRatio
      }

      break

    default:
      break
  }

  if (targetNodeInitialStyle.width + variation.width < minSize.width) {
    variation.width = minSize.width - targetNodeInitialStyle.width

    if (variation.x !== 0) {
      variation.x = variation.width * -1
    }
  }

  if (targetNodeInitialStyle.height + variation.height < minSize.height) {
    variation.height = minSize.height - targetNodeInitialStyle.height

    if (variation.y !== 0) {
      variation.y = variation.height * -1
    }
  }

  return variation
}
