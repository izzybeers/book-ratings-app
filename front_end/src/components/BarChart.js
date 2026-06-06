import React from 'react'

const BarChart = ({value, color}) => {
    const height = value*10
    console.log('entered bar chart')
    console.log(height)
    console.log(value)
    console.log(color)
  return (
    <div
    className = {`w-16 ${color}`}
    style = {{height: `${height}%`}}>
    
    </div>
  )
}

export default BarChart
