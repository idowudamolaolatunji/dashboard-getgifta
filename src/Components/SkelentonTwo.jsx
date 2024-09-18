import React from 'react'

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css';

function SkelentonTwo() {
    return (
        <div className="skeleton--grid-two" style={{ marginTop: '2rem' }}>
            <Skeleton height={"18rem"} />
            <Skeleton height={"18rem"} />
        </div>
    )
}

export default SkelentonTwo