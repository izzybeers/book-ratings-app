import React, {useState, useEffect, useMemo} from 'react'
import {useSelector} from 'react-redux'
import { selectJoinedTable } from '../store/selectors';

const DataTable = () => {
    const [authorAscendingSort, setAuthorAscendingSort] = useState(false)
    const [titleAscendingSort, setTitleAscendingSort] = useState(false)
    const [yearAscendingSort, setYearAscendingSort] = useState(false)
    const [memberAscendingSort, setMemberAscendingSort] = useState(false)
    const [ratingAscendingSort, setRatingAscendingSort] = useState(true)
    const [startdateAscendingSort, setStartdateAscendingSort] = useState(false)
    const [finishdateAscendingSort, setFinishdateAscendingSort] = useState(false)
    const [sortedJoinedTable, setSortedJoinedTable] = useState([])
    const [filterString, setFilterString] = useState('')

    const bookData = useSelector((state) => state.books).data
    const ratingsData = useSelector((state) => state.ratings).data
    const membersData = useSelector((state) => state.members).data
    
    const joined_table = useSelector(selectJoinedTable); 
    useEffect(() => {
        setSortedJoinedTable(joined_table)
    }, [joined_table])
    
    const sort_table = (field, ascending) => {
        const sorted = [...sortedJoinedTable].sort((a,b) => {
            if (a[field] === b[field]) {
            return 0;
            }
            if(ascending == true)
            {
                return a[field] < b[field] ? 1 : -1
            } else {
                return a[field] > b[field] ? 1 : -1
            }
    })
    setSortedJoinedTable(sorted)
    }

  return (
    <div>
        <h1 className = 'text-3xl my-10 text-center'> Full Ratings Data </h1>
        <div className = 'w-3/4 mx-auto flex justify-end'>
        <input className = 'border-gray-500 border-[2px] px-1'type = 'text' placeholder = 'Search' onChange = {(e) => setFilterString(e.target.value)}></input>
        </div>
        <table className = 'border-gray-500 border-[5px] p-10 w-3/4 bg-gray-50 my-5 mx-auto'>
            <thead className = 'text-xl font-extrabold cursor-pointer'>
                <tr>
                    <th onClick = {() => {
                        setYearAscendingSort(!yearAscendingSort)
                        sort_table('Year', yearAscendingSort)
                    }}>Year Published</th>
                    <th onClick = {() => {
                        setAuthorAscendingSort(!authorAscendingSort)
                        sort_table('Author', authorAscendingSort)
                    }}>Author</th>
                    <th onClick = {() => {
                        setTitleAscendingSort(!titleAscendingSort)
                        sort_table('Book', titleAscendingSort)
                    }}>Title</th>
                    <th onClick = {() => {
                        setMemberAscendingSort(!memberAscendingSort)
                        sort_table('Member', memberAscendingSort)
                    }}>Member</th>
                    <th onClick = {() => {
                        setRatingAscendingSort(!ratingAscendingSort)
                        sort_table('Rating', ratingAscendingSort)
                    }}>Rating</th>
                    <th onClick = {() => {
                        setStartdateAscendingSort(!startdateAscendingSort)
                        sort_table('StartDate', startdateAscendingSort)
                    }}>Start Date</th>
                    <th onClick = {() => {
                        setFinishdateAscendingSort(!finishdateAscendingSort)
                        sort_table('FinishDate', finishdateAscendingSort)
                    }}>Finish Date</th>
                </tr>
            </thead>
            <tbody>
                {sortedJoinedTable.filter((row) => {
                    if(filterString === '') return row;
                    return row.Book.toLowerCase().includes(filterString.toLowerCase()) || row.Author.toLowerCase().includes(filterString.toLowerCase()) ||
                row.Member.toLowerCase().includes(filterString.toLowerCase())
                }).map((row) => {
                    return(
                        <tr className = 'text-center text-base font-semibold border-[3px]'>
                            <td>{row.Year}</td>
                            <td>{row.Author}</td>
                            <td>{row.Book}</td>
                            <td>{row.Member}</td>
                            <td>{row.Rating}</td>
                            <td>{row.StartDate}</td>
                            <td>{row.FinishDate}</td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    </div>
  )
}

export default DataTable
