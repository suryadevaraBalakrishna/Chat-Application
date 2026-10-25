
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import Sidebar from './Sidebar'
import socket from '../socket/socket'
import MessageBox from './MessageBox'

export default function Homepage() {

    const [selectedUser, setSelectedUser] = useState(null)
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [sending, setSending] = useState(false)
    const [error, setError] = useState('')

    const currentUser = useSelector((state) => state.login.user)
    const token = useSelector((state) => state.login.token)

    // Get the logged-in user's ID
    const currentUserId = currentUser?._id || currentUser?.id

    // Fetch conversation whenever the selected user changes
    useEffect(() => {
        if (!selectedUser?._id || !currentUserId) {
            setMessages([])
            return
        }

        let cancelled = false

        const fetchMessages = async () => {
            setLoading(true)
            setError('')
            setMessages([])

            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_MESSAGE}${currentUserId}/${selectedUser._id}`,
                    {
                        headers: token
                            ? { Authorization: `Bearer ${token}` }
                            : {}
                    }
                )

                if (cancelled) return

                const body = response.data

                // Supports common API response formats
                const conversation =
                    Array.isArray(body) ? body :
                        Array.isArray(body._data) ? body._data :
                            Array.isArray(body.data) ? body.data :
                                Array.isArray(body.messages) ? body.messages :
                                    Array.isArray(body._data?.messages) ? body._data.messages :
                                        []

                setMessages(conversation)
            } catch (err) {
                if (!cancelled) {
                    console.error(
                        'Error fetching conversation:',
                        err.response?.data || err.message
                    )
                    setError('Unable to load messages.')
                }
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        fetchMessages()

        return () => {
            cancelled = true
        }
    }, [selectedUser?._id, currentUserId, token])

    // Send a message
    const handleSendMessage = async (text) => {
        if (!currentUserId || !selectedUser?._id || sending) return

        setSending(true)
        setError('')

        try {
            const response = await axios.post(
                import.meta.env.VITE_SEND_MESSAGE,
                {
                    senderId: currentUserId,
                    receiverId: selectedUser._id,
                    message: text
                },
                {
                    headers: token
                        ? { Authorization: `Bearer ${token}` }
                        : {}
                }
            )

            // Add the returned message if the API provides one.
            // Otherwise, reload the conversation from the server.
            const body = response.data
            const savedMessage = body._data || body.data || body.messageData

            if (
                savedMessage &&
                typeof savedMessage === 'object' &&
                (savedMessage.message || savedMessage._id)
            ) {
                setMessages((previous) => {
                    const alreadyExists = previous.some(
                        (item) =>
                            String(item._id) === String(savedMessage._id)
                    )

                    if (alreadyExists) {
                        return previous
                    }

                    return [...previous, savedMessage]
                })
            } else {
                const refreshed = await axios.get(
                    `${import.meta.env.VITE_MESSAGE}${currentUserId}/${selectedUser._id}`,
                    {
                        headers: token
                            ? { Authorization: `Bearer ${token}` }
                            : {}
                    }
                )

                const refreshedBody = refreshed.data
                const conversation =
                    Array.isArray(refreshedBody) ? refreshedBody :
                        Array.isArray(refreshedBody._data) ? refreshedBody._data :
                            Array.isArray(refreshedBody.data) ? refreshedBody.data :
                                Array.isArray(refreshedBody.messages) ? refreshedBody.messages :
                                    []

                setMessages(conversation)
            }
        } catch (err) {
            console.error(
                'Error sending message:',
                err.response?.data || err.message
            )
            setError('Message could not be sent. Please try again.')
        } finally {
            setSending(false)
        }
    }


    //new code
    // Connect Socket.IO and join the logged-in user's room
    useEffect(() => {
        if (!currentUserId) return

        const joinRoom = () => {
            console.log('Socket connected:', socket.id)
            socket.emit('join', currentUserId)
        }

        socket.on('connect', joinRoom)

        if (!socket.connected) {
            socket.connect()
        } else {
            joinRoom()
        }

        return () => {
            socket.off('connect', joinRoom)
            socket.disconnect()
        }
    }, [currentUserId])



    // socket
    useEffect(() => {
        const handleNewMessage = (newMessage) => {
            console.log('Real-time message received:', newMessage)

            const senderId =
                typeof newMessage.senderId === 'object'
                    ? newMessage.senderId?._id
                    : newMessage.senderId

            const receiverId =
                typeof newMessage.receiverId === 'object'
                    ? newMessage.receiverId?._id
                    : newMessage.receiverId

            const isCurrentConversation =
                (
                    String(senderId) === String(currentUserId) &&
                    String(receiverId) === String(selectedUser?._id)
                ) ||
                (
                    String(senderId) === String(selectedUser?._id) &&
                    String(receiverId) === String(currentUserId)
                )

            if (isCurrentConversation) {
                setMessages((previous) => {
                    const alreadyExists = previous.some(
                        (item) => String(item._id) === String(newMessage._id)
                    )

                    if (alreadyExists) return previous

                    return [...previous, newMessage]
                })
            }
        }

        socket.on('newMessage', handleNewMessage)

        return () => {
            socket.off('newMessage', handleNewMessage)
        }
    }, [currentUserId, selectedUser?._id])

    return (
        <div className="flex h-screen items-center justify-center bg-[#075e54] p-0 md:p-5 lg:p-8">
            <div className="flex h-full w-full max-w-[1500px] overflow-hidden bg-white shadow-2xl md:rounded-2xl">
                <Sidebar
                    selectedUser={selectedUser}
                    onSelectUser={setSelectedUser}
                />

                <main
                    className={`${selectedUser ? 'flex' : 'hidden md:flex'
                        } min-w-0 flex-1 flex-col bg-[#efeae2]`}
                >
                    {selectedUser ? (
                        <>
                            {/* Chat header */}

                            <div className="flex items-center gap-3 border-b border-gray-200 bg-[#f0f2f5] px-5 py-4">

                                {/* User Profile Image */}
                                <div className="h-11 w-11 shrink-0">
                                    {selectedUser.image ? (
                                        <img
                                            src={`${import.meta.env.VITE_BASE_URL}/uploads/user/${selectedUser.image}`}
                                            alt={selectedUser.fullName || 'User'}
                                            className="h-11 w-11 rounded-full bg-gray-200 object-cover"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none'
                                                e.currentTarget.nextElementSibling.style.display = 'flex'
                                            }}
                                        />
                                    ) : null}

                                    {/* Fallback when image is missing or fails to load */}
                                    <div
                                        className={`${selectedUser.image ? 'hidden' : 'flex'
                                            } h-11 w-11 items-center justify-center rounded-full bg-[#128c7e] text-lg font-semibold text-white`}
                                    >
                                        {(selectedUser.fullName || selectedUser.username || '?')
                                            .charAt(0)
                                            .toUpperCase()}
                                    </div>
                                </div>

                                {/* User Details */}
                                <div className="min-w-0">
                                    <h2 className="font-semibold text-gray-800">
                                        {selectedUser.fullName || selectedUser.username}
                                    </h2>

                                    <p className="text-xs text-gray-500">
                                        @{selectedUser.username}
                                    </p>
                                </div>

                                {/* Back Button */}
                                <button
                                    type="button"
                                    onClick={() => setSelectedUser(null)}
                                    className="ml-auto text-sm text-gray-500 md:hidden"
                                >
                                    Back
                                </button>
                            </div>


                            {/* Conversation messages */}
                            <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4 sm:p-6">
                                {loading ? (
                                    <p className="m-auto text-sm text-gray-500">
                                        Loading messages...
                                    </p>
                                ) : error && messages.length === 0 ? (
                                    <p className="m-auto text-sm text-red-500">
                                        {error}
                                    </p>
                                ) : messages.length === 0 ? (
                                    <p className="m-auto rounded-lg bg-white/80 px-5 py-3 text-sm text-gray-500 shadow-sm">
                                        No messages yet. Say hello!
                                    </p>
                                ) : (
                                    messages.map((item, index) => {
                                        const senderId =
                                            typeof item.senderId === 'object'
                                                ? item.senderId?._id
                                                : item.senderId

                                        const isMine =
                                            String(senderId) === String(currentUserId)

                                        return (
                                            <div
                                                key={item._id || index}
                                                className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div
                                                    className={`max-w-[80%] rounded-xl px-4 py-2 shadow-sm sm:max-w-[70%] ${isMine
                                                        ? 'rounded-br-sm bg-[#d9fdd3]'
                                                        : 'rounded-bl-sm bg-white'
                                                        }`}
                                                >
                                                    <p className="break-words text-sm text-gray-800">
                                                        {item.message}
                                                    </p>

                                                    {item.createdAt && (
                                                        <p className="mt-1 text-right text-[10px] text-gray-500">
                                                            {new Date(item.createdAt).toLocaleTimeString([], {
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })
                                )}

                                {error && messages.length > 0 && (
                                    <p className="text-center text-sm text-red-500">
                                        {error}
                                    </p>
                                )}
                            </div>

                            {/* Message input */}
                            <MessageBox
                                onSendMessage={handleSendMessage}
                                disabled={sending}
                            />
                        </>
                    ) : (
                        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                            <i className="fa-solid fa-comments mb-5 text-6xl text-[#128c7e]"></i>

                            <h1 className="text-3xl font-light text-gray-700">
                                Welcome to Chat App
                            </h1>

                            <p className="mt-3 text-gray-500">
                                Select a conversation to start chatting.
                            </p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}
