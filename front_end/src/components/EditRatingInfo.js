import React, {useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectJoinedTable } from '../store/selectors'
import {supabase} from '../utils/SupabaseClient.js'
import { addRating } from '../store/ratingSlice.js';

const EditRatingInfo = (props) => {
    const ratingsData =  useSelector(selectJoinedTable)
    const ratingsDataThisBook = ratingsData.filter((row) => row.bookid == props.book)
    const ratingsDataFiltered = ratingsDataThisBook.filter((row) => row.Member == props.member)
    const existingRating = ratingsDataFiltered.length > 0 ? ratingsDataFiltered[0].Rating : null
    const newRatingMessage = !existingRating && `${props.member} has not rated this book before. Add a new rating here.`
    const [rating, setRating] = useState(existingRating ? existingRating : 5)

    const defaultStartDate = ratingsDataFiltered.length > 0 ? ratingsDataFiltered[0].start_date : null
    const defaultFinishDate = ratingsDataFiltered.length > 0 ? ratingsDataFiltered[0].finish_date : null
    const [startDate, setStartDate] = useState(defaultStartDate)
    const [finishDate, setFinishDate] = useState(defaultFinishDate)

    const dataChange = !(existingRating == rating && existingRating && startDate == defaultStartDate && finishDate == defaultFinishDate)

    const [addedRatingMessage, setAddedRatingMessage] = useState('')
    const buttonMessage = dataChange ? 'Update' : 'Add New Rating'

    const dispatch = useDispatch()

    const ingestNewRating = async () => {
    
            const dataToWrite = {
                bookid: props.book,
                memberid: props.memberid,
                Rating: rating,
                start_date: startDate,
                finish_date: finishDate
            }
    
            console.log(dataToWrite)
    
            const { data, error } = await supabase
                .from('BookRatings')
                .upsert(dataToWrite)
                .select()
            if (error) {
                setAddedRatingMessage('The rating was unable to be added.')
                console.log(error.message)
                return
            } else {
                dataChange ? setAddedRatingMessage(`Successfully updated rating data.`) : setAddedRatingMessage('Successfully added new rating.')
                dispatch(addRating(data[0]))
            }
    
         }

  return (
    <div className = 'grid grid-cols-5 items-center justify-center mr-5 w-3/4'>
      <img className = 'col-span-1  pr-3' src = {props.selectedbookdata.thumbnail_url}></img>
      <div className = 'flex flex-col col-span-4 pl-3'>
        <p className = 'text-xs'>{newRatingMessage}</p>
        <label className="font-bold py-2">{props.member}'s Rating: {rating}</label>
        <input type = 'range' min = '1' max = '10' step = '1' value = {rating} onChange = {(e) => setRating(e.target.value)} ></input>
        <div className = 'grid grid-cols-9 py-5'>
            <label className = 'font-bold col-span-2'>Dates Read:</label>
            <input className = 'border border-gray-600 cursor-pointer col-span-3 text-center' type = 'date' value = {startDate} onChange = {(e) => setStartDate(e.target.value)}/>
            <p className= 'col-span-1 text-center'>to</p>
            <input className = 'border border-gray-600 cursor-pointer col-span-3 text-center' type = 'date' value = {finishDate} onChange = {(e) => setFinishDate(e.target.value)}/>
        </div>
        <div className = 'text-center'>
            {(!!dataChange || !existingRating) && (<button className = 'border border-[2] border-gray-600 font-bold bg-gray-100 w-1/3' onClick = {() => ingestNewRating()}>{buttonMessage}</button>)}
        </div>
         <p className='my-2'>{addedRatingMessage}</p>
      </div>
     
    </div>
  )
}

export default EditRatingInfo
