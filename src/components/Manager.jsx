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
    const [showPasswordId, setShowPasswordId] = useState(null)

const getPasswords = async () => {
    try {
        console.log('Fetching passwords...');
        const response = await fetch("https://passwordmanager-lt9g.onrender.com");
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Failed to fetch passwords');
        }
        const data = await response.json();
        console.log('Received data:', data);
        setPasswordArray(Array.isArray(data) ? data : []);
    } catch (error) {
        console.error('Error fetching passwords:', error);
        toast.error(`Failed to load passwords: ${error.message}`);
    }
}

    useEffect(() => {
        getPasswords()

    }, [])

    const copyText = (text) => {
        navigator.clipboard.writeText(text)
        toast('Copied to clipboard!', {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }

    const togglePasswordVisibility = (id) => {
        setShowPasswordId(showPasswordId === id ? null : id);
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
        // Form validation
        if (form.site.length < 3 || form.username.length < 3 || form.password.length < 3) {
            toast.error('All fields must be at least 3 characters long!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
                theme: "colored"
            });
            return;
        }

        try {
            const passwordData = { 
                ...form, 
                id: form.id || uuidv4() 
            };

            // If it's an edit, remove the old entry
            if (form.id) {
                const deleteResponse = await fetch("https://passwordmanager-lt9g.onrender.com", { 
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" }, 
                    body: JSON.stringify({ id: form.id })
                });

                if (!deleteResponse.ok) {
                    const errorData = await deleteResponse.json().catch(() => ({}));
                    throw new Error(errorData.error || 'Failed to update existing password');
                }
            }

            // Save the new/updated password
            const response = await fetch("https://passwordmanager-lt9g.onrender.com", { 
                method: "POST",
                headers: { "Content-Type": "application/json" }, 
                body: JSON.stringify(passwordData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Failed to save password');
            }

            // Refresh the password list
            await getPasswords();
            
            toast.success('Password Saved Successfully!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
                theme: "colored"
            });

            // Reset form
            setform({ site: "", username: "", password: "" });
        } catch (error) {
            console.error('Error saving password:', error);
            toast.error(`Error: ${error.message}`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
                theme: "colored"
            });
        }

    }

    const deletePassword = async (id) => {
    try {
        const confirmDelete = window.confirm("Do you really want to delete this password?");
        if (!confirmDelete) return;

        const response = await fetch("https://passwordmanager-lt9g.onrender.com", { 
            method: "DELETE",
            headers: { "Content-Type": "application/json" }, 
            body: JSON.stringify({ id })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Failed to delete password');
        }

        // Update local state
        setPasswordArray(passwordArray.filter(item => item.id !== id));
        
        toast.success('Password Deleted!', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            theme: "colored"
        });
    } catch (error) {
        console.error('Error deleting password:', error);
        toast.error(`Error: ${error.message}`);
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
        <div className="min-h-screen bg-gray-50">
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
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-[#5e3eb1] mb-2">
                        <span className="text-5xl">&#8473;</span>
                        ass<span className="text-[#5e3eb1]">Manager</span>
                    </h1>
                    <p className="text-gray-600">Your secure password vault</p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="site" className="block text-sm font-medium text-gray-700 mb-1">
                                Website URL
                            </label>
                            <input
                                id="site"
                                name="site"
                                type="text"
                                value={form.site}
                                onChange={handleChange}
                                placeholder="example.com"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5e3eb1] focus:border-transparent"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                    Username
                                </label>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    value={form.username}
                                    onChange={handleChange}
                                    placeholder="Enter username"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5e3eb1] focus:border-transparent"
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        ref={passwordRef}
                                        id="password"
                                        name="password"
                                        type="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        placeholder="Enter password"
                                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5e3eb1] focus:border-transparent"
                                    />
                                    <button
                                        type="button"
                                        onClick={showPassword}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        aria-label={passwordRef.current?.type === 'password' ? 'Show password' : 'Hide password'}
                                    >
                                        <img 
                                            ref={ref} 
                                            className="w-5 h-5 text-gray-400 hover:text-gray-500" 
                                            src="/eye.png" 
                                            alt="Toggle password visibility" 
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                onClick={savePassword}
                                className="w-full bg-[#5e3eb1] hover:bg-[#4a2d8a] text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center space-x-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                                </svg>
                                <span>{form.id ? 'Update' : 'Add'} Password</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="passwords mt-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Passwords</h2>
                    {passwordArray.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <p>No passwords saved yet</p>
                        </div>
                    ) : (
                        <div className="bg-white shadow overflow-hidden rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Website
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Username
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Password
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {passwordArray.map((item, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <a href={item.site.startsWith('http') ? item.site : `https://${item.site}`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-blue-600 hover:text-blue-800">
                                                        {item.site}
                                                    </a>
                                                    <button 
                                                        onClick={() => copyText(item.site)}
                                                        className="ml-2 text-gray-400 hover:text-gray-600"
                                                        aria-label="Copy website"
                                                    >
                                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1m-6 4l6-6m0 0l-6-6m6 6H7" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <span className="text-sm text-gray-900">{item.username}</span>
                                                    <button 
                                                        onClick={() => copyText(item.username)}
                                                        className="ml-2 text-gray-400 hover:text-gray-600"
                                                        aria-label="Copy username"
                                                    >
                                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1m-6 4l6-6m0 0l-6-6m6 6H7" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <span className="font-mono text-sm text-gray-900">
                                                        {showPasswordId === item.id ? item.password : '•'.repeat(item.password.length)}
                                                    </span>
                                                    <div className="flex ml-2">
                                                        <button 
                                                            onClick={() => togglePasswordVisibility(item.id)}
                                                            className="text-gray-400 hover:text-gray-600"
                                                            aria-label={showPasswordId === item.id ? "Hide password" : "Show password"}
                                                        >
                                                            <svg 
                                                                className="h-4 w-4" 
                                                                fill="none" 
                                                                stroke="currentColor" 
                                                                viewBox="0 0 24 24" 
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                {showPasswordId === item.id ? (
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                                ) : (
                                                                    <>
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                    </>
                                                                )}
                                                            </svg>
                                                        </button>
                                                        <button 
                                                            onClick={() => copyText(item.password)}
                                                            className="ml-2 text-gray-400 hover:text-gray-600"
                                                            aria-label="Copy password"
                                                        >
                                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1m-6 4l6-6m0 0l-6-6m6 6H7" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-center space-x-2">
                                                    <button 
                                                        onClick={() => editPassword(item.id)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                        aria-label="Edit password"
                                                    >
                                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button 
                                                        onClick={() => deletePassword(item.id)}
                                                        className="text-red-600 hover:text-red-900"
                                                        aria-label="Delete password"
                                                    >
                                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Manager;