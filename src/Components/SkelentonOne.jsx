import React from 'react';

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css';

function SkelentonOne({ height }) {
  return (
    <div className="skeleton--flex" style={{marginTop: '2rem'}}>
        <Skeleton height={height || "6rem"} width={'100%'} />
        <Skeleton height={height || "6rem"} width={'100%'} />
        <Skeleton height={height || "6rem"} width={'100%'} />
    </div>
  )
}

export default SkelentonOne;