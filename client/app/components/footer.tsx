export default function Footer() {
    return (
        <footer className="bg-gray-800 text-white py-6 w-full">
            <div className="max-w-[1400px] mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                    <div>
                        <h3 className="text-lg font-bold mb-2">Về ShopTech</h3>
                        <p>ShopTech là nền tảng thương mại điện tử chuyên cung cấp các sản phẩm công nghệ cao, từ điện thoại thông minh, laptop đến phụ kiện chính hãng.</p>
                        <p>Chúng tôi cam kết mang đến sản phẩm chất lượng, giá cả cạnh tranh và dịch vụ hỗ trợ tận tâm.</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold mb-2">Hỗ trợ khách hàng</h3>
                        <ul>
                            <li><a href="#" className="hover:underline">Chính sách bảo hành</a></li>
                            <li><a href="#" className="hover:underline">Chính sách đổi trả</a></li>
                            <li><a href="#" className="hover:underline">Hướng dẫn mua hàng</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold mb-2">Liên hệ</h3>
                        <p>Email: support@shoptech.com</p>
                        <p>Hotline: 1800 1234</p>
                        <p>Địa chỉ: 123 Đường ABC, TP.HCM</p>
                    </div>
                </div>
                <hr className="border-gray-600 my-4" />
                <p className="text-center">&copy; 2025 ShopTech. All rights reserved.</p>
            </div>
        </footer>
    )
}
