'use client'
import Image from "next/image";
import Link from "next/link";
import { ILoai, ISanPham } from "../../../data";
import ShowCategory from "../../../components/category";
import HomeProduct from "../../../components/homeProuct";
import Pagination from "../../../components/Pagination";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

// Interface cho dữ liệu phân trang
interface PaginationData {
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
}

// Component hiển thị trang sản phẩm theo danh mục
export default function CategoryProductsPage() {
    const router = useRouter();
    const options = useSearchParams();
    const params = useParams();
    const productRef = useRef<HTMLDivElement>(null);

    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        const queryParams = new URLSearchParams(options.toString());

        queryParams.delete("sort");
        queryParams.delete("hot");

        if (selectedValue === "asc" || selectedValue === "desc") {
            queryParams.set("sort", selectedValue);
        } else if (selectedValue === "hot") {
            queryParams.set("hot", "1");
        }

        const newUrl = params.id
            ? `/product/bycategory/${params.id}?${queryParams.toString()}`
            : `/product/bycategory?${queryParams.toString()}`;
        router.push(newUrl);
    };

    const searchParams = useSearchParams();
    const [sp_arr, setSpArr] = useState<ISanPham[]>([]);
    const [category_arr, setCategoryArr] = useState<ILoai[]>([]);
    const [pageTitle, setPageTitle] = useState<string>("");
    const [baseUrl, setBaseUrl] = useState<string>("");
    const [pagination, setPagination] = useState<PaginationData>({
        total: 0,
        totalPages: 0,
        currentPage: 1,
        limit: 0,
    });

    useEffect(() => {
        const currentPage = searchParams.get('page') ? parseInt(searchParams.get('page') as string) : 1;
        const categoryId = params.id;
        const newBaseUrl = categoryId ? `/product/bycategory/${categoryId}` : `/product/bycategory`;

        let apiUrl = '';
        let newPageTitle = "Tất cả sản phẩm";

        if (searchParams.get('hot')) {
            apiUrl = `http://localhost:3000/api/products/category/${categoryId}/hot/page/${currentPage}`;
            newPageTitle = "Sản phẩm bán chạy";
        } else if (searchParams.get('sort')) {
            const sortValue = searchParams.get('sort');
            if (categoryId) {
                apiUrl = `http://localhost:3000/api/products/category/${categoryId}/page/${currentPage}?sort=${sortValue}`;
            }
            if (sortValue === "asc") {
                newPageTitle = "Sản phẩm được sắp xếp theo giá tăng dần";
            } else if (sortValue === "desc") {
                newPageTitle = "Sản phẩm được sắp xếp theo giá giảm dần";
            }

        } else if (categoryId) {
            apiUrl = `http://localhost:3000/api/products/category/${categoryId}/page/${currentPage}`;
        }

        // Fetch dữ liệu sản phẩm
        fetch(apiUrl)
            .then(res => res.json())
            .then(data => {
                setSpArr(data.products);
                setPagination(data.pagination);
                if (data.category) {
                    setPageTitle(`Sản phẩm trong loại ${data.category.ten_loai}`);
                }

                if (currentPage > 1) {
                    setTimeout(() => {
                        productRef.current?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                }
            })
            .catch(err => {
                console.error("Lỗi khi fetch dữ liệu sản phẩm:", err);
            });
        fetch(`http://localhost:3000/api/loai`)
            .then(res => res.json())
            .then(data => {
                setCategoryArr(data);

                // Nếu không có tiêu đề từ API sản phẩm, tìm danh mục từ danh sách
                // if (!searchParams.get('hot') && !searchParams.get('sort') && categoryId) {
                //     const category = data.find((cat: ILoai) => cat.id === parseInt(categoryId as string));
                //     if (category) {
                //         setPageTitle(`Sản phẩm trong loại ${category.ten_loai}`);
                //     }
                // }
            })
            .catch(err => {
                console.error("Lỗi khi fetch danh mục:", err);
            });

        setBaseUrl(newBaseUrl);
    }, [searchParams, params.id]);

    // Tạo query params cho phân trang, bỏ qua tham số page
    const createPaginationParams = () => {
        const currentParams = new URLSearchParams(searchParams.toString());
        currentParams.delete('page');
        return currentParams.toString();
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="w-full h-32 bg-blue-500 text-white flex items-center justify-center text-2xl font-bold">
                {pageTitle}
            </div>

            <section className="py-8 px-4 flex gap-6 max-w-[1400px] mx-auto pt-26" ref={productRef}>

                <aside className="bg-white p-4 shadow-md w-1/4 rounded">
                    <h3 className="text-xl font-semibold mb-4">Lọc sản phẩm</h3>
                    <div className="mb-4">
                        <h4 className="font-medium mb-4">Theo danh mục</h4>
                        <ul className="grid grid-cols-2 gap-2">
                            {category_arr.map((cat: ILoai) => (
                                <ShowCategory key={cat.id} category={cat} />
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
                        <h4 className="font-medium mb-4">Sắp xếp theo</h4>
                        <select
                            className="w-full p-2 border rounded"
                            onChange={handleSortChange}
                            defaultValue={searchParams.get('hot') ? 'hot' : searchParams.get('sort') || ''}
                        >
                            <option value="">Tất cả sản phẩm</option>
                            <option value="asc">Giá tăng dần</option>
                            <option value="desc">Giá giảm dần</option>
                            <option value="hot">Sản phẩm bán chạy nhất</option>
                        </select>
                    </div>
                </aside>


                <div className="w-3/4">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h2 className="text-2xl font-bold">{pageTitle}</h2>
                            <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                                <Link href="/" className="hover:text-blue-600">Trang chủ</Link>
                                <span>/</span>
                                <span>{pageTitle}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">
                                Hiển thị {sp_arr.length} / {pagination.total} sản phẩm
                            </span>
                            <div className="flex gap-2">
                                <button className="p-2 border rounded hover:bg-gray-100">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zM3 16a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" />
                                    </svg>
                                </button>
                                <button className="p-2 border rounded hover:bg-gray-100">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {sp_arr.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {sp_arr.map((product: ISanPham) => (
                                <HomeProduct key={product.id} sp={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                            <p className="text-yellow-700">Không tìm thấy sản phẩm nào trong danh mục này.</p>
                        </div>
                    )}

                    {/* Phân trang */}
                    <Pagination
                        totalPages={pagination.totalPages}
                        currentPage={pagination.currentPage}
                        baseUrl={`${baseUrl}?${createPaginationParams()}`}
                    />
                </div>
            </section>
        </div>
    );
}