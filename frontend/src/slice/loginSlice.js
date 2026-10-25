
import Cookies from 'js-cookie'
import { createSlice } from '@reduxjs/toolkit'

// Restore user object and token after page refresh
const getUserFromCookie = () => {
    try {
        const user = Cookies.get('User')
        return user ? JSON.parse(user) : null
    } catch (error) {
        console.error('Error parsing user cookie:', error)
        return null
    }
}

const initialState = {
    user: getUserFromCookie(),
    token: Cookies.get('token') || ''
}

export const loginSlice = createSlice({
    name: 'login',
    initialState,

    reducers: {
        userDetails: (state, action) => {
            state.user = action.payload.user
            state.token = action.payload.token

            // Store the user object as JSON
            Cookies.set('User', JSON.stringify(action.payload.user), {
                expires: 7
            })

            Cookies.set('token', action.payload.token, {
                expires: 7
            })
        },

        logOut: (state) => {
            state.user = null
            state.token = ''

            Cookies.remove('User')
            Cookies.remove('token')
        }
    }
})

export const { userDetails, logOut } = loginSlice.actions

export default loginSlice.reducer
