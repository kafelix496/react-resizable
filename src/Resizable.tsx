import React from 'react'

import ResizableCore from './ResizableCore'
import ResizableHandles from './ResizableHandles'

import type { ResizableProps } from './interfaces'

const Resizable: React.FC<ResizableProps> = (props) => {
  // console.log('Resizable', props)

  const { children, handles } = props

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

            {<ResizableHandles handles={handles} handlesRef={handlesRef} />}
          </>
        )
      })}
    </ResizableCore>
  )
}

export default Resizable
