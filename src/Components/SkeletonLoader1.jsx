import React from 'react';

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

function SkeletonLoader() {
    return (
        <>
            <Skeleton height={"28rem"} width={"100%"} style={{ margin: '2rem 0', borderRadius: '1rem' }} />
            <div className="skeleton-grid">
                <Skeleton height={"18rem"} style={{ borderRadius: '0.5rem' }} />
                <Skeleton height={"18rem"} style={{ borderRadius: '0.5rem' }} />
                <Skeleton height={"18rem"} style={{ borderRadius: '0.5rem' }} />
                <Skeleton height={"18rem"} style={{ borderRadius: '0.5rem' }} />
                <Skeleton height={"18rem"} style={{ borderRadius: '0.5rem' }} />
                <Skeleton height={"18rem"} style={{ borderRadius: '0.5rem' }} />
                <Skeleton height={"18rem"} style={{ borderRadius: '0.5rem' }} />
                <Skeleton height={"18rem"} style={{ borderRadius: '0.5rem' }} />
            </div>
        </>
    )
}

export default SkeletonLoader
