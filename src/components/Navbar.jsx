import React from 'react'

const Navbar = () => {
    return (
        <nav className='bg-[#d2c1ff] text-white '>
            <div className="mycontainer flex justify-between items-center px-4 py-5 h-17">

                <div className="logo  text-white text-2xl">
                    <span className='text-[#5e3eb1] text-4xl'>&#8473;</span>
                   
                    <span>ass</span><span className='text-[#5e3eb1] font-bold'>Manager</span>
                  
                    
                    </div>
                {/* <ul>
                    <li className='flex gap-4 '>
                        <a className='hover:font-bold' href='/'>Home</a>
                        <a className='hover:font-bold' href='#'>About</a>
                        <a className='hover:font-bold' href='#'>Contact</a>
                    </li>
                </ul> */}
                <button className='text-white hover:cursor-pointer bg-[#5e3eb1] my-5 mx-2 rounded-full flex  justify-between items-center ring-white ring-1'> 
                    <img className=' w-10 p-1' src="github.svg" alt="github logo" />
                    <span className='font-bold px-2'>GitHub</span>
                </button>

            </div>
        </nav>
    )
}

export default Navbar