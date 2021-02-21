import React from 'react'

import { getTrimedHandles } from './utils'

import type { HandlesRef } from './interfaces'

import './Resizable.css'

interface ResizableHandlesProps {
  handles?: string
  handlesRef?: HandlesRef
}

const ResizableHandles: React.FC<ResizableHandlesProps> = (props): JSX.Element => {
  const { handles, handlesRef } = props

  const trimedHandles = getTrimedHandles(handles)

  return (
    <>
      {trimedHandles.map((handleName) => (
        <div
          key={handleName}
          className={`react-resizable-handle handle-${handleName}`}
          ref={(element) => {
            if (handlesRef !== undefined) {
              handlesRef.current = { ...handlesRef.current, [handleName]: element }
            }
          }}
        />
      ))}
    </>
  )
}

export default ResizableHandles
