
import React, { useState } from 'react'

export default function MessageBox({ onSendMessage, disabled = false }) {
    const [message, setMessage] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()

        const text = message.trim()
        if (!text || disabled) return

        await onSendMessage(text)
        setMessage('')
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 bg-[#f0f2f5] px-3 py-3 sm:gap-3 sm:px-5"
        >
            <button
                type="button"
                title="Emoji"
                className="hidden text-xl text-gray-500 transition hover:text-[#075e54] sm:block"
            >
                😊
            </button>

            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message"
                disabled={disabled}
                className="min-w-0 flex-1 rounded-lg bg-white px-4 py-3 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-[#128c7e]/30"
            />

            <button
                type="submit"
                disabled={!message.trim() || disabled}
                aria-label="Send message"
                title="Send message"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#075e54] text-white transition hover:bg-[#064e47] disabled:cursor-not-allowed disabled:opacity-50"
            >
                {disabled ? '…' : '➤'}
            </button>
        </form>
    )
}
