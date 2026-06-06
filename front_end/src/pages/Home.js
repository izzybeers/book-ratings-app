import React from 'react'
import Nav from '../components/Nav'
import {useSelector} from 'react-redux'
import BookScroller from '../components/BookScroller'
import { selectJoinedTable } from '../store/selectors';

const Home = () => {
const selectedUser = useSelector((state) => state.members.selectedMemberID)
const fullData = useSelector(selectJoinedTable); 
console.log('SELECTED MEMBER:', selectedUser)
console.log('full data')
console.log(fullData)
  return (
    <div>
      <Nav/>
      <BookScroller data = {fullData.filter((row) => {return row.memberid == selectedUser})}/>
    </div>
  )
}

export default Home
