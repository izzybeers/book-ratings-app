import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addBook } from '../store/bookSlice.js';
import { supabase } from '../utils/SupabaseClient.js'
import {genreOptions} from '../store/bookSlice.js'

const EditBookInfo = (props) => {
    const ageOptions = ['Adult', 'YA', 'Any Age']
    const rawMemberData = useSelector((state) => state.members).data
    const memberData = props.sort_table ? props.sort_table(rawMemberData, 'MemberName', true) : []
    const memberNames = memberData.map((row) => row.MemberName)

    //if we are passing in an existing book to edit, will default to the existing value. Otherwise, default as blank.
    const [author, setAuthor] = useState(props.author || null)
    const [title, setTitle] = useState(props.title || null)
    const [ageGroup, setAgeGroup] = useState(props.ageGroup || ageOptions[0])
    const [primaryGenre, setPrimaryGenre] = useState(props.primaryGenre || genreOptions[0])
    const [secondaryGenres, setSecondaryGenres] = useState(
        typeof props.secondaryGenres === 'string'
            ? props.secondaryGenres.split(',') 
            : (props.secondaryGenres || [])
    )
    const [bookSelector, setBookSelector] = useState(props.bookSelector)
    const [yearPublished, setYearPublished] = useState(props.yearPublished || null)
    const [wordCount, setWordCount] = useState(props.wordCount || null)

    const dispatch = useDispatch()
    const [addedBookMessage, setAddedBookMessage] = useState('')


    const ingestNewBook = async () => {

        const dataToWrite = {
            id: props.id,
            Year: yearPublished,
            Author: author,
            Book: title,
            BookSelector: bookSelector,
            Age: ageGroup,
            WordCount: wordCount,
            PrimaryGenre: primaryGenre,
            SecondaryGenres: secondaryGenres.filter((item) => item != primaryGenre).join(','),
            thumbnail_url: props.thumbnail,
            added: new Date().toISOString()
        }

        console.log(dataToWrite)

        const { data, error } = await supabase
            .from('BookInfo')
            .upsert(dataToWrite)
            .select()
        if (error) {
            setAddedBookMessage('The book was unable to be added.')
            console.log(error.message)
            return
        } else {
            setAddedBookMessage(`Successfully added ${title} to database. Select the book above to edit or add a new rating.`)
            dispatch(addBook(data[0]))
        }

    }
    return (
        <div className='flex flex-col mx-10 bg-green-100 justify-center'>
            <p className='font-semibold p-2'>{props.fillOutDataMessage}</p>
            <div className='flex flex-wrap justify-center'>
                <div className='flex flex-col m-2'>
                    <label className='font-bold h-7 m-1'> Author <span className='text-red-500 text-2xl'>*</span></label>
                    <input className='border border-gray-600 text-center' type='text' value={author} onChange={(e) => setAuthor(e.target.value)}></input>
                </div>
                <div className='flex flex-col m-2'>
                    <label className='font-bold h-7 m-1'> Title <span className='text-red-500 text-2xl'>*</span></label>
                    <input className='border border-gray-600 text-center' type='text' value={title} onChange={(e) => setTitle(e.target.value)}></input>
                </div>
                <div className='flex flex-col m-2'>
                    <label className='font-bold m-1 h-7'>Year Published</label>
                    <input className='border border-gray-600 text-center' type='text' value={yearPublished} onChange={(e) => setYearPublished(e.target.value)}></input>
                </div>
                <div className='flex flex-col m-2'>
                    <label className='font-bold h-7 m-1'>Approx. Word Count</label>
                    <input className='border border-gray-600 text-center' type='text' value={wordCount} onChange={(e) => setWordCount(e.target.value)}></input>
                </div>
            </div>
            <div className='flex justify-center'>
                <div className='flex flex-col m-2'>
                    <label className='font-bold m-1 h-7'>Select best age range<span className='text-red-500 text-2xl'>*</span></label>
                    <select className='border border-gray-600' value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)}>
                        {ageOptions.map((opt) => {
                            return (<option>{opt}</option>)
                        })}
                    </select>
                </div>
                <div className='flex flex-col m-2'>
                    <label className='font-bold m-1 h-7'>Who selected this for book club?<span className='text-red-500 text-2xl'>*</span></label>
                    <select className='border border-gray-600' value={bookSelector} onChange={(e) => setBookSelector(e.target.value)}>
                        <option value={null}>Not part of book club</option>
                        <option>Mutual</option>
                        {memberNames.map((item) => (<option>{item}</option>))}
                    </select>
                </div>
            </div>
            <div className='flex flex-col m-2 mx-auto'>
                <label className='font-bold m-1 h-7'>Select Primary Genre<span className='text-red-500 text-2xl'>*</span></label>
                <select className='border border-gray-600' value={primaryGenre} onChange={(e) => { setPrimaryGenre(e.target.value); setSecondaryGenres([]) }}>
                    {genreOptions.map((opt) => {
                        return (<option>{opt}</option>)
                    })}
                    <option>Other</option>
                </select>
            </div>
            <div className='flex flex-col m-2 items-center mx-auto'>
                <label className='font-bold m-1'>Select up to 2 secondary genres (optional)</label>
                <div className='flex flex-wrap gap-1 mx-auto px-[200px] max-w-[2500px] justify-center'>
                    {genreOptions.map((opt) => {
                        return opt != primaryGenre &&
                            (<div className='flex mx-2'>
                                <input type='checkbox' checked={secondaryGenres.includes(opt)} className='border border-gray-600'
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSecondaryGenres([...secondaryGenres, opt])
                                        } else {
                                            setSecondaryGenres(secondaryGenres.filter((item) => item != opt))
                                        }
                                    }} />
                                <option>{opt}</option>
                            </div>)
                    })}
                </div>
                {secondaryGenres.length > 2 && (<p className='text-red-500 font-bold p-1'>You may only select up to 2 secondary genres.</p>)}
                {console.log(secondaryGenres)}
            </div>
            {secondaryGenres.length <= 2 &&
                (<button onClick={() => { props.handleSelection(); ingestNewBook() }} className='border-2 border-gray-800 bg-red-200 text-3xl p-2 my-2 mx-auto w-48'>{props.buttonText}</button>)
            }
            <p className='my-2'>{addedBookMessage}</p>
        </div>
    )
}

export default EditBookInfo
