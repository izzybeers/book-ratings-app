import React from 'react'

const ShowSharedBooksCount = (props) => {
  return (
    <div>
      <p className='text-[50px] font-bold my-10'><span className='text-[75px] text-red-500 text-4xl px-2'>{props.uniqueValues(props.sharedBookData, 'bookid').length}</span> {props.uniqueValues(props.sharedBookData, 'bookid').length > 1 ? 'Books' : 'Book'} Rated Together </p>
    </div>
  )
}

export default ShowSharedBooksCount