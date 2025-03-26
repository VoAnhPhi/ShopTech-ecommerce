import { ICart, ISanPham } from "@/app/data";
import { createSlice, current, PayloadAction } from "@reduxjs/toolkit";


export const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        products_array: [] as ICart[],
        oder: {}
    },
    reducers: {

        addToCart: (state, { payload }: { payload: ISanPham }) => {
            const itemInCart = state.products_array.findIndex((items: ICart) => items.id === payload.id);
            if (itemInCart >= 0) {
                state.products_array[itemInCart].so_luong += 1;
            } else {
                const cart: ICart = {
                    id: payload.id,
                    ten_sp: payload.ten_sp,
                    so_luong: 1,
                    gia_mua: payload.gia_km,
                    hinh: payload.hinh
                };
                state.products_array.push(cart);
            }
            console.log("đã thêm vào giỏ hàng", current(state).products_array);
        },

        updateQuantity: (state, { payload }: { payload: { id: number, quantity: number } }) => {
            const id: number = Number(payload.id);
            const quantity: number = Number(payload.quantity);
            const index = state.products_array.findIndex((item: ICart) => item.id === id);
            if (index !== -1) {
                if (quantity <= 0) {
                    state.products_array.splice(index, 1);
                } else {
                    state.products_array[index].so_luong = quantity;
                }
            }
        },

        removeFromCart: (state, { payload }: { payload: { id: number } }) => {
            const id = payload.id;
            const index = state.products_array.findIndex((item: ICart) => item.id === id);
            if (index !== -1) {
                state.products_array.splice(index, 1);
            }
            console.log("đã xóa sản phẩm khỏi giỏ hàng", current(state).products_array);
        },

        clearCart: (state) => { 
            state.products_array = [];
        },
    }
});
export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
