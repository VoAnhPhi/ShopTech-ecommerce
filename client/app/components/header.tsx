'use client'
import Link from "next/link";
import { FiShoppingCart, FiUser } from 'react-icons/fi';
import SearchBar from "./SearchBar";

export default function Header() {
    return (
        <header className="bg-white shadow-md py-4 sticky top-0 z-50 w-full">
            <div className="max-w-[1400px] mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                   
                    <div className="flex items-center">
                        <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            <Link href="/">
                                ShopTech
                            </Link>
                        </div>
                    </div>

                
                    <nav className="flex space-x-8">
                        <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium">
                            Trang chủ
                        </Link>
                        <Link href="/product" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium">
                            Sản phẩm
                        </Link>
                        <Link href="/about-page" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium">
                            Về chúng tôi
                        </Link>
                        <Link href="/news-page" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium">
                            Tin tức
                        </Link>
                    </nav>

                    
                    <div className="relative w-full md:w-1/3 mt-2 md:mt-0">
                        <SearchBar />
                    </div>

                   
                    <div className="flex items-center space-x-4 mt-2 md:mt-0">
                        <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors duration-200">
                            <FiUser className="text-xl" />
                            <span className="hidden md:inline">Đăng nhập</span>
                        </button>
                        <button className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full transition-colors duration-200">
                            <FiShoppingCart className="text-xl" />
                            <Link href="/cart">
                            <span className="hidden md:inline">Giỏ hàng</span>
                            </Link>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    )
}
