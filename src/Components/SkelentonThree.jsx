import React from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css';


function SkelentonThree() {
  return (
    <div className="skeleton--grid-three" style={{ marginTop: '2rem' }}>
        <Skeleton height={"18rem"} />
        <Skeleton height={"18rem"} />
        <Skeleton height={"18rem"} />
    </div>
  )
}

export default SkelentonThree
