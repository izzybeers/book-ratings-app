import React, { useState } from 'react'
import Nav
  from '../components/Nav'
import { useSelector } from 'react-redux'
import { selectJoinedTable } from '../store/selectors';
import BookSearch from '../components/BookSearch';
import EditBookInfo from '../components/EditBookInfo';
import EditMemberInfo from '../components/EditMemberInfo';
import EditRatingInfo from '../components/EditRatingInfo';
import { combinationsReplacement } from 'simple-statistics';

const uniqueValues = (data, column) => {
  return ([...new Set(data.map((item => item[column])))])
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

const updateBookInfo = () => {

}


const AddNew = () => {
  const bookData = useSelector((state) => state.books).data
  const memberData = useSelector((state) => state.members).data
  const [selectedBook, setSelectedBook] = useState(null)
  const [selectedUpdateMember, setSelectedUpdateMember] = useState(null)
  const [newSearchQuery, setNewSearchQuery] = useState('')
  const [bookSearchResults, setBookSearchResults] = useState('')
  const [searchMode, setSearchMode] = useState(false)
  const [memberEditMode, setMemberEditMode] = useState(false)
  const [memberKey, setMemberKey] = useState(0)

  console.log('selected member')
  console.log(selectedUpdateMember)
  const selectedBookData = selectedBook && bookData.find((x) => x.id == selectedBook)
  console.log(selectedBookData)
  //console.log(selectedBookData.WordCount)
  return (
    <div>
      <Nav />
      <p className='text-2xl font-bold text-center p-5'>Add or update books, ratings, and members</p>
      <div className='flex flex-col justify-center items-center'>
        <div className='flex flex-col mx-10 mt-3 mb-5 items-center'>
          <p class='text-lg font-bold my-2'>Choose a book to update:</p>
          <select className='border border-gray-800 flex h-7 w-96' value={selectedBook || ''}
            onChange={(e) => { setSelectedBook(e.target.value) }}>
            <option value=''></option>
            {
              sort_table(sort_table(bookData, 'Book', true), 'Author', true).map((row) => {
                const bookid = row.id
                const bookAuthorLabel = `${row.Author} - ${row.Book}`
                return (<option value={bookid}>{bookAuthorLabel}</option>)
              })
            }
          </select>
          <div>
             <em className='flex text-xs p-1 cursor-pointer justify-center' onClick={() => {setSearchMode(true); setSelectedBook(null)}}>Don't see your book here? Click here to add a new book to the database.</em>
            {selectedBook &&
              (
                <div className='flex my-10 text-center'><EditBookInfo key={selectedBook} id = {selectedBookData.id} author={selectedBookData.Author} title={selectedBookData.Book} primaryGenre={selectedBookData.PrimaryGenre} secondaryGenres={selectedBookData.SecondaryGenres} ageGroup={selectedBookData.Age} wordCount={selectedBookData.WordCount} yearPublished={selectedBookData.Year} thumbnail = {selectedBookData.thumbnail_url} bookSelector = {selectedBookData.Book_Selector} new = {false} sort_table={sort_table}
                  buttonText='Update' handleSelection={updateBookInfo} fillOutDataMessage='If any book info is wrong, change it here!' />
                </div>)
              }
               {searchMode && (<BookSearch setSearchMode={setSearchMode} sort_table = {sort_table} />)}
          </div>
        </div>
        <div className='flex flex-col mx-10 mt-3 mb-5 items-center'>
          <p class='text-lg font-bold my-2 text-center'>Choose a member to update:</p>
          <select className='border border-gray-800 flex h-7 w-96' value={selectedUpdateMember}
            onChange={(e) => { setSelectedUpdateMember(e.target.value); setMemberEditMode(false); }}>
            <option value=''></option>
            {
              uniqueValues(sort_table(memberData, 'MemberName', true), 'MemberName').map((item) => {
                console.log(item)
                return (<option value={item}> {item}</option>)
              })
            }
          </select>
          <em className='text-xs p-1 cursor-pointer text-center' onClick={() => { setMemberEditMode(true); setMemberKey(prev => prev + 1) }}>Member is not listed here? Click here to add a new member to the database.</em>
          <div className = 'flex justify-center mt-5'>
            {memberEditMode && memberEditMode && (<EditMemberInfo key={memberKey} />)}
            {selectedUpdateMember && selectedBook && !memberEditMode && <EditRatingInfo key = {[selectedUpdateMember, selectedBook]} member={selectedUpdateMember} memberid={memberData.filter((row) => row.MemberName == selectedUpdateMember)[0].MemberID} book={selectedBook} selectedbookdata = {selectedBookData}/>}
            {selectedUpdateMember && !memberEditMode && !selectedBook && <p>To add a new rating, please select a book.</p>}
          </div>
        </div>
      </div>




    </div>
  )
}

export default AddNew
