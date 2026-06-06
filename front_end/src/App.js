import {useEffect} from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home.js';
import FriendComparisons from './pages/FriendComparisons.js';
import AddNew from './pages/AddNew.js';
import RawData from './pages/RawData.js';

import {useDispatch, useSelector} from 'react-redux'
import {fetchMembers} from './store/membersSlice.js'
import {fetchBookInfo} from './store/bookSlice.js'
import { fetchRatings } from './store/ratingSlice.js';

function App() {
  const dispatch = useDispatch()
  useEffect(() => { dispatch(fetchMembers())}, [])
  useEffect(() => { dispatch(fetchBookInfo())}, [])
  useEffect(() => { dispatch(fetchRatings())}, [])
  const membersData = useSelector((state) => state.members)
  // console.log(membersData)
  const bookData = useSelector((state) => state.books)
  // console.log(bookData)
  const ratingsData = useSelector((state) => state.ratings)
  // console.log(ratingsData)

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path = '/' element = {<Home/>}/>
        <Route exact path = '/friend-comparisons' element = {<FriendComparisons/>}/>
        <Route exact path = '/add-new' element = {<AddNew/>}/>
        <Route path = '/raw-data' element = {<RawData/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
