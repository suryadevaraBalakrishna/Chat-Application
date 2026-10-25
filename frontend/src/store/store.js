import { configureStore } from "@reduxjs/toolkit";
import loginSlice from "../slice/loginSlice";

export const myStore=configureStore({
    reducer:{
        login:loginSlice,
    }
})