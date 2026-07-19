import React, {useState, useMemo, useEffect} from 'react'
import Nav from '../components/Nav'
import AuthorAnalysis from '../components/AuthorAnalysis'
import TimelineAnalysis from '../components/TimelineAnalysis'
import PersonalRatingPullProfiles from '../components/PersonalRatingPullProfiles.js'
import HeadToHead from '../components/HeadToHead'
import GroupAnalysis from '../components/GroupAnalysis'
import {useSelector} from 'react-redux'
import { selectJoinedTable } from '../store/selectors';
import {genreOptions} from '../store/bookSlice.js'
import { mean, standardDeviation, median}  from 'simple-statistics'

const FriendComparisons = () => {

  const fullData = useSelector(selectJoinedTable)
  const selectedUser = useSelector((state) => state.members.selectedMemberID)
  const selectedUserData = fullData.filter((row) => row.memberid == selectedUser)
  console.log('selected user data')
  console.log(selectedUserData)


  const uniqueValues = (data, column) => {
      return([...new Set(data.map((item => item[column])))])
  }

  const numMembers = uniqueValues(fullData, 'memberid').length
  const selectedMemberName = uniqueValues(selectedUserData, 'Member')[0]
  const otherMemberNames = useMemo(() => {return uniqueValues(fullData.filter((row) => row.memberid != selectedUser), 'Member')}, [selectedUser, fullData])

  const [headToHead, setHeadToHead] = useState(otherMemberNames[0])

  console.log(numMembers)

  useEffect(() => {
    if (headToHead == selectedMemberName)
    {
      setHeadToHead(otherMemberNames[0])
    }
  }, [selectedUser, selectedMemberName, otherMemberNames, headToHead])



  const sort_table = (data, field, ascending) => {
      const sorted = [...data].sort((a,b) => {
        if (typeof a[field] === 'number' && typeof b[field] === 'number') {
          return ascending ? a[field] - b[field] : b[field] - a[field];
        }
          if (a[field] === b[field]) {
          return 0;
          }
          if(ascending == false)
          {
              return a[field] < b[field] ? 1 : -1
          } else {
              return a[field] > b[field] ? 1 : -1
          }
        })
      return(sorted)
  }

  const groupBy = (data, column, minThreshold) => {

     if (!data || data.length === 0) {
        return [];
      }
    const groups = data.reduce((boxes, row) => {
        const label = row[column]
        if(!boxes[label]) {
          boxes[label] = []
        }
        boxes[label].push(row.Rating)
        return boxes
    }, {})

    const summary_stats = Object.entries(groups).map(([columnVal, ratings]) => {
      if(ratings.length >= minThreshold) {
        const avgRating = mean(ratings)
        const sdRating = standardDeviation(ratings)
        return {
          value: columnVal,
          avgRating: avgRating,
          sdRating: sdRating,
          count: ratings.length
        }
      }
    }).filter(Boolean)
    return(sort_table(summary_stats, 'avgRating', false))
  }

   const avgByGenre = (data, minThreshold, halfForSecondary) => {
    let numBooks = 0
    let numBooksWithHalfs = 0
    let primaryBooksInGenre = null
    let secondaryBooksInGenre = null
    let booksInGenre = null
    let avgRating = 0

      return(sort_table(genreOptions.map((genre) => {

          primaryBooksInGenre = data.filter((row) => row.PrimaryGenre == genre)
          secondaryBooksInGenre = data.filter((row) =>row.SecondaryGenres?.includes(genre) && (row.SecondaryGenres != ''))
          numBooksWithHalfs = [...new Set(primaryBooksInGenre.map(book => book.bookid))].length + 0.5*[...new Set(secondaryBooksInGenre.map(book => book.bookid))].length
          numBooks = [...new Set(primaryBooksInGenre.map(book => book.bookid))].length + [...new Set(secondaryBooksInGenre.map(book => book.bookid))].length
        
          if (numBooks >= minThreshold)
          {
            const primaryTotalRating = primaryBooksInGenre?.reduce((runningTotal, row) => {
                return runningTotal += row.Rating
              }, 0)
            if (halfForSecondary)
            {
              const secondaryTotalRating = 0.5*secondaryBooksInGenre?.reduce((runningTotal, row) =>
               { return runningTotal+= row.Rating }, 0)
              avgRating = (primaryTotalRating + secondaryTotalRating)/numBooksWithHalfs
            } else {
              const secondaryTotalRating = secondaryBooksInGenre?.reduce((runningTotal, row) =>
               { return runningTotal+= row.Rating }, 0)
               avgRating = (primaryTotalRating + secondaryTotalRating)/numBooks
            } 
            
              return {
                genre: genre,
                avgRating: avgRating,
                numBooksWithHalfs: numBooksWithHalfs,
                numBooks: numBooks
              }
            }
        }).filter(Boolean), 'avgRating', false))
    }
  const [selectedAnalysisType, setSelectedAnalysisType] = useState('personal')

  const labelsClass = 'cursor-pointer p-5 w-3/4 text-center justify-center mx-auto font-bold text-xl border rounded-full border-gray-800 bg-red-100'
  return (
    fullData.length == 0 ?
      (<div className = 'items-center text-center text-lg'><p>Loading...</p></div>)
      :
    (<div>
        <Nav/>
        <div className = {`grid ${numMembers > 2 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-2'} mt-10`}>
          <label className ={`${labelsClass} ${selectedAnalysisType == 'personal' && 'border-[3px]'}`}>
            <input
              type="radio"
              name="analysis-type"
              value= 'personal'
              className = 'hidden' //hides the actual radio icon
              checked= {selectedAnalysisType == 'personal'}
              onChange={(e) => setSelectedAnalysisType(e.target.value)}
            />
             <span className = 'p-2'>Personal Analysis</span>
          </label>
          {numMembers > 2 &&
          (<label className ={`${labelsClass} ${selectedAnalysisType == 'head' && 'border-[3px]'}`}>
            <input
              type="radio"
              name="analysis-type"
              value= 'head'
              className = 'hidden' //hides the actual radio icon
              checked= {selectedAnalysisType == 'head'}
              onChange={(e) => setSelectedAnalysisType(e.target.value)}
            />
            <span className = 'p-2'>Head-To-Head</span>
          </label>)}
          <label className ={`${labelsClass} ${selectedAnalysisType == 'group' && 'border-[3px]'}`}>
              <input
              type="radio"
              name="analysis-type"
              value= 'group'
              className = 'hidden' //hides the actual radio icon
              checked= {selectedAnalysisType == 'group'}
              onChange={(e) => setSelectedAnalysisType(e.target.value)}
            />
            <span className = 'p-2'>Group Analysis </span>
          </label>
      </div>
        {selectedAnalysisType == 'personal' &&
        (
          <div>
            <AuthorAnalysis data = {selectedUserData} groupBy = {groupBy} sort_table = {sort_table} uniqueValues = {uniqueValues}/>
            <PersonalRatingPullProfiles data = {selectedUserData} avgByGenre = {avgByGenre} sort_table = {sort_table} groupBy = {groupBy}/>
            {selectedUserData.length > 0 ? (<TimelineAnalysis data = {selectedUserData} groupBy = {groupBy} sort_table = {sort_table} uniqueValues = {uniqueValues}/>) : (<p className = 'text-center font-bold'>Rate at least one book to see timeline analysis.</p>)}
          </div>
        )
        } 
        {selectedAnalysisType == 'head' &&
        (<div className = 'flex-col text-center'>
        <select className = 'mt-2 text-center font-bold border-2 border-gray-800 bg-gray-200 ' value = {headToHead} onChange = {(e) => setHeadToHead(e.target.value)}>
          {otherMemberNames.map((name) => (
            <option value = {name}>{name}</option>
          ))}
        </select>
        {headToHead != selectedMemberName && (<HeadToHead key = {headToHead} selectedUser = {selectedMemberName} headToHeadUser = {headToHead} data = {fullData} uniqueValues = {uniqueValues} groupBy = {groupBy} sort_table = {sort_table} avgByGenre = {avgByGenre}/>)}
        </div>)}
        {selectedAnalysisType == 'group' && <GroupAnalysis data = {fullData} uniqueValues = {uniqueValues} groupBy = {groupBy} sort_table = {sort_table} avgByGenre= {avgByGenre}/>} 
    </div>)
  )
}

export default FriendComparisons
