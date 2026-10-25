import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { Link } from 'react-router'

export default function MyProfile() {
  const User = useSelector((state) => state.login.user)
  const token = useSelector((state) => state.login.token)

  const [userDetails, setUserDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }

    const fetchProfile = async () => {
      try {
        setLoading(true)
        setError('')

        const result = await axios.post(
          `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_VIEW_PROFILE}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (result.data._status === true) {
          setUserDetails(result.data._data)
        } else {
          setError(result.data._message || 'Unable to load profile.')
        }
      } catch (err) {
        console.error('Profile API error:', err)
        setError('Unable to load your profile.')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [token])

  const profile = userDetails || User || {}

  const fullName = profile.fullName || profile.name || 'User'
  const username = profile.username || ''
  const email = profile.email || ''
  const phone = profile.phone || profile.mobile || ''
  const image = profile.image || ''

  const imageUrl = image
    ? image.startsWith('http')
      ? image
      : `${import.meta.env.VITE_BASE_URL}/uploads/user/${image}`
    : ''

  return (
    <div className="min-h-screen bg-[#f0f2f5] text-[#111b21]">

      {/* Header */}
      <header className="bg-[#008069] px-4 py-4 text-white sm:px-8">
        <div className="mx-auto flex max-w-4xl items-center gap-4">
          <Link
            to="/"
            aria-label="Back to chats"
            className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-white/15"
          >
            <i className="fa-solid fa-arrow-left text-lg"></i>
          </Link>

          <h1 className="text-xl font-semibold">Profile</h1>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-8 sm:py-8">

        {/* Loading */}
        {loading ? (
          <div className="flex min-h-64 items-center justify-center">
            <span className="loading loading-spinner loading-lg text-[#008069]"></span>
          </div>
        ) : error ? (

          /* Error */
          <div className="rounded-xl bg-white p-6 text-center shadow-sm">
            <i className="fa-solid fa-circle-exclamation mb-3 text-2xl text-red-500"></i>
            <p className="text-sm text-red-500">{error}</p>
          </div>

        ) : (

          /* Profile */
          <section className="overflow-hidden rounded-xl bg-white shadow-sm">

            {/* Profile Photo */}
            <div className="flex flex-col items-center border-b border-[#e9edef] px-5 py-8">

              <div className="relative mb-4 h-32 w-32">

                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt={fullName}
                    className="h-32 w-32 rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      e.currentTarget.nextElementSibling.style.display = 'flex'
                    }}
                  />
                )}

                {/* Fallback avatar */}
                <div
                  className={`${imageUrl ? 'hidden' : 'flex'} h-32 w-32 items-center justify-center rounded-full bg-[#dfe5e7] text-5xl font-medium text-[#54656f]`}
                >
                  {fullName.charAt(0).toUpperCase()}
                </div>

                <button
                  type="button"
                  title="Change profile photo"
                  className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-[#008069] text-white transition hover:bg-[#006d5b]"
                >
                  <i className="fa-solid fa-camera"></i>
                </button>
              </div>

              <h2 className="text-xl font-semibold">{fullName}</h2>

              {username && (
                <p className="mt-1 text-sm text-[#667781]">
                  @{username}
                </p>
              )}
            </div>

            {/* Profile Details */}
            <div className="px-5 sm:px-8">

              {/* Full Name */}
              <div className="border-b border-[#e9edef] py-5">
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm text-[#008069]">
                    Full name
                  </label>

                  <button
                    type="button"
                    title="Edit name"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-[#008069] transition hover:bg-[#f0f2f5]"
                  >
                    <i className="fa-solid fa-pen text-sm"></i>
                  </button>
                </div>

                <p className="text-base">{fullName}</p>
              </div>

              {/* Username */}
              <div className="border-b border-[#e9edef] py-5">
                <label className="mb-2 block text-sm text-[#008069]">
                  Username
                </label>

                <p className="break-all text-base">
                  {username || 'Not added'}
                </p>
              </div>

            

            </div>
          </section>
        )}

      </main>
    </div>
  )
}
