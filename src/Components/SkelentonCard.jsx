import React from 'react';

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css';


function SkelentonCard() {
  return (
    <div className='skeleton--card'>
        <div>
            <Skeleton height={"20rem"} width={'100%'} />
        </div>
        <div>
            <Skeleton height={"4rem"} width={'100%'} />
            <span>
                <Skeleton height={"1rem"} width={'100%'} />
                <Skeleton height={"1rem"} width={'100%'} />
                <Skeleton height={"1rem"} width={'100%'} />
                <Skeleton height={"1rem"} width={'100%'} />
                <Skeleton height={"1rem"} width={'100%'} />
            </span>
        </div>
    </div>
  )
}

export default SkelentonCard;
