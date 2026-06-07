import React from 'react'

const BarChart = ({value, color}) => {
    const height = value*10
  return (
    <div
    className = {`w-16 ${color}`}
    style = {{height: `${height}%`}}>
    </div>
  )
}

export default BarChart
