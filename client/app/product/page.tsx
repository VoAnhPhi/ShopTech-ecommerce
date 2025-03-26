'use client'
import { ILoai, ISanPham } from "../data";
import ShowCategory from "../components/category";
import HomeProduct from "../components/homeProuct";
import Pagination from "../components/Pagination";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface PaginationData {
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
}

export default function ProductPage() {
    const productRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const options = useSearchParams();


    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        const params = new URLSearchParams(options.toString());

        params.delete("sort");
        params.delete("hot");

        if (selectedValue === "asc" || selectedValue === "desc") {
            params.set("sort", selectedValue);
        } else if (selectedValue === "hot") {
            params.set("hot", "1");
        }
        router.push(`/product?${params.toString()}`);
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
        const limit = 9;
        const offset = (currentPage - 1) * limit;

        let baseUrl = "/product?";

        let apiUrl = `http://localhost:3000/api/products/page/${currentPage}`;
        let newBaseUrl = "/product?";
        let newPageTitle = "Tất cả sản phẩm";

        if (searchParams.get('hot')) {
            apiUrl = `http://localhost:3000/api/products/hot/page/${currentPage}`;
            newBaseUrl += `&hot=${searchParams.get('hot')}&page=${currentPage}`;
            newPageTitle = "Sản phẩm nổi bật";
        }

        if (searchParams.get("sort")) {
            const sortValue = searchParams.get("sort") as string;
            apiUrl = `http://localhost:3000/api/products/sort/${sortValue}/page/${currentPage}`;
            newBaseUrl += `&sort=${sortValue}&page=${currentPage}`;
            if (sortValue === "asc") {
                newPageTitle = "Sản phẩm được sắp xếp theo giá tăng dần";
            } else if (sortValue === "desc") {
                newPageTitle = "Sản phẩm được sắp xếp theo giá giảm dần";
            }
        }

        setBaseUrl(newBaseUrl);
        setPageTitle(newPageTitle);

        fetch(apiUrl)
            .then(res => res.json())
            .then(data => {
                setSpArr(data.products);
                setPagination(data.pagination);
                if (currentPage > 1) {
                    setTimeout(() => {
                        productRef.current?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                }
            })
            .catch(err => {
                console.error("Lỗi khi fetch dữ liệu:", err);
            });

        fetch("http://localhost:3000/api/loai")
            .then(res => res.json())
            .then(data => {
                setCategoryArr(data);
            })
            .catch(err => {
                console.error("Lỗi khi fetch dữ liệu:", err);
            });
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="w-full h-32 bg-blue-500 text-white flex items-center justify-center text-2xl font-bold">{pageTitle}</div>

            <section className="py-8 px-4 flex gap-6 max-w-[1400px] mx-auto pt-26" ref={productRef}>
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
                        <h4 className="font-medium mb-4">Sắp xếp theo</h4>
                        <select className="w-full p-2 border rounded"
                            onChange={handleSortChange}
                            defaultValue={searchParams.get("hot") ? ("sort") : searchParams.get("sort") || ""}>
                            <option value="">Tất cả sản phẩm</option>
                            <option value="asc">Giá tăng dần</option>
                            <option value="desc">Giá giảm dần</option>
                            <option value="hot">Sản phẩm bán chạy nhất</option>
                        </select>
                    </div>
                </aside>

                {/* Phần danh sách sản phẩm */}
                <div className="w-3/4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">{pageTitle}</h2>
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
                            {sp_arr.map((sp: ISanPham) => (
                                <HomeProduct key={sp.id} sp={sp} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                            <p className="text-yellow-700">Không tìm thấy sản phẩm nào.</p>
                        </div>
                    )}

                    <Pagination
                        totalPages={pagination.totalPages}
                        currentPage={pagination.currentPage}
                        baseUrl={baseUrl}
                    />
                </div>
            </section>
        </div>
    );
}