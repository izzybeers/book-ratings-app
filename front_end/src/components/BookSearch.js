import React, {useState} from 'react'
import EditBookInfo from './EditBookInfo'
import {useSelector} from 'react-redux'

const BookSearch = (props) => {
    const [queryText, setQueryText] = useState('')
    const [bookSearchResult, setBookSearchResult] = useState([])
    const [showSearchResults, setShowSearchResults] = useState(false)
    const [itemIsClicked, setItemIsClicked] = useState(false)
    const [clickedItem, setClickedItem] = useState(null)
    const [selectedItem, setSelectedItem] = useState(null)

    console.log('querytext:')
    console.log(queryText)


    const bookData =  useSelector((state) => state.books).data
    const maxBookId = bookData.length > 0 ? Math.max(...bookData.map((m) => m.id)) : 0
    const newBookId = maxBookId + 1

    const handleSearch = async() => {
        if (!queryText.trim()) {
            return
        }
        console.log("MY API URL IS:", process.env.REACT_APP_API_URL);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/search?text=${encodeURIComponent(queryText.trim())}&all_matches=True`);
            if (!response.ok) {
                throw new Error(`API returned status ${response.status}`);
            }
            const data = await response.json();
            setBookSearchResult(data);
            setShowSearchResults(true);
            setItemIsClicked(false);
            setClickedItem(null);
            
            console.log('API RESPONSE UPDATED:', data);
        } catch (error) {
            console.error("Search failed:", error);
        }
    }

    //clicking on a book on the list, so the choice can be highlighted
    const chooseBookFromResults = (index) => {
        if(index === clickedItem) {
            setItemIsClicked(!itemIsClicked)
            } else {
            setItemIsClicked(true) //was not clicked before, so must be selected now
        }

        setClickedItem(index)
    }


    //clicking the "select button"
    const handleSelection = (id) => {
        setBookSearchResult([])
        setItemIsClicked(false)
        setClickedItem(null)
    }

    console.log('book search result')
    console.log(bookSearchResult)
  return (
    <div className = 'flex justify-center'>
        <div className = 'relative flex flex-col border border-gray-800 border-2 h-[70vh] w-[95vw] bg-gray-100 overflow-hidden'>
            <div className= 'flex flex-wrap justify-between'>
                <div className = 'mt-4 mx-2 sm:mx-4 flex flex-wrap'>
                    <input className = 'border justify-start border-gray-600 w-full sm:w-60 my-2 mr-2 p-1 h-8' type = 'text' placeholder = 'Search for a book...'
                    onChange = {(e) => setQueryText(e.target.value)}
                    onKeyDown={(e) => {if (e.key === 'Enter' && queryText.length > 0) {handleSearch(queryText)}}}></input>
                    <button className = 'border justify-start border-gray-600 my-2 mx-2 p-1  h-8 active:bg-gray-300' onClick = {() => handleSearch(queryText)}>Search</button>
                    <button className = 'border justify-start border-gray-600 my-2 mx-2 p-1 h-8 active:bg-gray-200' onClick = {() => setBookSearchResult([])}>Reset</button>
                 </div>
                <p className = 'inline-block items-end justify-end mr-4 mt-2  w-7 h-7 text-center border border-gray-800 border-2 cursor-pointer'
                onClick = {() => {props.setSearchMode(false)}}>x</p>
            </div>
            {showSearchResults &&
                (<div className = 'relative flex-1 min-h-0 mx-2 sm:ml-4 overflow-y-auto overflow-x-hidden'>
                    {bookSearchResult.map((result, index) => {
                        const itemClicked = index == clickedItem && itemIsClicked ? true : false
                        const selectedStyle = itemClicked ? 'border-[3px] bg-gray-300' : ''
                        return ( 
                        <div className = 'grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-2'>
                            <div onClick = {() => chooseBookFromResults(index)}
                            className = {`py-2 inline-block bg-white self-start text-center cursor-pointer border border-gray-800 text-center overflow-y-auto my-2 ${selectedStyle}`}>
                                <img  className = 'mx-auto' src = {result.thumbnail} alt= 'no cover found'/>
                                <b>{result.author} - {result.title}</b>
                                <p>{result.description == '' ? 'No description found.' : result.description}</p>
                            </div>
                            <div className = 'flex justify-center items-start'>
                            {(clickedItem == index && itemIsClicked) ?
                                (<EditBookInfo id = {newBookId} author = {result.author} title = {result.title} buttonText = 'Add' handleSelection = {handleSelection} thumbnail = {result.thumbnail} sort_table = {props.sort_table} new = {true} fillOutDataMessage = 'Fill out as much information as possible to keep our dataset complete.'/>)
                                : null}
                            </div>
                        </div>
                        )
                    })}
                </div>)
                }
            </div>
    </div>
    )
}

export default BookSearch
