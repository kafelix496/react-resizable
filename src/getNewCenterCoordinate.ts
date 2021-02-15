import { coordBeforeTransform, coordAfterTransform } from '@kafelix496/matrix'

import type { Coordinate, TargetNodeStyle, TargetNodeMatrix } from './interfaces'

interface CoordRtn extends Coordinate {
  z?: number
}

interface Param {
  targetNodeInitialStyle: TargetNodeStyle
  targetNodeInitialMatrix: TargetNodeMatrix
  variation: TargetNodeStyle
}

const getTargetCoordinateX = (targetNodeStyle: TargetNodeStyle): number =>
  targetNodeStyle.x + targetNodeStyle.width * 0.5
const getTargetCoordinateY = (targetNodeStyle: TargetNodeStyle): number =>
  targetNodeStyle.y + targetNodeStyle.height * 0.5

const getCoordinateAfterVariationWithTransform = (
  targetNodeStyle: TargetNodeStyle,
  targetNodeMatrix: TargetNodeMatrix,
  variation: TargetNodeStyle
): Coordinate => {
  const centerCoord = {
    x: getTargetCoordinateX(targetNodeStyle),
    y: getTargetCoordinateY(targetNodeStyle)
  }
  const pointCoord = {
    x: centerCoord.x + getTargetCoordinateX(variation),
    y: centerCoord.y + getTargetCoordinateY(variation)
  }

  return coordAfterTransform(pointCoord, centerCoord, targetNodeMatrix)
}

const getCoordinateWithoutTransform = (
  centerCoord: Coordinate,
  matrix: TargetNodeMatrix
): CoordRtn => coordBeforeTransform(centerCoord, centerCoord, matrix)

export default ({
  targetNodeInitialStyle,
  targetNodeInitialMatrix,
  variation
}: Param): Coordinate => {
  return getCoordinateWithoutTransform(
    getCoordinateAfterVariationWithTransform(
      targetNodeInitialStyle,
      targetNodeInitialMatrix,
      variation
    ),
    targetNodeInitialMatrix
  )
}
