import React from 'react'

import '@testing-library/jest-dom'
import { render } from '@testing-library/react'

import ResizableHandles from '../ResizableHandles'

describe('Test ResizableHandle component', () => {
  test('should generate html by "handles" prop', () => {
    const { getByTestId } = render(
      <div data-testid="test-parent-div">
        <ResizableHandles handles="e,se,n" />
      </div>
    )

    const testParentDiv = getByTestId('test-parent-div')
    const testDivs = testParentDiv.children

    expect(
      Array.from(testDivs).map((childNode) =>
        (childNode.getAttribute('class') ?? '')
          .split(' ')
          .find((className) => /^handle/g.test(className))
      )
    ).toEqual(['handle-e', 'handle-se', 'handle-n'])
  })

  test('should ignore inappropriate prop "handles" name', () => {
    const { getByTestId } = render(
      <div data-testid="test-parent-div">
        <ResizableHandles handles="e,q,n" />
      </div>
    )

    const testParentDiv = getByTestId('test-parent-div')
    const testDivs = testParentDiv.children

    expect(
      Array.from(testDivs).map((childNode) =>
        (childNode.getAttribute('class') ?? '')
          .split(' ')
          .find((className) => /^handle/g.test(className))
      )
    ).toEqual(['handle-e', 'handle-n'])
  })

  test('should match every renered node and each handlesRef', () => {
    const handlesRef = {
      current: {
        n: null,
        e: null,
        s: null,
        w: null,
        nw: null,
        ne: null,
        sw: null,
        se: null
      }
    }

    render(
      <div>
        <ResizableHandles handles="e,n" handlesRef={handlesRef} />
      </div>
    )

    expect(handlesRef.current.n).not.toBe(null)
    expect(handlesRef.current.n).toHaveClass('handle-n')
    expect(handlesRef.current.e).not.toBe(null)
    expect(handlesRef.current.e).toHaveClass('handle-e')
    expect(handlesRef.current.s).toBe(null)
    expect(handlesRef.current.w).toBe(null)
    expect(handlesRef.current.nw).toBe(null)
    expect(handlesRef.current.ne).toBe(null)
    expect(handlesRef.current.sw).toBe(null)
    expect(handlesRef.current.se).toBe(null)
  })
})
