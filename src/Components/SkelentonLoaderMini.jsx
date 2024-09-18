import React from 'react';

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

function SkeletonLoaderMini() {
  return (
    <div className="skeleton-grid" style={{marginTop: '4rem'}}>
        <Skeleton height={"14rem"} />
        <Skeleton height={"14rem"} />
        <Skeleton height={"14rem"} />
        <Skeleton height={"14rem"} />
    </div>
  )
}

export default SkeletonLoaderMini
