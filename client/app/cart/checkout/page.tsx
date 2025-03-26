'use client'
import Link from 'next/link'
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store';
import { ICart } from '@/app/data';
import Image from 'next/image';
import { removeFromCart, updateQuantity } from '@/lib/cartSlice';
import { useRef } from 'react';


export default function Checkout() {
    const cartItems: ICart[] = useSelector((state: RootState) => state.cart.products_array);
    const cartTotal = cartItems.reduce((total, item) => total + (item.gia_mua * item.so_luong), 0);
    const dispatch = useDispatch();

    const shipping = 40000;
    const tax = 0.03 * cartTotal;
    const total = cartTotal + shipping + tax;

    let hotenRef = useRef<HTMLInputElement>(null)
    let emailRef = useRef<HTMLInputElement>(null)
    let ghichuRef = useRef<HTMLTextAreaElement>(null)
    let thongbaoRef = useRef<HTMLDivElement>(null)
    let phoneRef = useRef<HTMLInputElement>(null)
    let addressRef = useRef<HTMLInputElement>(null)

    const submitDuLieu = () => {
        let ht = hotenRef.current?.value
        let email = emailRef.current?.value
        let ghichu = ghichuRef.current?.value
        let address = addressRef.current?.value 
        let phone = phoneRef.current?.value
        if (ht?.trim() == "") {
            thongbaoRef.current!.innerHTML = "Bạn chưa nhập họ tên"
            // hotenRef.current!.style.backgroundColor = "yellow";
            hotenRef.current!.focus(); return;
        } else if (email?.trim() == "") {
            thongbaoRef.current!.innerHTML = "Bạn chưa nhập email"
            emailRef.current!.focus(); return;
        } else if (phone?.trim() == "") {
            thongbaoRef.current!.innerHTML = "Bạn chưa nhập địa chỉ giao hàng"
            phoneRef.current!.focus(); return;
        } else if (address?.trim() == "") {
            thongbaoRef.current!.innerHTML = "Bạn chưa nhập địa chỉ giao hàng"
            addressRef.current!.focus(); return;
        } else hotenRef.current!.style.backgroundColor = "white";

        let opt = {
            method: "post",
            body: JSON.stringify({ ho_ten: ht, email: email, ghi_chu: ghichu, dia_chi: address }),
            headers: { 'Content-Type': 'application/json' }
        }
        fetch("http://localhost:3000/api/luudonhang", opt)
            .then(res => res.json()).then(data => {
                thongbaoRef.current!.innerHTML = data.thong_bao;

                if (data.dh != undefined) {
                    let id_dh = data.dh.id;
                    luuchitietdonhang(id_dh, cartItems);
                }
            })
            .catch(err => {
                console.log("Lỗi request lưu dh:", err);
                thongbaoRef.current!.innerHTML = "Có lỗi gì đó, xem trong log"
            })
    }

    const luuchitietdonhang = async (id_dh: number, cart: ICart[]) => {
        let url = "http://localhost:3000/api/luugiohang";
        let promises = cart.map(sp => {
            let t = { id_dh: id_dh, id_sp: sp.id, so_luong: sp.so_luong };
            let opt = {
                method: "POST",
                body: JSON.stringify(t),
                headers: { 'Content-Type': 'application/json' }
            };
            return fetch(url, opt).then(res => res.json())
                .catch(err => console.log('Lỗi lưu sản phẩm', sp));
        });
        await Promise.all(promises);
        window.location.href = "/cart/order-confirmation";
    }
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Checkout</h1>

            {cartItems.length === 0 ? (
                <div className="bg-gray-50 p-6 rounded-lg text-center">
                    <p className="text-lg mb-4">Bạn không thể thanh toán khi giỏ hàng trống</p>
                    <Link href="/" className="text-blue-600 hover:underline">
                        Tiếp tục mua hàng
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Checkout Form */}
                    <div className="lg:col-span-2">
                        <form>
                            <div className="bg-white rounded-lg shadow p-6 mb-6">
                                <h2 className="text-xl font-semibold mb-4">Thông Tin Khách Hàng</h2>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên</label>
                                    <input ref={hotenRef}
                                        type="text"
                                        id="ho_ten"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Nhập họ tên"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input ref={emailRef}
                                        type="email"
                                        id="email"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Nhập email"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                                    <input ref={phoneRef}
                                        type="tel"
                                        id="phone"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Nhập số điện thoại"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="bg-white rounded-lg shadow p-6 mb-6">
                                <h2 className="text-xl font-semibold mb-4">Địa chỉ giao hàng</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="mb-4">
                                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">Tên</label>
                                        <input
                                            type="text"
                                            id="firstName"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Họ</label>
                                        <input
                                            type="text"
                                            id="lastName"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ giao hàng</label>
                                    <input ref={addressRef}
                                        type="text"
                                        id="address"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                                    <textarea ref={ghichuRef}
                                        id="ghichu"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            <h1 className='text-red-500 text-center mb-4 font-bold text-xl' ref={thongbaoRef}></h1>
                            <button type="submit" className="block w-full bg-blue-600 text-white py-3 px-4 rounded-md text-center font-medium hover:bg-blue-700 mb-4" onClick={submitDuLieu}>
                                Place Order
                            </button>
                        </form>

                    </div>
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow p-6 sticky top-6">
                            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                            {/* Danh sách sản phẩm */}
                            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between gap-3 border-b pb-3">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={item.hinh}
                                                alt={item.ten_sp}
                                                className="w-14 h-14 object-cover rounded"
                                            />
                                            <div>
                                                <p className="text-sm font-medium text-gray-800">{item.ten_sp}</p>
                                                <p className="text-sm text-gray-500">Số lượng: {item.so_luong}</p>
                                            </div>
                                        </div>
                                        <div className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                                            {(item.gia_mua * item.so_luong).toLocaleString('vi-VN')} VNĐ
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Thông tin tổng kết đơn hàng */}
                            <div className="border-t border-gray-200 pt-4 mb-4">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600">Items ({cartItems.length}):</span>
                                    <span>{cartTotal.toLocaleString('vi-VN')} VNĐ</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600">Shipping:</span>
                                    <span>{shipping.toLocaleString('vi-VN')} VNĐ</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600">Tax:</span>
                                    <span>{tax.toLocaleString('vi-VN')} VNĐ</span>
                                </div>
                            </div>

                            {/* Tổng thanh toán */}
                            <div className="flex justify-between font-bold text-lg mb-6">
                                <span>Tổng thanh toán:</span>
                                <span>{total.toLocaleString('vi-VN')} VNĐ</span>
                            </div>
                            <Link
                                href="/cart"
                                className="block w-full text-center text-blue-600 hover:underline"
                            >
                                Return to Cart
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
