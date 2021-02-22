import React from 'react'
import * as R from 'ramda'

import '@testing-library/jest-dom'
import { render, fireEvent } from '@testing-library/react'

import Resizable from '../Resizable'
import type { Ui } from '../interfaces'
import { getStyle } from '@kafelix496/dom'
import { coordAfterTransform, stringToArray } from '@kafelix496/matrix'

describe('Test Resizable component', () => {
  test('should pass style and className properly from child', () => {
    const { getByTestId } = render(
      <Resizable>
        <div
          data-testid="test-div"
          className="hello"
          style={{ backgroundColor: 'green' }}
        />
      </Resizable>
    )

    const testDiv = getByTestId('test-div')

    expect(testDiv).toHaveStyle({ backgroundColor: 'green' })
    expect(testDiv).toHaveClass('react-resizable hello')
  })

  test('should set the appropriate custom className when resizing', () => {
    const { getByTestId } = render(
      <Resizable resizingClassName="resizing">
        <div data-testid="test-div" />
      </Resizable>
    )

    const testDiv = getByTestId('test-div')
    const resizeHandleElement = testDiv.querySelector(
      '.react-resizable-handle'
    ) as HTMLElement

    fireEvent.mouseDown(resizeHandleElement)
    expect(testDiv).toHaveClass('react-resizable resizing')
    fireEvent.mouseUp(resizeHandleElement)
    expect(testDiv).toHaveClass('react-resizable')
    expect(testDiv).not.toHaveClass('resizing')
  })

  test("should not start resize if 'disable' prop is true", () => {
    const { getByTestId } = render(
      <Resizable resizingClassName="resizing" disabled={true}>
        <div data-testid="test-div" />
      </Resizable>
    )

    const testDiv = getByTestId('test-div')
    const resizeHandleElement = testDiv.querySelector(
      '.react-resizable-handle'
    ) as HTMLElement

    fireEvent.mouseDown(resizeHandleElement)
    expect(testDiv).toHaveClass('react-resizable')
    fireEvent.mouseUp(resizeHandleElement)
    expect(testDiv).toHaveClass('react-resizable')
    expect(testDiv).not.toHaveClass('resizing')
  })

  test("should have handles 's', 'e', 'se' as default", () => {
    const { getByTestId } = render(
      <Resizable resizingClassName="resizing">
        <div data-testid="test-div" />
      </Resizable>
    )

    const testDiv = getByTestId('test-div')
    const resizeHandlesElement = testDiv.querySelectorAll<HTMLElement>(
      '.react-resizable-handle'
    )

    expect(resizeHandlesElement.length).toBe(3)
    expect(
      Array.from(resizeHandlesElement).map((domNode) => {
        if (domNode === null) {
          return domNode
        }

        return (domNode.getAttribute('class') ?? '')
          .split(' ')
          .find((className) => /^handle/g.test(className))
      })
    ).toEqual(['handle-e', 'handle-s', 'handle-se'])
  })

  test('should have custom handles if I pass custom resizable handles', () => {
    const { getByTestId } = render(
      <Resizable resizingClassName="resizing" handles="e, sw">
        <div data-testid="test-div" />
      </Resizable>
    )

    const testDiv = getByTestId('test-div')
    const resizeHandlesElement = testDiv.querySelectorAll<HTMLElement>(
      '.react-resizable-handle'
    )

    expect(resizeHandlesElement.length).toBe(2)
    expect(
      Array.from(resizeHandlesElement).map((domNode) => {
        return (domNode.getAttribute('class') ?? '')
          .split(' ')
          .find((className) => /^handle/g.test(className))
      })
    ).toEqual(['handle-e', 'handle-sw'])
  })

  test('should filter incorrect handles name', () => {
    const { getByTestId } = render(
      <Resizable resizingClassName="resizing" handles="e, sw, ee">
        <div data-testid="test-div" />
      </Resizable>
    )

    const testDiv = getByTestId('test-div')
    const resizeHandlesElement = testDiv.querySelectorAll<HTMLElement>(
      '.react-resizable-handle'
    )

    expect(resizeHandlesElement.length).toBe(2)
    expect(
      Array.from(resizeHandlesElement).map((domNode) => {
        return (domNode.getAttribute('class') ?? '')
          .split(' ')
          .find((className) => /^handle/g.test(className))
      })
    ).toEqual(['handle-e', 'handle-sw'])
  })

  test('should trigger callback functions', () => {
    const resizeStart = jest.fn()
    const resizing = jest.fn()
    const resizeStop = jest.fn()

    const { getByTestId } = render(
      <Resizable resizeStart={resizeStart} resizing={resizing} resizeStop={resizeStop}>
        <div data-testid="test-div" />
      </Resizable>
    )

    const testDiv = getByTestId('test-div')
    const resizeHandleElement = testDiv.querySelector(
      '.react-resizable-handle'
    ) as HTMLElement

    fireEvent.mouseDown(resizeHandleElement)
    expect(resizeStart).toHaveBeenCalled()
    expect(resizing).not.toHaveBeenCalled()
    expect(resizeStop).not.toHaveBeenCalled()
    fireEvent.mouseUp(resizeHandleElement)
    expect(resizing).not.toHaveBeenCalled()
    expect(resizeStop).toHaveBeenCalled()
  })

  describe('should resize content block', () => {
    test('should callback param is the same what I expect', () => {
      let eventValue: MouseEvent | null = null
      let uiValue: Ui | null = null

      const resizeStart = jest.fn((event, ui) => {
        eventValue = event
        uiValue = ui
      })
      const resizing = jest.fn((event, ui) => {
        eventValue = event
        uiValue = ui
      })
      const resizeStop = jest.fn((event, ui) => {
        eventValue = event
        uiValue = ui
      })

      const { getByTestId } = render(
        <Resizable resizeStart={resizeStart} resizing={resizing} resizeStop={resizeStop}>
          <div
            data-testid="test-div"
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: 50,
              height: 50,
              transform: 'matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)'
            }}
          />
        </Resizable>
      )

      const testDiv = getByTestId('test-div')
      const resizeHandleElement = testDiv.querySelector(
        '.react-resizable-handle.handle-se'
      ) as HTMLElement

      fireEvent.mouseDown(resizeHandleElement, { clientX: 50, clientY: 50 })
      expect(uiValue).toEqual({
        targetNode: testDiv,
        startSize: { width: 50, height: 50 },
        currentSize: { width: 50, height: 50 }
      })
      expect(((eventValue as unknown) as MouseEvent).type).toBe(
        new MouseEvent('mousedown').type
      )
      eventValue = null
      uiValue = null

      fireEvent.mouseMove(resizeHandleElement, { clientX: 70, clientY: 25 })
      if (uiValue !== null) {
        expect((uiValue as Ui).targetNode).toBe(testDiv)
        expect((uiValue as Ui).startSize).toEqual({ width: 50, height: 50 })
        expect((uiValue as Ui).currentSize).toEqual({ width: 70, height: 70 })
      }
      expect(((eventValue as unknown) as MouseEvent).type).toBe(
        new MouseEvent('mousemove').type
      )
      eventValue = null
      uiValue = null

      fireEvent.mouseUp(resizeHandleElement, { clientX: 70, clientY: 25 })
      if (uiValue !== null) {
        expect((uiValue as Ui).targetNode).toBe(testDiv)
        expect((uiValue as Ui).startSize).toEqual({ width: 50, height: 50 })
        expect((uiValue as Ui).currentSize).toEqual({ width: 70, height: 70 })
      }
      expect(((eventValue as unknown) as MouseEvent).type).toBe(
        new MouseEvent('mouseup').type
      )
      eventValue = null
      uiValue = null
    })

    test('should fix opposite side position while resizing', () => {
      const matrix3d45Deg =
        'matrix3d(0.7071067811865476,0.7071067811865475,0,0,-0.7071067811865475,0.7071067811865476,0,0,0,0,1,0,0,0,0,1)'

      const { getByTestId } = render(
        <Resizable>
          <div
            data-testid="test-div"
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: 50,
              height: 50,
              transform: matrix3d45Deg
            }}
          />
        </Resizable>
      )

      const testDiv = getByTestId('test-div')
      const resizeHandleElement = testDiv.querySelector(
        '.react-resizable-handle.handle-se'
      ) as HTMLElement

      const getTestDivStyle = getStyle(R.__, false, testDiv)

      fireEvent.mouseDown(resizeHandleElement, { clientX: 25, clientY: 63 })
      const initialStyle = {
        left: parseFloat(getTestDivStyle('left')),
        top: parseFloat(getTestDivStyle('top')),
        width: parseFloat(getTestDivStyle('width')),
        height: parseFloat(getTestDivStyle('height'))
      }
      expect(initialStyle.left).toBe(0)
      expect(initialStyle.top).toBe(0)
      expect(initialStyle.width).toBe(50)
      expect(initialStyle.height).toBe(50)
      const initialLeftTopCoord = coordAfterTransform(
        { x: initialStyle.left, y: initialStyle.top },
        {
          x: initialStyle.left + initialStyle.width * 0.5,
          y: initialStyle.top + initialStyle.height * 0.5
        },
        stringToArray(matrix3d45Deg)
      )

      fireEvent.mouseMove(resizeHandleElement, { clientX: 25, clientY: 89 })
      const afterMoveStyle = {
        left: parseFloat(getTestDivStyle('left')),
        top: parseFloat(getTestDivStyle('top')),
        width: parseFloat(getTestDivStyle('width')),
        height: parseFloat(getTestDivStyle('height'))
      }
      expect(afterMoveStyle.left).toBeCloseTo(-9.19, 2)
      expect(afterMoveStyle.top).toBeCloseTo(3.81, 2)
      expect(afterMoveStyle.width).toBeCloseTo(68.38, 2)
      expect(afterMoveStyle.height).toBeCloseTo(68.38, 2)
      const afterMoveLeftTopCoord = coordAfterTransform(
        { x: afterMoveStyle.left, y: afterMoveStyle.top },
        {
          x: afterMoveStyle.left + afterMoveStyle.width * 0.5,
          y: afterMoveStyle.top + afterMoveStyle.height * 0.5
        },
        stringToArray(matrix3d45Deg)
      )
      expect(initialLeftTopCoord).toEqual(afterMoveLeftTopCoord)

      fireEvent.mouseUp(resizeHandleElement, { clientX: 25, clientY: 89 })
      const afterUpStyle = {
        left: parseFloat(getTestDivStyle('left')),
        top: parseFloat(getTestDivStyle('top')),
        width: parseFloat(getTestDivStyle('width')),
        height: parseFloat(getTestDivStyle('height'))
      }
      expect(afterUpStyle.left).toBeCloseTo(-9.19, 2)
      expect(afterUpStyle.top).toBeCloseTo(3.81, 2)
      expect(afterUpStyle.width).toBeCloseTo(68.38, 2)
      expect(afterUpStyle.height).toBeCloseTo(68.38, 2)
      const afterUpLeftTopCoord = coordAfterTransform(
        { x: afterUpStyle.left, y: afterUpStyle.top },
        {
          x: afterUpStyle.left + afterUpStyle.width * 0.5,
          y: afterUpStyle.top + afterUpStyle.height * 0.5
        },
        stringToArray(matrix3d45Deg)
      )
      expect(initialLeftTopCoord).toEqual(afterUpLeftTopCoord)
    })
  })
})
