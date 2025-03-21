import React from 'react'

const Footer = () => {
    return (
        <div className=' text-white flex flex-col justify-center items-center  w-full'>
            <div className="logo font-bold text-white">
                <span className='text-[#44229f]'>&#8473;</span>
                <span>ass</span><span className='text-[#44229f]'>Manager</span>
            </div>
            <hr style={{width:"40%", color:"#44229f"}} />
            <div className='flex justify-center items-center'>&#169;Created by Aditya Bora</div>
        </div>
    )
}

export default Footer