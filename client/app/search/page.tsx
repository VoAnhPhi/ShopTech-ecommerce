import Link from "next/link";
import { ISanPham, ILoai } from "../data";
import ShowCategory from "../components/category";
import Pagination from "../components/Pagination";
import HomeProduct from "../components/homeProuct";

interface PaginationData {
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
}

interface ProductsResponse {
    products: ISanPham[];
    pagination: PaginationData;
}

export default async function SearchPage(
    { searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }
) {
    let currentPage = searchParams.page ? Number(searchParams.page) : 1;
    let key = searchParams.key ? String(searchParams.key).trim() : "";
    
    // Nếu không có từ khóa tìm kiếm, hiển thị thông báo
    if (!key) {
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

    try {
        // Mã hóa từ khóa tìm kiếm để tránh lỗi URL
        const encodedKey = encodeURIComponent(key);
        
        // Fetch danh sách sản phẩm
        let res = await fetch(`http://localhost:3000/api/search/${encodedKey}/page/${currentPage}`, {
            cache: 'no-store'
        });

        // Kiểm tra nếu response không thành công
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        let data: ProductsResponse = await res.json();
        let products: ISanPham[] = data?.products || [];
        let pagination: PaginationData = data?.pagination || { total: 0, totalPages: 1, currentPage: 1, limit: 9 };

        // Fetch danh mục
        let cateRes = await fetch("http://localhost:3000/api/loai", { cache: 'no-store' });
        let category_arr: ILoai[] = await cateRes.json();

        return (
            <div className="min-h-screen bg-gray-100">
                <div className="max-w-[1400px] mx-auto px-4">
                    <div className="py-4">
                        <Link href="/" className="text-blue-600 hover:underline">
                            ← Quay lại trang chủ
                        </Link>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg shadow mb-6">
                        <h1 className="text-2xl font-bold mb-2">Kết quả tìm kiếm cho: "{key}"</h1>
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
                                    <p className="text-yellow-700">Không tìm thấy sản phẩm nào phù hợp với từ khóa "{key}".</p>
                                </div>
                            )}

                            {products.length > 0 && (
                                <Pagination
                                    totalPages={pagination.totalPages}
                                    currentPage={pagination.currentPage}
                                    baseUrl={`/search?key=${encodeURIComponent(key)}&`}
                                />
                            )}
                        </div>
                    </section>
                </div>
            </div>
        );
    } catch (error) {
        console.error("Lỗi khi fetch dữ liệu:", error);
        return (
            <div className="min-h-screen bg-gray-100">
                <div className="max-w-[1400px] mx-auto px-4 py-8">
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                        <h2 className="text-xl font-bold text-red-700 mb-2">Đã xảy ra lỗi</h2>
                        <p className="text-red-600">Không thể tìm kiếm sản phẩm. Vui lòng thử lại sau.</p>
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
}
