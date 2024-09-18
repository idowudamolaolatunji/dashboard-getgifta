import React from 'react'

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css';


function SkelentonFour() {
  return (
    <div className="skeleton--grid-four" style={{ marginTop: '2rem' }}>
        <Skeleton height={"24rem"} />
        <Skeleton height={"24rem"} />
        <Skeleton height={"24rem"} />
        <Skeleton height={"24rem"} />
    </div>
  )
}

export default SkelentonFour
