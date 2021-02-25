import React from 'react'

import { addClass, addEvent, removeClass, removeEvent, setStyle } from '@kafelix496/dom'
import { stringToArray, coordBeforeTransform } from '@kafelix496/matrix'
import { useRefWithSetter } from '@kafelix496/react-hooks'

import getVariation from './getVariation'
import getNewCenterCoordinate from './getNewCenterCoordinate'
import type {
  Coordinate,
  HandlesRef,
  InitialData,
  ResizableProps,
  Ui
} from './interfaces'

interface ResizableCoreProps extends ResizableProps {
  handlesRef: HandlesRef
  targetRef: React.MutableRefObject<HTMLElement | null>
  targetMinWidth?: number
  targetMinHeight?: number
}

const ResizableCore: React.FC<ResizableCoreProps> = (props): JSX.Element => {
  // console.log('ResizableCore', props)

  const {
    children,
    handles,
    disabled = false,
    resizingClassName = '',
    targetRef,
    handlesRef,
    targetMinWidth = 0,
    targetMinHeight = 0,
    resizeStart,
    resizing,
    resizeStop
  } = props

  const [initialDataRef, setInitialData] = useRefWithSetter<InitialData>({
    handle: '',
    mouseCoordinate: { x: NaN, y: NaN },
    mouseCoordinateBeforeTransform: { x: NaN, y: NaN },
    targetNodeStyle: {
      x: NaN,
      y: NaN,
      width: NaN,
      height: NaN
    },
    targetNodeMatrix: [[]]
  })
  const [uiData, setUiData] = useRefWithSetter<Ui>({
    targetNode: null,
    startSize: { width: NaN, height: NaN },
    currentSize: { width: NaN, height: NaN }
  })
  const [
    currentMouseCoordinateRef,
    setCurrentMouseCoordinate
  ] = useRefWithSetter<Coordinate>({
    x: NaN,
    y: NaN
  })

  const [isMouseDown, setMouseDownStatus] = React.useState(false)

  React.useEffect(() => {
    setUiData((prev) => ({
      ...prev,
      targetNode: targetRef.current
    }))
  }, [targetRef, setUiData])

  React.useEffect(() => {
    const mouseDownHandle = (activeHandle: string) => (event: MouseEvent): void => {
      if (disabled) {
        return
      }

      const targetElement = targetRef.current

      if (targetElement === null) {
        return
      }

      setInitialData((prev) => {
        const childrenComputedStyle = window.getComputedStyle(targetElement)

        return {
          ...prev,
          handle: activeHandle,
          mouseCoordinate: {
            x: event.clientX,
            y: event.clientY
          },
          targetNodeStyle: {
            x: parseFloat(childrenComputedStyle.left),
            y: parseFloat(childrenComputedStyle.top),
            width: parseFloat(childrenComputedStyle.width),
            height: parseFloat(childrenComputedStyle.height)
          },
          targetNodeMatrix: stringToArray(childrenComputedStyle.transform)
        }
      })

      setUiData((prev) => ({
        ...prev,
        startSize: {
          width: initialDataRef.current.targetNodeStyle.width,
          height: initialDataRef.current.targetNodeStyle.height
        },
        currentSize: {
          width: initialDataRef.current.targetNodeStyle.width,
          height: initialDataRef.current.targetNodeStyle.height
        }
      }))

      if (resizingClassName.length > 0) {
        addClass(resizingClassName, targetElement)
      }

      if (typeof resizeStart === 'function') {
        resizeStart(event, uiData.current)
      }

      setMouseDownStatus(true)
    }

    const handlesElement = handlesRef.current

    if (handlesElement !== null) {
      Object.entries(handlesElement).forEach(([key, value]) => {
        if (value !== null) {
          addEvent(value, 'mousedown', mouseDownHandle(key) as EventListener)
        }
      })
    }

    return () => {
      if (handlesElement !== null) {
        Object.entries(handlesElement).forEach(([key, value]) => {
          if (value !== null) {
            removeEvent(value, 'mousedown', mouseDownHandle(key) as EventListener)
          }
        })
      }
    }
  }, [
    handles,
    disabled,
    handlesRef,
    initialDataRef,
    resizeStart,
    resizingClassName,
    setInitialData,
    setUiData,
    targetRef,
    uiData
  ])

  /**
   * if initial mouse coordinate || target node style is changed
   * calculate initial mouse coordinate before transform and update value
   *
   * the reason it's calculated in here is it can be updated by user with resizeStart function callback
   */
  React.useEffect(() => {
    const { mouseCoordinate, targetNodeStyle, targetNodeMatrix } = initialDataRef.current

    const isAnyNaNValue = [
      ...Object.values(mouseCoordinate),
      ...Object.values(targetNodeStyle)
    ].some((value) => Number.isNaN(value))

    if (!isAnyNaNValue) {
      setInitialData((prev) => ({
        ...prev,
        mouseCoordinateBeforeTransform: coordBeforeTransform(
          mouseCoordinate,
          {
            x: targetNodeStyle.x + targetNodeStyle.width * 0.5,
            y: targetNodeStyle.y + targetNodeStyle.height * 0.5
          },
          targetNodeMatrix
        )
      }))
    }
  }, [initialDataRef, setInitialData])

  React.useEffect(() => {
    const mouseMoveHandler = (event: MouseEvent): void => {
      const targetElement = targetRef.current

      if (targetElement === null) {
        return
      }

      setCurrentMouseCoordinate({ x: event.clientX, y: event.clientY })

      const { targetNodeStyle, targetNodeMatrix } = initialDataRef.current

      const variation = getVariation({
        targetNodeInitialStyle: targetNodeStyle,
        minSize: { width: targetMinWidth, height: targetMinHeight },
        initialMouseCoordinateBeforeTransform:
          initialDataRef.current.mouseCoordinateBeforeTransform,
        currentMouseCoordinateBeforeTransform: coordBeforeTransform(
          currentMouseCoordinateRef.current,
          {
            x: targetNodeStyle.x + targetNodeStyle.width * 0.5,
            y: targetNodeStyle.y + targetNodeStyle.height * 0.5
          },
          targetNodeMatrix
        ),
        handle: initialDataRef.current.handle,
        startRatio: targetNodeStyle.width / targetNodeStyle.height
      })

      const newTargetCenterCoordinate = getNewCenterCoordinate({
        targetNodeInitialStyle: targetNodeStyle,
        targetNodeInitialMatrix: targetNodeMatrix,
        variation
      })

      setStyle(
        {
          left: `${
            newTargetCenterCoordinate.x - (targetNodeStyle.width + variation.width) * 0.5
          }px`,
          top: `${
            newTargetCenterCoordinate.y -
            (targetNodeStyle.height + variation.height) * 0.5
          }px`,
          width: `${targetNodeStyle.width + variation.width}px`,
          height: `${targetNodeStyle.height + variation.height}px`
        },
        targetElement
      )

      setUiData((prev) => ({
        ...prev,
        currentSize: {
          width: parseFloat(targetElement.style.width),
          height: parseFloat(targetElement.style.height)
        }
      }))

      if (typeof resizing === 'function') {
        resizing(event, uiData.current)
      }
    }

    const mouseUpHandler = (event: MouseEvent): void => {
      const targetElement = targetRef.current

      if (targetElement !== null && resizingClassName.length > 0) {
        removeClass(resizingClassName, targetElement)
      }

      if (typeof resizeStop === 'function') {
        resizeStop(event, uiData.current)
      }

      setUiData((prev) => ({
        ...prev,
        startSize: {
          width: NaN,
          height: NaN
        },
        currentSize: {
          width: NaN,
          height: NaN
        }
      }))

      setMouseDownStatus(false)
    }

    if (isMouseDown) {
      addEvent(document, 'mousemove', mouseMoveHandler as EventListener)
      addEvent(document, 'mouseup', mouseUpHandler as EventListener)
    } else {
      removeEvent(document, 'mousemove', mouseMoveHandler as EventListener)
      removeEvent(document, 'mouseup', mouseUpHandler as EventListener)
    }

    return () => {
      removeEvent(document, 'mousemove', mouseMoveHandler as EventListener)
      removeEvent(document, 'mouseup', mouseUpHandler as EventListener)
    }
  }, [
    isMouseDown,
    currentMouseCoordinateRef,
    initialDataRef,
    resizeStop,
    resizing,
    resizingClassName,
    setCurrentMouseCoordinate,
    setUiData,
    targetMinWidth,
    targetMinHeight,
    targetRef,
    uiData
  ])

  return React.cloneElement(React.Children.only(children))
}

export default ResizableCore
