import React from 'react'

import ResizableCore from './ResizableCore'
import type { HandlesRef, ResizableProps } from './interfaces'

import { getTrimedHandles } from './utils'

import './Resizable.css'

const handleElements = (
  handles: string | undefined,
  handlesRef: HandlesRef
): JSX.Element[] => {
  const trimedHandles = getTrimedHandles(handles)

  return trimedHandles.map((handleName) => (
    <div
      key={handleName}
      className={`react-resizable-handle handle-${handleName}`}
      ref={(element) => {
        handlesRef.current = { ...handlesRef.current, [handleName]: element }
      }}
    />
  ))
}

const Resizable: React.FC<ResizableProps> = (props) => {
  // console.log('Resizable', props)

  const { children, disabled = false, handles } = props

  const targetRef = React.useRef(null)
  const handlesRef = React.useRef({
    n: null,
    e: null,
    s: null,
    w: null,
    nw: null,
    ne: null,
    sw: null,
    se: null
  })

  const childrenClassName = (children.props.className ?? '') as string

  return (
    <ResizableCore {...props} targetRef={targetRef} handlesRef={handlesRef}>
      {React.cloneElement(React.Children.only(children), {
        className: (childrenClassName + ' react-resizable').trim(),
        ref: targetRef,
        children: (
          <>
            {childrenClassName}

            {!disabled ? handleElements(handles, handlesRef) : ''}
          </>
        )
      })}
    </ResizableCore>
  )
}

export default Resizable
