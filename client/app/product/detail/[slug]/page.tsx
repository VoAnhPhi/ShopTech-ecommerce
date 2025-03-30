"use client"
import Image from "next/image";
import { useEffect, useState } from "react";
import { ISanPham } from "@/app/data";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { addToCart } from "@/lib/cartSlice";

// Component hiển thị trang chi tiết sản phẩm

export default function ProductDetail() {
    const params = useParams();
    let slug = params.slug;
    const [product, setProduct] = useState<ISanPham | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [product_similar, setProductSimilar] = useState<ISanPham[]>([]);
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`http://localhost:3000/api/sp/${slug}`);
                if (!res.ok) {
                    throw new Error("Lỗi khi lấy dữ liệu sản phẩm");
                }
                const data = await res.json();
                const id_loai = data.id_loai;
                console.log(id_loai);

                const product_similar = await fetch(`http://localhost:3000/api/products/same-category/${id_loai}`);
                const data_similar = await product_similar.json();

                setProduct(data);
                setProductSimilar(data_similar);
            } catch (error) {
                setError(error as string);
            }
        };
        fetchProduct();
    }, [slug]);

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
                        <button className="flex-1 bg-gray-800 hover:bg-gray-900 text-white py-3 px-6 rounded-lg font-semibold transition duration-200" onClick={()=>dispatch(addToCart(product))}>
                            <i className="fas fa-shopping-cart mr-2"></i>
                            Thêm vào giỏ hàng
                        </button>
                        <button className="flex-1 bg-gray-800 hover:bg-gray-900 text-white py-3 px-6 rounded-lg font-semibold transition duration-200">
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

            {/* Phần sản phẩm tương tự */}
            <div className="mt-12">
                <h2 className="text-2xl font-bold mb-4">Sản phẩm tương tự</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {product_similar.map((sp) => (
                        <div key={sp.id} className="bg-white p-4 shadow rounded max-w-full">
                            <img
                                src={sp.hinh}
                                alt={sp.ten_sp}
                                className="w-full h-52 object-cover rounded mb-4 transition-transform duration-300 hover:scale-105"
                            />
                            <h3 className="text-base font-bold mt-2 mb-4 hover:text-[#10375C] text-center line-clamp-1">
                                <Link href={`/product/detail/${sp.id}`}>{sp.ten_sp}</Link>
                            </h3>
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-base font-bold">
                                    Giá: <span className="text-[#10375C]">{sp.gia_km.toLocaleString("vi-VN")} VNĐ</span>
                                </p>
                                <p className="text-base font-bold line-through text-gray-500">
                                    {sp.gia.toLocaleString("vi-VN")} VNĐ
                                </p>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <p className="font-semibold">Cập Nhật: {sp.ngay}</p>
                                <p className="font-semibold">Lượt xem: {sp.luot_xem}</p>
                            </div>
                            <div className="flex justify-between mt-4">
                                <button className="bg-[#10375C] text-white px-4 py-2 rounded hover:bg-[#F3C623] hover:text-[#10375C] transition-colors duration-200">
                                    Mua hàng
                                </button>
                                <button
                                    className="bg-[#F3C623] text-[#10375C] px-4 py-2 rounded hover:bg-[#10375C] hover:text-white transition-colors duration-200"
                                    onClick={() => dispatch(addToCart(sp))}
                                >
                                    Thêm vào giỏ hàng
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}