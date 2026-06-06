import React, { useState, useEffect, useRef } from 'react'
import Heatmap from './BookSelectorHeatmap'
import StarsDisplay from './StarsDisplay'
import { BsCheckSquareFill, BsXCircleFill, BsFillHeartFill } from "react-icons/bs"
import BarChart from './BarChart'

const HeadToHead = (props) => {

  const [selectedH2HView, setSelectedH2HView] = useState('favorite')

  //making the scroll on the H2H scrollable right side view automatically scroll back up to the top when a new H2H view is clicked
  //Take the scrollable div and assign it as a reference. Apply the reference here below.
  //The function .scrollTop gives the vertical scrolled position of that object.
  const scrollContainerRef = useRef()
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0
    }
  }, [selectedH2HView])

  const shared_books_both_members = props.groupBy(props.data, 'bookid', 2).map((row) => row.value)
  const member_ids_for_analysis = props.uniqueValues(props.data, 'memberid')
  const member_names_for_analysis = props.uniqueValues(props.data, 'Member')
  const ratings_data_filtered = props.data.filter((row) => shared_books_both_members.includes(String(row.bookid)))


  //create a wide dataframe:
  const shared_books_1 = ratings_data_filtered.filter((row) => row.memberid == member_ids_for_analysis[0])
  const shared_books_2 = ratings_data_filtered.filter((row) => row.memberid == member_ids_for_analysis[1])
  const combinedRatingsTableWide = shared_books_1.map((row1) => {
    const member1name = row1.Member
    const book2 = shared_books_2.find((row2) =>
      row2.bookid == row1.bookid
    )
    if (book2) {
      return {
        Book: book2.Book,
        Author: book2.Author,
        [`${member1name}Rating`]: row1.Rating,
        [`${book2.Member}Rating`]: book2.Rating,
        Thumbnail: book2.Thumbnail,
        BookSelector: book2.BookSelector,
        Year: book2.Year,
        PrimaryGenre: book2.PrimaryGenre,
        SecondaryGenre: book2.SecondaryGenre,
        WordCount: book2.WordCount,
        RatingDifference: Math.abs(Number(row1.Rating) - Number(book2.Rating)),
        RatingAverage: 0.5 * (Number(row1.Rating) + Number(book2.Rating)),
        displayName: [`${book2.Author} - ${book2.Book}`]
      }
    }

  })

  const avg_by_member = props.groupBy(ratings_data_filtered, 'Member', 1)
  const avg_by_selector = props.groupBy(ratings_data_filtered.filter((row) => member_names_for_analysis.includes(row.BookSelector)), 'BookSelector', 1)
  const avg_by_member_for_selector1 = props.groupBy(ratings_data_filtered.filter((row) => row.BookSelector == member_names_for_analysis[0]), 'Member', 1).map((row) => ({
    ...row,
    BookSelector: member_names_for_analysis[0]
  })
  )
  const avg_by_member_for_selector2 = props.groupBy(ratings_data_filtered.filter((row) => row.BookSelector == member_names_for_analysis[1]), 'Member', 1).map((row) => ({
    ...row,
    BookSelector: member_names_for_analysis[1]
  })
  )

  let h2hViewSorted = selectedH2HView == 'favorite' ? props.sort_table(props.sort_table(combinedRatingsTableWide, 'RatingDifference', true), 'RatingAverage', false) :
    selectedH2HView == 'agree' ? props.sort_table(props.sort_table(combinedRatingsTableWide, 'RatingAverage', false), 'RatingDifference', true) :
      props.sort_table(combinedRatingsTableWide, 'RatingDifference', false)

  let ratingCols = Object.keys(h2hViewSorted[0]).map((key) => {
    const match = key.match(/[A-Z].+Rating/)
    return match ? key : null
  }).filter(Boolean)

  const unselectedH2HViewClass = 'flex m-4 p-2 border items-center justify-center  bg-gray-100'
  const selectedH2HViewClass = unselectedH2HViewClass + ' border-[5px] border-blue-800'

  const selectorWideDf = props.sort_table(avg_by_member_for_selector1.concat(avg_by_member_for_selector2), 'BookSelector', true)
  const raterColorMap = {
    [props.uniqueValues(selectorWideDf, 'value')[0]]: 'bg-blue-400',
    [props.uniqueValues(selectorWideDf, 'value')[1]]: 'bg-green-400'
  }
  return (
    <div className='grid grid-cols-[5fr_3fr]'>
      <div id='h2h-left-side' className='my-10 ml-10 border border-2'>
        <p className='text-[50px] font-bold my-10'><span className='text-[75px] text-red-500 text-4xl px-2'>{shared_books_both_members.length}</span> Books Rated Together </p>
        <div className='flex flex-col px-20'>
          {avg_by_member.map((row) => {
            const fillPercentage = row.avgRating * 10
            return (
              <div className={`border-2 rounded-xl border-gray-200 p-5`}
                style={{
                  backgroundImage: `linear-gradient(to right, #fecaca ${fillPercentage}%, #f3f4f6 ${fillPercentage}%)`
                }}>
                <p className='m-2 text-2xl font-bold'>{row.value}:<br></br>
                  <span className='text-red-500 text-3xl mx-2'>
                    {row.avgRating.toFixed(2)}
                  </span>
                  Average Rating on Shared Books
                </p>
              </div>)
          })}
        </div>
        <p className='text-[40px] font-bold mt-10'>Who picks the best books?</p>
        <div className='flex items-end justify-center h-80 px-4 w-[400px] gap-8'>
          {props.uniqueValues(selectorWideDf, 'BookSelector').map((selector) => {
            const rows = selectorWideDf.filter((row) => row.BookSelector == selector)
            return (
              <div className='flex-col h-full'>
                <div className='flex h-full items-end gap-2'>
                  {rows.map((rating) => {
                    console.log(rating)
                    return (
                      <div className='flex flex-col h-full justify-end items-center'>
                        <p>{rating.avgRating.toFixed(1)}</p>
                        <BarChart value={rating.avgRating} color={raterColorMap[rating.value]} />
                        <p>{rating.value}</p>
                      </div>
                    )
                  })}
                </div>
                <p>{selector}'s Picks</p>
              </div>

            )
          })}
        </div>
        {/* <Heatmap data= {avg_by_member_for_selector1.concat(avg_by_member_for_selector2)} uniqueValues = {props.uniqueValues}/> */}


      </div>
      <div id='h2h-right-side' className='my-10 mr-10 border border-2 border-gray-300'>
        <div className='grid grid-cols-3 text-center bg-gray-300'>
          <div className={selectedH2HView == 'favorite' ? selectedH2HViewClass : unselectedH2HViewClass}>
            <label className='cursor-pointer'>
              <input
                type='radio'
                name='h2h_sorted'
                value='favorite'
                className='hidden'
                checked={selectedH2HView == 'favorite'}
                onChange={(e) => setSelectedH2HView(e.target.value)}
              />
              <span className='flex flex-col items-center cursor-pointer font-medium'> <BsFillHeartFill className='text-2xl text-pink-600' /> Our Favorite Books </span>
            </label>
          </div>
          <div className={selectedH2HView == 'agree' ? selectedH2HViewClass : unselectedH2HViewClass}>
            <label className='cursor-pointer'>
              <input
                type='radio'
                name='h2h_sorted'
                value='agree'
                className='hidden'
                checked={selectedH2HView == 'agree'}
                onChange={(e) => setSelectedH2HView(e.target.value)}
              />
              <span className='flex flex-col items-center cursor-pointer font-medium'> <BsCheckSquareFill className='text-2xl text-green-500' />Books We Agreed On Most </span>
            </label>
          </div>
          <div className={selectedH2HView == 'disagree' ? selectedH2HViewClass : unselectedH2HViewClass}>
            <label className='cursor-pointer'>
              <input
                type='radio'
                name='h2h_sorted'
                value='disagree'
                className='hidden'
                checked={selectedH2HView == 'disagree'}
                onChange={(e) => setSelectedH2HView(e.target.value)}
              />
              <span className='flex flex-col items-center cursor-pointer font-medium'> <BsXCircleFill className='text-2xl text-red-600' /> Books We Disagreed On Most </span>
            </label>
          </div>
        </div>
        <div>
          <div className='grid grid-cols-3 mt-4'>
            <p className='font-bold text-2xl'>{ratingCols[0].replace('Rating', '')}</p>
            <p> </p>
            <p className='font-bold text-2xl'>{ratingCols[1].replace('Rating', '')}</p>
          </div>
          <div ref={scrollContainerRef} className='overflow-y-scroll max-h-[600px] mt-1  [&::-webkit-scrollbar]:w-3' style={{ scrollbarWidth: 'auto', scrollbarColor: 'gray' }}>
            {h2hViewSorted.map((row) => {
              return (<div className='grid grid-cols-3 py-3 m-4 justify-items-center border border-2 bg-gray-100 border-gray-200'>
                <div>
                  <StarsDisplay Rating={row[ratingCols[0]]} />
                </div>
                <div>
                  <img src={row.Thumbnail} alt={row.Book} title={`${row.Author} - ${row.Book} (${row.Year})`}></img>
                  {(!['Not part of book club', 'Mutual', ''].includes(row.BookSelector) && row.BookSelector != null) && (<p className='text-center text-sm font-bold mt-2'>{row.BookSelector}'s Pick</p>)}
                </div>
                <div>
                  <StarsDisplay Rating={row[ratingCols[1]]} />
                </div>
              </div>)
            })}
          </div>
        </div>
      </div>
    </div >
  )
}

export default HeadToHead
