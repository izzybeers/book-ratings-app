import React from 'react'
import { mean, standardDeviation, median }  from 'simple-statistics'

const PersonalRatingsDisplayProfiles = (props) => {
  return (
    <div className = 'border border-[4px] border-gray-800 bg-orange-100 mx-2 mb-10 py-3 px-4'>
        <h1 className = 'text-[20px] font-bold text-center mb-5'>{props.groupTitle}</h1>
        <div className = 'grid grid-cols-3'>
            <div className = 'flex flex-col text-center'>
                <p className = 'text-2xl font-bold text-red-800 m-1'>{props.groupData.length}</p>
                <p className = 'text-center text-md font-semibold'>Books</p>
            </div>
            <div className = 'flex flex-col text-center'>
                <p className = 'text-2xl font-bold text-red-800 m-1'>{median(props.groupData.map((row)=>row.Year)).toFixed()}</p>
                <p className = 'text-center text-md font-semibold'>Median Year </p>
            </div>
            <div className = 'flex flex-col text-center'>
                <p className = 'text-2xl font-bold text-red-800 m-1'>{(100*mean(props.groupData.map((row)=>row.Age == 'Adult' ? 1 : 0))).toFixed()}%</p>
                <p className = 'text-center text-md font-semibold'>Adult</p>
            </div>
        </div>
        {props.groupData.length > 0 &&
        (<div className = {`grid grid-cols-${props.groupGenres.length} `}>
        {props.groupGenres.map((row) => {
            return (<div className = 'flex items-center text-center justify-center border border-[1px] border-gray-400 bg-gray-200 my-3 mx-1 h-[50px]'><p className = 'm-2 text-[16px] font-bold text-blue-800 p-1 m-2 text-center'>{row.genre}</p></div>)
        })}
        </div>)}
        {props.groupAuthor != null &&
        props.groupAuthor.map((row) => {
            return (<div className = 'flex flex-col text-center border border-[1px] border-gray-400 bg-gray-200 mx-[120px] mt-1 px-5 py-2'>
                <p className = 'text-lg font-bold'>{row.value}</p>
                <p className = 'text-xs'>Most Frequent Author In Group</p>
                </div>)
        })}
        {/* {favorites.length > 0 &&
        favoritesBySelector.map((row) => {
            return (<p>{row.value == 'Not part of book club' ? row.value :
                row.value == 'Mutual' ? 'Mutual Selection' : `Selected By ${row.value}`} {100*(row.count/favorites.length).toFixed(2)}%</p>)
        })} */}
        <p className = 'text-center my-3 text-lg font-bold'>Average: {Math.round(mean(props.groupData.filter((row) => row.WordCount != null).map((row) => row.WordCount))).toLocaleString()} Words</p>
    </div>
  )
}

export default PersonalRatingsDisplayProfiles