'use client'

import Link from 'next/link'
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store';
import { ICart } from '../data';
import Image from 'next/image';
import { removeFromCart, updateQuantity } from '@/lib/cartSlice';

export default function Cart() {
    const cartItems: ICart[] = useSelector((state: RootState) => state.cart.products_array);
    const cartTotal = cartItems.reduce((total, item) => total + (item.gia_mua * item.so_luong), 0);
    const dispatch = useDispatch();

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Giỏ hàng</h1>

            {cartItems.length === 0 ? (
                <div className="bg-gray-50 p-6 rounded-lg text-center">
                    <p className="text-lg mb-4">Giỏ Hàng Của Bạn Đang Trống</p>
                    <Link href="/" className="text-blue-600 hover:underline">
                        Tiếp tục mua hàng
                    </Link>
                </div>
            ) : (
                <div>
                    <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
                        <table className="w-full">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 ">
                                {cartItems.map((item: ICart, index: number) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-35 w-55 flex-shrink-0 bg-gray-200 rounded">
                                                    <Image src={item.hinh} alt={item.ten_sp} width={400} height={400} className='w-full h-full object-cover' />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{item.ten_sp}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {item.gia_mua.toLocaleString("vi-VN")}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <button className="bg-gray-200 px-2 py-1 rounded-l" onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.so_luong - 1 }))}>-</button>
                                                <span className="bg-gray-100 px-4 py-1">{item.so_luong}</span>
                                                <button className="bg-gray-200 px-2 py-1 rounded-r" onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.so_luong + 1 }))}>+</button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {item.gia_mua.toLocaleString("vi-VN")}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <button className="text-red-600 hover:text-red-900" onClick={() => dispatch(removeFromCart({ id: item.id }))}>Remove</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <div className="flex justify-between text-lg font-bold mb-2">
                            <span>Tổng tiền:</span>
                            <span>{cartTotal.toLocaleString("vi-VN")}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500 mb-4">
                            <span>Phí vận chuyển và thuế được tính ở thanh toán</span>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                            <Link href="/" className="bg-white border border-gray-300 px-6 py-3 rounded-md text-center hover:bg-gray-50">
                                Tiếp tục mua hàng
                            </Link>
                            <Link href="/cart/checkout" className="bg-gray-800 text-white px-6 py-3 rounded-md text-center hover:bg-gray-900">
                                Thanh toán
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
