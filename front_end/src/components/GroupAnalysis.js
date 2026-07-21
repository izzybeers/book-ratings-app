import React, { useState } from 'react'
import ShowSharedBooksCount from './ShowSharedBooksCount'
import MemberAverageVisualBar from './MemberAverageVisualBar'

const GroupAnalysis = (props) => {

  const [viewChoice, setViewChoice] = useState('Books Rated By More Than One Member')

  const uniqueMembers = props.uniqueValues(props.data, 'memberid')
  const numMembers = uniqueMembers.length

  const booksRatedByAllMembers = props.groupBy(props.data, 'bookid', numMembers).map((row) => row.value)
  const allMembersRatings = props.data.filter((row) => booksRatedByAllMembers.includes(String(row.bookid)))

  const booksRatedByMoreThanOneMember = props.groupBy(props.data, 'bookid', 2).map((row) => row.value)
  const moreThanOneMemberRatings = props.data.filter((row) => booksRatedByMoreThanOneMember.includes(String(row.bookid)))

  const ratingsTable = viewChoice == 'Books Rated By Every Member' ? allMembersRatings : viewChoice == 'Books Rated By More Than One Member' ? moreThanOneMemberRatings : props.data

  console.log('Ratings Table')
  console.log(ratingsTable)
  const avg_by_member = props.groupBy(ratingsTable, 'Member', 2)
  const topRatedMember = props.sort_table(avg_by_member, 'avgRating', false)[0]
  const bottomRatedMember = props.sort_table(avg_by_member, 'avgRating', true)[0]


  const avg_by_book = props.groupBy(ratingsTable, 'bookid', 2)
  const topRatedBook = props.sort_table(props.sort_table(avg_by_book, 'count', false), 'avgRating', false)[0]
  const membersRatedTopRatedBook = props.uniqueValues(ratingsTable.filter((row) => row.bookid == topRatedBook.value), 'Member')
  const bottomRatedBook = props.sort_table(props.sort_table(avg_by_book, 'count', false), 'avgRating', true)[0]
  const membersRatedBottomRatedBook = props.uniqueValues(ratingsTable.filter((row) => row.bookid == bottomRatedBook.value), 'Member')
  const topConsistencyBook = props.sort_table(props.sort_table(avg_by_book, 'count', false), 'sdRating', true)[0]
  const membersRatedTopConsistencyBook = props.uniqueValues(ratingsTable.filter((row) => row.bookid == topConsistencyBook.value), 'Member')
  console.log(props.sort_table(props.sort_table(avg_by_book, 'count', false), 'avgRating', false))
  const leastConsistentBook = props.sort_table(props.sort_table(avg_by_book, 'count', false), 'sdRating', false)[0]
  const membersRatedLeastConsistentBook = props.uniqueValues(ratingsTable.filter((row) => row.bookid == leastConsistentBook.value), 'Member')

  const longestBook = props.sort_table(ratingsTable.filter((row) => row.WordCount != null), 'WordCount', false)[0]
  const membersRatedLongestBook = props.uniqueValues(ratingsTable.filter((row) => row.bookid == longestBook.bookid), 'Member')
  const shortestBook = props.sort_table(ratingsTable.filter((row) => row.WordCount != null), 'WordCount', true)[0]
  const membersRatedShortestBook = props.uniqueValues(ratingsTable.filter((row) => row.bookid == shortestBook.bookid), 'Member')

  console.log(topConsistencyBook)


  const oldestBook = props.sort_table(ratingsTable, 'Year', true)[0]
  const membersRatedOldestBook = props.uniqueValues(ratingsTable.filter((row) => row.bookid == oldestBook.bookid), 'Member')
  console.log(membersRatedOldestBook[0])
  const newestBook = props.sort_table(ratingsTable, 'Year', false)[0]
  const membersRatedNewestBook = props.uniqueValues(ratingsTable.filter((row) => row.bookid == newestBook.bookid), 'Member')

  const consistentRater = props.sort_table(avg_by_member, 'sdRating', true)[0]
  const leastConsistentRater = props.sort_table(avg_by_member, 'sdRating', false)[0]

  const mostBooksRated = props.sort_table(avg_by_member, 'count', false)[0]
  console.log('book selectors')
  console.log(props.uniqueValues(ratingsTable, 'BookSelector'))
  const bestSelector = props.sort_table(props.groupBy(ratingsTable.filter((row) => !['Mutual', 'Not part of book club'].includes(row.BookSelector) & row['BookSelector'] != null), 'BookSelector', 2), 'avgRating', false)[0]

  const avg_by_genre = props.avgByGenre(ratingsTable, 3, true)
  console.log(avg_by_genre)
  const avgByGenreAbove5 = avg_by_genre.filter((row) => row.numBooks >= 5)
  let topReadGenres = []
  if (avg_by_genre.length > 0)
  {
    if (avgByGenreAbove5.length >= 5) {
      topReadGenres = props.sort_table(avgByGenreAbove5, 'avgRating', false).slice(0, 5)
    } else if (avg_by_genre.length >= 5) {
      topReadGenres = props.sort_table(avg_by_genre, 'avgRating', false).slice(0, 5)
    }
  }

  const unselectedClassName = 'border border-gray-500 bg-blue-100 py-10 px-4 cursor-pointer rounded-xl w-full'
  const selectedClassName = 'border border-gray-500 border-[5px] bg-blue-200 py-10 px-4 cursor-pointer rounded-xl w-full'
  const awardTitleClass = ' text-lg lg:text-xl font-bold mt-1 mb-2'

  const classNameWithFullOverlap = 'grid grid-cols-1 sm:grid-cols-3 gap-4 mx-2 sm:mx-10 my-10'
  const classNameWithPartialOverlap = 'grid grid-cols-1 sm:grid-cols-2 gap-4 mx-2 sm:mx-10 my-10'
  const classNameWithNoOverlap = 'grid grid-cols-1 gap-4 mx-2 sm:mx-10 my-10'
  
  let classToUse = classNameWithNoOverlap

  if (booksRatedByAllMembers.length > 0)
  {
    classToUse = classNameWithFullOverlap
  } else if (booksRatedByMoreThanOneMember.length > 0) {
    classToUse = classNameWithPartialOverlap
  } else {
    classToUse = classNameWithNoOverlap
  }


  return (
    <div>
      <div className={classToUse}>
        {booksRatedByAllMembers.length > 0 &&
        (<div onClick={() => setViewChoice('Books Rated By Every Member')} className={viewChoice == 'Books Rated By Every Member' ? selectedClassName : unselectedClassName}>
          <p className='text-4xl md:text-[50px] font-bold text-center'>{booksRatedByAllMembers.length}</p>
          <p className='text-center text-sm pt-3'>Books Rated By Every Member </p>
        </div>)}
        {booksRatedByMoreThanOneMember.length > 0 &&
        (<div onClick={() => setViewChoice('Books Rated By More Than One Member')} className={viewChoice == 'Books Rated By More Than One Member' ? selectedClassName : unselectedClassName}>
          <p className='text-4xl md:text-[50px] font-bold text-center' >{booksRatedByMoreThanOneMember.length}</p>
          <p className='text-center text-sm pt-3'>Books Rated By More Than One Member </p>
        </div>)}
        <div onClick={() => setViewChoice('Books Rated By Anyone')} className={viewChoice == 'Books Rated By Anyone' ? selectedClassName : unselectedClassName}>
          <p className='text-4xl md:text-[50px] font-bold text-center'>{props.uniqueValues(props.data, 'bookid').length}</p>
          <p className='text-center text-sm pt-3'>Books Rated By Anyone </p>
        </div>
      </div>

      <div className='grid md:grid-cols-2 2xl:grid-cols-4 text-center items-center justify-center bg-gray-400 py-10 gap-8 mx-10'>
        {topRatedBook?.value &&
          (<div className='flex flex-col items-center text-center justify-center bg-gray-200  mx-auto  h-[400px] w-full max-w-[400px] border-2 border-gray-500 rounded-xl'>
            <img className = 'h-48 object-contain mb-4 mt-2 rounded' src={ratingsTable.filter((row) => row.bookid == topRatedBook.value)[0].Thumbnail} />
            <p className={awardTitleClass}>Group's Favorite Book</p>
            <p className='text-sm'>{ratingsTable.filter((row) => row.bookid == topRatedBook.value)[0].Author} - {ratingsTable.filter((row) => row.bookid == topRatedBook.value)[0].Book}</p>
            <p className='text-sm'>Average: {topRatedBook.avgRating.toFixed(2)}</p>
            {viewChoice != 'Books Rated By Every Member' &&
              <em className='text-sm'>{membersRatedTopRatedBook.length == 1 ? `${membersRatedTopRatedBook[0]} Rated This` :
                membersRatedTopRatedBook.length == 2 ? `${membersRatedTopRatedBook[0]} and ${membersRatedTopRatedBook[1]} Rated This` : `${membersRatedTopRatedBook.length} Members Rated This`}</em>}
          </div>)
        }
        {bottomRatedBook?.value &&
          (<div className='flex flex-col items-center text-center justify-center bg-gray-200  mx-auto  h-[400px] w-full max-w-[400px]  border-2 border-gray-500 rounded-xl'>
            <img className = 'h-48 w-full object-contain mb-4 mt-2 rounded' src={ratingsTable.filter((row) => row.bookid == bottomRatedBook.value)[0].Thumbnail} />
            <p className={awardTitleClass}>Group's Least Favorite Book</p>
            <p className='text-sm'>{ratingsTable.filter((row) => row.bookid == bottomRatedBook.value)[0].Author} - {ratingsTable.filter((row) => row.bookid == bottomRatedBook.value)[0].Book}</p>
            <p className='text-sm'> Average: {bottomRatedBook.avgRating.toFixed(2)}</p>
            {viewChoice != 'Books Rated By Every Member' &&
              <em className='text-sm'>{membersRatedBottomRatedBook.length == 1 ? `${membersRatedBottomRatedBook[0]} Rated This` :
                membersRatedBottomRatedBook.length == 2 ? `${membersRatedBottomRatedBook[0]} and ${membersRatedBottomRatedBook[1]} Rated This` : `${membersRatedBottomRatedBook.length} Members Rated This`}</em>}
          </div>)}
        {topConsistencyBook?.value &&
          (<div className='flex flex-col items-center text-center justify-center bg-gray-200  mx-auto  h-[400px] w-full max-w-[400px] border-2 border-gray-500 rounded-xl'>
            <img className = 'h-48 w-full object-contain mb-4 mt-2 rounded' src={ratingsTable.filter((row) => row.bookid == topConsistencyBook.value)[0].Thumbnail} />
            <p className={awardTitleClass}>Group's Most Consistent Book</p>
            <p className='text-sm'>{ratingsTable.filter((row) => row.bookid == topConsistencyBook.value)[0].Author} - {ratingsTable.filter((row) => row.bookid == topConsistencyBook.value)[0].Book}</p>
            <p className='text-sm'>Standard Deviation: {topConsistencyBook.sdRating.toFixed(2)}</p>
            {viewChoice != 'Books Rated By Every Member' &&
              <em className='text-sm'>{membersRatedTopConsistencyBook.length == 1 ? `${membersRatedTopConsistencyBook[0]} Rated This` :
                membersRatedTopConsistencyBook.length == 2 ? `${membersRatedTopConsistencyBook[0]} and ${membersRatedTopConsistencyBook[1]} Rated This` : `${membersRatedTopConsistencyBook.length} Members Rated This`}</em>}
          </div>)
        }
        {leastConsistentBook?.value &&
          (
            <div className='flex flex-col items-center text-center justify-center bg-gray-200 mx-auto h-[400px] w-full max-w-[400px] border-2 border-gray-500 rounded-xl'>
              <img className = 'h-48 w-full object-contain mb-4 mt-2 rounded' src={ratingsTable.filter((row) => row.bookid == leastConsistentBook.value)[0].Thumbnail} />
              {leastConsistentBook?.value &&
                <p className={awardTitleClass}>Group's Least Consistent Book</p>}
              <p className='text-sm'>{ratingsTable.filter((row) => row.bookid == leastConsistentBook.value)[0].Author} - {ratingsTable.filter((row) => row.bookid == leastConsistentBook.value)[0].Book}</p>
              <p className='text-sm'>Standard Deviation: {leastConsistentBook.sdRating.toFixed(2)}</p>
              {viewChoice != 'Books Rated By Every Member' &&
                <em className='text-sm'>{membersRatedLeastConsistentBook.length == 1 ? `${membersRatedLeastConsistentBook[0]} Rated This` :
                  membersRatedLeastConsistentBook.length == 2 ? `${membersRatedLeastConsistentBook[0]} and ${membersRatedLeastConsistentBook[1]} Rated This` : `${membersRatedLeastConsistentBook.length} Members Rated This`}</em>}
            </div>)
        }
        {
          longestBook &&
          (<div className='flex flex-col items-center text-center justify-center bg-gray-200  mx-auto  h-[400px] w-full max-w-[400px] border-2 border-gray-500 rounded-xl'>
            <img className = 'h-48 w-full object-contain mb-4 mt-2 rounded' src={longestBook.Thumbnail} />
            <p className={awardTitleClass}>Longest Book</p>
            <p className='text-sm'>{longestBook.Author} - {longestBook.Book}</p>
            <p className='text-sm'>~{longestBook.WordCount.toLocaleString()} Words</p>
            {viewChoice != 'Books Rated By Every Member' &&
              <em className='text-sm'>{membersRatedLongestBook.length == 1 ? `${membersRatedLongestBook[0]} Rated This` :
                membersRatedLongestBook.length == 2 ? `${membersRatedLongestBook[0]} and ${membersRatedLongestBook[1]} Rated This` : `${membersRatedLongestBook.length} Members Rated This`}</em>}
          </div>)
        }
        {
          shortestBook &&
          (<div className='flex flex-col items-center text-center justify-center bg-gray-200  mx-auto  h-[400px] w-full max-w-[400px] border-2 border-gray-500 rounded-xl'>
            <img className = 'h-48 w-full object-contain mb-4 mt-2 rounded' src={shortestBook?.Thumbnail} />
            <p className={awardTitleClass}>Shortest Book</p>
            <p className='text-sm'>{shortestBook?.Author} - {shortestBook?.Book}</p>
            <p className='text-sm'>~{shortestBook?.WordCount.toLocaleString()} Words</p>
            {viewChoice != 'Books Rated By Every Member' &&
              <em className='text-sm'>{membersRatedShortestBook.length == 1 ? `${membersRatedShortestBook[0]} Rated This` :
                membersRatedShortestBook.length == 2 ? `${membersRatedShortestBook[0]} and ${membersRatedShortestBook[1]} Rated This` : `${membersRatedShortestBook.length} Members Rated This`}</em>}
          </div>)
        }

        {oldestBook &&
          (<div className='flex flex-col items-center text-center justify-center bg-gray-200 mx-auto  h-[400px] w-full max-w-[400px] border-2 border-gray-500 rounded-xl'>
            <img className = 'h-48 w-full object-contain mb-4 mt-2 rounded' src={oldestBook.Thumbnail} />
            <p className={awardTitleClass}>Oldest Book</p>
            <p className='text-sm'>{oldestBook.Author} - {oldestBook.Book}</p>
            <p className='text-sm'>{oldestBook.Year}</p>
            {viewChoice != 'Books Rated By Every Member' &&
              <em className='text-sm'>{membersRatedOldestBook.length == 1 ? `${membersRatedOldestBook[0]} Rated This` :
                membersRatedOldestBook.length == 2 ? `${membersRatedOldestBook[0]} and ${membersRatedOldestBook[1]} Rated This` : `${membersRatedOldestBook.length} Members Rated This`}</em>}
          </div>)
        }
        {newestBook &&
          (<div className='flex flex-col items-center text-center justify-center bg-gray-200 mx-auto  h-[400px] w-full max-w-[400px] border-2 border-gray-500 rounded-xl'>
            <img className = 'h-48 w-full object-contain mb-4 mt-2 rounded' src={newestBook.Thumbnail} />
            <p className={awardTitleClass}>Newest Book</p>
            <p className='text-sm'>{newestBook.Author} - {newestBook.Book}</p>
            <p className='text-sm'> {newestBook.Year}</p>
            {viewChoice != 'Books Rated By Every Member' &&
              <em className='text-sm'>{membersRatedNewestBook.length == 1 ? `${membersRatedNewestBook[0]} Rated This` :
                membersRatedNewestBook.length == 2 ? `${membersRatedNewestBook[0]} and ${membersRatedNewestBook[1]} Rated This` : `${membersRatedNewestBook.length} Members Rated This`}</em>}
          </div>)
        }
      </div>

    {topRatedMember?.value &&
      (<div className='flex flex-wrap gap-8 bg-blue-200 py-10 items-center justify-center text-center mx-10 mt-10'>
          <div className='flex flex-col text-center items-center justify-center bg-gray-200 mx-auto w-full max-w-[300px] h-[200px] border-2 border-gray-500 rounded-xl'>
            <p className={awardTitleClass}>Highest Rater </p>
            <p className='text-sm'>{topRatedMember.value}</p>
            <p className='text-sm'>Average: {topRatedMember.avgRating.toFixed(2)}</p>
            {viewChoice != 'Books Rated By Every Member' &&
              (<em className='text-sm'>{ratingsTable.filter((row) => row.Member == topRatedMember.value).length} Books</em>)}
          </div>
          <div className='flex flex-col text-center items-center justify-center bg-gray-200 mx-auto w-full max-w-[300px] h-[200px]  border-2 border-gray-500 rounded-xl'>
            <p className={awardTitleClass}>Hardest To Please</p>
            <p className='text-sm'>{bottomRatedMember.value}</p>
            <p className='text-sm'>Average: {bottomRatedMember.avgRating.toFixed(2)}</p>
            {viewChoice != 'Books Rated By Every Member' &&
              (<em className='text-sm'>{ratingsTable.filter((row) => row.Member == bottomRatedMember.value).length} Books</em>)}
          </div>
          <div className='flex flex-col text-center items-center justify-center bg-gray-200 mx-auto w-full max-w-[300px] h-[200px]  border-2 border-gray-500 rounded-xl'>
            <p className={awardTitleClass}>Most Consistent Rater</p>
            <p className='text-sm'>{consistentRater.value}</p>
            <p className='text-sm'>Standard Deviation: {consistentRater.sdRating.toFixed(2)}</p>
          </div>
          <div className='flex flex-col text-center items-center justify-center bg-gray-200 mx-auto w-full max-w-[300px] h-[200px]  border-2 border-gray-500 rounded-xl'>
            <p className={awardTitleClass}>Least Consistent Rater</p>
            <p className='text-sm'>{leastConsistentRater.value}</p>
            <p className='text-sm'>Standard Deviation: {leastConsistentRater.sdRating.toFixed(2)}</p>
          </div>
          <div className='flex flex-col text-center items-center justify-center bg-gray-200 mx-auto w-full max-w-[300px] h-[200px]  border-2 border-gray-500 rounded-xl'>
              <p className={awardTitleClass}>Chooses the best books</p>
              <p className='text-sm'>{bestSelector.value}</p>
              <p className='text-sm'>Average Rating: {bestSelector.avgRating.toFixed(2)}</p>
            </div>
      </div>)}

      <div className={`flex flex-wrap text-center justify-center items-center bg-blue-200 gap-8 py-10 mx-10 mb-10`}>
        {
          topReadGenres.length > 0 && topReadGenres.map((genre_row) => {
            let genre = genre_row.genre
            let memberWinner = ''
            let winnerRating = 0
            let winnerNumBooks = 0
            for (const member of uniqueMembers) {
              const memberName = props.uniqueValues(ratingsTable.filter((row) => row.memberid == member), 'Member')[0]
              let avgByMemberThisGenre = props.avgByGenre(ratingsTable.filter((row) => row.memberid == member), 2, true).filter((row => row.genre == genre))
              if (avgByMemberThisGenre.length > 0 && avgByMemberThisGenre[0].avgRating > winnerRating) {
                memberWinner = memberName
                winnerRating = avgByMemberThisGenre[0].avgRating
                winnerNumBooks = avgByMemberThisGenre[0].numBooks
              }
            }
            return (
              <div className='flex flex-col items-center text-center justify-center bg-gray-200 mx-auto h-[200px] border-2 border-gray-500 rounded-xl p-2 w-full max-w-[300px]'>
                <p className={awardTitleClass}>Biggest {genre} Fan</p>
                <p className='text-sm'>{memberWinner}</p>
                <p className='text-sm'>{winnerRating.toFixed(2)} Avg Rating</p>
                <em className='text-sm'>{winnerNumBooks} Books</em>
              </div>)
          })
        }
      </div>


    </div >
  )
}

export default GroupAnalysis
