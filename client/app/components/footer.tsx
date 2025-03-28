'use client'
import Link from "next/link";
import Image from "next/image";
import { 
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt
} from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className="bg-[#10375C] text-[#F4F6FF] py-12 w-full">
            <div className="max-w-[1400px] mx-auto px-4">
                {/* Top Row - Brand and Images */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
                    {/* Brand Section */}
                    <div className="flex-1 space-y-4">
                        <h3 className="text-2xl font-bold text-white">ShopTech</h3>
                        <p className="text-[#F4F6FF] leading-relaxed">
                            ShopTech là nền tảng thương mại điện tử chuyên cung cấp các sản phẩm công nghệ cao, từ điện thoại thông minh, laptop đến phụ kiện chính hãng.
                        </p>
                        <p className="text-[#F4F6FF] leading-relaxed">
                            Chúng tôi cam kết mang đến sản phẩm chất lượng, giá cả cạnh tranh và dịch vụ hỗ trợ tận tâm.
                        </p>
                    </div>

                    {/* Images Section */}
                    <div className="flex gap-4">
                        <div className="relative w-32 h-32">
                            <Image
                                src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80"
                                alt="Technology"
                                fill
                                className="object-cover rounded-lg"
                            />
                        </div>
                        <div className="relative w-32 h-32">
                            <Image
                                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                                alt="Customer Service"
                                fill
                                className="object-cover rounded-lg"
                            />
                        </div>
                    </div>
                </div>

                {/* Bottom Row - Links */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Liên Kết Nhanh</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/product" className="text-[#F4F6FF] hover:text-[#F3C623] transition-colors duration-200">
                                    Sản Phẩm
                                </Link>
                            </li>
                            <li>
                                <Link href="/about-page" className="text-[#F4F6FF] hover:text-[#F3C623] transition-colors duration-200">
                                    Về Chúng Tôi
                                </Link>
                            </li>
                            <li>
                                <Link href="/news-page" className="text-[#F4F6FF] hover:text-[#F3C623] transition-colors duration-200">
                                    Tin Tức
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-[#F4F6FF] hover:text-[#F3C623] transition-colors duration-200">
                                    Liên Hệ
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Support */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Hỗ Trợ</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="#" className="text-[#F4F6FF] hover:text-[#F3C623] transition-colors duration-200">
                                    Chính sách bảo hành
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-[#F4F6FF] hover:text-[#F3C623] transition-colors duration-200">
                                    Chính sách đổi trả
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-[#F4F6FF] hover:text-[#F3C623] transition-colors duration-200">
                                    Hướng dẫn mua hàng
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-[#F4F6FF] hover:text-[#F3C623] transition-colors duration-200">
                                    FAQ
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Liên Hệ</h3>
                        <ul className="space-y-3">
                            <li className="flex items-center space-x-3">
                                <FaEnvelope className="text-[#F3C623]" />
                                <span className="text-[#F4F6FF]">support@shoptech.com</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <FaPhone className="text-[#F3C623]" />
                                <span className="text-[#F4F6FF]">1800 1234</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <FaMapMarkerAlt className="text-[#F3C623]" />
                                <span className="text-[#F4F6FF]">123 Đường ABC, TP.HCM</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-[#F4F6FF]/20">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-[#F4F6FF] text-sm">
                            &copy; 2025 ShopTech. All rights reserved.
                        </p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <Link href="#" className="text-[#F4F6FF] hover:text-[#F3C623] text-sm transition-colors duration-200">
                                Điều khoản sử dụng
                            </Link>
                            <Link href="#" className="text-[#F4F6FF] hover:text-[#F3C623] text-sm transition-colors duration-200">
                                Chính sách bảo mật
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
