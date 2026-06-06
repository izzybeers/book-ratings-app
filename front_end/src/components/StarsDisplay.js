import React from 'react'
import { Star, StarHalf } from 'lucide-react';

const StarsDisplay = (props) => {
    const wholeStars = Math.floor(props.Rating / 2)
    const halfStars = Math.floor(props.Rating) % 2
    const emptyStars = 5 - (wholeStars + halfStars)
    return (
        <div className='flex justify-center items-center'>
            {Array(wholeStars).fill(null).map(() => (
                <Star className='inline-block' fill='gold' />
            ))}
            {Array(halfStars).fill(null).map(() => (
                <StarHalf className='inline-block' fill='gold' />
            ))}
        </div>
    )
}

export default StarsDisplay
