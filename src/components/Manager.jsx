import React from 'react'
import { useRef, useState, useEffect } from 'react';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';


import 'react-toastify/dist/ReactToastify.css';

const Manager = () => {
    const ref = useRef()
    const passwordRef = useRef()
    const [form, setform] = useState({ site: "", username: "", password: "" })
    const [passwordArray, setPasswordArray] = useState([])

const getPasswords = async () => {
    let req = await fetch("http://localhost:3000/", { method: "GET" })
    // req.then((res) => res.json()).then((data) => {
        // setPasswordArray(data)
        let passwords = await req.json(); 
        
            setPasswordArray(passwords)
        }

    useEffect(() => {
        getPasswords()

    }, [])

    const copyText = (text) => {
        toast.info('Copied to clipboard!', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            theme: "colored",
            // transition: {Bounce},
        });
        navigator.clipboard.writeText(text)
    }



    const showPassword = () => {
        passwordRef.current.type = "text"
        console.log(ref.current.src)
        if (ref.current.src.includes("/eyecross.png")) {
            ref.current.src = "/eye.png"
            passwordRef.current.type = "password"
        }
        else {
            passwordRef.current.type = "text"
            ref.current.src = "/eyecross.png"
        }

    }

    const savePassword = async () => {
        if (form.site.length > 3 && form.username.length > 3 && form.password.length > 3) {

            toast.success('Password Saved Successfully!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
                theme: "colored",
                // transition: {Bounce},
            });

            await  fetch("http://localhost:3000/", { method: "DELETE",headers: { "Content-Type": "application/json" }, body: JSON.stringify({  id : form.id}) })
            

            setPasswordArray([...passwordArray, { ...form, id: uuidv4() }])
            // localStorage.setItem("passwords", JSON.stringify([...passwordArray, { ...form, id: uuidv4() }]))
            // console.log([...passwordArray, form])
            await  fetch("http://localhost:3000/", { method: "POST",headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, id: uuidv4() }) })
            setform({ site: "", username: "", password: "" })
        }
        else {
            toast.error('Password Not Saved!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
                theme: "colored",
                // transition: {Bounce},
            });
        }

    }

    const deletePassword = async (id) => {
        // console.log("Deleting password with id ", id)
        let c = confirm("Do you really want to delete this password?")
        if (c) {
            toast.info('Password Deleted!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
                theme: "colored",
                // transition: {Bounce},
            });
            setPasswordArray(passwordArray.filter(item => item.id !== id))
            // localStorage.setItem("passwords", JSON.stringify(passwordArray.filter(item => item.id !== id)))
            await  fetch("http://localhost:3000/", { method: "DELETE",headers: { "Content-Type": "application/json" }, body: JSON.stringify({  id }) })
            
        }

    }
    const editPassword = (id) => {

        console.log("Editing password with id ", id)
        setform({...passwordArray.filter(i => i.id === id)[0], id: id})
        setPasswordArray(passwordArray.filter(item => item.id !== id))


    }



    const handleChange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value })
    }



    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                pauseOnHover
                theme="colored"
                transition={Bounce}
            />
            {/* Same as */}
            {/* <ToastContainer /> */}
            {/* <div class="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]"></div> */}
            <div className=" p-3 md:mycontainer min-h-[88.2vh] md:w-[85%] mx-auto ">
                <h1 className='text-4xl text  text-center'>
                    <span className='text-[#44229f] text-5xl'>&#8473;</span>

                    <span>ass</span><span className='text-[#44229f] font-bold' >Manager</span>

                </h1>
                <p className='text-[#44229f] font-semibold text-lg text-center'>Your own Password Manager</p>

                <div className="flex flex-col p-4 text-black gap-8 items-center">
                    <input value={form.site} onChange={handleChange} placeholder='Enter website URL' className='rounded-full border border-[#44229f] w-full p-4 py-1' type="text" name="site" id="site" />
         <div className="flex md:flex-row flex-col justify-between w-full gap-8">
                        <input value={form.username} onChange={handleChange} placeholder='Enter Username' className='rounded-full border border-[#44229f] p-4 w-full py-1' type="text" name="username" id="username" />
                        <div className="relative">

                            <input ref={passwordRef} value={form.password} onChange={handleChange} placeholder='Enter Password' className='rounded-full border border-[#44229f] w-full p-4 py-1' type="password" name="password" id="password" />
                            <span className='absolute right-[3px] top-[4px] cursor-pointer' onClick={showPassword}>
                                <img ref={ref} className='p-1' width={26} src="/eye.png" alt="eye" />
                            </span>
                        </div>          

                    </div>
                    <button onClick={savePassword} className='flex justify-center text-black items-center gap-2 bg-[#d2c1ff] hover:bg-[#e1d6fc] hover:scale-105 font-bold rounded-full px-8 py-2 w-fit border border-[#d2c1ff]'>
                        <lord-icon
                            src="https://cdn.lordicon.com/jgnvfzqg.json"
                            trigger="hover" 
                            colors="primary:#5e3eb1" 
                            >
                        </lord-icon>
                        Save</button>
                </div>

                <div className="passwords">
                    <h2 className='font-bold text-2xl py-4'>Your Passwords</h2>
                    {passwordArray.length === 0 && <div> No passwords to show</div>}
                    {passwordArray.length != 0 && <table className="table-auto w-full rounded-md overflow-hidden mb-10">
                        <thead className='bg-[#5e3eb1] text-white'>
                            <tr>
                                <th className='py-2'>Site</th>
                                <th className='py-2'>Username</th>
                                <th className='py-2'>Password</th>
                                <th className='py-2'>Actions</th>
                            </tr>
                        </thead>
                        <tbody className='bg-[#d2c1ff]'>
                            {passwordArray.map((item, index) => {
                                return <tr key={index}>
                                    <td className='py-2 border border-white text-center'>
                                        <div className='flex items-center justify-center '>
                                            <a href={item.site} target='_blank'>{item.site}</a>
                                            <div className='lordiconcopy size-7 cursor-pointer' onClick={() => { copyText(item.site) }}>
                                            <lord-icon
                                                    src="https://cdn.lordicon.com/iykgtsbt.json"
                                                    trigger="hover" 
                                                    colors="primary:#5e3eb1"    
                                                    style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }}>
                                                </lord-icon>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='py-2 border border-white text-center'>
                                        <div className='flex items-center justify-center '>
                                            <span>{item.username}</span>
                                            <div className='lordiconcopy size-7 cursor-pointer' onClick={() => { copyText(item.username) }}>
                                            <lord-icon
                                                    src="https://cdn.lordicon.com/iykgtsbt.json"
                                                    trigger="hover" 
                                                    colors="primary:#5e3eb1"    
                                                    style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }}>
                                                </lord-icon>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='py-2 border border-white text-center'>
                                        <div className='flex items-center justify-center '>
                                            <span>{"*".repeat(item.password.length)}</span>
                                            <div className='lordiconcopy size-7 cursor-pointer' onClick={() => { copyText(item.password) }}>
                                                <lord-icon
                                                    src="https://cdn.lordicon.com/iykgtsbt.json"
                                                    trigger="hover" 
                                                    colors="primary:#5e3eb1"    
                                                    style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }}>
                                                </lord-icon>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='justify-center py-2 border border-white text-center'>
                                        <span className='cursor-pointer mx-1' onClick={() => { editPassword(item.id) }}>
                                            <lord-icon
                                                src="https://cdn.lordicon.com/vwzukuhn.json"
                                                trigger="hover"
                                                colors="primary:black,secondary:#5e3eb1"    
                                                style={{ "width": "25px", "height": "25px" }}>
                                            </lord-icon>
                                        </span>
                                        <span className='cursor-pointer mx-1' onClick={() => { deletePassword(item.id) }}>
                                            <lord-icon
                                                src="https://cdn.lordicon.com/nhqwlgwt.json"
                                                trigger="hover"
                                                colors="primary:black,secondary:#5e3eb1"
                                                style={{ "width": "25px", "height": "25px" }}>
                                            </lord-icon>
                                        </span>
                                    </td>
                                </tr>

                            })}
                        </tbody>
                    </table>}
                </div>
            </div>

        </>
    )
}

export default Manager