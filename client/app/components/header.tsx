'use client'
import Link from "next/link";
import { FiShoppingCart, FiUser } from 'react-icons/fi';
import SearchBar from "./SearchBar";
import { useEffect, useState } from "react";

export default function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    useEffect(() => {
        const userData = sessionStorage.getItem("user");
        if (userData) {
            setIsLoggedIn(true);
        }
    }, []);
    return (
        <header className="bg-[#F4F6FF] shadow-md py-4 sticky top-0 z-50 w-full">
            <div className="max-w-[1400px] mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">

                    <div className="flex items-center">
                        <div className="text-2xl font-bold text-[#10375C]">
                            <Link href="/main">
                                ShopTech
                            </Link>
                        </div>
                    </div>


                    <nav className="flex space-x-8">
                        <Link href="/main" className="text-[#10375C] hover:text-[#F3C623] transition-colors duration-200 font-medium">
                            Trang chủ
                        </Link>
                        <Link href="/main/product" className="text-[#10375C] hover:text-[#F3C623] transition-colors duration-200 font-medium">
                            Sản phẩm
                        </Link>
                        <Link href="/main/about-page" className="text-[#10375C] hover:text-[#F3C623] transition-colors duration-200 font-medium">
                            Về chúng tôi
                        </Link>
                        <Link href="/main/news-page" className="text-[#10375C] hover:text-[#F3C623] transition-colors duration-200 font-medium">
                            Tin tức
                        </Link>
                    </nav>


                    <div className="relative w-full md:w-1/3 mt-2 md:mt-0">
                        <SearchBar />
                    </div>


                    <div className="flex items-center space-x-4 mt-2 md:mt-0">
                        <button className="flex items-center space-x-1 text-[#10375C] hover:text-[#F3C623] transition-colors duration-200">
                            <FiUser className="text-xl" />
                            <Link className="hidden md:inline" href={isLoggedIn ? "/main/user" : "/main/sign-in"}>
                                {isLoggedIn ? "Tài khoản" : "Đăng nhập"}
                            </Link>
                        </button>
                        <button className="flex items-center space-x-1 bg-[#F3C623] text-[#10375C] hover:bg-[#10375C] hover:text-white px-4 py-2 rounded-full transition-colors duration-200">
                            <FiShoppingCart className="text-xl" />
                            <Link href="/main/cart">
                                <span className="hidden md:inline">Giỏ hàng</span>
                            </Link>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    )
}
