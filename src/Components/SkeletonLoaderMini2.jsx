import React from 'react';

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

function SkeletonLoaderMini2() {
  return (
    <div className="skeleton-grid" style={{marginTop: '4rem'}}>
        <Skeleton height={"24rem"} />
        <Skeleton height={"24rem"} />
        <Skeleton height={"24rem"} />
        <Skeleton height={"24rem"} />
    </div>
  )
}

export default SkeletonLoaderMini2
