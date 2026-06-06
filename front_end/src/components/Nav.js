import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { setSelectedMemberID } from '../store/membersSlice.js'
import { MdPerson } from "react-icons/md";

const Nav = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const membersData = useSelector((state) => state.members.data)
    console.log("MY DATA:", membersData)
    console.log(membersData?.length)
    const selectedUser = useSelector((state) => state.members.selectedMemberID)
    return (
        <div className = 'flex w-full h-[50px] bg-blue-100 border-black-100 text-lg text-blue-900 font-medium items-center'>
            <div className = 'px-5 cursor-pointer ' onClick={() => navigate('/')}>
                <p>Home</p>
            </div>
            <div className = ' px-5 cursor-pointer ' onClick={() => navigate('/friend-comparisons')}>
                <p>Friend Comparisons</p>
            </div>
            <div className = 'px-5 cursor-pointer 'onClick={() => navigate('/add-new')}>
                <p>Add New</p>
            </div>
            <div className = 'px-5 cursor-pointer ' onClick={() => navigate('/raw-data')}>
                <p>Raw Data</p>
            </div>
            <div className = 'flex pr-5 ml-auto text-xl font-bold text-black-100'>
                <MdPerson className = 'm-2' size = {24} />
                <select className = 'w-40 text-center border-black-1[ border[4] h-8 my-auto cursor-pointer' value = {selectedUser} onChange = {(e) => dispatch(setSelectedMemberID(e.target.value))}>
                    {
                        membersData.map((m) => {
                            console.log('Mapping:', m)
                            return (<option key={m.MemberID} value={m.MemberID}>{m.MemberName}</option>)
                        })
                    }
                </select>
            </div>
        </div>
    )
}

export default Nav
