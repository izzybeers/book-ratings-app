import React from 'react'
import { mean, standardDeviation, median }  from 'simple-statistics'

const AuthorAnalysis = (props) => {
    const data = props.data
    console.log('data')
    console.log(data)

    const authorMeans = props.groupBy(data, 'Author', 2)
    const greatAuthors = authorMeans.filter((row) => row.avgRating >= 8)
    const goodAuthors = authorMeans.filter((row) => row.avgRating < 8 & row.avgRating >= 6)
    const okayAuthors = authorMeans.filter((row) => row.avgRating < 6 & row.avgRating >= 4)
    const badAuthors = authorMeans.filter((row) => row.avgRating < 4)

  return (
    <div className = 'my-5 text-center'>
        <div className = 'grid grid-cols-2'>
            <h2 className = 'text-center px-5 pt-10 font-bold border-gray-600 border[2] text-3xl'>My Total Books Rated: {data.length}</h2>
            <h2 className = 'text-center px-5 pt-10 font-bold border-gray-600 border[2] text-3xl'>My Average Rating: {data.length > 0 ? mean(data.map((item) => item.Rating)).toFixed(1) : ''}/10</h2>
        </div>
        <div className = 'border border-gray-600  bg-gray-100  my-16 py-5'>
            <p className = 'font-extrabold text-2xl text-center'>My Ratings By Author</p>
            <div className = 'grid grid-cols-4 mx-2 py-5'>
                <div>
                    <p  className =  'text-3xl'> ❤️ </p>
                    {greatAuthors.length > 0 ? 
                    (<table className = 'ml-4 mt-5 border border-2 border-gray-700'>
                        <thead>
                            <tr>
                                <th className = 'h-[40px] font-extrabold text-md px-1'></th>
                                <th className = 'h-[40px] font-extrabold text-md px-1'>Average Rating</th>
                                <th className = 'h-[40px] font-extrabold text-md px-1'>Books Rated</th>
                                <th className = 'h-[40px] font-extrabold text-md px-1'>Consistency</th>
                            </tr>
                        </thead>
                        <tbody>
                            {greatAuthors.map((row) => {
                                return(
                                    <tr>
                                        <td  className = 'h-[40px] font-bold border border-gray-600 px-1'>{row.value}</td>
                                        <td  className = 'h-[40px] border border-gray-600 px-1'>{row.avgRating.toFixed(2)}</td>
                                        <td className = 'h-[40px] border border-gray-600 px-1'>{row.count}</td>
                                        <td className = 'h-[40px] border border-gray-600 px-1'> {row.sdRating <= 0.75 ? 'Very High' : row.sdRating <= 1.25 ? 'High' : row.sdRating <= 2 ? 'Medium' : 'Hit or Miss'}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>)
                    : <p className = 'mt-5 font-semibold'>You haven't rated any authors in this category yet!</p>
                    }
                </div>
                <div>
                    <p   className =  'text-3xl font-extrabold'> 👍 </p>
                    {goodAuthors.length > 0 ? 
                    (<table className = 'ml-4  mt-5 border border-2 border-gray-700'>
                        <thead>
                            <tr>
                                <th className = 'h-[40px] font-extrabold text-md px-1'></th>
                                <th className = 'h-[40px] font-extrabold text-md px-1'>Average Rating</th>
                                <th className = 'h-[40px] font-extrabold text-md px-1'>Books Rated</th>
                                <th className = 'h-[40px] font-extrabold text-md px-1'>Consistency</th>
                            </tr>
                        </thead>
                        <tbody>
                            {goodAuthors.map((row) => {
                                return(
                                    <tr>
                                        <td  className = 'h-[40px] font-bold border border-gray-600 px-1'>{row.value}</td>
                                        <td  className = 'h-[40px] border border-gray-600 px-1'>{row.avgRating.toFixed(2)}</td>
                                        <td className = 'h-[40px] border border-gray-600 px-1'>{row.count}</td>
                                        <td className = 'h-[40px] border border-gray-600 px-1'> {row.sdRating <= 0.75 ? 'Very High' : row.sdRating <= 1.25 ? 'High' : row.sdRating <= 2 ? 'Medium' : 'Hit or Miss'}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>)
                    : <p className = 'mt-5 font-semibold'>You haven't rated any authors in this category yet!</p>
                    }
                </div>
                <div>
                    <p  className =  'text-3xl font-extrabold'> 😐 </p>
                    {okayAuthors.length > 0 ?
                    (<table className = 'ml-4 mt-5 border border-2 border-gray-700'>
                        <thead>
                            <tr>
                                <th className = 'h-[40px] font-extrabold text-md px-1'></th>
                                <th className = 'h-[40px] font-extrabold text-md px-1'>Average Rating</th>
                                <th className = 'h-[40px] font-extrabold text-md px-1'>Books Rated</th>
                                <th className = 'h-[40px] font-extrabold text-md px-1'>Consistency</th>
                            </tr>
                        </thead>
                        <tbody>
                            {okayAuthors.map((row) => {
                                return(
                                    <tr>
                                        <td  className = 'h-[40px] font-bold border border-gray-600 px-1'>{row.value}</td>
                                        <td  className = 'h-[40px] border border-gray-600 px-1'>{row.avgRating.toFixed(2)}</td>
                                        <td className = 'h-[40px] border border-gray-600 px-1'>{row.count}</td>
                                        <td className = 'h-[40px] border border-gray-600 px-1'> {row.sdRating <= 0.75 ? 'Very High' : row.sdRating <= 1.25 ? 'High' : row.sdRating <= 2 ? 'Medium' : 'Hit or Miss'}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>)
                    : <p className = 'mt-5 font-semibold'>You haven't rated any authors in this category yet!</p>
                    }
                </div>
                <div>
                    <p  className =  'text-3xl font-extrabold'> 👎 </p>
                    {badAuthors.length > 0 ? 
                        (<table className = 'ml-4 mt-5 border border-2 border-gray-700'>
                            <thead className = 'h-8'>
                                <tr>
                                    <th className = 'h-[40px] font-extrabold text-md px-1'></th>
                                    <th className = 'h-[40px] font-extrabold text-md px-1'>Average Rating</th>
                                    <th className = 'h-[40px]  font-extrabold text-md px-1'>Books Rated</th>
                                    <th className = 'h-[40px] font-extrabold text-md px-1'>Consistency</th>
                                </tr>
                            </thead>
                            <tbody>
                                {badAuthors.map((row) => {
                                    return(
                                        <tr>
                                            <td className = 'h-[40px] px-1 font-bold border border-gray-600 px-1'>{row.value}</td>
                                            <td  className = 'h-[40px] px-1 border border-gray-600 px-1'>{row.avgRating.toFixed(2)}</td>
                                            <td className = 'h-[40px] px-1 border border-gray-600 px-1'>{row.count}</td>
                                            <td className = 'h-[40px] border border-gray-600 px-1'> {row.sdRating <= 0.75 ? 'Very High' : row.sdRating <= 1.25 ? 'High' : row.sdRating <= 2 ? 'Medium' : 'Hit or Miss'}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>)
                        : <p className = 'mt-5 font-semibold'>You don't have any low-rated authors yet!</p>
                        }
                </div>
            </div>
        </div>
    </div>
  )
}

export default AuthorAnalysis
