import { configureStore } from "@reduxjs/toolkit";
import cartReduucer from "./cartSlice";

export const store = configureStore({
    reducer: {
        cart: cartReduucer,
    },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
