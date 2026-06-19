import React from 'react'

const MemberAverageVisualBar = (props) => {

    const fillPercentage = props.row.avgRating * 10

    return (
    <div className={`border-2 rounded-xl border-gray-200 p-5`}
        style={{
        backgroundImage: `linear-gradient(to right, #fecaca ${fillPercentage}%, #f3f4f6 ${fillPercentage}%)`
        }}>
        <p className='m-2 text-2xl font-bold'>{props.namePrefix}{props.row.value}<br></br>
        <span className='text-red-500 text-3xl mx-2'>
            {props.row.avgRating.toFixed(2)}
        </span>
        Average Rating on Shared Books
        </p>
    </div>)
}


export default MemberAverageVisualBar
