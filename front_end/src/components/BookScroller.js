import React, {useState, useEffect} from 'react'
import {BsChevronCompactLeft, BsChevronCompactRight} from 'react-icons/bs'
import StarsDisplay from './StarsDisplay';

const BookScroller = (props) => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [itemsPerPage, setItemsPerPage] = useState(30)
    const [cols, setCols] = useState(10)

    useEffect(() => setCurrentIndex(0), [props.data])

    useEffect(() => {
      const handleResize = () =>{
        const width = window.innerWidth
        if (width > 1800) {
          let calculatedCols = Math.floor(width / 190)
          setCols(calculatedCols)
          setItemsPerPage(calculatedCols*3)
          } else if (width >= 1536) { // 2xl screen
              setItemsPerPage(30); 
              setCols(10)
          } else if (width >= 1280) { // xl screen
              setItemsPerPage(24); 
              setCols(8)
          } else if (width >= 1024) { // lg screen
              setItemsPerPage(21); 
              setCols(7)
          } else if (width >= 768) { // md screen
              setItemsPerPage(24);  
              setCols(6)
          } else if (width >= 640) {
              setItemsPerPage(20) //sm screen
              setCols(5)
          } else if (width >= 400) {
            setItemsPerPage(16);
            setCols(4)
          } else { 
              setItemsPerPage(6);
              setCols(2);
          }
        }
        setCurrentIndex(0)

        handleResize()

        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize)
      }, [])

    const sorted_data = [...props.data].sort((a,b) => {
            if (a['Rating'] === b['Rating']) {
            return 0;
            } else {
                return a['Rating'] < b['Rating'] ? 1 : -1
            }
        }
        )
  const maxPage = Math.ceil(sorted_data.length/itemsPerPage)
  const startBookIndex = currentIndex*itemsPerPage
  const endBookIndex = itemsPerPage*(currentIndex + 1) < sorted_data.length ? itemsPerPage*(currentIndex + 1)  :  sorted_data.length
  const currentPageBooks = sorted_data.slice(startBookIndex, endBookIndex)
  console.log(`Start to end: ${startBookIndex} to ${endBookIndex}`)
  console.log(`window size: ${window.innerWidth}`)
  console.log(`items per page: ${itemsPerPage}`)
  return (
    <div className = 'flex items-start h-[92vh] pt-12'>
       <div className = 'flex self-center'>
          {currentIndex > 0 && (<BsChevronCompactLeft className = 'cursor-pointer inline-block' onClick = {() => setCurrentIndex(prevCount => prevCount - 1)}/>)}
        </div>
        <div className = 'max-w-[1600px] mx-auto gap-2 grid' style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {
            currentPageBooks.map((book) =>  {
              return (
              <div>
                <div className='px-2 py-2 w-full lg:w-44'>
                  <div className='flex h-40 lg:h-56'>
                      <img className='items-start justify-center' src={book.Thumbnail} alt={`${book.Author} - ${book.Book}`} title={`${book.Author} - ${book.Book} (${book.Year})`}></img>
                  </div>
                  <StarsDisplay Rating = {book.Rating}/>

                </div>
              </div>
              )

            }) 
        }
      </div>
      <div className = 'flex self-center'>
        {currentIndex < (maxPage-1) && <BsChevronCompactRight className = 'cursor-pointer inline-block' onClick = {() => setCurrentIndex(prevCount => prevCount + 1)}/>}
      </div>
    </div>
  )
}

export default BookScroller
