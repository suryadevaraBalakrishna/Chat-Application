
import React, { useState } from 'react'
import { Link } from 'react-router'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router'
import axios from 'axios';
import { userDetails } from '../slice/loginSlice'


export default function Login() {

    const dispatch = useDispatch();

    const navigate = useNavigate();



    const [formData, setFormData] = useState({
        username: '',
        password: '',
    })

    const [showPassword, setShowPassword] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        // Next step: connect this form to your login API
        axios.post(import.meta.env.VITE_BASE_URL + import.meta.env.VITE_USER_LOGIN, formData)
            .then((result) => {
                if (result.data.status == true) {
                    dispatch((userDetails({
                        user: result.data.data,
                        token: result.data.token
                    })))
                    console.log(result.data.message);
                    toast.success(result.data.message);
                    navigate('/');
                    e.target.reset();
                } else {
                    toast.error(result.data.message);
                    console.log(result.data.message)
                }
            }).catch((error) => {
                toast.error(error);
                console.log(error);

            })
    }

    return (
        <div className="flex min-h-screen items-center justify-center px-4 py-10">
            <div className="w-full max-w-md rounded-3xl border border-white/20 bg-white/95 p-6 shadow-2xl sm:p-8">

                {/* Logo and heading */}
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#075e54] text-3xl text-white shadow-lg">
                        <i className="fa-solid fa-comments"></i>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-800">
                        Welcome Back!
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        Login to continue chatting with your friends
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">

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
                                placeholder="Enter your username"
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
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                className="grow bg-transparent text-gray-800 placeholder:text-gray-400 outline-none"
                                autoComplete="current-password"
                                required
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="shrink-0 cursor-pointer text-gray-600 hover:text-[#075e54]"
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? '🙈' : '👁'}
                            </button>
                        </label>
                    </fieldset>

                    {/* Login button */}
                    <button
                        type="submit"
                        className="btn w-full border-0 bg-[#075e54] text-base text-white shadow-md hover:bg-[#064e47]"
                    >
                        Login
                        <i className="fa-solid fa-arrow-right"></i>
                    </button>
                </form>

                {/* Register link */}
                <div className="mt-7 border-t border-gray-200 pt-5 text-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link
                            to="/register"
                            className="font-semibold text-[#075e54] hover:underline"
                        >
                            Create Account
                        </Link>
                    </p>
                </div>

                <p className="mt-5 text-center text-xs text-gray-400">
                    Your conversations are just one login away.
                </p>
            </div>
        </div>
    )
}
