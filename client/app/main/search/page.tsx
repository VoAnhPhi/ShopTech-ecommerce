'use client';
import Link from "next/link";
import { ISanPham, ILoai } from "../../data";
import ShowCategory from "../components/category";
import Pagination from "../components/Pagination";
import HomeProduct from "../components/homeProuct";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface PaginationData {
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
}

export default function SearchPage() {
    const searchParams = useSearchParams();
    const [products, setProducts] = useState<ISanPham[]>([]);
    const [category_arr, setCategoryArr] = useState<ILoai[]>([]);
    const [pagination, setPagination] = useState<PaginationData>({
        total: 0,
        totalPages: 1,
        currentPage: 1,
        limit: 9
    });

    useEffect(() => {
        const currentPage = searchParams.get('page') ? parseInt(searchParams.get('page') as string) : 1;
        const limit = 9;
        const offset = (currentPage - 1) * limit;

        fetch(`http://localhost:3000/api/search/${searchParams.get('key')}/page/${currentPage}`)
            .then(res => res.json())
            .then(data => {
                setProducts(data.products);
                setPagination(data.pagination);
            });
    }, [searchParams]);

    // Nếu không có từ khóa tìm kiếm, hiển thị thông báo
    if (!searchParams.get('key')) {
        return (
            <div className="min-h-screen bg-gray-100">
                <div className="max-w-[1400px] mx-auto px-4 py-8">
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                        <p className="text-yellow-700">Vui lòng nhập từ khóa tìm kiếm.</p>
                    </div>
                    <div className="mt-4">
                        <Link href="/" className="text-blue-600 hover:underline">
                            ← Quay lại trang chủ
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-[1400px] mx-auto px-4">
                <div className="py-4">
                    <Link href="/" className="text-blue-600 hover:underline">
                        ← Quay lại trang chủ
                    </Link>
                </div>

                <div className="bg-white p-4 rounded-lg shadow mb-6">
                    <h1 className="text-2xl font-bold mb-2">Kết quả tìm kiếm cho: "{searchParams.get('key')}"</h1>
                    <p className="text-gray-600">Tìm thấy {pagination.total} sản phẩm</p>
                </div>

                <section className="py-4 flex gap-6">
                    <aside className="bg-white p-4 shadow-md w-1/4 rounded">
                        <h3 className="text-xl font-semibold mb-4">Lọc sản phẩm</h3>
                        <div className="mb-4">
                            <h4 className="font-medium mb-4">Theo danh mục</h4>
                            <ul className="grid grid-cols-2 gap-2">
                                {category_arr.map((category: ILoai) => (
                                    <ShowCategory key={category.id} category={category} />
                                ))}
                            </ul>
                        </div>
                        <div className="mb-4">
                            <h4 className="font-medium">Theo giá</h4>
                            <input type="range" min="0" max="50000000" className="w-full" />
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>0 VNĐ</span>
                                <span>50,000,000 VNĐ</span>
                            </div>
                        </div>
                        <div className="mb-4">
                            <h4 className="font-medium mb-4">Sản phẩm mới</h4>
                            <Link href="/page-product" className="text-blue-500 hover:underline">Xem ngay</Link>
                        </div>
                        <div>
                            <h4 className="font-medium mb-4">Mua nhiều</h4>
                            <Link href="/page-product?sort=popular" className="text-blue-500 hover:underline">Xem ngay</Link>
                        </div>
                    </aside>

                    <div className="w-3/4">
                        {products.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {products.map((sp: ISanPham) => (
                                    <HomeProduct key={sp.id} sp={sp} />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                                <p className="text-yellow-700">Không tìm thấy sản phẩm nào phù hợp với từ khóa "{searchParams.get('key')}".</p>
                            </div>
                        )}

                        {products.length > 0 && (
                            <Pagination
                                totalPages={pagination.totalPages}
                                currentPage={pagination.currentPage}
                                baseUrl={`/search?key=${searchParams.get('key')}`}
                            />
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}
