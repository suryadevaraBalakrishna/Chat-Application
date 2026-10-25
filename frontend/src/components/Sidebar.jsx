
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { logOut } from '../slice/loginSlice'
import axios from 'axios'
import socket from '../socket/socket'
import { Link } from 'react-router'

export default function Sidebar({ selectedUser, onSelectUser }) {
    const [search, setSearch] = useState('')
    const [users, setUsers] = useState([])
    const [imagePath, setImagePath] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [onlineUsers, setOnlineUsers] = useState([])

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const token = useSelector((state) => state.login.token)

    // Logout user
    const handleLogout = () => {
        dispatch(logOut())
        socket.disconnect()
        navigate('/login')
    }

    // Fetch users from API
    useEffect(() => {
        const fetchUsers = async () => {
            if (!token) {
                setUsers([])
                setLoading(false)
                navigate('/login')
                return
            }

            try {
                setLoading(true)
                setError('')

                const result = await axios.post(
                    `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_VIEW_ALL}`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )

                if (result.data._status === true) {
                    setUsers(result.data._data || [])
                    setImagePath(result.data._user_image_path || '')
                } else {
                    setUsers([])
                    setError(result.data._message || 'Unable to fetch users.')
                }
            } catch (error) {
                console.error('Error fetching users:', error)
                setError(
                    error.response?.data?._message ||
                    'Failed to load users. Please try again.'
                )
            } finally {
                setLoading(false)
            }
        }

        fetchUsers()
    }, [token, navigate])

    // Search by full name or username
    const filteredUsers = users.filter((item) => {
        const fullName = (item.fullName || '').toLowerCase()
        const username = (item.username || '').toLowerCase()
        const searchText = search.toLowerCase()

        return fullName.includes(searchText) ||
            username.includes(searchText)
    })

    // Listen for online-user updates
    useEffect(() => {
        const handleOnlineUsers = (users) => {
            setOnlineUsers(users.map(String))
        }

        const handleUserStatus = ({ userId, online }) => {
            const id = String(userId)

            setOnlineUsers((previous) => {
                if (online) {
                    return previous.includes(id)
                        ? previous
                        : [...previous, id]
                }

                return previous.filter((item) => item !== id)
            })
        }

        const requestOnlineUsers = () => {
            socket.emit('requestOnlineUsers')
        }

        socket.on('onlineUsers', handleOnlineUsers)
        socket.on('userStatus', handleUserStatus)
        socket.on('connect', requestOnlineUsers)

        if (socket.connected) {
            requestOnlineUsers()
        }

        return () => {
            socket.off('onlineUsers', handleOnlineUsers)
            socket.off('userStatus', handleUserStatus)
            socket.off('connect', requestOnlineUsers)
        }
    }, [])

    return (
        <aside
            className={`${
                selectedUser ? 'hidden md:flex' : 'flex'
            } w-full flex-col border-r border-gray-200 bg-white md:w-[340px] md:shrink-0 lg:w-[390px]`}
        >
            {/* Sidebar Header */}
            <div className="flex items-center justify-between bg-[#f0f2f5] px-4 py-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#075e54] text-lg text-white">
                        <i className="fa-solid fa-user"></i>
                    </div>

                    <div>

                        <h2 className="font-bold text-gray-800">My Chats</h2>
                        <p className="text-xs text-gray-500">Stay connected</p>
                    </div>
                </div>

                  

                   <Link
                   to='/my-profile'
                    className="text-sm text-gray-500 transition hover:text-red-500"
                >
                   My Profile
                </Link>

                <button
                    type="button"
                    onClick={handleLogout}
                    title="Logout"
                    aria-label="Logout"
                    className="text-sm text-gray-500 transition hover:text-red-500"
                >
                    Logout
                </button>
            </div>

            {/* Search */}
            <div className="border-b border-gray-100 p-3">
                <div className="flex items-center gap-3 rounded-lg bg-[#f0f2f5] px-4 py-3">
                    <i className="fa-solid fa-magnifying-glass text-sm text-gray-500"></i>

                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search or start a new chat"
                        className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-500"
                    />
                </div>
            </div>

            {/* User List */}
            <div className="flex-1 overflow-y-auto">
                <div className="px-5 py-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#128c7e]">
                        Available users
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center p-8">
                        <span className="loading loading-spinner loading-md text-[#128c7e]"></span>
                    </div>
                ) : error ? (
                    <div className="p-5 text-center">
                        <p className="text-sm text-red-500">{error}</p>
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="mt-3 rounded-lg bg-[#075e54] px-4 py-2 text-sm text-white hover:bg-[#064e46]"
                        >
                            Try again
                        </button>
                    </div>
                ) : filteredUsers.length > 0 ? (
                    filteredUsers.map((item) => {
                        const isSelected =
                            selectedUser?._id === item._id

                        const isOnline =
                            onlineUsers.includes(String(item._id))

                        return (
                            <button
                                key={item._id}
                                type="button"
                                onClick={() => onSelectUser(item)}
                                className={`flex w-full items-center gap-3 border-b border-gray-100 px-4 py-4 text-left transition hover:bg-gray-50 ${
                                    isSelected ? 'bg-[#f0f2f5]' : ''
                                }`}
                            >
                                {/* Avatar and online indicator */}
                                <div className="relative shrink-0">
                                    {item.image && imagePath ? (
                                        <img
                                            src={`${imagePath.replace(/\/$/, '')}/${item.image}`}
                                            alt={item.fullName || 'User'}
                                            className="h-12 w-12 rounded-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none'
                                                e.currentTarget.nextElementSibling.style.display = 'flex'
                                            }}
                                        />
                                    ) : null}

                                    <div
                                        className={`${
                                            item.image && imagePath ? 'hidden' : 'flex'
                                        } h-12 w-12 items-center justify-center rounded-full bg-[#128c7e] text-lg font-semibold text-white`}
                                    >
                                        {(item.fullName || item.username || '?')
                                            .charAt(0)
                                            .toUpperCase()}
                                    </div>

                                    {isOnline && (
                                        <span
                                            title="Online"
                                            className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500"
                                        />
                                    )}
                                </div>

                                {/* User details */}
                                <div className="min-w-0 flex-1">
                                    <h3 className="truncate font-semibold text-gray-800">
                                        {item.fullName || item.username}
                                    </h3>

                              
                                    <p className={`text-xs ${
                                        isOnline ? 'text-green-600' : 'text-gray-400'
                                    }`}>
                                        {isOnline ? 'Online' : 'Offline'}
                                    </p>
                                </div>

                                <i className="fa-regular fa-comment-dots text-gray-400"></i>
                            </button>
                        )
                    })
                ) : (
                    <p className="p-5 text-center text-sm text-gray-500">
                        {search
                            ? 'No users match your search.'
                            : 'No users found.'}
                    </p>
                )}
            </div>

            {/* Sidebar Footer */}
            <div className="border-t border-gray-200 bg-[#f8f9fa] px-4 py-3">
                <p className="text-center text-xs text-gray-400">
                    <i className="fa-solid fa-lock mr-1 text-[#128c7e]"></i>
                    Your chats, your connections.
                </p>
            </div>
        </aside>
    )
}
