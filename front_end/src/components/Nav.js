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
        <div className = 'flex flex-wrap w-full h-[75px] sm:h-[50px] bg-blue-100 border-black-100 text-md md:text-lg text-blue-900 font-medium justify-center items-center'>
            <div className = 'px-5 cursor-pointer ' onClick={() => navigate('/')}>
                <p>Home</p>
            </div>
            <div className = ' px-5 cursor-pointer ' onClick={() => navigate('/friend-comparisons')}>
                <p>Analysis</p>
            </div>
            <div className = 'px-5 cursor-pointer 'onClick={() => navigate('/add-new')}>
                <p>Add New</p>
            </div>
            <div className = 'px-5 cursor-pointer ' onClick={() => navigate('/raw-data')}>
                <p>Raw Data</p>
            </div>
            <div className = 'flex pr-5 sm:ml-auto text-xl mx-auto sm:mx-0 font-bold text-black-100'>
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
