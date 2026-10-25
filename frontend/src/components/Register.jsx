
import React, { useState } from 'react'
import { Link } from 'react-router'
import { toast } from 'react-toastify'
import axios from 'axios';


export default function Register() {

    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
        password: '',
        gender: '',
        image: null,
    })

    const [preview, setPreview] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    const handleChange = (e) => {
        const { name, value, files } = e.target

        if (name === 'image') {
            const file = files[0]
            if (file) {
                setFormData((prev) => ({ ...prev, image: file }))
                setPreview(URL.createObjectURL(file))
            }
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }))
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        // Next step: connect this form to your register API
        axios.post(import.meta.env.VITE_BASE_URL+import.meta.env.VITE_USER_REGISTER,formData)
        .then((result)=>{
            if(result.data.status==true){
                console.log(result.data.message);
                toast.success(result.data.message);
                e.target.reset();
            }else{
                toast.error(result.data.message);
                console.log(result.data.message)
            }
        }).catch((error)=>{
              toast.error(error);
            console.log(error);
            
        })
    }

    return (
        <div className="flex min-h-screen items-center justify-center px-4 py-10">
            <div className="w-full max-w-md rounded-3xl border border-white/20 bg-white/95 p-6 shadow-2xl sm:p-8">

                {/* Logo and heading */}
                <div className="mb-6 text-center">
                    <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#075e54] text-3xl text-white shadow-lg">
                        <i className="fa-solid fa-comments"></i>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-800">
                        Create Account
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        Join us and start chatting with your friends
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Profile image */}
                    <div className="flex flex-col items-center">
                        <label
                            htmlFor="image"
                            className="group relative flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-[#128c7e] bg-[#e7f5f1] transition hover:bg-[#d5eee7]"
                        >
                            {preview ? (
                                <img
                                    src={preview}
                                    alt="Profile preview"
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="text-center text-[#075e54]">
                                    <i className="fa-solid fa-camera text-2xl"></i>
                                    <p className="mt-1 text-xs">Add photo</p>
                                </div>
                            )}

                            <span className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-[#075e54] text-white">
                                <i className="fa-solid fa-plus text-xs"></i>
                            </span>
                        </label>

                        <input
                            id="image"
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleChange}
                            className="hidden"
                        />

                        <p className="mt-2 text-xs text-gray-500">
                            Upload a profile photo (optional)
                        </p>
                    </div>

                    {/* Full name */}
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend text-gray-700">
                            Full Name
                        </legend>
                        <label className="input input-bordered flex w-full items-center gap-3 bg-white">
                            <i className="fa-regular fa-user text-gray-400"></i>
                            <input
                                type="text"
                                name="fullName"
                                placeholder="Enter your full name"
                                value={formData.fullName}
                                onChange={handleChange}
                                className="grow text-gray-800 placeholder:text-gray-400"
                                autoComplete="name"
                                required
                            />
                        </label>
                    </fieldset>

                    {/* Username */}
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend text-gray-700">
                            Username
                        </legend>
                        <label className="input input-bordered flex w-full items-center gap-3 bg-white">
                            <i className="fa-solid fa-at text-gray-400"></i>
                            <input
                                type="text"
                                name="username"
                                placeholder="Choose a username"
                                value={formData.username}
                                onChange={handleChange}
                                className="grow text-gray-800 placeholder:text-gray-400"
                                autoComplete="username"
                                required
                            />
                        </label>
                    </fieldset>

                    {/* Password */}

                    <fieldset className="fieldset">
                        <legend className="fieldset-legend text-gray-700">
                            Password
                        </legend>

                        <label className="input input-bordered flex w-full items-center gap-3 bg-white text-gray-800">
                            <span className="text-gray-400">🔒</span>

                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder="Create a password"
                                value={formData.password}
                                onChange={handleChange}
                                className="grow bg-transparent text-gray-800 placeholder:text-gray-400 outline-none"
                                autoComplete="new-password"
                                minLength={6}
                                required
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(prev => !prev)}
                                className="shrink-0 cursor-pointer text-gray-600 hover:text-[#075e54]"
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? '🙈' : '👁'}
                            </button>
                        </label>
                    </fieldset>




                    {/* Gender */}
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend text-gray-700">
                            Gender
                        </legend>

                        <div className="flex flex-wrap items-center gap-5">
                            <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="male"
                                    checked={formData.gender === 'male'}
                                    onChange={handleChange}
                                    className="radio radio-success"
                                    required
                                />
                                Male
                            </label>

                            <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="female"
                                    checked={formData.gender === 'female'}
                                    onChange={handleChange}
                                    className="radio radio-success"
                                />
                                Female
                            </label>

                        </div>
                    </fieldset>


                    {/* Submit */}
                    <button
                        type="submit"
                        className="btn w-full border-0 bg-[#075e54] text-base text-white shadow-md hover:bg-[#064e47]"
                    >
                        Create Account
                        <i className="fa-solid fa-arrow-right"></i>
                    </button>
                </form>

                {/* Login link */}
                <div className="mt-6 border-t border-gray-200 pt-5 text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            className="font-semibold text-[#075e54] hover:underline"
                        >
                            Login
                        </Link>
                    </p>
                </div>

                <p className="mt-5 text-center text-xs text-gray-400">
                    Your conversations start here.
                </p>
            </div>
        </div>
    )
}
