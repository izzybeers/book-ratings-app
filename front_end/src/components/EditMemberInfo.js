import React, {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import { addMember } from '../store/membersSlice.js';
import {supabase} from '../utils/SupabaseClient.js'

const EditMemberInfo = () => {

  const [showNewMemberBox, setShowNewMemberBox] = useState(true)
  const membersData = useSelector((state) => state.members).data
  const dispatch = useDispatch()
  const [newMemberName, setNewMemberName] = useState('')
  const [addedMemberMessage, setAddedMemberMessage] = useState('')
  const maxMemberId = membersData.length > 0 ? Math.max(...membersData.map((m) => m.MemberID)) : 0//... turns it from array to vector
  const newMemberId = maxMemberId + 1
  console.log(membersData)
  console.log(membersData.MemberName)
  console.log(maxMemberId)

  const ingestNewMember = async() => {

    const dataToWrite = {
        MemberID: newMemberId,
        MemberName: newMemberName,
        added: new Date().toISOString()
        }

    const { data, error } = await supabase
            .from('Members')
            .upsert(dataToWrite)
            .select()
            if (error) {
                setAddedMemberMessage('The member was unable to be added.')
                console.log(error.message)
                return
            } else {
              setAddedMemberMessage(`Successfully added ${newMemberName} to database. Select the member above to add a new rating.`)
              dispatch(addMember(data[0]))
              setNewMemberName('')
              setShowNewMemberBox(false)
            }

  }
  return (
    <div>

      {showNewMemberBox &&
        (
        <div className = 'flex flex-col'>
          <input className = 'border border-gray-500 w-96 my-3 px-1' type = 'text' placeholder = 'Enter new member name here' value = {newMemberName} onChange = {(e) => {setNewMemberName(e.target.value); setAddedMemberMessage('')}}></input>
          {newMemberName && membersData.some(m => m.MemberName === newMemberName) ?
          (<p>You already have a member in your dataset with that same name. Please choose a new name.</p>) :
          (<button className = 'border border-gray-500 w-96 my-1' onClick = {ingestNewMember}>Add</button>)}
        </div>
        )
        }

        
        <p className = 'my-2'>{addedMemberMessage}</p>

    </div>
 
  )
}

export default EditMemberInfo
