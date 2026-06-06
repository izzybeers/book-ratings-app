import React, {useState, useEffect} from 'react'
import {BsChevronCompactLeft, BsChevronCompactRight} from 'react-icons/bs'
import StarsDisplay from './StarsDisplay';

const BookScroller = (props) => {
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => setCurrentIndex(0), [props])

    const sorted_data = [...props.data].sort((a,b) => {
            if (a['Rating'] === b['Rating']) {
            return 0;
            } else {
                return a['Rating'] < b['Rating'] ? 1 : -1
            }
        }
        )
        const itemsPerPage = 30
        const maxPage = Math.ceil(sorted_data.length/itemsPerPage)
        const startBookIndex = currentIndex*itemsPerPage
        const endBookIndex = itemsPerPage*(currentIndex + 1) < sorted_data.length ? itemsPerPage*(currentIndex + 1)  :  sorted_data.length
        const currentPageBooks = sorted_data.slice(startBookIndex, endBookIndex)
  return (
    <div className = 'flex items-center h-[92vh] pt-12'>
       <div className = 'flex'>
          {currentIndex > 0 && (<BsChevronCompactLeft className = 'cursor-pointer inline-block' onClick = {() => setCurrentIndex(prevCount => prevCount - 1)}/>)}
        </div>
        <div className = 'flex flex-wrap justify-center'>
        {
            currentPageBooks.map((book) =>  {
              return (
              <div>
                <div className='px-5 py-2 w-32 md:w-40 lg:w-44'>
                  <div className='flex h-40 md:h-48 lg:h-52'>
                      <img className='items-center justify-center' src={book.Thumbnail} alt={`${book.Author} - ${book.Book}`} title={`${book.Author} - ${book.Book} (${book.Year})`}></img>
                  </div>
                  <StarsDisplay Rating = {book.Rating}/>
                </div>
              </div>
              )

            }) 
        }
      </div>
      <div className = 'flex'>
        {currentIndex < (maxPage-1) && <BsChevronCompactRight className = 'cursor-pointer inline-block' onClick = {() => setCurrentIndex(prevCount => prevCount + 1)}/>}
      </div>
    </div>
  )
}

export default BookScroller
