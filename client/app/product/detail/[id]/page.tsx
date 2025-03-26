"use client"
import Image from "next/image";
import { useEffect, useState } from "react";
import { ISanPham } from "@/app/data";
import { useParams } from "next/navigation";

// Component hiển thị trang chi tiết sản phẩm

export default function ProductDetail() {
    const params = useParams();
    let id = params.id;
    const [product, setProduct] = useState<ISanPham | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`http://localhost:3000/api/sp/${id}`);
                if (!res.ok) {
                    throw new Error("Lỗi khi lấy dữ liệu sản phẩm");
                }
                const data = await res.json();
                setProduct(data);
            } catch (error) {
                setError(error as string);
            }
        };
        fetchProduct();
    }, [id]);

    if (error) {
        return (
            <div className="container mx-auto p-6">
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
                    <h1 className="text-2xl font-bold">Lỗi khi lấy dữ liệu sản phẩm</h1>
                    <p className="mt-2">
                        Vui lòng thử lại sau hoặc liên hệ quản trị viên.
                    </p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container mx-auto p-6">
                <div className="bg-gray-100 border-l-4 border-gray-500 text-gray-700 p-4 rounded">
                    <h1 className="text-2xl font-bold">Đang tải dữ liệu sản phẩm...</h1>
                    <p className="mt-2"></p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            {/* Phần header sản phẩm */}
            <div className="flex flex-col md:flex-row gap-8">
                {/* Phần hình ảnh */}
                <div className="md:w-1/2 object-fit">
                    <Image
                        src={product.hinh}
                        alt={product.ten_sp}
                        width={500}
                        height={400}
                        className="w-full h-auto object-cover rounded-lg shadow-lg"
                    />
                </div>

                {/* Phần thông tin sản phẩm */}
                <div className="md:w-1/2">
                    <h1 className="text-3xl font-bold mb-4">{product.ten_sp}</h1>
                    <div className="flex items-center gap-4 mb-4">
                        <span className="text-2xl font-bold text-red-600">
                            {product.gia_km.toLocaleString("vi-VN")}đ
                        </span>
                        <span className="text-lg text-gray-500 line-through">
                            {product.gia.toLocaleString("vi-VN")}đ
                        </span>
                        <span className="bg-red-100 text-red-600 px-2 py-1 rounded">
                            {Math.round(
                                ((product.gia - product.gia_km) / product.gia) * 100
                            )}
                            % giảm
                        </span>
                    </div>

                    {/* Thông tin chi tiết */}
                    <div className="space-y-4 mb-6">
                        <div className="flex items-center gap-2">
                            <i className="fas fa-eye text-gray-500"></i>
                            <span>Lượt xem: {product.luot_xem}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <i className="fas fa-calendar text-gray-500"></i>
                            <span>
                                Ngày đăng:{" "}
                                {new Date(product.ngay).toLocaleDateString("vi-VN")}
                            </span>
                        </div>
                        {product.hot === "1" && (
                            <div className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                <i className="fas fa-fire mr-1"></i>
                                Sản phẩm HOT
                            </div>
                        )}
                    </div>

                    {/* Mô tả ngắn */}
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                        <h3 className="font-semibold mb-2">Mô tả sản phẩm:</h3>
                        <p className="text-gray-700">{product.mo_ta}</p>
                    </div>

                    {/* Nút mua hàng */}
                    <div className="flex gap-4">
                        <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition duration-200">
                            <i className="fas fa-shopping-cart mr-2"></i>
                            Thêm vào giỏ hàng
                        </button>
                        <button className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-semibold transition duration-200">
                            <i className="fas fa-bolt mr-2"></i>
                            Mua ngay
                        </button>
                    </div>
                </div>
            </div>

            {/* Phần mô tả chi tiết */}
            <div className="mt-12">
                <h2 className="text-2xl font-bold mb-4">Thông tin chi tiết</h2>
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="prose max-w-none">{product.mo_ta}</div>
                </div>
            </div>
        </div>
    );
}