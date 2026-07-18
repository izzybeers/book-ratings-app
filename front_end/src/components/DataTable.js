import React, { useState } from 'react'
import Nav from '../components/Nav'
import { useSelector } from 'react-redux'
import { selectJoinedTable } from '../store/selectors';
import BookSearch from '../components/BookSearch';
import EditBookInfo from '../components/EditBookInfo';
import EditMemberInfo from '../components/EditMemberInfo';
import EditRatingInfo from '../components/EditRatingInfo';
import { combinationsReplacement } from 'simple-statistics';

const uniqueValues = (data, column) => {
  return ([...new Set(data.map((item => item[column])) )])
}

const sort_table = (data, field, ascending) => {
  const sorted = [...data].sort((a, b) => {
    if (typeof a[field] === 'number' && typeof b[field] === 'number') {
      return ascending ? a[field] - b[field] : b[field] - a[field];
    }
    if (a[field] === b[field]) {
      return 0;
    }
    if (ascending == false) {
      return a[field] < b[field] ? 1 : -1
    } else {
      return a[field] > b[field] ? 1 : -1
    }
  })
  return (sorted)
}

const updateBookInfo = () => {}

const DataTable = () => {
  const [authorAscendingSort, setAuthorAscendingSort] = useState(false)
  const [titleAscendingSort, setTitleAscendingSort] = useState(false)
  const [yearAscendingSort, setYearAscendingSort] = useState(false)
  const [memberAscendingSort, setMemberAscendingSort] = useState(false)
  const [ratingAscendingSort, setRatingAscendingSort] = useState(true)
  const [wordcountAscendingSort, setWordcountAscendingSort] = useState(false)
  const [genreAscendingSort, setGenreAscendingSort] = useState(false)
  const [sortedJoinedTable, setSortedJoinedTable] = useState([])
  const [filterString, setFilterString] = useState('')

  const bookData = useSelector((state) => state.books).data
  const ratingsData = useSelector((state) => state.ratings).data
  const membersData = useSelector((state) => state.members).data

  const joined_table = useSelector(selectJoinedTable);

  const joined_table_with_genres = joined_table.map((row) => { return { ...row, Genres: `${row.PrimaryGenre}${row.SecondaryGenres == '' ? '' : ', '}${row.SecondaryGenres?.replace(',', ', ')}` } })
  React.useEffect(() => {
    setSortedJoinedTable(joined_table_with_genres)
  }, [joined_table])

  const sort_table_local = (field, ascending) => {
    const sorted = [...sortedJoinedTable].sort((a, b) => {
      if (a[field] === b[field]) {
        return 0;
      }
      if (ascending == true) {
        return a[field] < b[field] ? 1 : -1
      } else {
        return a[field] > b[field] ? 1 : -1
      }
    })
    setSortedJoinedTable(sorted)
  }

  return (
    <div className='px-3 sm:px-4'>
      <h1 className='text-3xl my-10 text-center'> Full Ratings Data </h1>
      <div className='w-full max-w-6xl mx-auto flex justify-end'>
        <input className='border-gray-500 border-[2px] px-1' type='text' placeholder='Search' onChange={(e) => setFilterString(e.target.value)}></input>
      </div>

      <div className='overflow-x-auto'>
        <table className='min-w-full max-w-6xl mx-auto my-5 border-gray-500 border-[5px] bg-gray-50'>
          <thead className='text-md md:text-xl font-extrabold cursor-pointer'>
            <tr>
              <th onClick={() => {
                setYearAscendingSort(!yearAscendingSort)
                sort_table_local('Year', yearAscendingSort)
              }}>Year Published</th>
              <th onClick={() => {
                setAuthorAscendingSort(!authorAscendingSort)
                sort_table_local('Author', authorAscendingSort)
              }}>Author</th>
              <th onClick={() => {
                setTitleAscendingSort(!titleAscendingSort)
                sort_table_local('Book', titleAscendingSort)
              }}>Title</th>
              <th onClick={() => {
                setMemberAscendingSort(!memberAscendingSort)
                sort_table_local('Member', memberAscendingSort)
              }}>Member</th>
              <th onClick={() => {
                setRatingAscendingSort(!ratingAscendingSort)
                sort_table_local('Rating', ratingAscendingSort)
              }}>Rating</th>
              <th onClick={() => {
                setWordcountAscendingSort(!wordcountAscendingSort)
                sort_table_local('WordCount', wordcountAscendingSort)
              }}>Word Count</th>
              <th onClick={() => {
                setGenreAscendingSort(!genreAscendingSort)
                sort_table_local('Genres', genreAscendingSort)
              }}>Genres</th>
            </tr>
          </thead>
          <tbody>
            {sortedJoinedTable.filter((row) => {
              if (filterString === '') return row;
              return row.Book.toLowerCase().includes(filterString.toLowerCase()) || row.Author.toLowerCase().includes(filterString.toLowerCase()) ||
                row.Member.toLowerCase().includes(filterString.toLowerCase())
            }).map((row, idx) => {
              return (
                <tr key={idx} className='text-center text-sm md:text-base font-semibold border-[3px]'>
                  <td>{row.Year}</td>
                  <td>{row.Author}</td>
                  <td>{row.Book}</td>
                  <td>{row.Member}</td>
                  <td>{row.Rating}</td>
                  <td>{row.WordCount?.toLocaleString()}</td>
                  <td>{row.Genres}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DataTable
