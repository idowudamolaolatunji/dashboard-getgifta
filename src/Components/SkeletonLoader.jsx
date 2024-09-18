import React from 'react';

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

function SkeletonLoader() {
    return (
        <div className="skeleton-grid" style={{ marginTop: '6rem' }}>
            <Skeleton height={"18rem"} style={{ borderRadius: '0.5rem' }} />
            <Skeleton height={"18rem"} style={{ borderRadius: '0.5rem' }} />
            <Skeleton height={"18rem"} style={{ borderRadius: '0.5rem' }} />
            <Skeleton height={"18rem"} style={{ borderRadius: '0.5rem' }} />
            <Skeleton height={"18rem"} style={{ borderRadius: '0.5rem' }} />
            <Skeleton height={"18rem"} style={{ borderRadius: '0.5rem' }} />
            <Skeleton height={"18rem"} style={{ borderRadius: '0.5rem' }} />
            <Skeleton height={"18rem"} style={{ borderRadius: '0.5rem' }} />
        </div>
    )
}

export default SkeletonLoader
